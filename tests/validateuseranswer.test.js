const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const { validateUserAnswers } = require('../utils/QuizzesUtil');

// Update adminMockInternalError to include correct data
const adminMockInternalError = {
  firestore: () => ({
    collection: () => ({
      doc: () => ({
        get: sinon.stub().resolves({
          exists: true,
          data: () => ({
            quizId: 'eD34Q9fHHRds7BTKHPBK',
            quizTitle: 'Your Quiz Title',
            quizCourse: 'Your Quiz Course',
            questions: [
              {
                correctOption: 2,
                options: ["Option A", "Option B", "Option C", "Option D"],
                questionTitle: "Question 1"
              },
              {
                correctOption: 1,
                options: ["Option X", "Option Y", "Option Z"],
                questionTitle: "Question 2"
              },
            ]
          }),
        }),
      }),
    }),
  }),
};

// Use the updated adminMockInternalError in the test case
const { validateUserAnswers: validateUserAnswersInternalError } = proxyquire('../utils/QuizzesUtil', { '../firebaseAdmin.js': { admin: adminMockInternalError } });

describe('Testing validateUserAnswers utility function', () => {
  it('should return correct answer message for correct options', async () => {
    const quizId = 'eD34Q9fHHRds7BTKHPBK';
    const userAnswers = [2, 1]; // Assuming Option C for Question 1 and Option Y for Question 2 are correct

    try {
      const result = await validateUserAnswersInternalError(quizId, userAnswers);

      expect(result.totalQuestions).to.equal(2);
      expect(result.correctAnswers).to.equal(2);
      expect(result.results).to.deep.equal([
        {
          questionTitle: 'Question 1',
          userAnswer: 2,  // Assuming Option C (2) is correct for Question 1
          correctOption: 'Option C',
          isCorrect: true,
        },
        {
          questionTitle: 'Question 2',
          userAnswer: 1,  // Assuming Option Y (1) is correct for Question 2
          correctOption: 'Option Y',
          isCorrect: true,
        },
      ]);
    } catch (error) {
      // Handle error if necessary
      console.error(error);
    }
  });


  it('should handle invalid number of answers error', async () => {
    const quizId = 'eD34Q9fHHRds7BTKHPBK';
    const userAnswers = [1]; // Provide only one answer for a quiz with two questions

    try {
      await validateUserAnswersInternalError(quizId, userAnswers);
    } catch (error) {
      expect(error.message).to.equal('Invalid number of answers.');
    }
  });


  it('should handle internal server error', async () => {
    const adminMockInternalError = {
      firestore: () => ({
        collection: () => ({
          doc: () => ({
            get: sinon.stub().throws(new Error('Internal Server Error')),
          }),
        }),
      }),
    };

    const { validateUserAnswers: validateUserAnswersInternalError } = proxyquire('../utils/QuizzesUtil', { '../firebaseAdmin.js': { admin: adminMockInternalError } });

    const quizId = 'eD34Q9fHHRds7BTKHPBK';
    const userAnswers = [2, 1];

    try {
      await validateUserAnswersInternalError(quizId, userAnswers);
      // If the function does not throw an error, fail the test
      expect.fail('Expected function to throw an error.');
    } catch (error) {
      expect(error.message).to.equal('Internal Server Error');
    }
  });
});
