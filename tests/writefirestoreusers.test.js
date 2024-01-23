const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const { admin } = require('../firebaseAdmin.js');
const db = admin.firestore();
const { writeFirestore } = require('../utils/UserUtil.js');

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
});