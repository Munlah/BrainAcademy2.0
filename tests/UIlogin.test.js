const { app } = require('../index');
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

chai.use(chaiAsPromised);
const expect = chai.expect;

var server;
before(async function () {
    server = await new Promise((resolve) => {
        server = app.listen(0, "localhost", () => {
            resolve(server);
        });
    });
});

after(async function () {
    await server.close();
    process.exit(0);
});

describe('Login Page UI Testing', function () {
    this.timeout(30000);
    let driver;
    var counter = 0;

    before(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.get('http://localhost:' + server.address().port + '/instrumented/index.html');
    });

    afterEach(async () => {

        await driver.navigate().refresh();

        await driver.executeScript('return window.__coverage__;').then(async (coverageData) => {
            if (coverageData) {
                await fs.writeFile('coverage-frontend/coverageLogin' + counter++ + '.json',
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
        await driver.sleep(3000);
        await driver.executeScript('document.getElementById("loginForm").onsubmit = function() { return false; }');
        await driver.sleep(3000);
        let loginButton = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'LOGIN')]")), 5000);
        await loginButton.click();
        await driver.sleep(3000);
    }

    function getCredentials() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        return { username, password };
    }

    function validateCredentials(username, password) {
        if (!username || !password) {
            showAlert('Username and password are required');
            return false;
        }
        return true;
    }

    function showAlert(message) {
        alert(message);
    }

    it('should log in successfully with valid credentials without using the form listener', async function () {
        await driver.get('http://localhost:' + server.address().port + '/instrumented/index.html');

        await login('jennieeain2', 'Ilovefood123@');

        await driver.sleep(3000);

        await driver.wait(until.urlContains('/courses.html'), 10000);

        await driver.sleep(3000);

        const currentUrl = await driver.getCurrentUrl();

        await driver.sleep(3000);

        expect(currentUrl).to.include('/courses.html');
    });


    it('stores username and userId in local storage on successful login', async function () {
        await driver.get('http://localhost:' + server.address().port + '/instrumented/index.html');
        await login('jennieeain2', 'Ilovefood123@');

        await driver.sleep(3000);

        const username = await driver.executeScript('return localStorage.getItem("username");');
        const userId = await driver.executeScript('return localStorage.getItem("userId");');

        await driver.sleep(3000);

        expect(username).to.equal('jennieeain2');
        expect(userId).to.equal('B5AijGy9O8g9PAGIvkKs');
    });

    it('should navigate to courses.html if user role is student', async function () {
        await driver.get('http://localhost:' + server.address().port + '/instrumented/index.html');

        await driver.sleep(3000);

        await login('jennieeain2', 'Ilovefood123@');

        await driver.sleep(3000);

        await driver.wait(until.urlContains('/courses.html'), 10000);

        await driver.sleep(3000);

        const currentUrl = await driver.getCurrentUrl();

        await driver.sleep(3000);

        expect(currentUrl).to.include('/courses.html');

        await driver.sleep(3000);

    });

    it('should navigate to viewAllQuizzes.html if user role is enterprise', async function () {
        await driver.get('http://localhost:' + server.address().port + '/instrumented/index.html');

        await driver.sleep(3000);

        await login('enterprise', 'Ilovefood123@');

        await driver.sleep(3000);

        await driver.wait(until.urlContains('/viewAllQuizzes.html'), 10000);

        await driver.sleep(3000);

        const currentUrl = await driver.getCurrentUrl();

        await driver.sleep(3000);

        expect(currentUrl).to.include('/viewAllQuizzes.html');

        await driver.sleep(3000);
    });

    it('should display certain elements in login', async function () {
        await driver.get('http://localhost:' + server.address().port + '/instrumented/index.html');

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
        await driver.get('http://localhost:' + server.address().port + '/instrumented/index.html');

        await login('', 'Ilovefood123@');

        await driver.wait(until.alertIsPresent());
        let alert = await driver.switchTo().alert();
        expect(alert).to.not.be.null;
        let alertText = await alert.getText();
        expect(alertText).to.equal('Username and password are required');
        await alert.accept();
    });

    it('Should show error when password is missing', async function () {
        await driver.get('http://localhost:' + server.address().port + '/instrumented/index.html');

        await login('enterprise', '');

        await driver.wait(until.alertIsPresent());
        let alert = await driver.switchTo().alert();
        expect(alert).to.not.be.null;
        let alertText = await alert.getText();
        expect(alertText).to.equal('Username and password are required');
        await alert.accept();
    });

    it('Should show error when username does not exist', async function () {
        await driver.get('http://localhost:' + server.address().port + '/instrumented/index.html');

        await login('enterprise1', 'Ilovefood123@');

        await driver.wait(until.alertIsPresent());
        let alert = await driver.switchTo().alert();
        expect(alert).to.not.be.null;
        let alertText = await alert.getText();
        expect(alertText).to.equal('Invalid username');
        await alert.accept();
    });

    it('Should show error when password is incorrect', async function () {
        await driver.get('http://localhost:' + server.address().port + '/instrumented/index.html');

        await login('enterprise', 'Ilovefood123');

        await driver.wait(until.alertIsPresent());
        let alert = await driver.switchTo().alert();
        expect(alert).to.not.be.null;
        let alertText = await alert.getText();
        expect(alertText).to.equal('Invalid password');
        await alert.accept();
    });

    it('Should show the title', async () => {
        await driver.get('http://localhost:' + server.address().port + '/instrumented/index.html');

        const title = await driver.getTitle();
        expect(title).to.equal("Login");
    });

    it('Should show alert when username and password are not provided', async function () {
        await driver.get('http://localhost:' + server.address().port + '/instrumented/index.html');

        await login('', '');

        await driver.wait(until.alertIsPresent());
        let alert = await driver.switchTo().alert();
        expect(alert).to.not.be.null;
        let alertText = await alert.getText();
        expect(alertText).to.equal('Username and password are required');
        await alert.accept();
    });

    it('Should load the login page', async function () {
        await driver.get('http://localhost:' + server.address().port + '/instrumented/index.html');
        const title = await driver.getTitle();
        expect(title).to.equal('Login');
    });

    it('Should get the correct username value', async function () {
        await driver.get('http://localhost:' + server.address().port + '/instrumented/index.html');
        const usernameInput = await driver.findElement(By.id('username'));
        expect(await usernameInput.isDisplayed()).to.be.true;
        await usernameInput.sendKeys('testuser');
        const username = await usernameInput.getAttribute('value');
        expect(username).to.equal('testuser');
    });

    it('Should get the correct password value', async function () {
        await driver.get('http://localhost:' + server.address().port + '/instrumented/index.html');
        const passwordInput = await driver.findElement(By.id('password'));
        expect(await passwordInput.isDisplayed()).to.be.true;
        await passwordInput.sendKeys('testpassword');
        const password = await passwordInput.getAttribute('value');
        expect(password).to.equal('testpassword');
    });

    it('Should display the login form', async function () {
        await driver.get('http://localhost:' + server.address().port + '/instrumented/index.html');
        const loginForm = await driver.findElement(By.id('loginForm'));
        expect(await loginForm.isDisplayed()).to.be.true;
    });

    it('Should allow entering a username', async function () {
        await driver.get('http://localhost:' + server.address().port + '/instrumented/index.html');
        const usernameInput = await driver.findElement(By.id('username'));
        expect(await usernameInput.isDisplayed()).to.be.true;
        await usernameInput.sendKeys('testuser');
        expect(await usernameInput.getAttribute('value')).to.equal('testuser');
    });

    it('Should allow entering a password', async function () {
        await driver.get('http://localhost:' + server.address().port + '/instrumented/index.html');
        const passwordInput = await driver.findElement(By.id('password'));
        expect(await passwordInput.isDisplayed()).to.be.true;
        await passwordInput.sendKeys('testpassword');
        expect(await passwordInput.getAttribute('value')).to.equal('testpassword');
    });

    it('should retrieve username and password from the DOM', function () {
        const dom = new JSDOM('<!doctype html><html><body><input id="username" value="testUser"><input id="password" value="testPassword"></body></html>');

        global.window = dom.window;
        global.document = dom.window.document;

        const credentials = getCredentials();

        expect(credentials).to.deep.equal({
            username: 'testUser',
            password: 'testPassword'
        });
    });

    it('should return true when both username and password are provided', function () {
        const alertSpy = sinon.spy(showAlert);

        const result = validateCredentials('testUser', 'testPassword');

        sinon.assert.notCalled(alertSpy);

        expect(result).to.be.true;
    });

});