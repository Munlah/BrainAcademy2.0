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

var counter = 0;

//register start

describe("Register Page UI Testing", function () {
    this.timeout(30000);
    var driver;

    before(async () => {
        driver = await new Builder().forBrowser("chrome").build();
    });

    after(async () => {
        await driver.quit();
    });

    beforeEach(async () => {
        // Navigate back to the registration page before each test
        await driver.get(
            "http://localhost:" +
            server.address().port +
            "/instrumented/register.html"
        );
    });

    afterEach(async function () {
        await driver.executeScript('return window.__coverage__;').then(async (coverageData) => {
            if (coverageData) {
                await fs.writeFile('coverage-frontend/coverageRegister' + counter++ + '.json',
                    JSON.stringify(coverageData), async (err) => {
                        if (err) {
                            console.error('Error writing coverage data:', err);
                        } else {
                            console.log('Coverage data written to coverage.json');

                            const backendCoverageData = await fs.readFile('coverage/coverage-final.json', 'utf8');

                            const mergedCoverage = JSON.parse(backendCoverageData);

                            mergedCoverage.push(coverageData);

                            await fs.writeFile('coverage/coverage-final.json', JSON.stringify(mergedCoverage), (err) => {
                                if (err) {
                                    console.error('Error writing merged coverage data:', err);
                                } else {
                                    console.log('Merged coverage data written to coverage-final.json');
                                }
                            });
                        }
                    });
            }
        });

        // Clear the input fields to ensure they do not affect subsequent tests
        const inputs = await driver.findElements(By.css("input"));
        for (const input of inputs) {
            await input.clear();
        }
    });

    it("Should show the title", async () => {
        const title = await driver.getTitle();
        expect(title).to.equal("Register");
    });

    it("Should show validation errors for empty fields", async () => {
        const submitButton = await driver.findElement(
            By.css("button[type='submit']")
        );
        await submitButton.click();

        const alertText = await driver.switchTo().alert().getText();
        expect(alertText).to.include("All fields are required");
        await driver.switchTo().alert().accept(); // Close the alert
    });

    it("Should show an error if the password is too short", async () => {
        await driver.findElement(By.id("username")).sendKeys("registeruser");
        await driver.findElement(By.id("email")).sendKeys("registeruser@gmail.com");
        await driver.findElement(By.id("password")).sendKeys("Short1!");
        await driver.findElement(By.id("fullName")).sendKeys("Register User");
        await driver.findElement(By.id("contactNumber")).sendKeys("12345678");

        const submitButton = await driver.findElement(
            By.css("button[type='submit']")
        );
        await submitButton.click();

        const passwordErrors = await driver
            .findElement(By.id("passwordErrors"))
            .getText();
        expect(passwordErrors).to.include(
            "Password must be at least 8 characters long"
        );
    });

    it("Should show an error if the password does not contain an uppercase letter", async () => {
        await driver.findElement(By.id("username")).sendKeys("registeruser");
        await driver.findElement(By.id("email")).sendKeys("registeruser@gmail.com");
        await driver.findElement(By.id("password")).sendKeys("password1!");
        await driver.findElement(By.id("fullName")).sendKeys("Register User");
        await driver.findElement(By.id("contactNumber")).sendKeys("12345678");

        const submitButton = await driver.findElement(
            By.css("button[type='submit']")
        );
        await submitButton.click();

        const passwordErrors = await driver
            .findElement(By.id("passwordErrors"))
            .getText();
        expect(passwordErrors).to.include(
            "Password must contain at least one uppercase letter"
        );
    });

    it("Should show an error if the password does not contain an lowercase letter", async () => {
        await driver.findElement(By.id("username")).sendKeys("registeruser");
        await driver.findElement(By.id("email")).sendKeys("registeruser@gmail.com");
        await driver.findElement(By.id("password")).sendKeys("PASSWORD1!");
        await driver.findElement(By.id("fullName")).sendKeys("Register User");
        await driver.findElement(By.id("contactNumber")).sendKeys("12345678");

        const submitButton = await driver.findElement(
            By.css("button[type='submit']")
        );
        await submitButton.click();

        const passwordErrors = await driver
            .findElement(By.id("passwordErrors"))
            .getText();
        expect(passwordErrors).to.include(
            "Password must contain at least one lowercase letter"
        );
    });

    it("Should show an error if the password does not contain a number", async () => {
        await driver.findElement(By.id("username")).sendKeys("registeruser");
        await driver.findElement(By.id("email")).sendKeys("registeruser@gmail.com");
        await driver.findElement(By.id("password")).sendKeys("Password!");
        await driver.findElement(By.id("fullName")).sendKeys("Register User");
        await driver.findElement(By.id("contactNumber")).sendKeys("12345678");

        const submitButton = await driver.findElement(
            By.css("button[type='submit']")
        );
        await submitButton.click();

        const passwordErrors = await driver
            .findElement(By.id("passwordErrors"))
            .getText();
        expect(passwordErrors).to.include(
            "Password must contain at least one number"
        );
    });

    it("Should show an error if the password does not contain a special character", async () => {
        await driver.findElement(By.id("username")).sendKeys("registeruser");
        await driver.findElement(By.id("email")).sendKeys("registeruser@gmail.com");
        await driver.findElement(By.id("password")).sendKeys("Password1");
        await driver.findElement(By.id("fullName")).sendKeys("Register User");
        await driver.findElement(By.id("contactNumber")).sendKeys("12345678");

        const submitButton = await driver.findElement(
            By.css("button[type='submit']")
        );
        await submitButton.click();

        const passwordErrors = await driver
            .findElement(By.id("passwordErrors"))
            .getText();
        expect(passwordErrors).to.include(
            "Password must contain at least one special character"
        );
    });

    it("Should show an error if the password contains more than two identical characters in a row", async () => {
        await driver.findElement(By.id("username")).sendKeys("registeruser");
        await driver.findElement(By.id("email")).sendKeys("registeruser@gmail.com");
        await driver.findElement(By.id("password")).sendKeys("Password111!");
        await driver.findElement(By.id("fullName")).sendKeys("Register User");
        await driver.findElement(By.id("contactNumber")).sendKeys("12345678");

        const submitButton = await driver.findElement(
            By.css("button[type='submit']")
        );
        await submitButton.click();

        const passwordErrors = await driver
            .findElement(By.id("passwordErrors"))
            .getText();
        expect(passwordErrors).to.include(
            "Password must not contain more than two identical characters in a row"
        );
    });

    it("Should show an error if the password contains the username", async () => {
        await driver.findElement(By.id("username")).sendKeys("registeruser");
        await driver.findElement(By.id("email")).sendKeys("registeruser@gmail.com");
        await driver.findElement(By.id("password")).sendKeys("registerUser1!");
        await driver.findElement(By.id("fullName")).sendKeys("Register User");
        await driver.findElement(By.id("contactNumber")).sendKeys("12345678");

        const submitButton = await driver.findElement(
            By.css("button[type='submit']")
        );
        await submitButton.click();

        const passwordErrors = await driver
            .findElement(By.id("passwordErrors"))
            .getText();
        expect(passwordErrors).to.include(
            "Password must not contain the username",
            "Password must not contain part of the email address"
        );
    });

    it("Should successfully register with a valid password and redirect to login page", async () => {
        await driver.findElement(By.id("username")).sendKeys("validuser");
        await driver.findElement(By.id("email")).sendKeys("validuser@gmail.com");
        await driver.findElement(By.id("password")).sendKeys("ValidPassword1!");
        await driver.findElement(By.id("fullName")).sendKeys("Valid User");
        await driver.findElement(By.id("contactNumber")).sendKeys("12345678");

        const submitButton = await driver.findElement(
            By.css("button[type='submit']")
        );
        await submitButton.click();

        // console.log("Waiting for the passwordErrors element to become invisible");
        await driver.wait(
            until.elementIsNotVisible(driver.findElement(By.id("passwordErrors"))),
            10000
        );

        // console.log("Verifying that password errors are hidden");
        const passwordErrors = await driver.findElement(By.id("passwordErrors"));
        const passwordErrorsDisplayStyle = await passwordErrors.getCssValue(
            "display"
        );
        // console.log(
        //   `Password error element display style: ${passwordErrorsDisplayStyle}`
        // );
        expect(passwordErrorsDisplayStyle).to.equal("none");

        await driver.sleep(1000);

        // console.log("Getting alert text");
        const alertText = await driver.switchTo().alert().getText();
        // console.log(`Alert text: ${alertText}`);
        expect(alertText).to.include("Registration successful! Please login.");

        // console.log("Accepting alert");
        await driver.switchTo().alert().accept(); // Close the alert

        // console.log("Waiting for redirection to the login page");
        // await driver.wait(
        //   until.urlIs(
        //     "http://localhost:" + server.address().port + "/instrumented/index.html"
        //   ),
        //   10000
        // );

        // console.log("Checking page title post-redirection");
        // const title = await driver.getTitle();
        // console.log(`Page title: ${title}`);
        // expect(title).to.equal("Login");

        // console.log("Test completed");
    });

    it("Should show an error if the user already exists", async () => {
        await driver.findElement(By.id("username")).sendKeys("validuser");
        await driver.findElement(By.id("email")).sendKeys("validuser@gmail.com");
        await driver.findElement(By.id("password")).sendKeys("ValidPassword1!");
        await driver.findElement(By.id("fullName")).sendKeys("Valid User");
        await driver.findElement(By.id("contactNumber")).sendKeys("12345678");

        const submitButton = await driver.findElement(
            By.css("button[type='submit']")
        );
        await submitButton.click();

        await driver.sleep(2000);

        // Handle the alert
        const alert = await driver.switchTo().alert();
        const alertText = await alert.getText();
        await alert.accept();

        // Check if the alert text is as expected
        expect(alertText).to.equal("User already exists");
    });
});

