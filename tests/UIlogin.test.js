const { Builder, By, until } = require('selenium-webdriver');
const { describe, it, after, before } = require('mocha');
const { expect } = require('chai');

describe.only('Login Page UI Testing', function () {
    this.timeout(30000);
    let driver;

    before(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.get('http://127.0.0.1:5500/public/index.html');
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

    it('Should display the login form', async function () {
        const loginForm = await driver.findElement(By.id('loginForm'));
        expect(await loginForm.isDisplayed()).to.be.true;
    });

    it('Should allow entering a username', async function () {
        const usernameInput = await driver.findElement(By.id('username'));
        await usernameInput.sendKeys('testuser');
        expect(await usernameInput.getAttribute('value')).to.equal('testuser');
    });

    it('Should allow entering a password', async function () {
        const passwordInput = await driver.findElement(By.id('password'));
        await passwordInput.sendKeys('testpassword');
        expect(await passwordInput.getAttribute('value')).to.equal('testpassword');
    });

    it('Should redirect to courses page for student role', async function () {
        await driver.findElement(By.id('username')).sendKeys('jennieeain2');
        await driver.findElement(By.id('password')).sendKeys('Ilovefood123@');
        await driver.findElement(By.xpath("//button[contains(text(), 'LOGIN')]")).click();
        await driver.wait(until.urlIs('http://127.0.0.1:5500/public/courses.html'), 10000);
    });

    it('Should redirect to viewAllQuizzes page for enterprise role', async function () {
        await driver.get('http://127.0.0.1:5500/public/index.html');
        await driver.findElement(By.id('username')).sendKeys('enterprise');
        await driver.findElement(By.id('password')).sendKeys('Ilovefood123@');
        await driver.findElement(By.xpath("//button[contains(text(), 'LOGIN')]")).click();
        await driver.wait(until.urlIs('http://127.0.0.1:5500/public/viewAllQuizzes.html'), 10000);
    });

    it('Should show error when username is missing', async function () {
        await driver.get('http://127.0.0.1:5500/public/index.html');
        await driver.findElement(By.id('password')).sendKeys('password');
        await driver.findElement(By.xpath("//button[contains(text(), 'LOGIN')]")).click();
        await driver.wait(until.alertIsPresent());
        let alert = await driver.switchTo().alert();
        let alertText = await alert.getText();
        expect(alertText).to.equal('Username and password are required');
        await alert.accept();
    });

    it('Should show error when password is missing', async function () {
        await driver.get('http://127.0.0.1:5500/public/index.html');
        await driver.findElement(By.id('username')).sendKeys('newuser');
        await driver.findElement(By.xpath("//button[contains(text(), 'LOGIN')]")).click();
        await driver.wait(until.alertIsPresent());
        let alert = await driver.switchTo().alert();
        let alertText = await alert.getText();
        expect(alertText).to.equal('Username and password are required');
        await alert.accept();
    });

    it('Should show error when username does not exist', async function () {
        await driver.get('http://127.0.0.1:5500/public/index.html');
        await driver.findElement(By.id('username')).sendKeys('nonexistentuser');
        await driver.findElement(By.id('password')).sendKeys('password');
        await driver.findElement(By.xpath("//button[contains(text(), 'LOGIN')]")).click();
        await driver.wait(until.alertIsPresent());
        let alert = await driver.switchTo().alert();
        let alertText = await alert.getText();
        expect(alertText).to.equal('Invalid username');
        await alert.accept();
    });

    it('Should show error when password is incorrect', async function () {
        await driver.get('http://127.0.0.1:5500/public/index.html');
        await driver.findElement(By.id('username')).sendKeys('jennieeain2');
        await driver.findElement(By.id('password')).sendKeys('wrongpassword');
        await driver.findElement(By.xpath("//button[contains(text(), 'LOGIN')]")).click();
        await driver.wait(until.alertIsPresent());
        let alert = await driver.switchTo().alert();
        let alertText = await alert.getText();
        expect(alertText).to.equal('Invalid password');
        await alert.accept();
    });

});