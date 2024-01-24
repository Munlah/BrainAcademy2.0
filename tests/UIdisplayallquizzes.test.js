const { Builder, By, until } = require('selenium-webdriver');
const { describe, it, after, before } = require('mocha');
const { expect } = require('chai');
const fs = require('fs').promises;

describe('Testing View All Quizzes Admin Page', function () {
    this.timeout(30000);
    var counter = 0;
    let driver;

    before(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.get('http://127.0.0.1:5500/public/instrumented/viewAllQuizzes.html');
    });

    after(async () => {
        await driver.quit();
    });

    it('Should have the correct title', async () => {
        const title = await driver.getTitle();
        expect(title).to.equal('View All Quizzes Admin');
    });

    it('Should have a logout link', async () => {
        const logoutLink = await driver.findElement(By.id('logoutLink'));
        expect(await logoutLink.isDisplayed()).to.be.true;
    });

    it('Should have an Add Quiz button', async () => {
        const addQuizButton = await driver.findElement(By.id('redirectAddQuiz'));
        expect(await addQuizButton.isDisplayed()).to.be.true;
    });

    it('Should display quizzes after fetching', async () => {
        await driver.wait(until.elementLocated(By.css('.quiz')), 5000);
        const quizzes = await driver.findElements(By.css('.quiz'));
        expect(quizzes.length).to.be.greaterThan(0);
    });

    it('Should open a modal when a delete button is clicked', async () => {
        const deleteButton = await driver.findElement(By.css('.delete-button'));
        await deleteButton.click();

        const modal = await driver.findElement(By.id('myModal'));
        expect(await modal.isDisplayed()).to.be.true;
    });

    it('Should close the modal when the No button is clicked', async () => {

        const modal = await driver.findElement(By.id('myModal'));
        expect(await modal.isDisplayed()).to.be.true;

        const noButton = await driver.findElement(By.id('cancel-delete'));
        await noButton.click();

        await driver.wait(until.elementIsNotVisible(modal), 10000); // Increase wait time
        expect(await modal.isDisplayed()).to.be.false;
    });

    it('Add Quiz button should redirect to addQuiz.html', async () => {
        const modal = await driver.findElement(By.id('myModal'));
        await driver.wait(until.elementIsNotVisible(modal), 10000); // Increase wait time

        const addQuizButton = await driver.findElement(By.id('redirectAddQuiz'));
        await addQuizButton.click();

        expect(await driver.getCurrentUrl()).to.equal('http://127.0.0.1:5500/public/addQuiz.html');
    });

    afterEach(async function () {
        await driver.executeScript('return window.__coverage__;').then(async (coverageData) => {
            if (coverageData) {
                // Save coverage data to a file
                await fs.writeFile('coverage-frontend/coverage' + counter++ + '.json',
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