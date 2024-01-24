const { Builder, By, Key, until } = require('selenium-webdriver');
const { describe, it } = require('mocha');
const { expect } = require('chai');

describe('Testing View Course', function () {
    this.timeout(30000);
    var driver; // Declare a WebDriver variable
    before(async () => {
        // Initialize a Chrome WebDriver instance
        driver = await new Builder().forBrowser('chrome').build();
        await driver.get('http://localhost:5500/public/addCourse.html');
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
        const logo = await driver.findElement(By.id('BA'));
        expect(await logo.isDisplayed()).to.be.true;
    });
    it('Should show the Courses in grid view', async () => {
        const coursesGrid = await driver.findElement(By.id('coursesGrid'));
        const topicBoxes = await coursesGrid.findElements(By.className('topic-box'));
        // Assert that at least one course is displayed
        expect(topicBoxes.length).to.be.greaterThan(0);
    });
    it('Should show the "Add Course" button', async () => {
        const addButton = await driver.findElement(By.xpath('//button[text()="Add Course"]'));
        const isDisplayed = await addButton.isDisplayed();

        expect(isDisplayed).to.be.true;
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

    it('Should close the "Add Course" modal when clicking the close button', async () => {
        const closeButton = await driver.findElement(By.className('close'));
        await closeButton.click();

        const modal = await driver.findElement(By.id('addCourseModal'));
        const isDisplayed = await modal.isDisplayed();

        expect(isDisplayed).to.be.false;
    });
});
