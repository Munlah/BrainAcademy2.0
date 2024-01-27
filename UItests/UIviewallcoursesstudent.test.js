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
    it('Should show the Courses in grid view', async () => {
        await driver.sleep(2000);
        const coursesGrid = await driver.findElement(By.id('coursesGrid'));
        const topicBoxes = await coursesGrid.findElements(By.className('topic-box'));
        // Assert that at least one course is displayed
        expect(topicBoxes.length).to.be.greaterThan(0);
    });
   
     it('Should store courseId and topic in local storage and navigate to courseDetails.html', async () => {
        // Navigate to course details page
        await driver.executeScript(`navigateToCourseDetails('2eOC6Pd7Tcx6OFqGKcPA', 'Division')`);
        await driver.sleep(2000);

        // Get the current URL and stored values from local storage
        //const currentUrl = await driver.getCurrentUrl();
        const currentUrl = await driver.getCurrentUrl();
        const courseId = await driver.executeScript('return localStorage.getItem("courseId");');
        const topic = await driver.executeScript('return localStorage.getItem("topic");');

        // Log the information for debugging
        console.log('Current URL:', currentUrl);
        console.log('Stored courseId:', courseId);
        console.log('Stored topic:', topic);

        // Assert the stored values
        expect(courseId).to.equal('2eOC6Pd7Tcx6OFqGKcPA');
        expect(topic).to.equal('Division');

        // Assert the current URL
        await driver.wait(until.urlContains('/coursesDetails.html'), 10000);
        //console.log('Expected URL:', expectedUrl);
        expect(currentUrl).to.include('/coursesDetails.html');
        await driver.sleep(1000);
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

    // it('Should store courseId and topic in local storage and navigate to courseDetails.html', async () => {
    //     // Navigate to course details page
    //     await driver.executeScript(`navigateToCourseDetails('2eOC6Pd7Tcx6OFqGKcPA', 'Division')`);
    //     await driver.sleep(2000);

    //     // Get the current URL and stored values from local storage
    //     //const currentUrl = await driver.getCurrentUrl();
    //     const currentUrl = await driver.getCurrentUrl();
    //     const courseId = await driver.executeScript('return localStorage.getItem("courseId");');
    //     const topic = await driver.executeScript('return localStorage.getItem("topic");');

    //     // Log the information for debugging
    //     console.log('Current URL:', currentUrl);
    //     console.log('Stored courseId:', courseId);
    //     console.log('Stored topic:', topic);

    //     // Assert the stored values
    //     expect(courseId).to.equal('2eOC6Pd7Tcx6OFqGKcPA');
    //     expect(topic).to.equal('Division');

    //     // Assert the current URL
    //     await driver.wait(until.urlContains('/coursesDetails.html'), 10000);
    //     //console.log('Expected URL:', expectedUrl);
    //     expect(currentUrl).to.include('/coursesDetails.html');

    //     // Wait for the course details to load
    //     const courseDetailsElement = await driver.wait(until.elementLocated(By.id('courseDetails')), 10000);
    //     const textContent = await courseDetailsElement.getText();

    //     // Log the text content for debugging
    //     console.log('Course Details Text Content:', textContent);

    //     // Assert that the course details are displayed
    //     expect(textContent).to.include('Division'); 
    //     expect(textContent).to.include('Category'); 
    //     expect(textContent).to.include('Description'); 

    //     // Clean up - remove values from local storage
    //     await driver.executeScript('localStorage.removeItem("courseId");');
    //     await driver.executeScript('localStorage.removeItem("topic");');
    // });
    // it('Should click on the first course, store courseId and topic in local storage', async () => {
    //     // Wait for the courses to load
    //     await driver.wait(until.elementLocated(By.className('topic-box')), 5000);

    //     // Find the first course element
    //     const firstCourse = await driver.findElement(By.className('topic-box'));

    //     // Click on the first course
    //     await firstCourse.click();

    //     // Wait for the local storage values to be set
    //     await driver.wait(async () => {
    //         const courseId = await driver.executeScript('return localStorage.getItem("courseId");');
    //         const topic = await driver.executeScript('return localStorage.getItem("topic");');
    //         return courseId === '2eOC6Pd7Tcx6OFqGKcPA' && topic === 'Division';
    //     }, 5000);

    //     // Assert that local storage values are set
    //     const courseId = await driver.executeScript('return localStorage.getItem("courseId");');
    //     const topic = await driver.executeScript('return localStorage.getItem("topic");');

    //     expect(courseId).to.equal('2eOC6Pd7Tcx6OFqGKcPA');
    //     expect(topic).to.equal('Division');
    // });
    
    
    
