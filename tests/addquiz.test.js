const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const { admin } = require('../firebaseAdmin.js');
const { createQuizWithQuestions, deleteQuiz } = require('../utils/QuizzesUtil');

// Mocking the entire firebaseAdmin module to simulate an internal server error
const adminMockInternalError = {
  firestore: () => ({
    collection: () => ({
      add: sinon.stub().throws(new Error('Internal Server Error')),
    }),
  }),
};

const { createQuizWithQuestions: createQuizWithQuestionsInternalError } = proxyquire('../utils/QuizzesUtil', { '../firebaseAdmin.js': { admin: adminMockInternalError } });

describe.only('Testing Add Quiz Function', () => {
  let addStub;
  let addedQuizId; // Variable to store the addedQuizId

  // Hook to run after all test cases
  after(async () => {
    if (addStub) {
      addStub.restore(); // Restore the stub after tests
    }

    // Assuming you have access to the addedQuizId
    if (addedQuizId) {
      try {
        // Create a minimal res object
        const minimalRes = {
          status: () => minimalRes, // Mimic the status method
          json: () => minimalRes,   // Mimic the json method
        };

        // Delete the added quiz from Firestore
        await deleteQuiz({ params: { quizId: addedQuizId } }, minimalRes);
      } catch (error) {
        console.error('Error deleting added quiz:', error);
      }
    }
  });

  it('should create a new quiz', async () => {
    // Stub the firestore add method to simulate successful quiz creation
    addStub = sinon.stub(admin.firestore().collection('quizzes'), 'add').returns({ id: 'fakeQuizId' });

    const newQuiz = {
      quizTitle: 'Test add quiz test case',
      quizCourse: 'Division',
      questions: [
        {
          questionTitle: 'Test Question',
          options: ['Option 1', 'Option 2'],
          correctOption: 0,
        },
      ],
    };

    const req = { body: newQuiz };
    const res = {
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        // Save the added quiz document ID for later deletion
        addedQuizId = data.quizId;
        expect(data.message).to.equal('Quiz created successfully.');
      },
    };

    await createQuizWithQuestions(req, res);

    // Expectations for successful quiz creation
    expect(res.statusCode).to.equal(201);
    // expect(addedQuizId).to.equal('fakeQuizId');
  });

  // it('should handle internal server error', async () => {
  //   // Stub the firestore add method to simulate internal server error
  //   addStub = sinon.stub(admin.firestore().collection('quizzes'), 'add').throws(new Error('Internal Server Error'));

  //   const newQuiz = {
  //     quizTitle: 'Test Quiz123',
  //     quizCourse: 'Algebra',
  //     questions: [
  //       {
  //         questionTitle: 'Test Question',
  //         options: ['Option 1', 'Option 2'],
  //         correctOption: 0,
  //       },
  //     ],
  //   };

  //   const req = { body: newQuiz };
  //   const res = {
  //     status: function (code) {
  //       this.statusCode = code;
  //       return this;
  //     },
  //     json: function (data) {
  //       this.data = data;
  //     },
  //   };

  //   await createQuizWithQuestionsInternalError(req, res);

  //   // Expectations for internal server error
  //   expect(res.statusCode).to.equal(500);
  //   expect(res.data.message).to.equal('Internal Server Error');
  // });


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

  // it('should handle internal server error', async () => {
  //   const newQuiz = {
  //     quizTitle: 'Test Quiz123',
  //     quizCourse: 'Test course',
  //     questions: [
  //       {
  //         questionTitle: 'Test Question',
  //         options: ['Option 1', 'Option 2'],
  //         correctOption: 0
  //       },
  //     ]
  //   };

  //   const req = { body: newQuiz };
  //   const res = {
  //     status: function (code) {
  //       this.statusCode = code;
  //       return this;
  //     },
  //     json: function (data) {
  //       this.data = data;
  //     },
  //   };

  //   await createQuizWithQuestionsInternalError(req, res);

  //   // Expectations
  //   expect(res.statusCode).to.equal(500);
  //   expect(res.data.message).to.equal('Internal Server Error');
  // });

});