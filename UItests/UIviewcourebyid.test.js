// const { app } = require('../index');
// const { Builder, By, until } = require('selenium-webdriver');
// const { describe, it } = require('mocha');
// const { expect } = require('chai');
// const fs = require('fs').promises;

// var server;
// var driver;
// var counter = 0;

// before(async function () {
//     server = await new Promise((resolve) => {
//         server = app.listen(0, "localhost", () => {
//             resolve(server);
//         });
//     });

//     driver = await new Builder().forBrowser('chrome').build();
// });

// after(async function () {
//     await server.close();
//     await driver.quit();
// });

// describe('Testing View Course in Chrome', function () {
//     this.timeout(30000);

//     before(async () => {
//         await driver.get('http://localhost:' + server.address().port + '/instrumented/courseDetails.html?courseId=2eOC6Pd7Tcx6OFqGKcPA&topic=Division');
//     });

//     it('Should display course details - topic', async () => {
//         const h2 = await driver.geth2();
//         expect(h2).to.equal("Division");
//     });

//     it('Should show the "quizz" button', async () => {
//         const quizzButton = await driver.findElement(By.id('start-quiz-button'));
//         const isDisplayed = await quizzButton.isDisplayed();

//         expect(isDisplayed).to.be.true;
//     });

//     // it('Should redirect to quiz when "Start Quiz" button is pressed', async function () {
//     //     // Wait for the start-quiz-button to be visible
//     //     await driver.wait(until.elementLocated(By.id('tart-quiz-button')), 5000);

//     //     // Find the start-quiz-button by id
//     //     const startQuizButton = await driver.findElement(By.id('redirectQuiz'));

//     //     // Click the start-quiz-button
//     //     await startQuizButton.click();

//     //     // Wait for the redirection to complete
//     //     await driver.wait(until.urlContains('/validateQuiz.html'), 10000);

//     //     // Assert that the URL is redirected to the expected URL
//     //     const currentUrl = await driver.getCurrentUrl();
//     //     expect(currentUrl).to.include('/validateQuiz.html');
//     // });

//     afterEach(async function () {
//         await driver.executeScript('return window.__coverage__;').then(async (coverageData) => {
//             if (coverageData) {
//                 // Save coverage data to a file
//                 await fs.writeFile('coverage-frontend/coverageCourseDetailsStudent' + counter++ + '.json',
//                     JSON.stringify(coverageData), (err) => {
//                         if (err) {
//                             console.error('Error writing coverage data:', err);
//                         } else {
//                             console.log('Coverage data written to coverage.json');
//                         }
//                     });
//             }
//         });
//     });
// });
// const { app } = require('../index');
// const { Builder, By, until } = require('selenium-webdriver');
// const { describe, it, after, before } = require('mocha');
// const { expect } = require('chai');
// const fs = require('fs').promises;

// //redirect to the quiz qn ui page from the course
// courseId = '2eOC6Pd7Tcx6OFqGKcPA';
// quizId = 'bNeESFLUHc3Abh9qLZ5u';


// var server;
// before(async function () {
//   server = await new Promise((resolve) => {
//     server = app.listen(0, "localhost", () => {
//       resolve(server);
//     });
//   });
// });

// after(async function () {
//   await server.close();
//   process.exit(0);
// });


// describe('Redirect to quiz', function () {
//   this.timeout(30000);
//   let driver;
//   var counter = 0;

//   before(async () => {
//     driver = await new Builder().forBrowser('chrome').build();
//     await driver.get('http://localhost:' + server.address().port + '/instrumented/courseDetails.html?courseId=2eOC6Pd7Tcx6OFqGKcPA&topic=Division');
//   });

//   after(async () => {
//     await driver.quit();
//   });

//   afterEach(async function () {
//     await driver.executeScript('return window.__coverage__;').then(async (coverageData) => {
//       if (coverageData) {
//         // Save coverage data to a file
//         await fs.writeFile('coverage-frontend/coverageValidateUserAnswer' + counter++ + '.json',
//           JSON.stringify(coverageData), (err) => {
//             if (err) {
//               console.error('Error writing coverage data:', err);
//             } else {
//               console.log('Coverage data written to coverage.json');
//             }
//           });
//       }
//     });
//   });

//   it('redirect to quiz when start quiz button is pressed', async function () {
//     //Wait for the start-quiz-button to be visible
//     await driver.wait(until.elementLocated(By.id('redirectQuiz')), 5000);

//     //Find the start-quiz-button by id
//     const startQuizButton = await driver.findElement(By.id('redirectQuiz'));

//     //Click the start-quiz-button
//     await startQuizButton.click();

//     //Wait for the redirection to complete
//     await driver.wait(until.urlContains('/validateQuiz.html?quizId=bNeESFLUHc3Abh9qLZ5u'), 10000);


//     //Assert that the URL is redirected to the expected URL
//     const currentUrl = await driver.getCurrentUrl();

//     expect(currentUrl).to.include('/validateQuiz.html?quizId=bNeESFLUHc3Abh9qLZ5u');
//   })

// })