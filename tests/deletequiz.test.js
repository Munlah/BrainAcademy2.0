const { expect } = require('chai');
const sinon = require('sinon');
const { admin } = require('../firebaseAdmin.js');
const { deleteQuiz } = require('../utils/QuizzesUtil');

describe('Testing Delete Quiz Function', () => {
    let getStub, deleteStub, statusStub, jsonStub;

    beforeEach(() => {
        getStub = sinon.stub();
        deleteStub = sinon.stub();
        statusStub = sinon.stub().returnsThis();
        jsonStub = sinon.stub();

        sinon.stub(admin.firestore(), 'collection').withArgs('quizzes').returns({
            doc: sinon.stub().withArgs('ZKdcI1Jue7HQGaiMTMU5').returns({
                get: getStub,
                delete: deleteStub,
            }),
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should delete the quiz successfully', async () => {
        const req = { params: { quizId: 'ZKdcI1Jue7HQGaiMTMU5' } };
        const res = { status: statusStub, json: jsonStub };

        getStub.resolves({ exists: true });

        deleteStub.resolves();

        await deleteQuiz(req, res);

        expect(statusStub.calledOnceWith(200)).to.be.true;
        expect(jsonStub.calledOnceWith({ message: 'Quiz deleted successfully' })).to.be.true;
        expect(deleteStub.calledOnce).to.be.true;
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

        getStub.withArgs('ZKdcI1Jue7HQGaiMTMU5').throws(new Error('Error occurred attempting to delete quiz'));

        await deleteQuiz(req, res);
    });


});