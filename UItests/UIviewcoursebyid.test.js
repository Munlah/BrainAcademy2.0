const { app } = require('../index');
const { Builder, By, Key, until } = require('selenium-webdriver');
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
describe('Testing Course Details in Chrome', function () {
    this.timeout(30000);
    var driver; // Declare a WebDriver variable
    var counter = 0;

    before(async () => {
        // Initialize a Chrome WebDriver instance
        driver = await new Builder().forBrowser('chrome').build();
        await driver.get('http://localhost:' + server.address().port + '/instrumented/courseDetails.html?courseId=2eOC6Pd7Tcx6OFqGKcPA&topic=Division');
    });

    after(async () => {
        await driver.quit();
    })
    it('Should display course details', async () => {
        // Wait for course details to load
        await driver.sleep(3000);
        await driver.wait(until.elementLocated(By.id('courseDetails')));
    });
    it('Should display course details - topic', async () => {
        // Wait for course details to load
        await driver.wait(until.elementLocated(By.id('courseDetails')));
    
        // Verify the presence of the course topic
        const courseTopicElement = await driver.findElement(By.css('#courseDetails h2'));
        const courseTopicText = await courseTopicElement.getText();
        expect(courseTopicText).to.equal('Division');
    });
    it('Should have a start quiz button', async () => {
        // Wait for quiz button to load
        await driver.wait(until.elementLocated(By.id('start-quiz-button')), 2000);

        // Verify the presence of the start quiz button
        const startQuizButton = await driver.findElement(By.id('start-quiz-button'));
        expect(await startQuizButton.isDisplayed()).to.be.true;
    });

    afterEach(async function () {
        await driver.executeScript('return window.__coverage__;').then(async (coverageData) => {
            if (coverageData) {
                // Save coverage data to a file
                await fs.writeFile('coverage-frontend/coverageCourseDetails' + counter++ + '.json',
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
});
