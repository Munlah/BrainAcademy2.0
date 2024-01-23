const { expect } = require("chai");
const sinon = require("sinon");
const { admin } = require("../firebaseAdmin.js");
const { createQuizWithQuestions, editQuiz } = require("../utils/QuizzesUtil");

describe("Testing Edit Quiz Function", () => {
  let getStub, updateStub, statusStub, jsonStub, createdQuizId;

  beforeEach(() => {
    getStub = sinon.stub();
    updateStub = sinon.stub();
    statusStub = sinon.stub().returnsThis();
    jsonStub = sinon.stub();

    sinon.stub(admin.firestore().collection("quizzes"), "doc").returns({
      get: getStub,
      update: updateStub,
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  // Create a mock quiz for editing
  it("should create a new quiz for editing", async () => {
    const req = {
      body: {
        quizTitle: "Test Quiz",
        quizCourse: "Algebra",
        questions: [
          {
            questionTitle: "Test Question",
            options: ["Option 1", "Option 2"],
            correctOption: 0,
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

    expect(res.statusCode).to.equal(201);
    expect(res.data.message).to.equal("Quiz created successfully.");

    createdQuizId = res.data.quiz.quizId;
  });

  // Test successful edit
  it("should successfully edit an existing quiz", async () => {
    // Mock that the quiz exists
    getStub.resolves({ exists: true });

    // Setup the request object with new quiz details
    const req = {
      params: { quizId: createdQuizId },
      body: {
        newQuizTitle: "Edited Quiz Title",
        newQuizCourse: "Edited Quiz Course",
        newQuestions: [
          {
            questionTitle: "Edited Question",
            options: ["Edited Option 1", "Edited Option 2"],
            correctOption: 1,
          },
        ],
      },
    };

    // Setup the response object
    const res = {
      status: statusStub,
      json: jsonStub,
    };

    // Call the editQuiz function
    await editQuiz(req, res);

    // Assert that the status code is 200
    expect(statusStub.calledOnceWith(200)).to.be.true;

    // Assert that the response message is as expected
    expect(
      jsonStub.calledOnceWith({
        message: "Quiz updated successfully",
        quiz: {
          quizTitle: "Edited Quiz Title",
          quizCourse: "Edited Quiz Course",
          questions: [
            {
              questionTitle: "Edited Question",
              options: ["Edited Option 1", "Edited Option 2"],
              correctOption: 1,
            },
          ],
        },
      })
    ).to.be.true;
  });

  // // Test editing a non-existing quiz
  it("should return 404 if the quiz to edit does not exist", async () => {
    getStub.resolves({ exists: false });

    const req = {
      params: { quizId: "nonExistingQuizId" },
      body: {
        newQuizTitle: "New Title",
        newQuizCourse: "New Course",
        newQuestions: [
          {
            questionTitle: "Test Question",
            options: ["Option 1", "Option 2"],
            correctOption: 0,
          },
        ],
      },
    };
    const res = {
      status: statusStub,
      json: jsonStub,
    };

    await editQuiz(req, res);

    expect(statusStub.calledOnceWith(404)).to.be.true;
    expect(jsonStub.calledOnceWith({ message: "Quiz not found" })).to.be.true;
  });

  // // Test editing with missing required fields
  it("should return 400 if required fields are missing for editing quiz", async () => {
    getStub.resolves({ exists: true });

    const req = {
      params: { quizId: createdQuizId },
      body: {
        newQuizTitle: "", // Missing / empty field
        newQuizCourse: "New Course",
        newQuestions: [
          {
            questionTitle: "Test Question",
            options: ["Option 1", "Option 2"],
            correctOption: 0,
          },
        ],
      },
    };
    const res = {
      status: statusStub,
      json: jsonStub,
    };

    await editQuiz(req, res);

    expect(statusStub.calledOnceWith(400)).to.be.true;
    expect(
      jsonStub.calledOnceWith({
        message: "Missing required fields for editing quiz.",
      })
    ).to.be.true;
  });

  it("should return 500 if an error occurs during editing", async () => {
    const req = {
      params: { quizId: createdQuizId },
      body: {
        newQuizTitle: "New Title",
        newQuizCourse: "New Course",
        newQuestions: [
          {
            questionTitle: "Test Question",
            options: ["Option 1", "Option 2"],
            correctOption: 0,
          },
        ],
      },
    };
    const res = {
      status: function (code) {
        expect(code).to.equal(500);
        return this;
      },
      json: function (data) {
        expect(data.message).to.equal("Error occurred attempting to edit quiz");
      },
    };

    updateStub.rejects(new Error("Error occurred attempting to edit quiz"));

    await editQuiz(req, res);
  });
});
