const { app } = require('../index');
const { Builder, By, Key, until } = require('selenium-webdriver');
const { describe, it } = require('mocha');
const { expect } = require('chai');
const fs = require('fs').promises;
const sinon = require('sinon');
const edge = require('selenium-webdriver/edge');

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

describe('Testing View Course in Microsoft', function () {
    this.timeout(30000);
    var driver; // Declare a WebDriver variable
    var counter = 0;

    before(async () => {
        // Initialize a Microsoft WebDriver instance
        driver = new Builder().forBrowser('MicrosoftEdge').setEdgeOptions(new edge.Options()).build();
        await driver.get('http://localhost:' + server.address().port + '/instrumented/courses.html');
    });

    after(async () => {
        await driver.quit();
    })
    it('Should show the title', async () => {
        const title = await driver.getTitle();
        expect(title).to.equal("All Courses");
    });
    it('Should show the logout link', async () => {
        const logoutLink = await driver.findElement(By.id('logoutLink'));
        expect(await logoutLink.isDisplayed()).to.be.true;
    });
    it('Should show the Courses in grid view', async () => {
        const coursesGrid = await driver.findElement(By.id('coursesGrid'));

        // Wait until the coursesGrid is visible
        await driver.wait(until.elementIsVisible(coursesGrid), 5000);

        const topicBoxes = await coursesGrid.findElements(By.className('topic-box'));

        // Assert that at least one course is displayed
        expect(topicBoxes.length).to.be.greaterThan(0);
        await driver.sleep(5000);

    });
    it('Should navigate to course details page when a course topic is clicked', async () => {
        // Find a course topic element
        const courseTopicElement = await driver.findElement(By.css('.topic-box'));

        // Get the current URL before clicking
        const initialUrl = await driver.getCurrentUrl();

        // Click on the course topic
        await courseTopicElement.click();

        // Add a sleep timer to wait for the navigation to complete (adjust the time as needed)
        await driver.sleep(9000);

        // Get the new URL after clicking
        const newUrl = await driver.getCurrentUrl();

        // Assert that the URL has changed, indicating successful navigation
        expect(newUrl).to.not.equal(initialUrl);

        // Extract course ID and topic from the new URL
        const urlParams = new URLSearchParams(newUrl.split('?')[1]);
        const courseId = urlParams.get('courseId');
        const topic = urlParams.get('topic');

        // Assert that the course ID and topic match the expected values
        expect(courseId).to.exist;
        expect(topic).to.exist;

        // Navigate back to the original page (courses.html)
        await driver.navigate().back();

        // Add a sleep timer to wait for the navigation back to complete (adjust the time as needed)
        await driver.sleep(5000);

        // Check if we are back on the original page
        const backToCoursesUrl = await driver.getCurrentUrl();
        expect(backToCoursesUrl).to.equal(initialUrl);
    });


    afterEach(async function () {
        await driver.executeScript('return window.__coverage__;').then(async (coverageData) => {
            if (coverageData) {
                // Save coverage data to a file
                await fs.writeFile('coverage-frontend/coverageCourseStudent' + counter++ + '.json',
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
