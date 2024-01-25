const { app } = require("../index");
const { Builder, By, Key, until } = require("selenium-webdriver");
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

describe("Register Page UI Testing ", function () {
  this.timeout(30000);
  var driver; // Declare a WebDriver variable
  var counter = 0;
  before(async () => {
    // Initialize a Chrome WebDriver instance
    driver = await new Builder().forBrowser("chrome").build();
    await driver.get(
      "http://localhost:" +
        server.address().port +
        "/instrumented/register.html"
    );
  });

  after(async () => {
    await driver.quit();
  });
  it("Should show the title", async () => {
    const title = await driver.getTitle();
    expect(title).to.equal("Register");
  });

  afterEach(async function () {
    await driver
      .executeScript("return window.__coverage__;")
      .then(async (coverageData) => {
        if (coverageData) {
          // Save coverage data to a file
          await fs.writeFile(
            "coverage-frontend/coverageRegister" + counter++ + ".json",
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
});
