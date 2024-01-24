const { Builder, By, until } = require('selenium-webdriver');
const { describe, it, after, before } = require('mocha');
const { expect } = require('chai');

//redirect to the quiz qn ui page from the course
courseId = '2eOC6Pd7Tcx6OFqGKcPA';
quizId = 'LK22AI2UANYHoDamMZAG';


describe.only('Redirect to quiz', function () {
  this.timeout(30000);
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.get('http://127.0.0.1:5500/public/courseDetails.html?courseId=2eOC6Pd7Tcx6OFqGKcPA&topic=Division');
  });

  after(async () => {
    // await driver.quit();
  });

  it('redirect to quiz when start quiz button is pressed', async function () {
    //Wait for the start-quiz-button to be visible
    await driver.wait(until.elementLocated(By.id('redirectQuiz')), 5000);

    //Find the start-quiz-button by id
    const startQuizButton = await driver.findElement(By.id('redirectQuiz'));

    //Click the start-quiz-button
    await startQuizButton.click();

    //Wait for the redirection to complete
    await driver.wait(until.urlIs('http://127.0.0.1:5500/public/validateQuiz.html?quizId=LK22AI2UANYHoDamMZAG'), 5000);

    //Assert that the URL is redirected to the expected URL
    expect(await driver.getCurrentUrl()).to.equal('http://127.0.0.1:5500/public/validateQuiz.html?quizId=LK22AI2UANYHoDamMZAG');
  })

})