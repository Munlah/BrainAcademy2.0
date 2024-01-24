const { Builder, By, until } = require('selenium-webdriver');
const { describe, it, after, before } = require('mocha');
const { expect } = require('chai');
const fs = require('fs').promises;
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

describe.only('Login Page UI Testing', function () {
    this.timeout(30000);
    let driver;
    var counter = 0;

    before(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.get('http://127.0.0.1:5500/public/instrumented/index.html');
    });

    afterEach(async () => {
        await driver.navigate().refresh();
    });

    after(async () => {
        await driver.quit();
    });

    it('Should load the login page', async function () {
        const title = await driver.getTitle();
        expect(title).to.equal('Login');
    });

    it('Should get the correct username value', async function () {
        const usernameInput = await driver.findElement(By.id('username'));
        expect(await usernameInput.isDisplayed()).to.be.true;
        await usernameInput.sendKeys('testuser');
        const username = await usernameInput.getAttribute('value');
        expect(username).to.equal('testuser');
    });

    it('Should get the correct password value', async function () {
        const passwordInput = await driver.findElement(By.id('password'));
        expect(await passwordInput.isDisplayed()).to.be.true;
        await passwordInput.sendKeys('testpassword');
        const password = await passwordInput.getAttribute('value');
        expect(password).to.equal('testpassword');
    });

    it('Should display the login form', async function () {
        const loginForm = await driver.findElement(By.id('loginForm'));
        expect(await loginForm.isDisplayed()).to.be.true;
    });

    it('Should allow entering a username', async function () {
        const usernameInput = await driver.findElement(By.id('username'));
        expect(await usernameInput.isDisplayed()).to.be.true;
        await usernameInput.sendKeys('testuser');
        expect(await usernameInput.getAttribute('value')).to.equal('testuser');
    });

    it('Should allow entering a password', async function () {
        const passwordInput = await driver.findElement(By.id('password'));
        expect(await passwordInput.isDisplayed()).to.be.true;
        await passwordInput.sendKeys('testpassword');
        expect(await passwordInput.getAttribute('value')).to.equal('testpassword');
    });

    it('Should redirect to courses page for student role', async function () {
        await driver.get('http://127.0.0.1:5500/public/instrumented/index.html');
        await driver.findElement(By.id('username')).sendKeys('jennieeain2');
        await driver.findElement(By.id('password')).sendKeys('Ilovefood123@');
        await driver.findElement(By.xpath("//button[contains(text(), 'LOGIN')]")).click();
        let loginButton = await driver.findElement(By.xpath("//button[contains(text(), 'LOGIN')]"));
        expect(await loginButton.isDisplayed()).to.be.true;
        await driver.wait(until.urlIs('http://127.0.0.1:5500/public/courses.html'), 10000);
        let currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).to.equal('http://127.0.0.1:5500/public/courses.html');
    });

    it('Should redirect to viewAllQuizzes page for enterprise role', async function () {
        await driver.get('http://127.0.0.1:5500/public/instrumented/index.html');
        await driver.findElement(By.id('username')).sendKeys('enterprise');
        await driver.findElement(By.id('password')).sendKeys('Ilovefood123@');
        await driver.findElement(By.xpath("//button[contains(text(), 'LOGIN')]")).click();
        await driver.wait(until.urlIs('http://127.0.0.1:5500/public/viewAllQuizzes.html'), 10000);
        let currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).to.equal('http://127.0.0.1:5500/public/viewAllQuizzes.html');
    });

    it('Should show error when username is missing', async function () {
        await driver.get('http://127.0.0.1:5500/public/instrumented/index.html');
        await driver.findElement(By.id('password')).sendKeys('password');
        await driver.findElement(By.xpath("//button[contains(text(), 'LOGIN')]")).click();
        await driver.wait(until.alertIsPresent());
        let alert = await driver.switchTo().alert();
        expect(alert).to.not.be.null;
        let alertText = await alert.getText();
        expect(alertText).to.equal('Username and password are required');
        await alert.accept();
    });

    it('Should show error when password is missing', async function () {
        await driver.get('http://127.0.0.1:5500/public/instrumented/index.html');
        await driver.findElement(By.id('username')).sendKeys('newuser');
        await driver.findElement(By.xpath("//button[contains(text(), 'LOGIN')]")).click();
        await driver.wait(until.alertIsPresent());
        let alert = await driver.switchTo().alert();
        expect(alert).to.not.be.null;
        let alertText = await alert.getText();
        expect(alertText).to.equal('Username and password are required');
        await alert.accept();
    });

    it('Should show error when username does not exist', async function () {
        await driver.get('http://127.0.0.1:5500/public/instrumented/index.html');
        await driver.findElement(By.id('username')).sendKeys('nonexistentuser');
        await driver.findElement(By.id('password')).sendKeys('password');
        await driver.findElement(By.xpath("//button[contains(text(), 'LOGIN')]")).click();
        await driver.wait(until.alertIsPresent());
        let alert = await driver.switchTo().alert();
        expect(alert).to.not.be.null;
        let alertText = await alert.getText();
        expect(alertText).to.equal('Invalid username');
        await alert.accept();
    });

    it('Should show error when password is incorrect', async function () {
        await driver.get('http://127.0.0.1:5500/public/instrumented/index.html');
        await driver.findElement(By.id('username')).sendKeys('jennieeain2');
        await driver.findElement(By.id('password')).sendKeys('wrongpassword');
        await driver.findElement(By.xpath("//button[contains(text(), 'LOGIN')]")).click();
        await driver.wait(until.alertIsPresent());
        let alert = await driver.switchTo().alert();
        expect(alert).to.not.be.null;
        let alertText = await alert.getText();
        expect(alertText).to.equal('Invalid password');
        await alert.accept();
    });

    afterEach(async function () {
        await driver.executeScript('return window.__coverage__;').then(async (coverageData) => {
            if (coverageData) {
                // Save coverage data to a file
                await fs.writeFile('coverage-frontend/coverage' + counter++ + '.json',
                    JSON.stringify(coverageData), (err) => {
                        if (err) {
                            console.error('Error writing coverage data:', err);
                        } else {
                            console.log('Coverage data written to coverage.json');
                        }
                    });
            }
        });
    });
});