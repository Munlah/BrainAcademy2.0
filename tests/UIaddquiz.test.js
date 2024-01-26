const { app } = require('../index');
const { Builder, By, Key, until } = require('selenium-webdriver');
const { describe, it, before, after } = require('mocha');
const { expect } = require('chai');
const fetch = require('node-fetch');
const sinon = require('sinon');
const fs = require('fs').promises;

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
    // Find quiz title field
    const quizTitleElement = await driver.findElement(By.id('quizTitle'));
    await quizTitleElement.click();
    await quizTitleElement.sendKeys('Maths');

    const quizCourseElement = await driver.findElement(By.id('quizCourse'));
    await quizCourseElement.click();
    await quizCourseElement.sendKeys('Test Course');

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


  it('should redirect to view all quizzes page after successfully adding', async function () {
    // qn 1
    const quizTitleElement = await driver.findElement(By.id('quizTitle'));
    await quizTitleElement.click();
    await quizTitleElement.sendKeys('successfull mock quiz added');

    const quizCourseElement = await driver.findElement(By.id('quizCourse'));
    await quizCourseElement.click();
    await quizCourseElement.sendKeys('Test Course mockhhh');

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

    await driver.wait(until.alertIsPresent(), 5000);
    const alert = await driver.switchTo().alert();
    const alertText = await alert.getText();
    expect(alertText).to.equal('Quiz created successfully.');

    await alert.dismiss();

    // Check that the URL is redirected to view all quizzes page
    expect(await driver.getCurrentUrl()).to.contain('/viewAllQuizzes.html');

  });



  // it('should show error alert if there is internal server error', async function () {
  //   // Stub the fetch function to simulate an internal server error
  //   const fetchStub = sinon.stub(global, 'fetch');
  //   fetchStub.rejects(new Error('Internal Server Error'));

  //   // Trigger form submission
  //   const submitButton = await driver.findElement(By.xpath('//button[text()="Submit"]'));
  //   await submitButton.click();

  //   // Wait for the alert to be present
  //   await driver.wait(until.alertIsPresent(), 5000);

  //   // Switch to the alert
  //   const alert = await driver.switchTo().alert();

  //   // Get the text from the alert
  //   const alertText = await alert.getText();

  //   // Assert that the alert message contains the expected text
  //   expect(alertText).to.equal('Error creating quiz. Please try again.');

  //   // Dismiss the alert
  //   await alert.dismiss();

  //   // Restore the original fetch function
  //   fetchStub.restore();
  // });


});




//after(async function () {
// await driver.quit();
// await server.close();
//process.exit(0);
//});