const { describe, it } = require('mocha');
const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

// Mocking the entire firebaseAdmin module
const adminMock = {
  firestore: () => ({
    collection: () => ({
      doc: () => ({
        get: sinon.stub().resolves({
          exists: true,
          data: () => ({
            quizId: 'Test Quiz Id',
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

const { viewQuestionsPerQuiz } = proxyquire('../utils/QuizzesUtil', { '../firebaseAdmin.js': { admin: adminMock } });

describe.only('Testing Display All Questions by QuizId Function', () => {
  it('should return questions by quizId', async () => {
    const req = { params: { quizId: 'Test Quiz Id' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

    await viewQuestionsPerQuiz(req, res);

    // Expectations
    expect(res.status.calledOnceWith(200)).to.be.true;
    expect(res.json.calledOnce).to.be.true;

    const response = res.json.getCall(0).args[0];
    expect(Array.isArray(response.questions)).to.be.true;

    const expectedQuestions = [
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
    ];

    expect(response.questions).to.deep.equal(expectedQuestions);
  });

  it('should return 404 if no quizzes are found', async () => {
    // Mocking the entire firebaseAdmin module to simulate a non-existing quiz
    const adminMockNoQuiz = {
      firestore: () => ({
        collection: () => ({
          doc: () => ({
            get: sinon.stub().resolves({ exists: false }),
          }),
        }),
      }),
    };

    const { viewQuestionsPerQuiz: viewQuestionsPerQuizNoQuiz } = proxyquire('../utils/QuizzesUtil', { '../firebaseAdmin.js': { admin: adminMockNoQuiz } });

    const req = { params: { quizId: 'Nonexistent Quiz Id' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

    await viewQuestionsPerQuizNoQuiz(req, res);

    // Expectations
    expect(res.status.calledOnceWith(404)).to.be.true;
    expect(res.json.calledOnceWith({ message: 'Quiz not found' })).to.be.true;
  });

  it('should return 500 for internal server error', async () => {
    // Mocking the entire firebaseAdmin module to simulate an internal server error
    const adminMockInternalError = {
      firestore: () => ({
        collection: () => ({
          doc: () => ({
            get: sinon.stub().throws(new Error('Internal Server Error')),
          }),
        }),
      }),
    };

    const { viewQuestionsPerQuiz: viewQuestionsPerQuizInternalError } = proxyquire('../utils/QuizzesUtil', { '../firebaseAdmin.js': { admin: adminMockInternalError } });

    const req = { params: { quizId: 'Internal Error Quiz Id' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

    await viewQuestionsPerQuizInternalError(req, res);

    // Expectations
    expect(res.status.calledOnceWith(500)).to.be.true;
    expect(res.json.calledOnceWith({ message: 'Internal Server Error' })).to.be.true;
  });

});
