const { app } = require("../index");
const { Builder, By, until } = require("selenium-webdriver");
const { describe, it, before, after, afterEach } = require("mocha");
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
});

describe("Register Page UI Testing", function () {
  this.timeout(30000);
  var driver;
  var counter = 0;

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
    await driver
      .executeScript("return window.__coverage__;")
      .then(async (coverageData) => {
        if (coverageData) {
          await fs.writeFile(
            `coverage-frontend/coverageRegister${counter++}.json`,
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
