const { expect } = require("chai");
const sinon = require("sinon");
const { admin } = require("../firebaseAdmin.js");
const { editQuiz } = require("../utils/QuizzesUtil");

describe("Testing Edit Quiz Function", () => {
  let getStub, updateStub, statusStub, jsonStub;

  beforeEach(() => {
    getStub = sinon.stub();
    updateStub = sinon.stub();
    statusStub = sinon.stub().returnsThis();
    jsonStub = sinon.stub();

    sinon
      .stub(admin.firestore(), "collection")
      .withArgs("quizzes")
      .returns({
        doc: sinon.stub().withArgs("quizIdExample").returns({
          get: getStub,
          update: updateStub,
        }),
      });
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should update the quiz successfully", async () => {
    const req = {
      params: { quizId: "quizIdExample" },
      body: {
        newQuizTitle: "Updated Title",
        newQuizCourse: "Updated Course",
        newQuestions: [
          {
            questionTitle: "Update Question?",
            options: ["Option 1", "Option 2", "Option 3"],
            correctOption: 0,
          },
        ],
      },
    };
    const res = { status: statusStub, json: jsonStub };

    // Simulate that the quiz exists
    getStub.resolves({ exists: true });

    // Simulate successful update
    updateStub.resolves();

    await editQuiz(req, res);

    expect(statusStub.calledOnceWith(200)).to.be.true;
    expect(jsonStub.calledOnce).to.be.true;
    expect(jsonStub.firstCall.args[0].message).to.equal(
      "Quiz updated successfully"
    );
    expect(updateStub.calledOnce).to.be.true;
  });

  it("should return 404 if the quiz does not exist", async () => {
    const req = {
      params: { quizId: "quizIdExample" },
      body: {},
    };
    const res = { status: statusStub, json: jsonStub };

    getStub.resolves({ exists: false });

    await editQuiz(req, res);

    expect(statusStub.calledOnceWith(404)).to.be.true;
    expect(jsonStub.calledOnceWith({ message: "Quiz not found" })).to.be.true;
  });

  it("should return 400 if required fields are missing", async () => {
    const req = {
      params: { quizId: "quizIdExample" },
      body: {
        newQuizTitle: "Updated Title",
      },
    };
    const res = { status: statusStub, json: jsonStub };
    // Simulate that the quiz exists
    getStub.resolves({ exists: true });

    await editQuiz(req, res);

    expect(statusStub.calledOnceWith(400)).to.be.true;
    expect(
      jsonStub.calledOnceWith({
        message: "Missing required fields for editing quiz.",
      })
    ).to.be.true;
  });

  it("should return 500 if an error occurs", async () => {
    const req = {
      params: { quizId: "quizIdExample" },
      body: {
        newQuizTitle: "Updated Title",
        newQuizCourse: "Updated Course",
        newQuestions: [
          {
            questionTitle: "Update Question?",
            options: ["Option 1", "Option 2", "Option 3"],
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

    // Simulate an error during update
    getStub.resolves({ exists: true });
    updateStub.throws(new Error("Error occurred attempting to edit quiz"));

    await editQuiz(req, res);
  });
});
