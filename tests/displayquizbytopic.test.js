const sinon = require('sinon');
const { expect } = require('chai');
const { admin } = require('../firebaseAdmin.js');
const { viewQuizzesBytopic } = require('../utils/QuizzesUtil');

describe('Testing View All Quizzes By Topic Function', () => {
    let getStub, statusStub, jsonStub;

    beforeEach(() => {
        getStub = sinon.stub();
        statusStub = sinon.stub().returnsThis();
        jsonStub = sinon.stub();

        // Correct stubbing to match the actual call in the function
        sinon.stub(admin.firestore(), 'collection').withArgs('quizzes').returns({
            get: getStub,
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return quizzes for a specific topic', async () => {
        const req = { params: { topic: 'Algebra' } };
        const res = { status: statusStub, json: jsonStub };

        // Simulate that quizzes exist for the specified topic
        getStub.resolves({
            docs: [
                { data: () => ({ quizCourse: 'Algebra', quizTitle: 'Test Quiz' }) },
                // Add more quiz objects if needed
            ],
        });

        await viewQuizzesBytopic(req, res);

        // Assertions
        expect(statusStub.calledOnceWith(200)).to.be.true;
        expect(jsonStub.calledOnce).to.be.true;
        // Add more specific assertions based on your expected data
    });
    it('should return 404 if no quizzes are found', async () => {
        const req = { params: { topic: 'tester' } };
        const res = { status: statusStub, json: jsonStub };

        // Simulate that no quizzes exist for the specified course
        getStub.resolves({ docs: [] });

        await viewQuizzesBytopic(req, res);

        expect(statusStub.calledOnceWith(404)).to.be.true;
        expect(jsonStub.calledOnceWith({ message: 'No quizzes found' })).to.be.true;
    });

    it('should return 500 if an error occurs', async () => {
        const req = { params: { topic: 'Algebra' } };
        const res = {
            status: function (code) {
                expect(code).to.equal(500);
                return this;
            },
            json: function (data) {
                expect(data.message).to.equal('Error reading from Firestore');
            },
        };
        await viewQuizzesBytopic(req, res);
    });
});