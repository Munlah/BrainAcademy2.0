const { app } = require('../index');
const { Builder, By, Key, until } = require('selenium-webdriver');
const { describe, it, before, after } = require('mocha');
const { expect } = require('chai');
const fetch = require('node-fetch');
const sinon = require('sinon');
const fs = require('fs').promises;
const path = require('path');  // Import the path module


const chrome = require('selenium-webdriver/chrome');
const chromeOptions = new chrome.Options();
// chromeOptions.addArguments('--headless');

let driver;
let quizId; // Declare global variable for quizId
var counter = 0;


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



describe.only('Add Quiz UI', function () {

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
        // Save coverage data to a file
        await fs.writeFile('coverage-frontend/coverageAddQiz' + counter++ + '.json',
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

