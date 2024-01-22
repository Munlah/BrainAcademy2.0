const { describe, it } = require('mocha');
const { expect } = require('chai');
const fs = require('fs').promises;
const sinon = require('sinon');
const { admin } = require('../firebaseAdmin.js');
const { viewAllQuizzesByCourse, viewAllQuizzes, readFirestore } = require('../utils/QuizzesUtil');
const QuizzesUtil = require('../utils/QuizzesUtil');

let getStub;

let quizzes = [ // Define quizzes
    { quizCourse: 'Your Quiz Course', quizTitle: 'Quiz 1' },
    { quizCourse: 'Your Quiz Course', quizTitle: 'Quiz 2' },
    { quizCourse: 'Another Quiz Course', quizTitle: 'Quiz 3' },
];

beforeEach(() => {
    getStub = sinon.stub(admin.firestore().collection('quizzes'), 'get').callsFake(async () => {
        const queriedQuizzes = quizzes.filter(quiz => quiz.quizCourse === 'Your Quiz Course'); // Filter quizzes
        return {
            docs: queriedQuizzes.map(quiz => ({
                data: () => quiz
            }))
        };
    });
});

afterEach(() => {
    getStub.restore();
    sinon.restore();
});

describe('Testing Display All Quizzes by Course Function', () => {

    it('should return quizzes by course', async () => {
        const req = { params: { course: 'Test course' } };
        const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

        // Create a stub of the function that retrieves quizzes from the database
        const getQuizzesByCourseNameStub = sinon
            .stub(QuizzesUtil, 'viewAllQuizzesByCourse')
            .returns(Promise.resolve([{ id: '1', name: 'Quiz 1' }, { id: '2', name: 'Quiz 2' }]));

        await viewAllQuizzesByCourse(req, res);

        expect(res.status.calledOnceWith(200)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
        expect(Array.isArray(res.json.getCall(0).args[0])).to.be.true;

        // Restore the original function
        getQuizzesByCourseNameStub.restore();
    });

    it('should return 404 if no quizzes are found', async () => {
        const req = { params: { course: 'Nonexistent Quiz Course' } };
        const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

        await viewAllQuizzesByCourse(req, res);

        expect(res.status.calledOnceWith(404)).to.be.true;
        expect(res.json.calledOnceWith({ message: 'No quizzes found' })).to.be.true;
    });

    it('Should fail with status 500 when there is a server error', async () => {
        const req = { params: { course: 'Your Quiz Course' } };
        const res = {
            status: function (code) {
                expect(code).to.equal(500);
                return this;
            },
            json: function (data) {
                expect(data.message).to.equal('Error reading from Firestore');
            },
        };

        const readFirestoreStub = sinon
            .stub(QuizzesUtil, 'readFirestore')
            .throws(new Error('Error reading from Firestore'));

        await QuizzesUtil.viewAllQuizzesByCourse(req, res);

        readFirestoreStub.restore();
    });


});

describe('Testing View All Quizzes Function', () => {

    it('should return all quizzes', async () => {
        const req = {};
        const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

        await viewAllQuizzes(req, res);

        expect(res.status.calledOnceWith(200)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
        expect(Array.isArray(res.json.getCall(0).args[0])).to.be.true;
    });

    it('Should fail with status 500 when there is a server error', async () => {
        const req = {};
        const res = {
            status: function (code) {
                expect(code).to.equal(500);
                return this;
            },
            json: function (data) {
                expect(data.message).to.equal('Error reading from Firestore');
            },
        };

        const readFirestoreStub = sinon
            .stub(QuizzesUtil, 'readFirestore')
            .throws(new Error('Error reading from Firestore'));

        await QuizzesUtil.viewAllQuizzes(req, res);

        readFirestoreStub.restore();
    });
});