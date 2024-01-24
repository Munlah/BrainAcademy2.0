const { app } = require('../index');
const { Builder, By, Key, until } = require('selenium-webdriver');
const { describe, it } = require('mocha');
const { expect } = require('chai');

const chrome = require('selenium-webdriver/chrome');
const chromeOptions = new chrome.Options();
chromeOptions.addArguments('--headless');
const driver = new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();

var server;
before(async function () {
  server = await new Promise((resolve) => {
    server = app.listen(0, 'localhost', () => {
      resolve(server);
    });
  })
});

describe.only('Add Quiz UI', function () {
  it('should have the correct title', async function () {
    const baseUrl = 'http://127.0.0.1:5500/public/addQuiz.html';

    await driver.get(baseUrl);
    const title = await driver.getTitle();
    expect(title).to.equal('Add Quiz Admin')
  })
})


after(async function () {
  await driver.quit();
  await server.close();
  process.exit(0);
});