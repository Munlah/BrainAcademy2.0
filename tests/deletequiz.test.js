const { expect } = require('chai');
const sinon = require('sinon');
const { admin } = require('../firebaseAdmin.js');
const { createQuizWithQuestions, deleteQuiz } = require('../utils/QuizzesUtil');

describe('Testing Delete Quiz Function', () => {
    let getStub, deleteStub, statusStub, jsonStub;

    beforeEach(() => {
        getStub = sinon.stub();
        deleteStub = sinon.stub();
        statusStub = sinon.stub().returnsThis();
        jsonStub = sinon.stub();

        sinon.stub(admin.firestore().collection('quizzes'), 'doc').returns({
            get: getStub,
            delete: deleteStub,
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    let createdQuizId;

    it('should create a new quiz', async () => {
        const req = {
            body: {
                quizTitle: 'Test Quiz',
                quizCourse: 'Test Course',
                questions: [
                    {
                        questionTitle: 'Test Question',
                        options: ['Option 1', 'Option 2'],
                        correctOption: 0
                    },
                ]
            }
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
        expect(res.data.message).to.equal('Quiz created successfully.');

        createdQuizId = res.data.quiz.quizId;
    });

    it('should delete a quiz if it exists', async () => {
        const req = { params: { quizId: createdQuizId } };
        const res = { status: statusStub, json: jsonStub };

        getStub.resolves({ exists: true });
        deleteStub.resolves();

        await deleteQuiz(req, res);

        expect(statusStub.calledOnceWith(200)).to.be.true;
        expect(jsonStub.calledOnceWith({ message: 'Quiz deleted successfully' })).to.be.true;
    });

    it('should return 404 if the quiz does not exist', async () => {
        const req = { params: { quizId: 'ZKdcI1Jue7HQGaiMTMU5' } };
        const res = { status: statusStub, json: jsonStub };

        getStub.resolves({ exists: false });

        await deleteQuiz(req, res);

        expect(statusStub.calledOnceWith(404)).to.be.true;
        expect(jsonStub.calledOnceWith({ message: 'Quiz not found' })).to.be.true;
    });

    it('should return 500 if an error occurs', async () => {
        const req = { params: { quizId: 'ZKdcI1Jue7HQGaiMTMU5' } };
        const res = {
            status: function (code) {
                expect(code).to.equal(500);
                return this;
            },
            json: function (data) {
                expect(data.message).to.equal('Error occurred attempting to delete quiz');
            },
        };
    
        const getStub = sinon.stub(admin.firestore().collection('quizzes').doc(req.params.quizId), 'get')
            .throws(new Error('Error occurred attempting to delete quiz'));
    
        await require('../utils/QuizzesUtil').deleteQuiz(req, res);
    
        getStub.restore();
    });

});