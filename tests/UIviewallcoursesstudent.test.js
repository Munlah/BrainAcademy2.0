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

describe.only('Testing View Course in Chrome', function () {
    this.timeout(30000);
    var driver; // Declare a WebDriver variable
    var counter = 0;
    before(async () => {
        // Initialize a Chrome WebDriver instance
        driver = await new Builder().forBrowser('chrome').build();
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
    it('Should show the profile link', async () => {
        const profileLink = await driver.findElement(By.id('profileLink'));
        expect(await profileLink.isDisplayed()).to.be.true;
    });
    it('Should show the logo', async () => {
        const logo = await driver.findElement(By.id('logo'));
        expect(await logo.isDisplayed()).to.be.true;
    });
    it('Should show the website name', async () => {
        const BA = await driver.findElement(By.id('BA'));
        expect(await BA.isDisplayed()).to.be.true;
    });
    it('Should show the Courses in grid view', async () => {
        const coursesGrid = await driver.findElement(By.id('coursesGrid'));
        const topicBoxes = await coursesGrid.findElements(By.className('topic-box'));
        // Assert that at least one course is displayed
        expect(topicBoxes.length).to.be.greaterThan(0);
    });
    it('Should navigate to the course details page when clicking a course', async () => {
        const courseElements = await driver.findElements(By.className('topic-box'));
    
        // Check if there is at least one course element
        expect(courseElements.length).to.be.greaterThan(0);
    
        // Get the current URL before clicking on the course
        const initialUrl = await driver.getCurrentUrl();
    
        // Click the first course element
        await courseElements[0].click();
    
        // Wait for the page to load (adjust the sleep duration based on your application behavior)
        await driver.sleep(2000);
    
        // Get the current URL after clicking on the course
        const currentUrl = await driver.getCurrentUrl();
    
        // Check if the current URL is the expected course details page URL
        expect(currentUrl).to.not.equal(initialUrl);  // The URL should have changed
        expect(currentUrl).to.include('courseDetails.html');
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


  // it('Should navigate to the course details page when clicking a course', async () => {
    //     // Assuming the course elements have the class name 'topic-box'
    //     const courseElements = await driver.findElements(By.className('topic-box'));

    //     // Check if there is at least one course element
    //     expect(courseElements.length).to.be.greaterThan(0);

    //     // Click the first course element
    //     await courseElements[0].click();

    //     // Wait for the page to load (adjust the sleep duration based on your application behavior)
    //     await driver.sleep(2000);

    //     // Check if the current URL is the expected course details page URL
    //     const currentUrl = await driver.getCurrentUrl();
    //     expect(currentUrl).to.include('courseDetails.html');

    // });