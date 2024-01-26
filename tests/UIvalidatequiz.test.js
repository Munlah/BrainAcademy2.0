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

describe.only("UI for validating quiz answers", function () {
  this.timeout(30000);
  var driver;
  var counter = 0;

  before(async () => {
    driver = await new Builder().forBrowser("chrome").build();
    await driver.get(
      "http://localhost:" +
      server.address().port +
      "/instrumented/validateQuiz.html?quizId=TWPgWQfjIFMcKYmIq10C"
    );
  });

  after(async () => {
    await driver.quit();
  });

  it("Should show the title", async () => {
    const title = await driver.getTitle();
    expect(title).to.equal("Quiz qns");
  });

  it('should display all the options for the quiz', async () => {

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
