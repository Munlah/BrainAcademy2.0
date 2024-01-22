// const { expect } = require('chai');
// const { MockFirestore } = require('firebase-mock');
// const sinon = require('sinon');
// const { admin } = require('../firebaseAdmin.js');
// const request = require('supertest');
// const { registerUser, deleteUser } = require('../utils/UserUtil.js');
// // Set the NODE_ENV to 'test'
// process.env.NODE_ENV = 'test';

// // Mocking Firebase for testing
// sinon.stub(admin, 'firestore').returns(new MockFirestore());

// describe('Delete User API', () => {
//   // Assume registerUser is a function that registers a user, and deleteUser deletes a user
//   test('should delete a user by username', async () => {
//     // Register a user first (assuming registration works fine)
//     const registerResponse = await request(app)
//       .post('/register')
//       .send({
//         username: 'testuser',
//         email: 'test@example.com',
//         password: 'Test123!',
//         fullName: 'Test User',
//         role: 'user',
//         contactNumber: '1234567890',
//       });

//     const userId = registerResponse.body.userId;

//     // Now, attempt to delete the user
//     const deleteResponse = await request(app).delete(`/users/testuser`);

//     expect(deleteResponse.statusCode).to.equal(200);
//     expect(deleteResponse.body).to.have.property('message', 'User deleted successfully');
//   });

//   // Add more test cases as needed

//   // Clean up the sinon stub after the tests
//   after(() => {
//     sinon.restore();
//   });
// });