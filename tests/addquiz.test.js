const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const { admin } = require('../firebaseAdmin.js');
const { createQuizWithQuestions } = require('../utils/QuizzesUtil');

// Mocking the entire firebaseAdmin module to simulate an internal server error
const adminMockInternalError = {
  firestore: () => ({
    collection: () => ({
      add: sinon.stub().throws(new Error('Internal Server Error')),
    }),
  }),
};

const { createQuizWithQuestions: createQuizWithQuestionsInternalError } = proxyquire('../utils/QuizzesUtil', { '../firebaseAdmin.js': { admin: adminMockInternalError } });

describe('Testing Add Quiz Function', () => {
  let addStub;

  beforeEach(() => {
    addStub = sinon.stub(admin.firestore().collection('quizzes'), 'add').resolves({ id: 'mockedQuizId' });
  });

  afterEach(() => {
    addStub.restore();
  });

  it('should create a new quiz', async () => {
    const newQuiz = {
      quizTitle: 'Test Quiz123',
      quizCourse: 'Test course',
      questions: [
        {
          questionTitle: 'Test Question',
          options: ['Option 1', 'Option 2'],
          correctOption: 0
        },
      ]
    };

    const req = { body: newQuiz };
    const res = {
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.data = data;
      },
    };

    await createQuizWithQuestions(req, res);

    expect(res.statusCode).to.equal(201);
    expect(res.data.message).to.equal('Quiz created successfully.');
  });


  it('should handle invalid data', async () => {

    const req = { body: { invalidData: true } };
    const res = {
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.data = data;
      },
    };

    await createQuizWithQuestions(req, res);

    //Expect a 400 status code and the correct error message
    expect(res.statusCode).to.equal(400);
    expect(res.data.message).to.equal('Invalid data provided for creating quiz.');
  });

  it('should handle missing quizTitle', async () => {
    const req = { body: { quizCourse: 'Test course', questions: [] } };
    const res = {
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.data = data;
      },
    };

    await createQuizWithQuestions(req, res);

    expect(res.statusCode).to.equal(400);
    expect(res.data.message).to.equal('Invalid data provided for creating quiz.');
  });

  it('should handle missing quizCourse', async () => {
    const req = { body: { quizTitle: 'Test Quiz', questions: [] } };
    const res = {
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.data = data;
      },
    };

    await createQuizWithQuestions(req, res);

    expect(res.statusCode).to.equal(400);
    expect(res.data.message).to.equal('Invalid data provided for creating quiz.');
  });

  it('should handle missing questions', async () => {
    const req = { body: { quizTitle: 'Test Quiz', quizCourse: 'Test course' } };
    const res = {
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.data = data;
      },
    };

    await createQuizWithQuestions(req, res);

    expect(res.statusCode).to.equal(400);
    expect(res.data.message).to.equal('Invalid data provided for creating quiz.');
  });

  it('should handle incorrect correctOption', async () => {
    const req = {
      body: {
        quizTitle: 'Test Quiz',
        quizCourse: 'Test course',
        questions: [
          {
            questionTitle: 'Test Question',
            options: ['Option 1', 'Option 2'],
            correctOption: 3, //incorrect index
          },
        ],
      },
    };
    const res = {
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.data = data;
      },
    };

    await createQuizWithQuestions(req, res);

    expect(res.statusCode).to.equal(400);
    expect(res.data.message).to.equal('Invalid correct option provided for creating quiz.');
  });

  it('should handle internal server error', async () => {
    const newQuiz = {
      quizTitle: 'Test Quiz123',
      quizCourse: 'Test course',
      questions: [
        {
          questionTitle: 'Test Question',
          options: ['Option 1', 'Option 2'],
          correctOption: 0
        },
      ]
    };

    const req = { body: newQuiz };
    const res = {
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.data = data;
      },
    };

    await createQuizWithQuestionsInternalError(req, res);

    // Expectations
    expect(res.statusCode).to.equal(500);
    expect(res.data.message).to.equal('Internal Server Error');
  });

});
