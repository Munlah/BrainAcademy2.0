const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const { admin } = require('../firebaseAdmin.js');
const db = admin.firestore();
const { writeFirestore } = require('../utils/QuizzesUtil.js');

describe('writeFirestore', () => {
    it('throws Internal Server Error when there is a Firestore error', async () => {
        const addStub = sinon.stub().throws();
        const collectionStub = sinon.stub(db, 'collection').returns({ add: addStub });

        try {
            await writeFirestore({ foo: 'bar' }, 'testCollection');
            expect.fail('writeFirestore should have thrown an error');
        } catch (err) {
            expect(err.message).to.equal('Internal Server Error');
        }

        collectionStub.restore();
    });

    it('returns the id of the newly created document when there is no Firestore error', async () => {
        // Create a mock DocumentReference with an id property
        const mockDocRef = { id: 'testId' };

        // Stub the add method of the Firestore collection to return the mock DocumentReference
        const addStub = sinon.stub().resolves(mockDocRef);
        const collectionStub = sinon.stub(db, 'collection').returns({ add: addStub });

        const id = await writeFirestore({ foo: 'bar' }, 'testCollection');
        expect(id).to.equal('testId');

        collectionStub.restore();
    });
});