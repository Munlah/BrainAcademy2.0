const { expect } = require('chai');
const sinon = require('sinon');
const { admin } = require('../firebaseAdmin.js');
const { viewAllQuizzesByCourse, viewAllQuizzes, readFirestore } = require('../utils/QuizzesUtil');
const { QuizzesUtil } = require('../utils/QuizzesUtil');

describe('Testing View All Quizzes By Course Function', () => {
    let getStub, statusStub, jsonStub;

    beforeEach(() => {
        getStub = sinon.stub();
        statusStub = sinon.stub().returnsThis();
        jsonStub = sinon.stub();

        sinon.stub(admin.firestore(), 'collection').withArgs('quizzes').returns({
            get: getStub,
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return quizzes for a specific course', async () => {
        const req = { params: { course: 'Math' } };
        const res = { status: statusStub, json: jsonStub };

        // Simulate that quizzes exist for the specified course
        getStub.resolves({
            docs: [
                { data: () => ({ quizCourse: 'Math', quizTitle: 'Sample Quiz' }) },
                // Add more quiz objects if needed
            ],
        });

        await viewAllQuizzesByCourse(req, res);

        expect(statusStub.calledOnceWith(200)).to.be.true;
        expect(jsonStub.calledOnce).to.be.true;
        // Add more specific assertions based on your expected data
    });

    it('should return 404 if no quizzes are found', async () => {
        const req = { params: { course: 'NonExistentCourse' } };
        const res = { status: statusStub, json: jsonStub };

        // Simulate that no quizzes exist for the specified course
        getStub.resolves({ docs: [] });

        await viewAllQuizzesByCourse(req, res);

        expect(statusStub.calledOnceWith(404)).to.be.true;
        expect(jsonStub.calledOnceWith({ message: 'No quizzes found' })).to.be.true;
    });

    it('should return 500 if an error occurs', async () => {
        const req = { params: { course: 'Math' } };
        const res = {
            status: function (code) {
                expect(code).to.equal(500);
                return this;
            },
            json: function (data) {
                expect(data.message).to.equal('Error reading from Firestore');
            },
        };

        // Simulate an error during fetching quizzes
        getStub.throws(new Error('Error reading from Firestore'));

        await viewAllQuizzesByCourse(req, res);
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
        // Stub the readFirestore function
        const readFirestoreStub = sinon.stub().throws(new Error('Simulated Firestore error'));

        // Replace the actual readFirestore function with the stub
        const originalReadFirestore = global.readFirestore;
        global.readFirestore = readFirestoreStub;

        // Mock request and response objects
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

        // Call the viewAllQuizzes function
        await viewAllQuizzes(req, res);

        // Restore the original readFirestore function
        global.readFirestore = originalReadFirestore;
    });
});