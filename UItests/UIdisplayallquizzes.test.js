const { app } = require("../index");
const { Builder, By, until } = require("selenium-webdriver");
const { describe, it, after, before } = require("mocha");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const fs = require("fs").promises;

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

after(async function () {
  await server.close();
  process.exit(0);
});

describe("Testing View All Quizzes Admin Page", function () {
  this.timeout(30000);
  var counter = 0;
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser("chrome").build();
    await driver.get(
      "http://localhost:" +
        server.address().port +
        "/instrumented/viewAllQuizzes.html"
    );
  });

  after(async () => {
    await driver.quit();
  });

  afterEach(async function () {
    await driver
      .executeScript("return window.__coverage__;")
      .then(async (coverageData) => {
        if (coverageData) {
          // Save coverage data to a file
          await fs.writeFile(
            "coverage-frontend/coverageDisplayAllQuizzes" + counter++ + ".json",
            JSON.stringify(coverageData),
            (err) => {
              if (err) {
                console.error("Error writing coverage data:", err);
              } else {
                console.log("Coverage data written to coverage.json");
              }
            }
          );
        }
      });
  });

  it("Should have the correct title", async () => {
    const title = await driver.getTitle();
    expect(title).to.equal("View All Quizzes Admin");
  });

  it("Should have a logout link", async () => {
    const logoutLink = await driver.findElement(By.id("logoutLink"));
    expect(await logoutLink.isDisplayed()).to.be.true;
  });

  it("Should have an Add Quiz button", async () => {
    const addQuizButton = await driver.findElement(By.id("redirectAddQuiz"));
    expect(await addQuizButton.isDisplayed()).to.be.true;
  });

  it("Should display quizzes after fetching", async () => {
    await driver.sleep(1000);
    await driver.wait(until.elementLocated(By.css(".quiz")), 5000);
    await driver.sleep(1000);
    const quizzes = await driver.findElements(By.css(".quiz"));
    await driver.sleep(1000);
    expect(quizzes.length).to.be.greaterThan(0);
  });

  it("Should open a modal when a delete button is clicked", async () => {
    await driver.sleep(1000);
    const deleteButton = await driver.findElement(By.css(".delete-button"));
    await driver.sleep(1000);
    await deleteButton.click();
    await driver.sleep(1000);
    const modal = await driver.findElement(By.id("myModal"));
    await driver.sleep(1000);
    expect(await modal.isDisplayed()).to.be.true;
  });

  it("Should close the modal when the No button is clicked", async () => {
    await driver.sleep(1000);
    const modal = await driver.findElement(By.id("myModal"));
    await driver.sleep(1000);
    expect(await modal.isDisplayed()).to.be.true;
    await driver.sleep(1000);
    const noButton = await driver.findElement(By.id("cancel-delete"));
    await noButton.click();
    await driver.sleep(1000);
    await driver.wait(until.elementIsNotVisible(modal), 10000);
    expect(await modal.isDisplayed()).to.be.false;
  });

  it("should display quizzes for a course", async function () {
    await driver.executeScript('fetchAndDisplayQuizzesByCourse("Division")');
    await driver.sleep(1000);
    await driver.wait(until.elementLocated(By.css(".quiz")), 5000);
    await driver.sleep(1000);
    const quizzes = await driver.findElements(By.css(".quiz"));
    await driver.sleep(1000);
    expect(quizzes.length).to.be.greaterThan(0);
  });

  it("should fetch and display quizzes when course button is clicked", async function () {
    await driver.sleep(1000);
    const courseButtons = await driver.findElements(By.css(".course-button"));
    await driver.sleep(1000);
    const coursetoSelect = courseButtons[3];
    await coursetoSelect.click();
    await driver.sleep(1000);
    await driver.wait(until.elementLocated(By.css(".quiz")), 5000);
    await driver.sleep(1000);
    const quizzes = await driver.findElements(By.css(".quiz"));
    await driver.sleep(1000);
    expect(quizzes.length).to.be.greaterThan(0);
  });

  it("should not display any quizzes for a course with no quizzes", async function () {
    await driver.sleep(1000);
    const courseButtons = await driver.findElements(By.css(".course-button"));
    await driver.sleep(1000);
    const coursetoSelect = courseButtons[2];
    await driver.sleep(1000);
    await coursetoSelect.click();
    await driver.sleep(1000);
    const quizzes = await driver.findElements(By.css(".quiz"));
    await driver.sleep(1000);
    expect(quizzes.length).to.equal(0);
  });

  it('should display "No quizzes found for this course" message when there are no quizzes for a course', async function () {
    await driver.sleep(1000);
    const courseButtons = await driver.findElements(By.css(".course-button"));
    await driver.sleep(1000);
    const coursetoSelect = courseButtons[2];
    await driver.sleep(1000);
    await coursetoSelect.click();
    await driver.sleep(1000);
    const noQuizzesMessage = await driver.findElement(
      By.css(".no-quizzes-message")
    );
    await driver.sleep(1000);
    expect(await noQuizzesMessage.getText()).to.equal(
      "No quizzes found for this course"
    );
  });

  it("should fetch and display quizzes for a course", async function () {
    await driver.sleep(1000);
    await driver.executeScript('fetchAndDisplayQuizzesByCourse("Division")');
    await driver.sleep(1000);
    await driver.wait(until.elementLocated(By.css(".quiz")), 5000);
    const quizzesContainer = await driver.findElement(
      By.id("display-all-quizzes")
    );
    await driver.sleep(1000);
    const quizzes = await quizzesContainer.findElements(By.css(".quiz"));
    await driver.sleep(1000);
    expect(quizzes.length).to.be.greaterThan(0);
  });

  it("should delete a quiz when the delete button is clicked and the deletion is confirmed", async function () {
    await driver.sleep(1000);

    await driver.executeScript('fetchAndDisplayQuizzesByCourse("Calculus")');

    await driver.sleep(1000);

    const deleteButtons = await driver.findElements(By.css(".delete-button"));
    const deleteButtonToClick = deleteButtons[0];
    await deleteButtonToClick.click();

    const confirmDeleteButton = await driver.findElement(
      By.id("confirm-delete")
    );
    await confirmDeleteButton.click();

    await driver.sleep(1000);

    const quizzesAfterDeletion = await driver.findElements(By.css(".quiz"));
    expect(quizzesAfterDeletion.length).to.equal(deleteButtons.length - 1);
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

  it("Add Quiz button should redirect to addQuiz.html", async () => {
    await driver.sleep(1000);
    const modal = await driver.findElement(By.id("myModal"));
    await driver.wait(until.elementIsNotVisible(modal), 10000);

    const addQuizButton = await driver.findElement(By.id("redirectAddQuiz"));
    await addQuizButton.click();
    await driver.sleep(1000);
    await driver.wait(until.urlContains("/addQuiz.html"), 10000);

    const currentUrl = await driver.getCurrentUrl();

    await driver.sleep(1000);

    expect(currentUrl).to.include("/addQuiz.html");
  });
});
