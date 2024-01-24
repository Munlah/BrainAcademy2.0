const { Builder, By, until } = require('selenium-webdriver');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const fs = require('fs').promises;
const { describe, it, after, before } = require('mocha');
const sinon = require('sinon');
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: "http://localhost" });
global.window = dom.window;
global.document = dom.window.document;
global.localStorage = dom.window.localStorage;

// Your tests go here
chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Login Page UI Testing', function () {
    this.timeout(30000);
    let driver;
    var counter = 0;
    this.timeout(30000);

    before(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.get('http://127.0.0.1:5500/public/instrumented/index.html');
    });

    afterEach(async () => {

        try {
            await driver.switchTo().alert().then(async (alert) => {
                await alert.accept();
            });
        } catch (e) {
            // No alert present, continue with the cleanup
        }

        await driver.navigate().refresh();

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

    after(async () => {
        await driver.quit();
    });

    async function login(username, password) {
        await driver.wait(until.elementLocated(By.id('username')), 5000);
        await driver.findElement(By.id('username')).sendKeys(username);
        await driver.wait(until.elementLocated(By.id('password')), 5000);
        await driver.findElement(By.id('password')).sendKeys(password);
        await driver.wait(until.elementLocated(By.id('loginForm')), 5000);
        await driver.findElement(By.id('loginForm')).submit();
    }


    it('should log in successfully with valid credentials', async function () {
        await login('jennieeain2', 'Ilovefood123@');

        await driver.wait(until.urlIs('http://127.0.0.1:5500/public/courses.html'), 5000);

        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).to.equal('http://127.0.0.1:5500/public/courses.html');
    });

    it('stores username and userId in local storage on successful login', async function () {
        await driver.get('http://127.0.0.1:5500/public/instrumented/index.html');
        await login('jennieeain2', 'Ilovefood123@');

        // Execute script in the context of the browser to get localStorage values
        const username = await driver.executeScript('return localStorage.getItem("username");');
        const userId = await driver.executeScript('return localStorage.getItem("userId");');

        // Assert that the username and userId are as expected
        expect(username).to.equal('jennieeain2');
        expect(userId).to.equal('B5AijGy9O8g9PAGIvkKs');
    });

    it('should navigate to courses.html if user role is student', async function () {
        await driver.get('http://127.0.0.1:5500/public/instrumented/index.html');

        await login('jennieeain2', 'Ilovefood123@');

        await driver.wait(until.urlIs('http://127.0.0.1:5500/public/courses.html'), 10000);
        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).to.equal('http://127.0.0.1:5500/public/courses.html');
    });

    it('should navigate to viewAllQuizzes.html if user role is enterprise', async function () {
        await driver.get('http://127.0.0.1:5500/public/instrumented/index.html');

        await login('enterprise', 'Ilovefood123@');

        await driver.wait(until.urlIs('http://127.0.0.1:5500/public/viewAllQuizzes.html'), 10000);
        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).to.equal('http://127.0.0.1:5500/public/viewAllQuizzes.html');
    });

    it('should display certain elements in login', async function () {
        await driver.get('http://127.0.0.1:5500/public/instrumented/index.html');

        await driver.wait(until.elementLocated(By.id('username')), 5000);
        await driver.wait(until.elementLocated(By.id('password')), 5000);
        await driver.wait(until.elementLocated(By.id('loginForm')), 5000);

        const username = await driver.findElement(By.id('username'));
        const password = await driver.findElement(By.id('password'));
        const form = await driver.findElement(By.id('loginForm'));

        const isUsernameDisplayed = await username.isDisplayed();
        const isPasswordDisplayed = await password.isDisplayed();
        const isFormDisplayed = await form.isDisplayed();

        expect(isUsernameDisplayed).to.be.true;
        expect(isPasswordDisplayed).to.be.true;
        expect(isFormDisplayed).to.be.true;
    });

    it('Should show error when username is missing', async function () {
        await driver.get('http://127.0.0.1:5500/public/instrumented/index.html');

        await login('', 'Ilovefood123@');

        await driver.wait(until.alertIsPresent());
        let alert = await driver.switchTo().alert();
        expect(alert).to.not.be.null;
        let alertText = await alert.getText();
        expect(alertText).to.equal('Username and password are required');
        await alert.accept();
    });

    it('Should show error when password is missing', async function () {
        await driver.get('http://127.0.0.1:5500/public/instrumented/index.html');

        await login('enterprise', '');

        await driver.wait(until.alertIsPresent());
        let alert = await driver.switchTo().alert();
        expect(alert).to.not.be.null;
        let alertText = await alert.getText();
        expect(alertText).to.equal('Username and password are required');
        await alert.accept();
    });

    it('Should show error when username does not exist', async function () {
        await driver.get('http://127.0.0.1:5500/public/instrumented/index.html');

        await login('enterprise1', 'Ilovefood123@');

        await driver.wait(until.alertIsPresent());
        let alert = await driver.switchTo().alert();
        expect(alert).to.not.be.null;
        let alertText = await alert.getText();
        expect(alertText).to.equal('Invalid username');
        await alert.accept();
    });

    it('Should show error when password is incorrect', async function () {
        await driver.get('http://127.0.0.1:5500/public/instrumented/index.html');

        await login('enterprise', 'Ilovefood123');

        await driver.wait(until.alertIsPresent());
        let alert = await driver.switchTo().alert();
        expect(alert).to.not.be.null;
        let alertText = await alert.getText();
        expect(alertText).to.equal('Invalid password');
        await alert.accept();
    });

    it('Should show the title', async () => {
        await driver.get('http://127.0.0.1:5500/public/instrumented/index.html');

        const title = await driver.getTitle();
        expect(title).to.equal("Login");
    });

    it('Should show alert when username and password are not provided', async function () {
        await driver.get('http://127.0.0.1:5500/public/instrumented/index.html');

        await login('', '');

        await driver.wait(until.alertIsPresent());
        let alert = await driver.switchTo().alert();
        expect(alert).to.not.be.null;
        let alertText = await alert.getText();
        expect(alertText).to.equal('Username and password are required');
        await alert.accept();
    });
});