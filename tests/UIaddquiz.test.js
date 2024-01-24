const { app } = require('../index');
const { Builder, By, Key, until } = require('selenium-webdriver');
const { describe, it, before, after } = require('mocha');
const { expect } = require('chai');
const fetch = require('node-fetch');
const sinon = require('sinon');

const chrome = require('selenium-webdriver/chrome');
const chromeOptions = new chrome.Options();
// chromeOptions.addArguments('--headless');

let driver;
let quizId; // Declare global variable for quizId

// let driver = new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();

// let driver;

// before(async () => {
//   driver = await new Builder().forBrowser('chrome').build();
//   await driver.get('http://127.0.0.1:5500/public/addQuiz.html');
// });

describe('Add Quiz UI', function () {

  this.timeout(30000);

  // let driver;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.get('http://127.0.0.1:5500/public/addQuiz.html');
  });


  after(async function () {
    await driver.quit();
    // await server.close();
    // process.exit(0);
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

  /*
    it('should redirect to view all quizzes page after successfully adding', async function () {
      // Find quiz title field
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
  
      // Get the quiz ID from the response data
      const fetchResponse = await fetch('http://localhost:5050/create-new-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizBody),
      });
  
      // Check if the response is successful (status code 200)
      if (fetchResponse.ok) {
        // Get the quiz ID from the response data
        const responseData = await fetchResponse.json();
        quizId = responseData.quizId; // Store the quizId globally
        console.log(quizId)
  
        // Make a request to delete the quiz
        await fetch(`http://localhost:5050/delete-quiz/${quizId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        // Introduce a delay (adjust the time as needed)
        await driver.sleep(2000);
  
        // Check that the URL is redirected to view all quizzes page
        // expect(await driver.getCurrentUrl()).to.equal('http://127.0.0.1:5500/public/viewAllQuizzes.html');
      } else {
        console.error('Error creating quiz. Please try again.');
      }
    });
  
  */
 
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




after(async function () {
  // await driver.quit();
  // await server.close();
  process.exit(0);
});