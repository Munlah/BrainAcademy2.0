const { app } = require("../index");
const { Builder, By, until } = require("selenium-webdriver");
const { describe, it, before, after, afterEach } = require("mocha");
const fs = require("fs").promises;

const chai = require("chai");
const chaiDom = require("chai-dom");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiDom);
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

  it("Should set password errors visible", async () => {
    // Call the function to set password errors visible
    await driver.executeScript("setPasswordErrorsVisible(true);");

    // Assert that the password errors are visible
    await expect(
      driver.findElement(By.id("passwordErrors")).getCssValue("display")
    ).to.eventually.equal("block");
  });

  it("Should display password errors", async () => {
    // Call the function to display password errors
    const errorString = "Error 1. Error 2. Error 3.";
    await driver.executeScript(`displayPasswordErrors("${errorString}");`);

    // Assert that the password errors are displayed
    const passwordErrors = await driver
      .findElement(By.id("passwordErrors"))
      .getText();
    expect(passwordErrors).to.include("Error 1");
    expect(passwordErrors).to.include("Error 2");
    expect(passwordErrors).to.include("Error 3");
  });

  // Using Chai-as-Promised for assertion, which allows to handle promises more elegantly using .eventually
  // The expectation is that the text of the password errors element should eventually include the specified message
  it("Should show password error if the password is too short", async () => {
    await driver.findElement(By.id("username")).sendKeys("registeruser");
    await driver.findElement(By.id("email")).sendKeys("registeruser@gmail.com");
    await driver.findElement(By.id("password")).sendKeys("Short1!");
    await driver.findElement(By.id("fullName")).sendKeys("Register User");
    await driver.findElement(By.id("contactNumber")).sendKeys("12345678");
    const submitButton = await driver.findElement(
      By.css("button[type='submit']")
    );
    await submitButton.click();

    // Using chai-as-promised for better handling of promises
    await expect(
      driver.findElement(By.id("passwordErrors")).getText()
    ).to.eventually.include("Password must be at least 8 characters long");
  });

  // Using standard Chai assertion style
  // The expectation is that the text of the password errors element should include the specified message directly
  // it("Should show an error if the password is too short", async () => {
  //   await driver.findElement(By.id("username")).sendKeys("registeruser");
  //   await driver.findElement(By.id("email")).sendKeys("registeruser@gmail.com");
  //   await driver.findElement(By.id("password")).sendKeys("Short1!");
  //   await driver.findElement(By.id("fullName")).sendKeys("Register User");
  //   await driver.findElement(By.id("contactNumber")).sendKeys("12345678");

  //   const submitButton = await driver.findElement(
  //     By.css("button[type='submit']")
  //   );
  //   await submitButton.click();

  // Standard Chai assertion without Chai-as-Promised
  //   const passwordErrors = await driver
  //     .findElement(By.id("passwordErrors"))
  //     .getText();
  //   expect(passwordErrors).to.include(
  //     "Password must be at least 8 characters long"
  //   );
  // });

  it("Should show an error if the password does not contain an uppercase letter", async () => {
    await driver.findElement(By.id("username")).sendKeys("registeruser");
    await driver.findElement(By.id("email")).sendKeys("registeruser@gmail.com");
    await driver.findElement(By.id("password")).sendKeys("password1!"); // Password without uppercase letter
    await driver.findElement(By.id("fullName")).sendKeys("Test User");
    await driver.findElement(By.id("contactNumber")).sendKeys("12345678");
    const submitButton = await driver.findElement(
      By.css("button[type='submit']")
    );
    await submitButton.click();

    // Using chai-as-promised for better handling of promises
    await expect(
      driver.findElement(By.id("passwordErrors")).getText()
    ).to.eventually.include(
      "Password must contain at least one uppercase letter"
    );
  });

  it("Should show an error if the password does not contain a lowercase letter", async () => {
    await driver.findElement(By.id("username")).sendKeys("registeruser");
    await driver.findElement(By.id("email")).sendKeys("registeruser@gmail.com");
    await driver.findElement(By.id("password")).sendKeys("PASSWORD1!"); // Password without lowercase letter
    await driver.findElement(By.id("fullName")).sendKeys("Test User");
    await driver.findElement(By.id("contactNumber")).sendKeys("12345678");
    const submitButton = await driver.findElement(
      By.css("button[type='submit']")
    );
    await submitButton.click();

    // Using chai-as-promised for better handling of promises
    await expect(
      driver.findElement(By.id("passwordErrors")).getText()
    ).to.eventually.include(
      "Password must contain at least one lowercase letter"
    );
  });

  it("Should show an error if the password does not contain a number", async () => {
    await driver.findElement(By.id("username")).sendKeys("registeruser");
    await driver.findElement(By.id("email")).sendKeys("registeruser@gmail.com");
    await driver
      .findElement(By.id("password"))
      .sendKeys("PasswordWithoutNumber!"); // Password without a number
    await driver.findElement(By.id("fullName")).sendKeys("Test User");
    await driver.findElement(By.id("contactNumber")).sendKeys("12345678");
    const submitButton = await driver.findElement(
      By.css("button[type='submit']")
    );
    await submitButton.click();

    // Using chai-as-promised for better handling of promises
    await expect(
      driver.findElement(By.id("passwordErrors")).getText()
    ).to.eventually.include("Password must contain at least one number");
  });

  it("Should show an error if the password does not contain a special character", async () => {
    await driver.findElement(By.id("username")).sendKeys("registeruser");
    await driver.findElement(By.id("email")).sendKeys("registeruser@gmail.com");
    await driver.findElement(By.id("password")).sendKeys("Password1"); // Password without a special character
    await driver.findElement(By.id("fullName")).sendKeys("Test User");
    await driver.findElement(By.id("contactNumber")).sendKeys("12345678");
    const submitButton = await driver.findElement(
      By.css("button[type='submit']")
    );
    await submitButton.click();

    // Using chai-as-promised for better handling of promises
    await expect(
      driver.findElement(By.id("passwordErrors")).getText()
    ).to.eventually.include(
      "Password must contain at least one special character"
    );
  });

  it("Should show an error if the password contains more than two identical characters in a row", async () => {
    await driver.findElement(By.id("username")).sendKeys("registeruser");
    await driver.findElement(By.id("email")).sendKeys("registeruser@gmail.com");
    await driver.findElement(By.id("password")).sendKeys("Passssword1!"); // Password with more than two identical characters
    await driver.findElement(By.id("fullName")).sendKeys("Test User");
    await driver.findElement(By.id("contactNumber")).sendKeys("12345678");
    const submitButton = await driver.findElement(
      By.css("button[type='submit']")
    );
    await submitButton.click();

    // Using chai-as-promised for better handling of promises
    await expect(
      driver.findElement(By.id("passwordErrors")).getText()
    ).to.eventually.include(
      "Password must not contain more than two identical characters in a row"
    );
  });

  it("Should show an error if the password contains the username or part of the email address", async () => {
    await driver.findElement(By.id("username")).sendKeys("registeruser");
    await driver.findElement(By.id("email")).sendKeys("registeruser@gmail.com");
    await driver.findElement(By.id("password")).sendKeys("registerUser1!"); // Password contains username
    await driver.findElement(By.id("fullName")).sendKeys("Test User");
    await driver.findElement(By.id("contactNumber")).sendKeys("12345678");
    const submitButton = await driver.findElement(
      By.css("button[type='submit']")
    );
    await submitButton.click();

    // Using chai-as-promised for better handling of promises
    await expect(
      driver.findElement(By.id("passwordErrors")).getText()
    ).to.eventually.include("Password must not contain the username");
    await expect(
      driver.findElement(By.id("passwordErrors")).getText()
    ).to.eventually.include(
      "Password must not contain part of the email address"
    );
  });

  it("Should successfully register with a valid password and redirect to login page", async () => {
    // Get the current URL before registering
    const initialUrl = await driver.getCurrentUrl();

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

    // Wait a bit to allow any JavaScript-based navigation to initiate
    await driver.sleep(3000); // Wait for navigation to complete
    // Capture the new URL after the expected navigation
    const newUrl = await driver.getCurrentUrl();

    // Assert that the URL has changed, indicating successful navigation
    expect(newUrl).to.not.equal(initialUrl);
    expect(newUrl).to.include("index.html"); // Confirm the specific navigation target

    // Navigate back and verify the initial page
    await driver.navigate().back();
    await driver.sleep(3000); // Wait for navigation back to complete
    const backUrl = await driver.getCurrentUrl();
    expect(backUrl).to.equal(initialUrl); // Back on the initial page
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
