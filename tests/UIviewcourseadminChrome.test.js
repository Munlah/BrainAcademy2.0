const { app } = require('../index');
const { Builder, By, Key, until } = require('selenium-webdriver');
const { describe, it } = require('mocha');
const { expect } = require('chai');
const fs = require('fs').promises;

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

describe('Testing Add and View Course in Chrome', function () {
    this.timeout(30000);
    var driver; // Declare a WebDriver variable
    var counter = 0;
    before(async () => {
        // Initialize a Chrome WebDriver instance
        driver = await new Builder().forBrowser('chrome').build();
        await driver.get('http://localhost:' + server.address().port + '/instrumented/addCourse.html');
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
    it('Should show the logo', async () => {
        const logo = await driver.findElement(By.id('logo'));
        expect(await logo.isDisplayed()).to.be.true;
    });
    it('Should show the website name', async () => {
        const BA = await driver.findElement(By.id('BA'));
        expect(await BA.isDisplayed()).to.be.true;
    });
    it('Should show the "Add Course" button', async () => {
        const addButton = await driver.findElement(By.xpath('//button[text()="Add Course"]'));
        const isDisplayed = await addButton.isDisplayed();

        expect(isDisplayed).to.be.true;
    });
    it('Should show the Courses in grid view', async () => {
        const coursesGrid = await driver.findElement(By.id('coursesGrid1'));
        const topicBoxes = await coursesGrid.findElements(By.className('topic-box'));
        // Assert that at least one course is displayed
        expect(topicBoxes.length).to.be.greaterThan(0);
    });


    it('Should open the "Add Course" modal when clicking the button', async () => {
        const addButton = await driver.findElement(By.xpath('//button[text()="Add Course"]'));
        await addButton.click();

        const modal = await driver.findElement(By.id('addCourseModal'));
        const isModalDisplayed = await modal.isDisplayed();
        expect(isModalDisplayed).to.be.true;

        // Check if individual fields are visible
        const topicInput = await driver.findElement(By.id('topic'));
        const descriptionInput = await driver.findElement(By.id('description'));
        const videoInput = await driver.findElement(By.id('video'));
        const categoryInput = await driver.findElement(By.id('category'));

        const isTopicVisible = await topicInput.isDisplayed();
        const isDescriptionVisible = await descriptionInput.isDisplayed();
        const isVideoVisible = await videoInput.isDisplayed();
        const isCategoryVisible = await categoryInput.isDisplayed();

        // Assert that all fields are visible
        expect(isTopicVisible).to.be.true;
        expect(isDescriptionVisible).to.be.true;
        expect(isVideoVisible).to.be.true;
        expect(isCategoryVisible).to.be.true;
    });
    it('Should add a course with valid inputs and handle success alert', async () => {
        // Fill in the form with valid inputs
        const topicInput = await driver.findElement(By.id('topic'));
        const descriptionInput = await driver.findElement(By.id('description'));
        const videoInput = await driver.findElement(By.id('video'));
        const categoryInput = await driver.findElement(By.id('category'));
        const addButton = await driver.findElement(By.id('addCourse'));

        await topicInput.sendKeys('Cold War');
        await descriptionInput.sendKeys('Cold war for sec 3');
        await videoInput.sendKeys('https://youtu.be/nTn9gVqRfKY?si=c0QLpMvbBcquwsZV');
        await categoryInput.sendKeys('History');

        // Click the "Add Course" button
        await addButton.click();


        await driver.sleep(2000);

        // Handle the alert
        const alert = await driver.switchTo().alert();
        const alertText = await alert.getText();
        await alert.accept();

        // Check if the alert text is as expected
        expect(alertText).to.equal('Course added successfully!');

        // Check if the course is added to the grid
        const coursesGrid = await driver.findElement(By.id('coursesGrid1'));
        const topicBoxes = await coursesGrid.findElements(By.className('topic-box'));

        // Assert that at least one course is displayed
        expect(topicBoxes.length).to.be.greaterThan(0);
    });
    it('Should show an error alert for empty fields', async () => {
        const addButton = await driver.findElement(By.xpath('//button[text()="Add Course"]'));
        await addButton.click();

        // Wait for the modal to appear (adjust the sleep duration based on your application behavior)
        await driver.sleep(2000);

        // Click the "Add Course" button without entering any data
        const addButtonInModal = await driver.findElement(By.id('addCourse'));
        await addButtonInModal.click();

        // Handle the alert
        const alert = await driver.switchTo().alert();
        const alertText = await alert.getText();
        await alert.accept();

        // Check if the alert text is as expected
        expect(alertText).to.equal('Please fill in all fields.');
    });
    it('Should show an error alert for an invalid video URL', async () => {
        // Fill in the form with an invalid video URL
        const topicInput = await driver.findElement(By.id('topic'));
        const descriptionInput = await driver.findElement(By.id('description'));
        const videoInput = await driver.findElement(By.id('video'));
        const categoryInput = await driver.findElement(By.id('category'));

        await topicInput.sendKeys('123');
        await descriptionInput.sendKeys('123');
        await videoInput.sendKeys('invalid_url');
        await categoryInput.sendKeys('History');


        // Click the "Add Course" button
        const addButton = await driver.findElement(By.id('addCourse'));
        await addButton.click();

        // Wait for the modal to disappear (adjust the sleep duration based on your application behavior)
        await driver.sleep(2000);

        // Handle the alert
        const alert = await driver.switchTo().alert();
        const alertText = await alert.getText();
        await alert.accept();

        // Check if the alert text is as expected
        expect(alertText).to.equal('Invalid URL. Please enter a valid URL for the video.');
    });
    it('Should show an error alert for exsiting topic', async () => {
        // Fill in the form with an invalid video URL
        const topicInput = await driver.findElement(By.id('topic'));
        const descriptionInput = await driver.findElement(By.id('description'));
        const videoInput = await driver.findElement(By.id('video'));
        const categoryInput = await driver.findElement(By.id('category'));

        await topicInput.sendKeys('Cold War');
        await descriptionInput.sendKeys('sec 3');
        await videoInput.sendKeys('https://youtu.be/nTn9gVqRfKY?si=c0QLpMvbBcquwsZV');
        await categoryInput.sendKeys('History');


        // Click the "Add Course" button
        const addButton = await driver.findElement(By.id('addCourse'));
        await addButton.click();

        // Wait for the modal to disappear (adjust the sleep duration based on your application behavior)
        await driver.sleep(2000);

        // Handle the alert
        const alert = await driver.switchTo().alert();
        const alertText = await alert.getText();
        await alert.accept();

        // Check if the alert text is as expected
        expect(alertText).to.equal('Topic already exists');
    });

   
    it('Should close the "Add Course" modal when clicking the close button', async () => {
        const closeButton = await driver.findElement(By.className('close'));
        await closeButton.click();

        const modal = await driver.findElement(By.id('addCourseModal'));
        const isDisplayed = await modal.isDisplayed();

        expect(isDisplayed).to.be.false;
    });
    afterEach(async function () {
        await driver.executeScript('return window.__coverage__;').then(async (coverageData) => {
            if (coverageData) {
                // Save coverage data to a file
                await fs.writeFile('coverage-frontend/coverageCourseAdmin' + counter++ + '.json',
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
 // it('Should show an error alert for exsiting description', async () => {
    //     // Fill in the form with an invalid video URL
    //     const topicInput = await driver.findElement(By.id('topic'));
    //     const descriptionInput = await driver.findElement(By.id('description'));
    //     const videoInput = await driver.findElement(By.id('video'));
    //     const categoryInput = await driver.findElement(By.id('category'));

    //     await topicInput.sendKeys('War');
    //     await descriptionInput.sendKeys('Cold war for sec 3');
    //     await videoInput.sendKeys('https://youtu.be/nTn9gVqRfKY?si=c0QLpMvbBcquwsZV');
    //     await categoryInput.sendKeys('History');


    //     // Click the "Add Course" button
    //     const addButton = await driver.findElement(By.id('addCourse'));
    //     await addButton.click();

    //     // Wait for the modal to disappear (adjust the sleep duration based on your application behavior)
    //     await driver.sleep(2000);

    //     // Handle the alert
    //     const alert = await driver.switchTo().alert();
    //     const alertText = await alert.getText();
    //     await alert.accept();

    //     // Check if the alert text is as expected
    //     expect(alertText).to.equal('Description already exists');
    // });