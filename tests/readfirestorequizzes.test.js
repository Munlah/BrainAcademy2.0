const sinon = require('sinon');
const { expect } = require('chai');
const QuizzesUtil = require('../utils/QuizzesUtil');
const { admin } = require('../firebaseAdmin.js');
const db = admin.firestore();

describe('readFirestore', function () {
    it('should catch the error, log it to the console and rethrow it', async function () {
        const consoleErrorStub = sinon.stub(console, 'error');
        const collectionStub = sinon.stub(db, 'collection').returns({
            get: sinon.stub().throws(new Error('Error reading Firestore'))
        });
    
        try {
            await QuizzesUtil.readFirestore('quizzes');
        } catch (err) {
            expect(err).to.be.an('error');
            expect(err.message).to.equal('Error reading Firestore');
            expect(consoleErrorStub.calledOnce).to.be.true;
            expect(consoleErrorStub.calledWith('Error reading Firestore:', sinon.match.any)).to.be.true;
        } finally {
            consoleErrorStub.restore();
            collectionStub.restore();
        }
    });
});