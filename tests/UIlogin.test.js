const { app } = require('../index');
const { Builder, By, until } = require('selenium-webdriver');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const fs = require('fs').promises;
const { describe, it, after, before } = require('mocha');
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

describe.only('Login Page UI Testing', function () {
    this.timeout(50000);
    let driver;
    var counter = 0;

    before(async function () {
        driver = await new Builder().forBrowser('chrome').build();
    });

    beforeEach(async () => {
        await driver.get('http://localhost:' + server.address().port + '/instrumented/index.html');
    })

    it('should navigate to courses.html if user role is student', async function () {

        await driver.findElement(By.id('username')).sendKeys('jennieeain2');
        await driver.findElement(By.id('password')).sendKeys('Ilovefood123@');
        await driver.findElement(By.id('loginForm')).submit();

        await driver.sleep(1000);

        await driver.wait(until.urlContains('/courses.html'), 10000);

        await driver.sleep(1000);

        const currentUrl = await driver.getCurrentUrl();

        await driver.sleep(1000);

        expect(currentUrl).to.include('/courses.html');
    });

    it('should navigate to viewAllQuizzes.html if user role is enterprise', async function () {

        await driver.findElement(By.id('username')).sendKeys('enterprise');
        await driver.findElement(By.id('password')).sendKeys('Ilovefood123@');
        await driver.findElement(By.id('loginForm')).submit();

        await driver.sleep(1000);

        await driver.wait(until.urlContains('/viewAllQuizzes.html'));

        await driver.sleep(1000);

        const currentUrl = await driver.getCurrentUrl();

        await driver.sleep(1000);

        expect(currentUrl).to.include('/viewAllQuizzes.html');

        await driver.sleep(1000);
    });

    it('should display an error message if username and password are not provided', async function () {
        await driver.findElement(By.id('loginForm')).submit();

        await driver.wait(until.alertIsPresent());

        let alert = await driver.switchTo().alert();

        expect(alert).to.not.be.null;

        let alertText = await alert.getText();

        expect(alertText).to.equal('Username and password are required');

        await alert.accept();
    });

    it('stores username and userId in local storage on successful login', async function () {
        await driver.findElement(By.id('username')).sendKeys('jennieeain2');
        await driver.findElement(By.id('password')).sendKeys('Ilovefood123@');
        await driver.findElement(By.id('loginForm')).submit();

        //const username = await driver.executeScript('return localStorage.setItem('username', data.user.username);');
        //const userId = await driver.executeScript('return localStorage.getItem("userId");');

        await driver.wait(until.urlContains('/viewAllQuizzes.html'));


        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).to.include('/viewAllQuizzes.html');
        const username = await driver.executeScript('return localStorage.getItem("username");');
        const userId = await driver.executeScript('return localStorage.getItem("userId");');

        await driver.sleep(1000);

        expect(username).to.equal('jennieeain2');
        expect(userId).to.equal('C0fLSVffNDuAmS3Hmqwl');
    });

    afterEach(async function () {
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
});

after(async function () {
    await server.close();
    process.exit(0);
});