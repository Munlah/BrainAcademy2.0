const { app } = require("../index");
const { Builder, By, until } = require("selenium-webdriver");
const { describe, it } = require("mocha");
const { expect } = require("chai");
const fs = require("fs").promises;

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

describe("Testing Edit Quiz in Chrome", function () {
  this.timeout(30000); // Extend timeout if necessary
  let driver;
  let counter = 0;

  before(async () => {
    // Initialize a Chrome WebDriver instance
    driver = await new Builder().forBrowser("chrome").build();
    await driver.get(
      `http://localhost:${
        server.address().port
      }/instrumented/editQuiz.html?quizId=Aq03XY1Tny1txPRtsepe`
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

  it("Should update the quiz with new, valid data", async () => {
    // Update quiz title
    const quizTitleInput = await driver.findElement(By.id("quizTitle"));
    await driver.sleep(2000); 
    await quizTitleInput.clear();
    await driver.sleep(2000);
    await quizTitleInput.sendKeys("Updated Quiz Title");

    await driver.sleep(2000);

    await driver.executeScript(
      "const quizId = 'Aq03XY1Tny1txPRtsepe'; updateQuiz(quizId, gatherUpdatedQuizData());"
    );

    await driver.sleep(3000);

    // Wait for the success alert and verify its text
    await driver.wait(until.alertIsPresent(), 10000);

    const alert = await driver.switchTo().alert();
    const alertText = await alert.getText();
    expect(alertText).to.include("Quiz updated successfully");
    await driver.sleep(2000); 
    // Accept the alert
    await alert.accept();


    await driver.wait(until.urlContains("/viewAllQuizzes.html"), 10000);
    const currentUrl = await driver.getCurrentUrl();
    await driver.sleep(1000);
    expect(currentUrl).to.include("/viewAllQuizzes.html");

  });

  it("Should display an error message if the quiz is not found", async () => {
    await driver.get(
      "http://localhost:" +
        server.address().port +
        "/instrumented/editQuiz.html?quizId=123"
    );

    await driver.wait(until.alertIsPresent());
    let alert = await driver.switchTo().alert();
    expect(alert).to.not.be.null;

    let alertText = await alert.getText();

    await driver.sleep(1000);

    expect(alertText).to.equal("Quiz not found. Please check the quiz ID.");

    await driver.sleep(3000);

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