//register end 

//login start
describe('Login Page UI Testing', function () {
    this.timeout(50000);
    let driver;

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

        await driver.findElement(By.id('username')).sendKeys('validuser');
        await driver.findElement(By.id('password')).sendKeys('ValidPassword1!');
        await driver.findElement(By.id('loginForm')).submit();

        // await driver.sleep(1000);

        // await driver.wait(until.urlContains('/courses.html'), 10000);

        // await driver.sleep(1000);

        // const currentUrl = await driver.getCurrentUrl();

        // await driver.sleep(1000);

        // expect(currentUrl).to.include('/courses.html');
        await driver.sleep(1000);
        await driver.wait(until.urlContains('/courses.html'), 10000);

        // const currentUrl = await driver.getCurrentUrl();
        // expect(currentUrl).to.include('/courses.html');

        // Extract the user ID after successful login
        const userId = await driver.executeScript(() => localStorage.getItem('userId'));

        // Navigate to the courses.html page
        await driver.get('http://localhost:' + server.address().port + '/instrumented/courses.html');

        // Assuming the deleteButton is part of the courses.html page
        const deleteButton = await driver.findElement(By.id('deleteButton'));
        await deleteButton.click();
        await driver.sleep(2000);

        const confirmationPrompt = await driver.switchTo().alert();
        expect(confirmationPrompt).to.exist;

        await confirmationPrompt.accept();
        // // Wait for the user to be deleted
        //await driver.sleep(2000); // Simulating the 2-second timeout
        // await driver.wait(until.urlContains('/index.html'));
        // // Validate that the navigation to index.html occurred
        // const currentUrl = await driver.getCurrentUrl();
        // expect(currentUrl).to.include('/index.html');
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

        await driver.sleep(1000);

        await driver.executeScript("localStorage.setItem('username', 'enterprise')");
        await driver.executeScript("localStorage.setItem('userId', 'oUu9UYMZ4mTQGIFo5688')");

        await driver.wait(until.urlContains('/viewAllQuizzes.html'), 5000);

        await driver.sleep(1000);

        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).to.include('/viewAllQuizzes.html');

        await driver.sleep(1000);

        const username = await driver.executeScript('return localStorage.getItem("username");');
        const userId = await driver.executeScript('return localStorage.getItem("userId");');

        await driver.sleep(1000);

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


    afterEach(async function () {
        await driver.executeScript('return window.__coverage__;').then(async (coverageData) => {
            if (coverageData) {
                await fs.writeFile('coverage-frontend/coverageLogin' + counter++ + '.json',
                    JSON.stringify(coverageData), async (err) => {
                        if (err) {
                            console.error('Error writing coverage data:', err);
                        } else {
                            console.log('Coverage data written to coverage.json');

                            const backendCoverageData = await fs.readFile('coverage/coverage-final.json', 'utf8');

                            const mergedCoverage = JSON.parse(backendCoverageData);

                            mergedCoverage.push(coverageData);

                            await fs.writeFile('coverage/coverage-final.json', JSON.stringify(mergedCoverage), (err) => {
                                if (err) {
                                    console.error('Error writing merged coverage data:', err);
                                } else {
                                    console.log('Merged coverage data written to coverage-final.json');
                                }
                            });
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

//login end 

//add quiz start
describe('Add Quiz UI', function () {

    this.timeout(30000);

    before(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.get('http://localhost:' + server.address().port + '/instrumented/addQuiz.html');
    });

    this.beforeEach(async () => {
        await driver.get('http://localhost:' + server.address().port + '/instrumented/addQuiz.html');

    })

    afterEach(async function () {
        // Capture and save screenshot if the test fails
        const testStatus = this.currentTest.state;
        if (testStatus === 'failed') {
            const screenshot = await driver.takeScreenshot();
            const screenshotPath = path.join(__dirname, './screenshots', `test-failure-${counter++}.png`);
            await fs.writeFile(screenshotPath, screenshot, 'base64');
            console.log(`Screenshot saved: ${screenshotPath}`);
        }
        await driver.executeScript('return window.__coverage__;').then(async (coverageData) => {
            if (coverageData) {
                await fs.writeFile('coverage-frontend/coverageAddQuiz' + counter++ + '.json',
                    JSON.stringify(coverageData), async (err) => {
                        if (err) {
                            console.error('Error writing coverage data:', err);
                        } else {
                            console.log('Coverage data written to coverage.json');

                            const backendCoverageData = await fs.readFile('coverage/coverage-final.json', 'utf8');

                            const mergedCoverage = JSON.parse(backendCoverageData);

                            mergedCoverage.push(coverageData);

                            await fs.writeFile('coverage/coverage-final.json', JSON.stringify(mergedCoverage), (err) => {
                                if (err) {
                                    console.error('Error writing merged coverage data:', err);
                                } else {
                                    console.log('Merged coverage data written to coverage-final.json');
                                }
                            });
                        }
                    });
            }
        });

    });



    it('should have the correct title', async function () {

        const title = await driver.getTitle();
        expect(title).to.equal('Add Quiz Admin')
    })


    it('should show alert if all fields are not filled', async function () {
        await driver.navigate().refresh();

        //Find quiz title field
        const quizTitleElement = await driver.findElement(By.id('quizTitle'));
        await quizTitleElement.click();
        await quizTitleElement.sendKeys('Frontend test add quiz');

        //Find submit button
        const submitButton = await driver.findElement(By.xpath('//button[text()="Submit"]'));
        await submitButton.click();

        //Wait for the alert to be present
        await driver.wait(until.alertIsPresent(), 5000);

        //Switch to the alert
        const alert = await driver.switchTo().alert();

        //Get the text from the alert
        const alertText = await alert.getText();

        //Assert that the alert message contains the expected text
        expect(alertText).to.equal('Please fill in all fields');

        //Dismiss the alert
        await alert.dismiss();
    });

    it('should show alert if quizTitle already exists', async function () {
        await driver.navigate().refresh();

        // Find quiz title field
        const quizTitleElement = await driver.findElement(By.id('quizTitle'));
        await quizTitleElement.click();
        await quizTitleElement.sendKeys('Test validation');

        const quizCourseElement = await driver.findElement(By.id('quizCourse'));
        await quizCourseElement.click();
        await quizCourseElement.sendKeys('Algebra');

        const questionOneTitleElement = await driver.findElement(By.id('questionOneTitle'));
        await questionOneTitleElement.click();
        await questionOneTitleElement.sendKeys('Test question title');

        const questionOneOptionOneElement = await driver.findElement(By.id('questionOneOptionOne'));
        await questionOneOptionOneElement.click();
        await questionOneOptionOneElement.sendKeys('option 1');

        const questionOneOptionTwoElement = await driver.findElement(By.id('questionOneOptionTwo'));
        await questionOneOptionTwoElement.click();
        await questionOneOptionTwoElement.sendKeys('option 2');

        const questionOneOptionThreeElement = await driver.findElement(By.id('questionOneOptionThree'));
        await questionOneOptionThreeElement.click();
        await questionOneOptionThreeElement.sendKeys('option 3');

        const questionOneCorrectOptionElement = await driver.findElement(By.id('questionOneCorrectOption'));
        await questionOneCorrectOptionElement.click();
        await questionOneCorrectOptionElement.sendKeys(1);


        // qn 2
        const questionTwoTitleElement = await driver.findElement(By.id('questionTwoTitle'));
        await questionTwoTitleElement.click();
        await questionTwoTitleElement.sendKeys('Test question title');

        const questionTwoOptionOneElement = await driver.findElement(By.id('questionTwoOptionOne'));
        await questionTwoOptionOneElement.click();
        await questionTwoOptionOneElement.sendKeys('option 1');

        const questionTwoOptionTwoElement = await driver.findElement(By.id('questionTwoOptionTwo'));
        await questionTwoOptionTwoElement.click();
        await questionTwoOptionTwoElement.sendKeys('option 2');

        const questionTwoOptionThreeElement = await driver.findElement(By.id('questionTwoOptionThree'));
        await questionTwoOptionThreeElement.click();
        await questionTwoOptionThreeElement.sendKeys('option 3');

        const questionTwoCorrectOptionElement = await driver.findElement(By.id('questionTwoCorrectOption'));
        await questionTwoCorrectOptionElement.click();
        await questionTwoCorrectOptionElement.sendKeys(1);

        // Find submit button
        const submitButton = await driver.findElement(By.xpath('//button[text()="Submit"]'));
        await submitButton.click();

        // Wait for the alert to be present
        await driver.wait(until.alertIsPresent(), 5000);

        // Switch to the alert
        const alert = await driver.switchTo().alert();

        // Get the text from the alert
        const alertText = await alert.getText();

        // Assert that the alert message contains the expected text
        expect(alertText).to.equal('Quiz with this title already exists.');

        // Dismiss the alert
        await alert.dismiss();
    });


    it('should add a quiz and redirect to view all quizzes page', async function () {
        await driver.navigate().refresh();

        // Fill in the quiz form
        await driver.findElement(By.id('quizTitle')).sendKeys('add quiz test case new');
        await driver.findElement(By.id('quizCourse')).sendKeys('add quiz course');

        // Fill in question 1
        await driver.findElement(By.id('questionOneTitle')).sendKeys('Question 1 Title');
        await driver.findElement(By.id('questionOneOptionOne')).sendKeys('Option 1');
        await driver.findElement(By.id('questionOneOptionTwo')).sendKeys('Option 2');
        await driver.findElement(By.id('questionOneOptionThree')).sendKeys('Option 3');
        await driver.findElement(By.id('questionOneCorrectOption')).sendKeys('1');

        // Fill in question 2
        await driver.findElement(By.id('questionTwoTitle')).sendKeys('Question 2 Title');
        await driver.findElement(By.id('questionTwoOptionOne')).sendKeys('Option 1');
        await driver.findElement(By.id('questionTwoOptionTwo')).sendKeys('Option 2');
        await driver.findElement(By.id('questionTwoOptionThree')).sendKeys('Option 3');
        await driver.findElement(By.id('questionTwoCorrectOption')).sendKeys('2');

        // Submit the form
        await driver.findElement(By.xpath('//button[text()="Submit"]')).click();

        // Wait for the alert to be present
        await driver.wait(until.alertIsPresent(), 5000);

        // Switch to the alert
        const alert = await driver.switchTo().alert();

        // Get the text from the alert
        const alertText = await alert.getText();

        // Assert that the alert message contains the expected text
        expect(alertText).to.equal('Quiz created successfully.');

        // Dismiss the alert
        await alert.dismiss();

        // Wait for a moment to ensure the alert is closed
        await driver.sleep(3000);

        // Execute JavaScript to check if the window.location.href has changed
        const redirectedUrl = await driver.executeScript('return window.location.href;');
        expect(redirectedUrl).to.include("/viewAllQuizzes.html");
    });



    after(async () => {
        await driver.quit();
    });
});

// add quiz end

//viewallquizzes delete quiz edit quiz start

describe('Testing View All Quizzes Admin Page', function () {
    this.timeout(30000);
    let driver;

    before(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.get('http://localhost:' + server.address().port + '/instrumented/viewAllQuizzes.html');
    });

    after(async () => {
        await driver.quit();
    });

    afterEach(async function () {
        await driver.executeScript('return window.__coverage__;').then(async (coverageData) => {
            if (coverageData) {
                await fs.writeFile('coverage-frontend/coverageDisplayAllQuiz' + counter++ + '.json',
                    JSON.stringify(coverageData), async (err) => {
                        if (err) {
                            console.error('Error writing coverage data:', err);
                        } else {
                            console.log('Coverage data written to coverage.json');

                            const backendCoverageData = await fs.readFile('coverage/coverage-final.json', 'utf8');

                            const mergedCoverage = JSON.parse(backendCoverageData);

                            mergedCoverage.push(coverageData);

                            await fs.writeFile('coverage/coverage-final.json', JSON.stringify(mergedCoverage), (err) => {
                                if (err) {
                                    console.error('Error writing merged coverage data:', err);
                                } else {
                                    console.log('Merged coverage data written to coverage-final.json');
                                }
                            });
                        }
                    });
            }
        });
    });

    it('Should have the correct title', async () => {
        const title = await driver.getTitle();
        expect(title).to.equal('View All Quizzes Admin');
    });

    it('Should have a logout link', async () => {
        const logoutLink = await driver.findElement(By.id('logoutLink'));
        expect(await logoutLink.isDisplayed()).to.be.true;
    });

    it('Should have an Add Quiz button', async () => {
        const addQuizButton = await driver.findElement(By.id('redirectAddQuiz'));
        expect(await addQuizButton.isDisplayed()).to.be.true;
    });

    it('Should display quizzes after fetching', async () => {
        await driver.sleep(1000);
        await driver.wait(until.elementLocated(By.css('.quiz')), 5000);
        await driver.sleep(1000);
        const quizzes = await driver.findElements(By.css('.quiz'));
        await driver.sleep(1000);
        expect(quizzes.length).to.be.greaterThan(0);
    });

    it('Should open a modal when a delete button is clicked', async () => {
        await driver.sleep(1000);
        const deleteButton = await driver.findElement(By.css('.delete-button'));
        await driver.sleep(1000);
        await deleteButton.click();
        await driver.sleep(1000);
        const modal = await driver.findElement(By.id('myModal'));
        await driver.sleep(1000);
        expect(await modal.isDisplayed()).to.be.true;
    });

    it('Should close the modal when the No button is clicked', async () => {
        await driver.sleep(1000);
        const modal = await driver.findElement(By.id('myModal'));
        await driver.sleep(1000);
        expect(await modal.isDisplayed()).to.be.true;
        await driver.sleep(1000);
        const noButton = await driver.findElement(By.id('cancel-delete'));
        await noButton.click();
        await driver.sleep(1000);
        await driver.wait(until.elementIsNotVisible(modal), 10000);
        expect(await modal.isDisplayed()).to.be.false;
    });


    it('should display quizzes for a course', async function () {
        await driver.executeScript('fetchAndDisplayQuizzesByCourse("Division")');
        await driver.sleep(1000);
        await driver.wait(until.elementLocated(By.css('.quiz')), 5000);
        await driver.sleep(1000);
        const quizzes = await driver.findElements(By.css('.quiz'));
        await driver.sleep(1000);
        expect(quizzes.length).to.be.greaterThan(0);
    });

    it('should fetch and display quizzes when course button is clicked', async function () {
        await driver.sleep(1000);
        const courseButtons = await driver.findElements(By.css('.course-button'));
        await driver.sleep(1000);
        const coursetoSelect = courseButtons[1];
        await coursetoSelect.click();
        await driver.sleep(1000);
        await driver.wait(until.elementLocated(By.css('.quiz')), 5000);
        await driver.sleep(1000);
        const quizzes = await driver.findElements(By.css('.quiz'));
        await driver.sleep(1000);
        expect(quizzes.length).to.be.greaterThan(0);
    });

    it('should not display any quizzes for a course with no quizzes', async function () {
        await driver.sleep(1000);
        const courseButtons = await driver.findElements(By.css('.course-button'));
        await driver.sleep(1000);
        const coursetoSelect = courseButtons[4];
        await driver.sleep(1000);
        await coursetoSelect.click();
        await driver.sleep(1000);
        const quizzes = await driver.findElements(By.css('.quiz'));
        await driver.sleep(1000);
        expect(quizzes.length).to.equal(0);
    });

    it('should display "No quizzes found for this course" message when there are no quizzes for a course', async function () {
        await driver.sleep(1000);
        const courseButtons = await driver.findElements(By.css('.course-button'));
        await driver.sleep(1000);
        const coursetoSelect = courseButtons[4];
        await driver.sleep(1000);
        await coursetoSelect.click();
        await driver.sleep(1000);
        const noQuizzesMessage = await driver.findElement(By.css('.no-quizzes-message'));
        await driver.sleep(1000);
        expect(await noQuizzesMessage.getText()).to.equal('No quizzes found for this course');
    });

    it('should fetch and display quizzes for a course', async function () {
        await driver.sleep(1000);
        await driver.executeScript('fetchAndDisplayQuizzesByCourse("Division")');
        await driver.sleep(1000);
        await driver.wait(until.elementLocated(By.css('.quiz')), 5000);
        const quizzesContainer = await driver.findElement(By.id('display-all-quizzes'));
        await driver.sleep(1000);
        const quizzes = await quizzesContainer.findElements(By.css('.quiz'));
        await driver.sleep(1000);
        expect(quizzes.length).to.be.greaterThan(0);
    });

    it('should delete a quiz when the delete button is clicked and the deletion is confirmed', async function () {
        await driver.sleep(1000);

        await driver.executeScript('fetchAndDisplayQuizzesByCourse("Calculus")');

        await driver.sleep(1000);

        const quizzesBeforeDeletion = await driver.findElements(By.css('.quiz'));

        await driver.sleep(1000);

        const deleteButtons = await driver.findElements(By.css('.delete-button'));
        const deleteButtonToClick = deleteButtons[0];

        await driver.sleep(1000);

        await deleteButtonToClick.click();

        await driver.sleep(1000);

        const confirmDeleteButton = await driver.findElement(By.id('confirm-delete'));

        await driver.sleep(1000);

        await confirmDeleteButton.click();

        await driver.sleep(1000);

        const quizzesAfterDeletion = await driver.findElements(By.css('.quiz'));

        await driver.sleep(1000);

        expect(quizzesAfterDeletion.length).to.equal(quizzesBeforeDeletion.length - 1);

        await driver.sleep(1000);
    });

    it("Should navigate to edit quiz page when an edit button is clicked", async function () {
        // First, set up the context by displaying quizzes for a specific course
        await driver.sleep(1000);
    
        await driver.executeScript('fetchAndDisplayQuizzesByCourse("Algebra")');
    
        await driver.sleep(5000);
    
        // Find an edit button for a quiz
        const editButton = await driver.findElement(By.css(".edit-button"));
    
        // Get the current URL before clicking the edit button
        const initialUrl = await driver.getCurrentUrl();
    
        // Click on the edit button
        await editButton.click();
    
        // Add a sleep timer to wait for the navigation to complete
        await driver.sleep(3000);
    
        // Get the new URL after clicking
        const newUrl = await driver.getCurrentUrl();
    
        // Assert that the URL has changed, indicating successful navigation
        expect(newUrl).to.not.equal(initialUrl);
    
        // Extract quiz ID from the new URL
        const urlParams = new URLSearchParams(newUrl.split("?")[1]);
        const quizId = urlParams.get("quizId");
    
        // Assert that the quiz ID exists in the URL
        expect(quizId).to.exist;
    
        // Navigate back to the original quizzes page to continue tests 
        await driver.navigate().back();
        await driver.sleep(3000);
      });

    it('Add Quiz button should redirect to addQuiz.html', async () => {
        await driver.sleep(1000);
        const modal = await driver.findElement(By.id('myModal'));
        await driver.wait(until.elementIsNotVisible(modal), 10000);

        const addQuizButton = await driver.findElement(By.id('redirectAddQuiz'));
        await addQuizButton.click();
        await driver.sleep(1000);
        await driver.wait(until.urlContains('/addQuiz.html'), 10000);

        const currentUrl = await driver.getCurrentUrl();

        await driver.sleep(1000);

        expect(currentUrl).to.include('/addQuiz.html');

    });

});

// edit quiz start
const quizId = "4V7n4oZmOt7fJHXf9tEV"; // Define the quiz ID as a constant
describe("Testing Edit Quiz in Chrome", function () {
    this.timeout(30000);
    let driver;
  
    before(async () => {
      // Initialize a Chrome WebDriver instance
      driver = await new Builder().forBrowser("chrome").build();
      // Use the predefined quizId to navigate to the edit page
      await driver.get(
        `http://localhost:${
          server.address().port
        }/instrumented/editQuiz.html?quizId=${quizId}`
      );
    });
  
    after(async () => {
      // Quit the WebDriver instance after the tests
      await driver.quit();
    });
  
    it("Should populate the form with existing quiz data", async () => {
      await driver.sleep(5000);
  
      // Wait for the form to be populated
      await driver.wait(until.elementLocated(By.id("quizTitle")), 10000);
  
      // Verify form fields are populated
      const quizTitle = await driver
        .findElement(By.id("quizTitle"))
        .getAttribute("value");
      expect(quizTitle).to.not.equal("");
  
      const quizCourse = await driver
        .findElement(By.id("quizCourse"))
        .getAttribute("value");
      expect(quizCourse).to.not.equal("");
  
      const question1Title = await driver
        .findElement(By.id("question1Title"))
        .getAttribute("value");
      expect(question1Title).to.not.equal("");
  
      const question1Option1 = await driver
        .findElement(By.id("question1Option1"))
        .getAttribute("value");
      expect(question1Option1).to.not.equal("");
  
      const question1Option2 = await driver
        .findElement(By.id("question1Option2"))
        .getAttribute("value");
      expect(question1Option2).to.not.equal("");
  
      const question1CorrectOption = await driver
        .findElement(By.id("question1CorrectOption"))
        .getAttribute("value");
      expect(question1CorrectOption).to.not.equal("");
  
      const question2Title = await driver
        .findElement(By.id("question2Title"))
        .getAttribute("value");
      expect(question2Title).to.not.equal("");
  
      const question2Option1 = await driver
        .findElement(By.id("question2Option1"))
        .getAttribute("value");
      expect(question2Option1).to.not.equal("");
  
      const question2Option2 = await driver
        .findElement(By.id("question2Option2"))
        .getAttribute("value");
      expect(question2Option2).to.not.equal("");
  
      const question2CorrectOption = await driver
        .findElement(By.id("question2CorrectOption"))
        .getAttribute("value");
      expect(question2CorrectOption).to.not.equal("");
    });
  
    it("Should update the quiz when form is submitted with valid data", async () => {
      // Get the current URL before updating the quiz
      const initialUrl = await driver.getCurrentUrl();
  
      // Simulate user input to update quiz details
      const updatedQuizTitle = "Updated Algebra Quiz";
      await driver.findElement(By.id("quizTitle")).clear();
      await driver.sleep(1000);
      await driver.findElement(By.id("quizTitle")).sendKeys(updatedQuizTitle);
  
      // Submit the updated form
      await driver.findElement(By.id("editQuizForm")).submit();
  
      // Wait for the success alert and verify its text
      await driver.wait(until.alertIsPresent(), 10000);
      const alert = await driver.switchTo().alert();
      const alertText = await alert.getText();
      expect(alertText).to.include("Quiz updated successfully");
      await driver.sleep(2000);
      alert.accept(); // Dismiss the alert
  
      // Wait a bit to allow any JavaScript-based navigation to initiate
      await driver.sleep(3000); // Wait for navigation to complete
      // Capture the new URL after the expected navigation
      const newUrl = await driver.getCurrentUrl();
  
      // Assert that the URL has changed, indicating successful navigation
      expect(newUrl).to.not.equal(initialUrl);
      expect(newUrl).to.include("viewAllQuizzes.html"); // Confirm the specific navigation target
  
      // Navigate back and verify the initial page
      await driver.navigate().back();
      await driver.sleep(3000); // Wait for navigation back to complete
      const backUrl = await driver.getCurrentUrl();
      expect(backUrl).to.equal(initialUrl); // Back on the initial page
    });
  
    it("Should display an error message if the quiz update failed", async () => {
      // Assuming a function to simulate a failed quiz update response
      await driver.executeScript(() => {
        window.fetch = () =>
          Promise.resolve({
            json: () => Promise.resolve({ message: "Quiz update failed" }),
          });
      });
  
      // Trigger the quiz update process
      await driver.findElement(By.id("editQuizForm")).submit();
  
      // Wait for the failure alert to be present
      await driver.wait(until.alertIsPresent(), 10000);
      const alert = await driver.switchTo().alert();
      const alertText = await alert.getText();
  
      // Verify the alert text matches the failure message
      expect(alertText).to.include("Quiz update failed");
      await driver.sleep(2000);
  
      // Accept the alert
      await alert.accept();
    });
  
    it("Should display an error message if the error failed to fetch", async () => {
      await driver.sleep(2000);
  
      // Simulate a fetch error
      await driver.executeScript(() => {
        window.fetch = () => Promise.reject(new Error("Simulated fetch failure"));
      });
  
      // Trigger the fetch process
      await driver.findElement(By.id("editQuizForm")).submit();
  
      // Wait for the error alert to be present
      await driver.wait(until.alertIsPresent(), 10000);
      const alert = await driver.switchTo().alert();
      const alertText = await alert.getText();
  
      // Verify the alert text matches the error message
      expect(alertText).to.include("Error updating quiz. Please try again.");
      await driver.sleep(2000);
  
      // Accept the alert
      await alert.accept();
    });
  
    it("Should display an error message if the quiz is not found", async () => {
      await driver.get(
        "http://localhost:" +
          server.address().port +
          "/instrumented/editQuiz.html?quizId=123"
      );
  
      // Wait for the error alert to be present
      await driver.wait(until.alertIsPresent(), 10000);
      const alert = await driver.switchTo().alert();
      const alertText = await alert.getText();
  
      // Verify the alert text matches the "Quiz not found" error message
      expect(alertText).to.include("Quiz not found. Please check the quiz ID.");
      await driver.sleep(2000);
  
      // Accept the alert
      await alert.accept();
    });
  
    afterEach(async function () {
      await driver
        .executeScript("return window.__coverage__;")
        .then(async (coverageData) => {
          if (coverageData) {
            await fs.writeFile(
              `coverage-frontend/coverageEditQuiz${counter++}.json`,
              JSON.stringify(coverageData)
            );
          }
        });
    });
  });


//viewallquizzes delete quiz edit quiz end

// redirect from course details to quiz start 

describe('Redirect to quiz', function () {
    this.timeout(30000);
    let driver;
    var counter = 0;

    before(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.get('http://localhost:' + server.address().port + '/instrumented/courseDetails.html?courseId=2eOC6Pd7Tcx6OFqGKcPA&topic=Division');
    });

    after(async () => {
        await driver.quit();
    });



    it('redirect to quiz when start quiz button is pressed', async function () {
        //Wait for the start-quiz-button to be visible
        await driver.wait(until.elementLocated(By.id('redirectQuiz')), 5000);

        //Find the start-quiz-button by id
        const startQuizButton = await driver.findElement(By.id('redirectQuiz'));

        //Click the start-quiz-button
        await startQuizButton.click();

        //Wait for the redirection to complete
        await driver.wait(until.urlContains('/validateQuiz.html?quizId=bNeESFLUHc3Abh9qLZ5u'), 10000);


        //Assert that the URL is redirected to the expected URL
        const currentUrl = await driver.getCurrentUrl();

        expect(currentUrl).to.include('/validateQuiz.html?quizId=bNeESFLUHc3Abh9qLZ5u');
    })
    afterEach(async function () {
        // Capture and save screenshot if the test fails
        const testStatus = this.currentTest.state;
        if (testStatus === 'failed') {
            const screenshot = await driver.takeScreenshot();
            const screenshotPath = path.join(__dirname, './screenshots', `test-failure-${counter++}.png`);
            await fs.writeFile(screenshotPath, screenshot, 'base64');
            console.log(`Screenshot saved: ${screenshotPath}`);
        }

        await driver.executeScript('return window.__coverage__;').then(async (coverageData) => {
            if (coverageData) {
                // Save coverage data to a file
                await fs.writeFile('coverage-frontend/coverageRedirectToQuiz' + counter++ + '.json',
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
})

// redirect from course details to quiz end

// validate quiz start

describe("UI for validating quiz answers", function () {
    this.timeout(30000);
    var driver;

    before(async () => {
        driver = await new Builder().forBrowser("chrome").build();
        await driver.get(
            "http://localhost:" +
            server.address().port +
            `/instrumented/validateQuiz.html?quizId=${quizId}`
        );
    });


    after(async () => {
        await driver.quit();
    });

    it("Should show the title", async () => {
        const title = await driver.getTitle();
        expect(title).to.equal("Main Quiz");
    });

    it('should expect the submit button to be shown and the redo button to be hidden', async () => {
        // Check if the results div is present
        const resultsContainer = await driver.findElement(By.id('results'));
        expect(resultsContainer).to.exist;

        // Check if the submit button is present and has the text "Get Results"
        const submitButton = await driver.findElement(By.id('submitQuiz'));
        expect(submitButton).to.exist;
        const submitButtonText = await submitButton.getText();
        expect(submitButtonText.trim()).to.equal('Get Results');

        // Check if the redo button is present and is hidden
        const redoButton = await driver.findElement(By.id('redoQuiz'));
        expect(redoButton).to.exist;
        const isRedoButtonHidden = await redoButton.isDisplayed();
        expect(isRedoButtonHidden).to.be.false;

        // Check that the results div is initially empty
        const resultsText = await resultsContainer.getText();
        expect(resultsText.trim()).to.equal('');
    })

    it('should check if quizId is present in the URL', async () => {
        // Get the current URL
        const currentUrl = await driver.getCurrentUrl();

        // Check if the URL contains the expected quizId parameter
        const expectedQuizId = quizId; // Replace with the expected quizId
        const isQuizIdInUrl = currentUrl.includes(`quizId=${expectedQuizId}`);

        // Assert that the quizId is present in the URL
        expect(isQuizIdInUrl).to.be.true;
    });

    it('should display all the options for the quiz', async () => {
        // Check if the display-qns div is present
        const displayQnsContainer = await driver.findElement(By.id('display-qns'));
        expect(displayQnsContainer).to.exist;

        // Fetch expected options and question titles from Firebase (replace with actual Firebase fetching logic)
        const expectedOptions = [
            ["ab", "a", "b"],
            ["a", "3a", "2a"],
        ];

        const expectedQuestionTitles = [
            "Result of a x b",
            "result of 2a + a",
        ];

        // Wait for the questions to be displayed on the page
        await driver.wait(until.elementLocated(By.className('question-container')), 5000);

        // Loop through each question and assert options and title
        for (let i = 0; i < expectedOptions.length; i++) {
            const questionContainer = await driver.findElement(By.xpath(`//div[@class='question-container'][${i + 1}]`));

            // Assert question title
            const actualQuestionTitle = await questionContainer.findElement(By.className('question')).getText();
            expect(actualQuestionTitle).to.equal(`Question ${i + 1}: ${expectedQuestionTitles[i]}`);

            // Assert options
            const optionLabels = await questionContainer.findElements(By.xpath('.//div[@class="options-container"]/label'));
            for (let j = 0; j < optionLabels.length; j++) {
                const actualOptionText = await optionLabels[j].getText();
                expect(actualOptionText).to.equal(`Option ${j + 1}: ${expectedOptions[i][j]}`);
            }
        }
    });

    it('should display an alert if the user tries to submit without selecting options', async () => {
        await driver.navigate().refresh();

        // Wait for the questions to be displayed
        await driver.wait(until.elementLocated(By.className('question-container')), 5000);

        // Locate the submit button and click it
        const submitButton = await driver.findElement(By.id('submitQuiz'));
        await submitButton.click();

        //Wait for the alert to be present
        await driver.wait(until.alertIsPresent(), 5000);

        //Switch to the alert
        const alert = await driver.switchTo().alert();

        //Get the text from the alert
        const alertText = await alert.getText();

        //Assert that the alert message contains the expected text
        expect(alertText).to.equal('Please attempt all questions before submitting.');

        //Dismiss the alert
        await alert.dismiss();
    });

    it('should display a confirmation alert if the user selects all options and clicks submit', async () => {

        // Wait for the questions to be displayed
        await driver.wait(until.elementLocated(By.className('question-container')), 5000);

        // Select all radio buttons
        const radioButtons = await driver.findElements(By.css('input[type="radio"]'));
        for (const radioButton of radioButtons) {
            await radioButton.click();
        }

        // Locate the submit button and click it
        const submitButton = await driver.findElement(By.id('submitQuiz'));
        await submitButton.click();

        //Wait for the alert to be present
        await driver.wait(until.alertIsPresent(), 5000);

        //Switch to the alert
        const alert = await driver.switchTo().alert();

        //Get the text from the alert
        const alertText = await alert.getText();

        //Assert that the alert message contains the expected text
        expect(alertText).to.equal('Are you sure you want to submit?');

        //Dismiss the alert
        await alert.dismiss();
    });

    it('Should show the result as 1/2 if the answer for a qn is wrong & reload the page', async function () {
        await driver.navigate().refresh();

        // Wait for the questions to be displayed
        await driver.wait(until.elementLocated(By.className('question-container')), 500);

        // Simulate user interactions to select answers
        await driver.executeScript(() => {
            // Select correct option for the 1st question
            document.querySelector('input[name="question0"][value="0"]').click();

            // Select incorrect option for the 2nd question
            document.querySelector('input[name="question1"][value="2"]').click();
        });

        // Locate the submit button and click it
        const submitButton = await driver.findElement(By.id('submitQuiz'));
        await submitButton.click();

        // Wait for the confirmation alert
        const alert = await driver.switchTo().alert();

        // Automatically click "Yes" (OK) on the confirmation alert
        await alert.accept();

        await driver.sleep(3000);

        // Wait for the results div to be displayed
        await driver.wait(until.elementLocated(By.id('results')), 5000);

        // Log the actual results text
        const resultsText = await driver.findElement(By.id('results')).getText();
        //console.log('Actual Results Text:', resultsText);

        // Assert that the result is displayed as "1/2"
        expect(resultsText).to.equal('Your score is: 1/2');

        // Assert that the submit button is changed to "Redo Quiz"
        const redoButton = await driver.findElement(By.id('redoQuiz'));
        expect(await redoButton.isDisplayed()).to.be.true;
        await redoButton.click();

        await driver.sleep(3000);


        // Wait for the page to be fully loaded after refreshing
        await driver.wait(until.elementLocated(By.id('submitQuiz')), 5000);

        // Wait for the page to be fully loaded after the second refresh
        await driver.wait(until.elementLocated(By.id('submitQuiz')), 5000);

        // Check if the display-qns div is present
        const displayQnsContainer = await driver.findElement(By.id('display-qns'));
        expect(displayQnsContainer).to.exist;

        // Check if the submit button is present
        expect(submitButton).to.exist;


        // Fetch expected options and question titles from Firebase (replace with actual Firebase fetching logic)
        const expectedOptions = [
            ["ab", "a", "b"],
            ["a", "3a", "2a"],
        ];

        const expectedQuestionTitles = [
            "Result of a x b",
            "result of 2a + a",
        ];

        // Wait for the questions to be displayed on the page
        await driver.wait(until.elementLocated(By.className('question-container')), 5000);

        // Loop through each question and assert options and title
        for (let i = 0; i < expectedOptions.length; i++) {
            const questionContainer = await driver.findElement(By.xpath(`//div[@class='question-container'][${i + 1}]`));

            // Assert question title
            const actualQuestionTitle = await questionContainer.findElement(By.className('question')).getText();
            expect(actualQuestionTitle).to.equal(`Question ${i + 1}: ${expectedQuestionTitles[i]}`);

            // Assert options
            const optionLabels = await questionContainer.findElements(By.xpath('.//div[@class="options-container"]/label'));
            for (let j = 0; j < optionLabels.length; j++) {
                const actualOptionText = await optionLabels[j].getText();
                expect(actualOptionText).to.equal(`Option ${j + 1}: ${expectedOptions[i][j]}`);
            }
        }
    });

    it('Should show the result as 2/2 if the answer for both qns are correct', async function () {
        await driver.navigate().refresh();

        // Wait for the questions to be displayed
        await driver.wait(until.elementLocated(By.className('question-container')), 500);

        // Simulate user interactions to select answers
        await driver.executeScript(() => {
            // Select correct option for the 1st question
            document.querySelector('input[name="question0"][value="0"]').click();

            // Select incorrect option for the 2nd question
            document.querySelector('input[name="question1"][value="1"]').click();
        });

        // Locate the submit button and click it
        const submitButton = await driver.findElement(By.id('submitQuiz'));
        await submitButton.click();

        // Wait for the confirmation alert
        const alert = await driver.switchTo().alert();

        // Automatically click "Yes" (OK) on the confirmation alert
        await alert.accept();

        await driver.sleep(3000);

        // Wait for the results div to be displayed
        await driver.wait(until.elementLocated(By.id('results')), 5000);

        // Log the actual results text
        const resultsText = await driver.findElement(By.id('results')).getText();
        //console.log('Actual Results Text:', resultsText);

        // Assert that the result is displayed as "1/2"
        expect(resultsText).to.equal('Your score is: 2/2');

        // Assert that the submit button is changed to "Redo Quiz"
        const redoButton = await driver.findElement(By.id('redoQuiz'));
        expect(await redoButton.isDisplayed()).to.be.true;

    });


    it('Should show the result as 1/2 if the answer for a qn is wrong & display the correct text colour', async function () {
        await driver.navigate().refresh();

        // Wait for the questions to be displayed
        await driver.wait(until.elementLocated(By.className('question-container')), 500);

        // Simulate user interactions to select answers
        await driver.executeScript(() => {
            // Select correct option for the 1st question
            document.querySelector('input[name="question0"][value="0"]').click();

            // Select incorrect option for the 2nd question
            document.querySelector('input[name="question1"][value="2"]').click();
        });

        // Locate the submit button and click it
        const submitButton = await driver.findElement(By.id('submitQuiz'));
        await submitButton.click();

        // Wait for the confirmation alert
        const alert = await driver.switchTo().alert();

        // Automatically click "Yes" (OK) on the confirmation alert
        await alert.accept();

        // Wait for the results div to be displayed
        await driver.wait(until.elementLocated(By.id('results')), 5000);

        // Add additional waiting time to ensure styles are applied
        await driver.sleep(2000);

        // Log the actual results text
        const resultsText = await driver.findElement(By.id('results')).getText();
        //console.log('Actual Results Text:', resultsText);

        // Assert that the result is displayed as "1/2"
        expect(resultsText).to.equal('Your score is: 1/2');

        // Assert that the submit button is changed to "Redo Quiz"
        const redoButton = await driver.findElement(By.id('redoQuiz'));
        expect(await redoButton.isDisplayed()).to.be.true;

        // Check the color of the options based on their correctness
        const question1Container = await driver.findElement(By.xpath('//div[@class="question-container"][1]'));
        const question1CorrectOption = await question1Container.findElement(By.xpath('.//input[@value="0"]'));

        const question2Container = await driver.findElement(By.xpath('//div[@class="question-container"][2]'));
        const question2CorrectOption = await question2Container.findElement(By.xpath('.//input[@value="1"]'));
        const question2IncorrectOption = await question2Container.findElement(By.xpath('.//input[@value="2"]'));

        // Check color for correct options
        const question1CorrectLabel = await question1CorrectOption.findElement(By.xpath('..'));
        const question1CorrectColor = await driver.executeScript('return getComputedStyle(arguments[0]).color', question1CorrectLabel);
        expect(question1CorrectColor).to.equal('rgb(0, 128, 0)'); // Green color

        const question2CorrectLabel = await question2CorrectOption.findElement(By.xpath('..'));
        const question2CorrectColor = await driver.executeScript('return getComputedStyle(arguments[0]).color', question2CorrectLabel);
        expect(question2CorrectColor).to.equal('rgb(0, 128, 0)'); // Green color

        // Check color for incorrect options
        const question2IncorrectLabel = await question2IncorrectOption.findElement(By.xpath('..'));
        const question2IncorrectColor = await driver.executeScript('return getComputedStyle(arguments[0]).color', question2IncorrectLabel);
        expect(question2IncorrectColor).to.equal('rgb(255, 0, 0)'); // Red color

    });

    it("Should redirect to courses.html when the back button is clicked", async function () {
        // Locate and click the back button
        const backButton = await driver.findElement(By.id('backArrow'));
        await backButton.click();

        // Wait for the redirection to complete (you may need to adjust the wait conditions)
        await driver.wait(until.urlContains("/courses.html"), 5000);

        // Get the current URL after redirection
        const currentUrl = await driver.getCurrentUrl();
        // Assert that the URL matches the expected URL after redirection
        expect(currentUrl).to.include("/courses.html");
    });


    afterEach(async function () {
        // Capture and save screenshot if the test fails
        const testStatus = this.currentTest.state;
        if (testStatus === 'failed') {
            const screenshot = await driver.takeScreenshot();
            const screenshotPath = path.join(__dirname, './screenshots', `test-failure-${counter++}.png`);
            await fs.writeFile(screenshotPath, screenshot, 'base64');
            console.log(`Screenshot saved: ${screenshotPath}`);
        }

        await driver.executeScript('return window.__coverage__;').then(async (coverageData) => {
            if (coverageData) {
                // Save coverage data to a file
                await fs.writeFile('coverage-frontend/coverageValidateQuizAnswers' + counter++ + '.json',
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

})

// validate quiz end 

// view all course student start
describe('Testing View Course in Chrome', function () {
    this.timeout(30000);
    var driver; // Declare a WebDriver variable

    before(async () => {
        // Initialize a Chrome WebDriver instance
        driver = await new Builder().forBrowser('chrome').build();
        await driver.get('http://localhost:' + server.address().port + '/instrumented/courses.html');
    });

    after(async () => {
        await driver.quit();
    })
    it('Should show the title', async () => {
        const title = await driver.getTitle();
        expect(title).to.equal("All Courses");
    });
    it('Should show the logout link', async () => {
        const logoutLink = await driver.findElement(By.id('logoutLink'));
        expect(await logoutLink.isDisplayed()).to.be.true;
    });
    it('Should show the Courses in grid view', async () => {
        const coursesGrid = await driver.findElement(By.id('coursesGrid'));

        // Wait until the coursesGrid is visible
        await driver.wait(until.elementIsVisible(coursesGrid), 5000);

        const topicBoxes = await coursesGrid.findElements(By.className('topic-box'));

        // Assert that at least one course is displayed
        expect(topicBoxes.length).to.be.greaterThan(0);
    });
    it('Should navigate to course details page when a course topic is clicked', async () => {
        // Find a course topic element
        const courseTopicElement = await driver.findElement(By.css('.topic-box'));

        // Get the current URL before clicking
        const initialUrl = await driver.getCurrentUrl();

        // Click on the course topic
        await courseTopicElement.click();

        // Add a sleep timer to wait for the navigation to complete (adjust the time as needed)
        await driver.sleep(3000);

        // Get the new URL after clicking
        const newUrl = await driver.getCurrentUrl();

        // Assert that the URL has changed, indicating successful navigation
        expect(newUrl).to.not.equal(initialUrl);

        // Extract course ID and topic from the new URL
        const urlParams = new URLSearchParams(newUrl.split('?')[1]);
        const courseId = urlParams.get('courseId');
        const topic = urlParams.get('topic');

        // Assert that the course ID and topic match the expected values
        expect(courseId).to.exist;
        expect(topic).to.exist;

        // Navigate back to the original page (courses.html)
        await driver.navigate().back();

        // Add a sleep timer to wait for the navigation back to complete (adjust the time as needed)
        await driver.sleep(3000);

        // Check if we are back on the original page
        const backToCoursesUrl = await driver.getCurrentUrl();
        expect(backToCoursesUrl).to.equal(initialUrl);
    });


    afterEach(async function () {
        await driver.executeScript('return window.__coverage__;').then(async (coverageData) => {
            if (coverageData) {
                // Save coverage data to a file
                await fs.writeFile('coverage-frontend/coverageCourseStudent' + counter++ + '.json',
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

// view all course student end

//view course details start

describe('Testing Course Details in Chrome', function () {
    this.timeout(30000);
    var driver; // Declare a WebDriver variable
    var counter = 0;

    before(async () => {
        // Initialize a Chrome WebDriver instance
        driver = await new Builder().forBrowser('chrome').build();
        await driver.get('http://localhost:' + server.address().port + '/instrumented/courseDetails.html?courseId=AIr2hTaloW4KHN6Dg1z2&topic=Division');
    });

    after(async () => {
        await driver.quit();
    })
    it('Should display course details', async () => {
        // Wait for course details to load
        await driver.sleep(3000);
        await driver.wait(until.elementLocated(By.id('courseDetails')));
    });
    it('Should display course details - topic', async () => {
        // Wait for course details to load
        await driver.wait(until.elementLocated(By.id('courseDetails')));
    
        // Verify the presence of the course topic
        const courseTopicElement = await driver.findElement(By.css('#courseDetails h2'));
        const courseTopicText = await courseTopicElement.getText();
        expect(courseTopicText).to.equal('Division');
    });
    it('Should have a start quiz button', async () => {
        // Wait for quiz button to load
        await driver.wait(until.elementLocated(By.id('start-quiz-button')), 2000);

        // Verify the presence of the start quiz button
        const startQuizButton = await driver.findElement(By.id('start-quiz-button'));
        expect(await startQuizButton.isDisplayed()).to.be.true;
    });

    afterEach(async function () {
        await driver.executeScript('return window.__coverage__;').then(async (coverageData) => {
            if (coverageData) {
                // Save coverage data to a file
                await fs.writeFile('coverage-frontend/coverageCourseDetails' + counter++ + '.json',
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

//view course details end

// view course admin chrome start

describe('Testing Add and View Course in Chrome', function () {
    this.timeout(30000);
    var driver; // Declare a WebDriver variable

    before(async () => {
        // Initialize a Chrome WebDriver instance
        driver = await new Builder().forBrowser('chrome').build();
        await driver.get('http://localhost:' + server.address().port + '/instrumented/addCourse.html');
    });

    after(async () => {
        await driver.quit();
    })
    it('Should show the title', async () => {
        const title = await driver.getTitle();
        expect(title).to.equal("All Courses");
    });
    it('Should show the logout link', async () => {
        const logoutLink = await driver.findElement(By.id('logoutLink'));
        expect(await logoutLink.isDisplayed()).to.be.true;
    });
    it('Should show the logo', async () => {
        const logo = await driver.findElement(By.id('logo'));
        expect(await logo.isDisplayed()).to.be.true;
    });
    it('Should show the website name', async () => {
        const BA = await driver.findElement(By.id('BA'));
        expect(await BA.isDisplayed()).to.be.true;
    });
    it('Should show the "Add Course" button', async () => {
        const addButton = await driver.findElement(By.xpath('//button[text()="Add Course"]'));
        const isDisplayed = await addButton.isDisplayed();

        expect(isDisplayed).to.be.true;
    });
    it('Should show the Courses in grid view', async () => {
        await driver.sleep(2000);
        const coursesGrid = await driver.findElement(By.id('coursesGrid1'));
        const topicBoxes = await coursesGrid.findElements(By.className('topic-box'));
        expect(topicBoxes.length).to.be.greaterThan(0);
    });
    it('Should open the "Add Course" modal when clicking the button', async () => {
        const addButton = await driver.findElement(By.xpath('//button[text()="Add Course"]'));
        await addButton.click();

        const modal = await driver.findElement(By.id('addCourseModal'));
        const isModalDisplayed = await modal.isDisplayed();
        expect(isModalDisplayed).to.be.true;

        // Check if individual fields are visible
        const topicInput = await driver.findElement(By.id('topic'));
        const descriptionInput = await driver.findElement(By.id('description'));
        const videoInput = await driver.findElement(By.id('video'));
        const categoryInput = await driver.findElement(By.id('category'));

        const isTopicVisible = await topicInput.isDisplayed();
        const isDescriptionVisible = await descriptionInput.isDisplayed();
        const isVideoVisible = await videoInput.isDisplayed();
        const isCategoryVisible = await categoryInput.isDisplayed();

        // Assert that all fields are visible
        expect(isTopicVisible).to.be.true;
        expect(isDescriptionVisible).to.be.true;
        expect(isVideoVisible).to.be.true;
        expect(isCategoryVisible).to.be.true;
    });
    it('Should add a course with valid inputs and handle success alert', async () => {
        // Fill in the form with valid inputs
        const topicInput = await driver.findElement(By.id('topic'));
        const descriptionInput = await driver.findElement(By.id('description'));
        const videoInput = await driver.findElement(By.id('video'));
        const categoryInput = await driver.findElement(By.id('category'));
        const addButton = await driver.findElement(By.id('addCourse'));

        await topicInput.sendKeys('Cold War');
        await descriptionInput.sendKeys('Cold war for sec 3');
        await videoInput.sendKeys('https://youtu.be/nTn9gVqRfKY?si=c0QLpMvbBcquwsZV');
        await categoryInput.sendKeys('History');

        // Click the "Add Course" button
        await addButton.click();


        await driver.sleep(2000);

        // Handle the alert
        const alert = await driver.switchTo().alert();
        const alertText = await alert.getText();
        await alert.accept();

        // Check if the alert text is as expected
        expect(alertText).to.equal('Course added successfully!');

        // Check if the course is added to the grid
        const coursesGrid = await driver.findElement(By.id('coursesGrid1'));
        const topicBoxes = await coursesGrid.findElements(By.className('topic-box'));

        // Assert that at least one course is displayed
        expect(topicBoxes.length).to.be.greaterThan(0);
    });
    it('Should show an error alert for empty fields', async () => {
        const addButton = await driver.findElement(By.xpath('//button[text()="Add Course"]'));
        await addButton.click();

        // Wait for the modal to appear (adjust the sleep duration based on your application behavior)
        await driver.sleep(2000);

        // Click the "Add Course" button without entering any data
        const addButtonInModal = await driver.findElement(By.id('addCourse'));
        await addButtonInModal.click();

        // Handle the alert
        const alert = await driver.switchTo().alert();
        const alertText = await alert.getText();
        await alert.accept();

        // Check if the alert text is as expected
        expect(alertText).to.equal('Please fill in all fields.');
    });
    it('Should show an error alert for an invalid video URL', async () => {
        // Fill in the form with an invalid video URL
        const topicInput = await driver.findElement(By.id('topic'));
        const descriptionInput = await driver.findElement(By.id('description'));
        const videoInput = await driver.findElement(By.id('video'));
        const categoryInput = await driver.findElement(By.id('category'));

        await topicInput.sendKeys('123');
        await descriptionInput.sendKeys('123');
        await videoInput.sendKeys('invalid_url');
        await categoryInput.sendKeys('History');


        // Click the "Add Course" button
        const addButton = await driver.findElement(By.id('addCourse'));
        await addButton.click();

        // Wait for the modal to disappear (adjust the sleep duration based on your application behavior)
        await driver.sleep(2000);

        // Handle the alert
        const alert = await driver.switchTo().alert();
        const alertText = await alert.getText();
        await alert.accept();

        // Check if the alert text is as expected
        expect(alertText).to.equal('Invalid URL. Please enter a valid URL for the video.');
    });
    it('Should show an error alert for exsiting topic', async () => {
        // Fill in the form with an invalid video URL
        const topicInput = await driver.findElement(By.id('topic'));
        const descriptionInput = await driver.findElement(By.id('description'));
        const videoInput = await driver.findElement(By.id('video'));
        const categoryInput = await driver.findElement(By.id('category'));

        await topicInput.sendKeys('Cold War');
        await descriptionInput.sendKeys('sec 3');
        await videoInput.sendKeys('https://youtu.be/nTn9gVqRfKY?si=c0QLpMvbBcquwsZV');
        await categoryInput.sendKeys('History');


        // Click the "Add Course" button
        const addButton = await driver.findElement(By.id('addCourse'));
        await addButton.click();

        // Wait for the modal to disappear (adjust the sleep duration based on your application behavior)
        await driver.sleep(2000);

        // Handle the alert
        const alert = await driver.switchTo().alert();
        const alertText = await alert.getText();
        await alert.accept();

        // Check if the alert text is as expected
        expect(alertText).to.equal('Topic already exists');
    });


    it('Should close the "Add Course" modal when clicking the close button', async () => {
        const closeButton = await driver.findElement(By.className('close'));
        await closeButton.click();

        const modal = await driver.findElement(By.id('addCourseModal'));
        const isDisplayed = await modal.isDisplayed();

        expect(isDisplayed).to.be.false;
    });
    it('Should show an error alert for exsiting description', async () => {
        const addingButton = await driver.findElement(By.xpath('//button[text()="Add Course"]'));
        await addingButton.click();

        // Wait for the modal to appear (adjust the sleep duration based on your application behavior)
        await driver.sleep(2000);
        // Fill in the form with an invalid video URL
        const topicInput = await driver.findElement(By.id('topic'));
        const descriptionInput = await driver.findElement(By.id('description'));
        const videoInput = await driver.findElement(By.id('video'));
        const categoryInput = await driver.findElement(By.id('category'));

        await topicInput.sendKeys('War');
        await descriptionInput.sendKeys('Cold war for sec 3');
        await videoInput.sendKeys('https://youtu.be/nTn9gVqRfKY?si=c0QLpMvbBcquwsZV');
        await categoryInput.sendKeys('History');


        // Click the "Add Course" button
        const addButton = await driver.findElement(By.id('addCourse'));
        await addButton.click();

        // Wait for the modal to disappear (adjust the sleep duration based on your application behavior)
        await driver.sleep(2000);

        // Handle the alert
        const alert = await driver.switchTo().alert();
        const alertText = await alert.getText();
        await alert.accept();

        // Check if the alert text is as expected
        expect(alertText).to.equal('Description already exists');
    });
    afterEach(async function () {
        await driver.executeScript('return window.__coverage__;').then(async (coverageData) => {
            if (coverageData) {
                // Save coverage data to a file
                await fs.writeFile('coverage-frontend/coverageCourseAdmin' + counter++ + '.json',
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

// view course admin chrome end


after(async function () {
    await server.close();
    process.exit(0);
});