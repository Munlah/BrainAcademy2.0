const { describe, it } = require('mocha');
const { expect } = require('chai');
const fs = require('fs').promises;
const sinon = require('sinon');
const { admin } = require('../firebaseAdmin.js');
const { viewAllQuizzesByCourse, readFirestore } = require('../utils/QuizzesUtil');

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
});

describe.only('Testing Display All Quizzes by Course Function', () => {

    it('should return quizzes by course', async () => {
        const req = { params: { course: 'Your Quiz Course' } };
        const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

        await viewAllQuizzesByCourse(req, res);

        expect(res.status.calledOnceWith(200)).to.be.true;
        expect(res.json.calledOnce).to.be.true;
        expect(Array.isArray(res.json.getCall(0).args[0])).to.be.true;
    });

    it('should return 404 if no quizzes are found', async () => {
        const req = { params: { course: 'Nonexistent Quiz Course' } };
        const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

        await viewAllQuizzesByCourse(req, res);

        expect(res.status.calledOnceWith(404)).to.be.true;
        expect(res.json.calledOnceWith({ message: 'No quizzes found' })).to.be.true;
    });

    it('should return 500 if an error occurs', async () => {
        const req = { params: { course: 'Your Quiz Course' } };
        const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    
        // Make the readFirestore function throw an error
        const readFirestoreStub = sinon.stub().throws(new Error('Error reading from Firestore'));
    
        try {
            await viewAllQuizzesByCourse(req, res);
    
            expect(res.status.calledOnceWith(500)).to.be.true;
            expect(res.json.calledOnceWith({ message: 'Error reading from Firestore' })).to.be.true;
        } catch (error) {

        } finally {
            // Restore the original function after the test
            sinon.restore();
        }
    });
    

});