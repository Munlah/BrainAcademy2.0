const { app } = require('../index');
const { Builder, By, until } = require('selenium-webdriver');
const { describe, it, after, before } = require('mocha');
const { expect } = require('chai');
const fs = require('fs').promises;
const path = require('path');  // Import the path module


courseId = 'eboZL9dwy2o9hu2TD4vi';
quizId = 'TWPgWQfjIFMcKYmIq10C';
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

describe("UI for validating quiz answers", function () {
  this.timeout(30000);
  var driver;
  var counter = 0;

  before(async () => {
    driver = await new Builder().forBrowser("chrome").build();
    await driver.get(
      "http://localhost:" +
      server.address().port +
      `/instrumented/validateQuiz.html?quizId=TWPgWQfjIFMcKYmIq10C`
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

    // Wait for the alert to be displayed
    await driver.switchTo().alert();
    const alertText = await driver.switchTo().alert().getText();

    // Assert that the alert message is as expected
    expect(alertText).to.equal('Please attempt all questions before submitting.');

    // Dismiss the alert
    await driver.switchTo().alert().dismiss();

    // Restore the original fetch function (resetting the browser's fetch function)
    await driver.executeScript(() => {
      delete window.fetch;
    });
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
