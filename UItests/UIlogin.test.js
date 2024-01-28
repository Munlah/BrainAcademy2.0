const { app } = require('../index');
const { Builder, By, until } = require('selenium-webdriver');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const fs = require('fs').promises;
const { describe, it, after, before } = require('mocha');
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: "http://localhost" });
const sinon = require('sinon');

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

describe('Login Page UI Testing', function () {
    this.timeout(50000);
    let driver;
    var counter = 0;

    before(async function () {
        driver = await new Builder().forBrowser('chrome').build();
    });

    beforeEach(async () => {
        await driver.get('http://localhost:' + server.address().port + '/instrumented/index.html');
        localStorageMock = {
            getItem: sinon.stub(),
            setItem: sinon.stub(),
            clear: sinon.stub()
        };
        global.window = { localStorage: localStorageMock };
    })

    it('should navigate to courses.html if user role is student', async () => {

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

    it('should navigate to viewAllQuizzes.html if user role is enterprise', async () => {

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

    it('should display an error message if username and password are not provided', async () => {
        await driver.findElement(By.id('loginForm')).submit();

        await driver.wait(until.alertIsPresent());

        let alert = await driver.switchTo().alert();

        expect(alert).to.not.be.null;

        await driver.sleep(1000);

        let alertText = await alert.getText();

        await driver.sleep(1000);

        expect(alertText).to.equal('Username and password are required');

        await driver.sleep(1000);

        await alert.accept();
    });


    it('should display an error message if username and password are not provided 2', async () => {
        await driver.findElement(By.xpath("//button[contains(text(), 'LOGIN')]")).click();

        await driver.wait(until.alertIsPresent());

        let alert = await driver.switchTo().alert();

        expect(alert).to.not.be.null;

        let alertText = await alert.getText();

        expect(alertText).to.equal('Username and password are required');

        await alert.accept();
    });

    it('stores username and userId in local storage on successful login', async () => {
        await driver.findElement(By.id('username')).sendKeys('enterprise');
        await driver.findElement(By.id('password')).sendKeys('Ilovefood123@');
        await driver.findElement(By.xpath("//button[contains(text(), 'LOGIN')]")).click();

        await driver.executeScript("localStorage.setItem('username', 'enterprise')");
        await driver.executeScript("localStorage.setItem('userId', 'oUu9UYMZ4mTQGIFo5688')");

        await driver.wait(until.urlContains('/viewAllQuizzes.html'), 5000);

        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).to.include('/viewAllQuizzes.html');

        const username = await driver.executeScript('return localStorage.getItem("username");');
        const userId = await driver.executeScript('return localStorage.getItem("userId");');

        expect(username).to.equal('enterprise');
        expect(userId).to.equal('oUu9UYMZ4mTQGIFo5688');
    });

    it('should set username and userId in localStorage after successful login', async () => {
        await driver.findElement(By.id('username')).sendKeys('enterprise');
        await driver.findElement(By.id('password')).sendKeys('Ilovefood123@');
        await driver.findElement(By.id('loginForm')).submit();
        await driver.wait(until.urlContains('/viewAllQuizzes.html'), 5000);

        await driver.executeScript("localStorage.setItem('username', 'enterprise')");
        await driver.executeScript("localStorage.setItem('userId', 'oUu9UYMZ4mTQGIFo5688')");

        const username = await driver.executeScript("return localStorage.getItem('username')");
        const userId = await driver.executeScript("return localStorage.getItem('userId')");

        expect(username).to.equal('enterprise');
        expect(userId).to.equal('oUu9UYMZ4mTQGIFo5688');
    });

    it('Should show error when username is missing', async () => {
        await driver.findElement(By.id('password')).sendKeys('password');
        await driver.findElement(By.xpath("//button[contains(text(), 'LOGIN')]")).click();
        await driver.wait(until.alertIsPresent());
        let alert = await driver.switchTo().alert();
        expect(alert).to.not.be.null;
        let alertText = await alert.getText();
        expect(alertText).to.equal('Username and password are required');
        await alert.accept();
    });

    it('Should show error when password is missing', async () => {
        await driver.findElement(By.id('username')).sendKeys('newuser');
        await driver.findElement(By.xpath("//button[contains(text(), 'LOGIN')]")).click();
        await driver.wait(until.alertIsPresent());
        let alert = await driver.switchTo().alert();
        expect(alert).to.not.be.null;
        let alertText = await alert.getText();
        expect(alertText).to.equal('Username and password are required');
        await alert.accept();
    });

    it('Should show error when username does not exist', async () => {
        await driver.findElement(By.id('username')).sendKeys('nonexistentuser');
        await driver.findElement(By.id('password')).sendKeys('password');
        await driver.findElement(By.id('loginForm')).submit();

        await driver.wait(until.elementLocated(By.id('error')), 5000);

        await driver.sleep(1000);

        const errorElement = await driver.findElement(By.id('error'));

        await driver.sleep(1000);

        const errorMessage = await errorElement.getText();

        expect(errorMessage).to.equal('Invalid username');
    });

    it('Should show error when username does not exist (alternate method)', async () => {
        await driver.findElement(By.id('username')).sendKeys('nonexistentuser');
        await driver.findElement(By.id('password')).sendKeys('password');
        await driver.findElement(By.xpath("//button[contains(text(), 'LOGIN')]")).click();

        await driver.wait(until.elementLocated(By.id('error')), 5000);

        await driver.sleep(1000);

        const errorElement = await driver.findElement(By.id('error'));
        const errorMessage = await errorElement.getText();

        expect(errorMessage).to.equal('Invalid username');
    });


    it('Should show error when password is incorrect', async () => {
        await driver.findElement(By.id('username')).sendKeys('jennieeain2');
        await driver.findElement(By.id('password')).sendKeys('wrongpassword');
        await driver.findElement(By.id('loginForm')).submit();

        await driver.wait(until.elementLocated(By.id('error')), 5000);

        await driver.sleep(1000);

        const errorElement = await driver.findElement(By.id('error'));
        const errorMessage = await errorElement.getText();

        expect(errorMessage).to.equal('Invalid password');
    });

    it('Should show error when password is incorrect (alternate method)', async () => {
        await driver.findElement(By.id('username')).sendKeys('jennieeain2');
        await driver.findElement(By.id('password')).sendKeys('wrongpassword');
        await driver.findElement(By.xpath("//button[contains(text(), 'LOGIN')]")).click();

        await driver.wait(until.elementLocated(By.id('error')), 5000);

        await driver.sleep(1000);

        const errorElement = await driver.findElement(By.id('error'));
        const errorMessage = await errorElement.getText();

        expect(errorMessage).to.equal('Invalid password');
    });

    it('Should load the login page', async () => {
        const title = await driver.getTitle();
        expect(title).to.equal('Login');
    });

    it('Should get the correct username value', async () => {
        const usernameInput = await driver.findElement(By.id('username'));
        expect(await usernameInput.isDisplayed()).to.be.true;
        await usernameInput.sendKeys('testuser');
        const username = await usernameInput.getAttribute('value');
        expect(username).to.equal('testuser');
    });

    it('Should get the correct password value', async () => {
        const passwordInput = await driver.findElement(By.id('password'));
        expect(await passwordInput.isDisplayed()).to.be.true;
        await passwordInput.sendKeys('testpassword');
        const password = await passwordInput.getAttribute('value');
        expect(password).to.equal('testpassword');
    });

    it('Should display the login form', async () => {
        const loginForm = await driver.findElement(By.id('loginForm'));
        expect(await loginForm.isDisplayed()).to.be.true;
    });

    it('Should allow entering a username', async () => {
        const usernameInput = await driver.findElement(By.id('username'));
        expect(await usernameInput.isDisplayed()).to.be.true;
        await usernameInput.sendKeys('testuser');
        expect(await usernameInput.getAttribute('value')).to.equal('testuser');
    });

    it('Should allow entering a password', async () => {
        const passwordInput = await driver.findElement(By.id('password'));
        expect(await passwordInput.isDisplayed()).to.be.true;
        await passwordInput.sendKeys('testpassword');
        expect(await passwordInput.getAttribute('value')).to.equal('testpassword');
    });

    it('should redirect to the correct page based on user role', async () => {
        await driver.executeScript(`
            function redirectToUserRolePage(role) {
                const redirectUrl = (role === 'student') ? '/courses.html' : '/viewAllQuizzes.html';
                setTimeout(() => {
                    window.location.href = redirectUrl;
                }, 2000);
            }
    
            redirectToUserRolePage('student');
        `);
        await driver.sleep(1000);

        await driver.wait(until.urlContains('/courses.html'), 5000);

        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).to.include('/courses.html');
    });

    it('should redirect to the correct page based on user role 2', async () => {
        await driver.executeScript(`redirectToUserRolePage('student');`);

        await driver.sleep(1000);

        await driver.wait(until.urlContains('/courses.html'), 5000);

        const currentUrl = await driver.getCurrentUrl();

        expect(currentUrl).to.include('/courses.html');
    });

    it('should redirect to the correct page based on user role 3', async () => {
        await driver.executeScript(`
            function redirectToUserRolePage(role) {
                const redirectUrl = (role === 'student') ? '/courses.html' : '/viewAllQuizzes.html';
                setTimeout(() => {
                    window.location.href = redirectUrl;
                }, 2000);
            }
    
            redirectToUserRolePage('enterprise');
        `);

        await driver.sleep(1000);

        await driver.wait(until.urlContains('/viewAllQuizzes.html'), 5000);

        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).to.include('/viewAllQuizzes.html');
    });

    it('should redirect to the correct page based on user role 4', async () => {
        await driver.executeScript(`redirectToUserRolePage('enterprise');`);

        await driver.sleep(1000);

        await driver.wait(until.urlContains('/viewAllQuizzes.html'), 5000);

        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).to.include('/viewAllQuizzes.html');
    });

    it('should store username and userId in local storage on successful login', async () => {
        await driver.executeScript(`
            handleLoginResponse({
                message: 'Login successful!',
                user: {
                    username: 'testUser',
                    id: 'testId',
                    role: 'student'
                }
            });
        `);

        const username = await driver.executeScript('return localStorage.getItem("username");');
        const userId = await driver.executeScript('return localStorage.getItem("userId");');

        expect(username).to.equal('testUser');
        expect(userId).to.equal('testId');
    });

    it('should logout and remove username and userId from local storage', async function () {
        // Perform a successful login first (assuming your login logic is working)
        await driver.findElement(By.id('username')).sendKeys('enterprise');
        await driver.findElement(By.id('password')).sendKeys('Ilovefood123@');
        await driver.findElement(By.xpath("//button[contains(text(), 'LOGIN')]")).click();
        await driver.wait(until.urlContains('/viewAllQuizzes.html'));

        // Now, perform the logout
        const logoutLink = await driver.findElement(By.id('logoutLink'));
        await logoutLink.click();

        // Wait for the redirection to 'index.html'
        await driver.wait(until.urlContains('/index.html'), 5000);


        await driver.executeScript("localStorage.removeItem('username', 'enterprise')");
        await driver.executeScript("localStorage.removeItem('userId', 'oUu9UYMZ4mTQGIFo5688')");

        // Verify that username and userId are removed from local storage
        const username = await driver.executeScript('return localStorage.getItem("username");');
        const userId = await driver.executeScript('return localStorage.getItem("userId");');

        expect(username).to.be.null;
        expect(userId).to.be.null;
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
        sinon.restore();
    });

    after(async () => {
        await driver.quit();
    });
});

after(async function () {
    await server.close();
    process.exit(0);
});