const { app } = require('../index');
const { Builder, By, Key, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const { describe, it } = require('mocha');
const { expect } = require('chai');
const fs = require('fs').promises;
const sinon = require('sinon');

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

describe('Delete User UI Testing FireFox', function () {
    this.timeout(50000);
    let driver;
    var counter = 0;

    before(async function () {
        driver = await new Builder().forBrowser('firefox').setFirefoxOptions(new firefox.Options()).build();
    });

    beforeEach(async () => {
        await driver.get('http://localhost:' + server.address().port + '/instrumented/courses.html');
        localStorageMock = {
            getItem: sinon.stub(),
            setItem: sinon.stub(),
            clear: sinon.stub()
        };
        global.window = { localStorage: localStorageMock };
    })
    it('should login and delete user', async () => {

        // Assuming the deleteButton is part of the courses.html page
        const deleteButton = await driver.findElement(By.id('deleteButton'));
        await deleteButton.click();
        await driver.sleep(2000);

        const confirmationPrompt = await driver.switchTo().alert();
        expect(confirmationPrompt).to.exist;

        await confirmationPrompt.accept();
    });
    afterEach(async function () {
        await driver.executeScript('return window.__coverage__;').then(async (coverageData) => {
            if (coverageData) {
                await fs.writeFile('coverage-frontend/coverageDeletuser' + counter++ + '.json',
                    JSON.stringify(coverageData), async (err) => {
                        if (err) {
                            console.error('Error writing coverage data:', err);
                        } else {
                            console.log('Coverage data written to coverage.json');

                            const backendCoverageData = await fs.readFile('coverage/coverage-final.json', 'utf8');

                            const mergedCoverage = JSON.parse(backendCoverageData);

                            mergedCoverage.push(coverageData);

                            await fs.writeFile('coverage/coverage-final.json', JSON.stringify(mergedCoverage), (err) => {
                                if (err) {
                                    console.error('Error writing merged coverage data:', err);
                                } else {
                                    console.log('Merged coverage data written to coverage-final.json');
                                }
                            });
                        }
                    });
            }
        });

        sinon.restore();
    });

    after(async () => {
        await driver.quit();
    });
});