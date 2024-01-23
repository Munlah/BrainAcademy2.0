const { expect } = require('chai');
const sinon = require('sinon');
const { admin } = require('../firebaseAdmin.js');
const { deleteUser } = require('../utils/UserUtil.js');

describe.only('Testing Delete user Function', () => {
    let getStub, deleteStub, statusStub, jsonStub;

    beforeEach(() => {
        getStub = sinon.stub();
        deleteStub = sinon.stub();
        statusStub = sinon.stub().returnsThis();
        jsonStub = sinon.stub();
        getStub.resolves({ exists: true });

        sinon.stub(admin.firestore(), 'collection').withArgs('users').returns({
            doc: sinon.stub().withArgs('6rv4HYHZKqTIa0JrPltO').returns({
                get: getStub,
                delete: deleteStub.resolves(), // Resolve deleteStub as well
            }),
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should delete the user successfully', async () => {
        const req = { params: { userId: '6rv4HYHZKqTIa0JrPltO' } };
        const res = { status: statusStub, json: jsonStub };

        // Simulate that the user exists
        getStub.resolves({ exists: true });

        // Simulate successful deletion
        deleteStub.resolves();

        await deleteUser(req, res);

        expect(statusStub.calledOnceWith(200)).to.be.true;
        expect(jsonStub.calledOnceWith({ message: 'User deleted successfully' })).to.be.true;
        expect(deleteStub.calledOnce).to.be.true;
    });

    it('should return 404 if the user does not exist', async () => {
        const req = { params: { userId: '6rv4HYHZKqTIa0JrPldo' } };
        const res = { status: statusStub, json: jsonStub };

        getStub.resolves({ exists: false });

        await deleteUser(req, res);

        expect(statusStub.calledOnceWith(404)).to.be.true;
        expect(jsonStub.calledOnceWith({ message: 'User not found' })).to.be.true;
    });


    it('should handle internal server error', async () => {
        const req = { params: { userId: '6rv4HYHZKqTIa0JrPltO' } };
        //const res = { status: statusStub, json: jsonStub };

        const res = {
            status: function (code) {
                expect(code).to.equal(500);
                return this;
            },
            json: function (data) {
                expect(data.message).to.equal('Internal server error');
            },
        };

        // Simulate an error during deletion
        getStub.withArgs('6rv4HYHZKqTIa0JrPltO').throws(new Error('Internal server error'));

        await deleteUser(req, res);
    });
});
