const { app } = require("../index");
const { Builder, By, until } = require("selenium-webdriver");
const { describe, it, before, after, afterEach } = require("mocha");
const { expect } = require("chai");
const fs = require("fs").promises;

var server;
const quizId = "Qb86EsWEg5O8zR7CjeAD"; // Define the quiz ID as a constant

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
  this.timeout(30000);
  let driver;
  let counter = 0;

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

  // it("Should display an error message on fetch failure", async () => {
  //   // Navigate to the page that performs the fetch operation
  //   await driver.get(
  //     `http://localhost:${
  //       server.address().port
  //     }/instrumented/editQuiz.html?quizId=${quizId}`
  //   );

  //   // Override the fetch function to simulate a failure
  //   await driver.executeScript(() => {
  //     window.fetch = () => Promise.reject(new Error("Simulated fetch failure"));
  //   });

  //   // Trigger the fetch call by reloading the page
  //   await driver.navigate().refresh();
  //   await driver.sleep(1000);

  //   // Wait for the alert to be present
  //   await driver.wait(until.alertIsPresent());
  //   let alert = await driver.switchTo().alert();
  //   expect(alert).to.not.be.null;

  //   let alertText = await alert.getText();
  //   expect(alertText).to.equal("Error fetching quiz data. Please try again.");
  //   await driver.sleep(2000);

  //   // Accept the alert to close it
  //   await alert.accept();
  // });

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
