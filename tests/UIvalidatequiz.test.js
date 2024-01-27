const { app } = require('../index');
const { Builder, By, until } = require('selenium-webdriver');
const { describe, it, after, before, afterEach } = require('mocha');
const { expect } = require('chai');
const fs = require('fs').promises;
const path = require('path');



courseId = 'eboZL9dwy2o9hu2TD4vi';
quizId = 'iz6sqlotv82qxkxMXPof';
//quiz for algebra 

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
});

describe.only("UI for validating quiz answers", function () {
  this.timeout(30000);
  var driver;
  var counter = 0;

  before(async () => {
    driver = await new Builder().forBrowser("chrome").build();
    await driver.get(
      "http://localhost:" +
      server.address().port +
      `/instrumented/validateQuiz.html?quizId=iz6sqlotv82qxkxMXPof`
    );
  });

  after(async () => {
    await driver.quit();
  });

  it("Should show the title", async () => {
    const title = await driver.getTitle();
    expect(title).to.equal("Main Quiz");
  });


  it('should display all the options for the quiz', async () => {
    // Check if the display-qns div is present
    const displayQnsContainer = await driver.findElement(By.id('display-qns'));
    expect(displayQnsContainer).to.exist;

    // Check if the results div is present
    const resultsContainer = await driver.findElement(By.id('results'));
    expect(resultsContainer).to.exist;

    // Check if the submit button is present
    const submitButton = await driver.findElement(By.id('submitQuiz'));
    expect(submitButton).to.exist;

    // Check if the redo button is present
    const redoButton = await driver.findElement(By.id('redoQuiz'));
    expect(redoButton).to.exist;

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
    // Execute JavaScript to override the fetch function and return questions
    await driver.executeScript(() => {
      window.fetch = async () => ({
        json: async () => ({
          questions: [
            {
              questionTitle: 'Sample Question',
              options: ['Option 1', 'Option 2', 'Option 3'],
              correctOption: 0,
            },
          ],
        }),
      });
    });

    // Reload the page to trigger the fetch request
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

  it('should display confirmation alert and automatically click "Yes"', async () => {
    // Reload the page to trigger the fetch request
    await driver.navigate().refresh();

    // Wait for the questions to be displayed
    await driver.wait(until.elementLocated(By.className('question-container')), 5000);

    // Simulate user interactions to select answers
    await driver.executeScript(() => {
      document.querySelector('input[name="question0"][value="0"]').click(); // Select correct option for the 1st question
      document.querySelector('input[name="question1"][value="2"]').click(); // Select incorrect option for the 2nd question
    });

    // Locate the submit button and click it
    const submitButton = await driver.findElement(By.id('submitQuiz'));
    await submitButton.click();

    // Wait for the confirmation alert
    const alert = await driver.switchTo().alert();

    // Automatically click "Yes" (OK) on the confirmation alert
    await alert.accept();

  });

  it('Should show the result as 1/2 if the answer for a qn is wrong', async function () {
    // Wait for the questions to be displayed
    await driver.wait(until.elementLocated(By.className('question-container')), 5000);

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
    console.log('Actual Results Text:', resultsText);

    // Assert that the result is displayed as "1/2"
    expect(resultsText).to.equal('Your score is: 1/2');

    // Assert that the submit button is changed to "Redo Quiz"
    const redoButton = await driver.findElement(By.id('redoQuiz'));
    expect(await redoButton.isDisplayed()).to.be.true;
  });


  /*

  it.only('should refresh the page when "Redo Quiz" button is clicked', async () => {
    // Simulate user interactions to select answers
    await driver.executeScript(() => {
      document.querySelector('input[name="question0"][value="0"]').click();
      document.querySelector('input[name="question1"][value="2"]').click();
    });

    // Locate the submit button before clicking it
    const submitButton = await driver.findElement(By.id('submitQuiz'));

    // Click the submit button
    await submitButton.click();

    // Wait for the confirmation alert
    const alert = await driver.switchTo().alert();
    await alert.accept();

    // Wait for the results div to be displayed
    await driver.wait(until.elementLocated(By.id('results')), 5000);

    // Assert that the result is displayed as "1/2"
    let resultsText = await driver.findElement(By.id('results')).getText();
    expect(resultsText).to.equal('Your score is: 1/2');

    // Locate the "Redo Quiz" button
    const redoButton = await driver.findElement(By.id('redoQuiz'));

    // Click the "Redo Quiz" button
    await redoButton.click();

    await driver.wait(until.urlContains('/validateQuiz.html?quizId=FLQK8dRiEvUDcAKDu1cA'), 20000);

    const currentUrl = await driver.getCurrentUrl();

    expect(currentUrl).to.include('/validateQuiz.html?quizId=FLQK8dRiEvUDcAKDu1cA');


    // Wait for the page to be fully loaded after refreshing
    await driver.wait(until.elementLocated(By.id('submitQuiz')), 5000);

    // Re-locate the submit button on the refreshed page
    const submitButtonRefreshed = await driver.findElement(By.id('submitQuiz'));

    // Assert that the "Get Results" button is shown
    const isSubmitButtonDisplayed = await submitButtonRefreshed.isDisplayed();
    expect(isSubmitButtonDisplayed).to.be.true;


    // Assert that there is no result displayed on the refreshed page
    const resultsContainerRefreshed = await driver.findElement(By.id('results'));
    const resultsRefreshedText = await resultsContainerRefreshed.getText();
    expect(resultsRefreshedText).to.equal('');
  });

  */



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
