const { describe, it } = require('mocha');
const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const { deleteUser } = require('../utils/UserUtil');
const { admin } = require('../firebaseAdmin.js');

let originalFirestore;

const adminMockInternalError = {
  firestore: () => ({
    collection: sinon.stub().returns({
      doc: sinon.stub().returns({
        delete: sinon.stub().throws(new Error('Internal Server Error')),
      }),
    }),
  }),
};

beforeEach(() => {
  // Backup the original firestore object
  originalFirestore = admin.firestore();

  admin.firestore = () => ({
    collection: sinon.stub().returns({
      doc: sinon.stub().returns({
        delete: sinon.stub(),
      }),
    }),
  });
});

afterEach(() => {
  // Restore the original firestore object after each test
  admin.firestore = originalFirestore;
});

// Proxyquire to mock internal errors
const { deleteUser: deleteUserInternalError } = proxyquire('../utils/UserUtil.js', {
  '../firebaseAdmin.js': { admin: adminMockInternalError },
});

describe('Testing delete User Function', () => {
  it('should delete a user when a valid ID is provided', async () => {
    // Arrange
    const req = { params: { id: 'ivEMB3Cmd2oZT79bjLug' } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // Act
    await deleteUser(req, res);

    // Assert
    sinon.assert.calledWith(res.status, 200);
    sinon.assert.calledOnce(res.json);
    expect(res.json.args[0][0].message).to.equal('User deleted successfully');
  });

  it('should return a 404 status when the user ID is not found', async () => {
    // Arrange
    const req = { params: { id: 'ivEMB3Cmd2oZT79bjLuR' } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // Act
    await deleteUser(req, res);

    // Assert
    sinon.assert.calledWith(res.status, 404);
    sinon.assert.calledOnce(res.json);
    expect(res.json.args[0][0].message).to.equal('User not found');
  });

//   it('should handle internal server errors and return a 500 status', async () => {
//     // Arrange
//     const req = { params: { id: 'validUserId' } };
//     const res = {
//       status: sinon.stub().returnsThis(),
//       json: sinon.stub(),
//     };

//     // Act
//     await deleteUserInternalError(req, res);

//     // Assert
//     sinon.assert.calledWith(res.status, 500);
//     sinon.assert.calledOnce(res.json);
//     // Add more assertions based on your expected behavior
//   });
});
