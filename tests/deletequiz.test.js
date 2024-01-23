const { expect } = require('chai');
const sinon = require('sinon');
const { admin } = require('../firebaseAdmin.js');
const { deleteQuiz } = require('../utils/QuizzesUtil');
const QuizzesUtil = require('../utils/QuizzesUtil');
const MockFirebase = require('mock-cloud-firestore');

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


    const firebase = new MockFirebase({
        database: {
            quizzes: {
                '0GgIQXe17luuRtp9wLiE': {
                    quizTitle: 'New Title',
                    quizCourse: 'New Course',
                    questions: [
                        {
                            questionTitle: 'Test Question',
                            options: ['Option 1', 'Option 2'],
                            correctOption: 0
                        },
                        // other questions...
                    ],
                    // other quiz data...
                },
                // other quizzes...
            },
        },
    });

    it('should delete a quiz if it exists', async () => {
        const req = { params: { quizId: '0GgIQXe17luuRtp9wLiE' } };
        const res = {
            status: function (code) {
                expect(code).to.equal(200);
                return this;
            },
            json: function (data) {
                expect(data.message).to.equal('Quiz deleted successfully');
            },
        };

        const docRef = firebase.firestore().doc(`quizzes/${req.params.quizId}`);

        const deleteStub = sinon.stub(docRef, 'delete').resolves();

        try {
            await require('../utils/QuizzesUtil').deleteQuiz(req, res);
        } catch (error) {
            console.error('Test Error:', error); // Log any errors during the test
        }

        deleteStub.restore();
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