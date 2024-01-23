// const { describe, it } = require('mocha');
// const { expect } = require('chai');
// const sinon = require('sinon');
// const proxyquire = require('proxyquire');

// const mockFirestore = {
//   collection: sinon.stub(),
//   doc: sinon.stub(),
//   get: sinon.stub(),
// };

// const adminMock = {
//   firestore: () => mockFirestore,
// };

// const { getCourseById } = proxyquire('../utils/CourseUtil', {
//   '../firebaseAdmin.js': { admin: adminMock },
// });

// describe.only('getCourseById Function', () => {
//   it('should return a course when a valid ID is provided', async () => {
//     // Arrange
//     const courseId = '2eOC6Pd7Tcx6OFqGKcPA';
//     const quizIds = ['quizId1', 'quizId2'];
//     const courseSnapshot = {
//       exists: true,
//       id: courseId,
//       data: sinon.stub().returns({ topic: 'Test Course' }),
//     };
//     const quizzesSnapshot = {
//       empty: false,
//       docs: quizIds.map(id => ({ id })),
//     };
//     mockFirestore.doc.withArgs(`courses/${courseId}`).returns({ get: sinon.stub().resolves(courseSnapshot) });
//     mockFirestore.collection.withArgs('quizzes').returns({ where: sinon.stub().returns({ get: sinon.stub().resolves(quizzesSnapshot) }) });

//     const req = { params: { id: courseId } };
//     const res = {
//       status: sinon.stub().returnsThis(),
//       json: sinon.stub(),
//     };

//     await getCourseById(req, res);

//     // Assert
//     sinon.assert.calledOnce(res.status); // Ensure status is called at least once
//     sinon.assert.calledWith(res.status.firstCall, 200); // Check the first call to status
//     sinon.assert.calledOnce(res.json);
//     const response = res.json.args[0][0];
//     expect(response.course).to.exist;
//     expect(response.course.id).to.equal(courseId);
//     expect(response.course.topic).to.equal('Test Course');
//     expect(response.course.quizIds).to.deep.equal(quizIds);

//   });

//   it('should return a 404 status when the course ID is not found', async () => {
//     // Arrange
//     const courseId = 'nonexistentCourseId';
//     mockFirestore.doc.withArgs(`courses/${courseId}`).returns({ get: sinon.stub().resolves({ exists: false }) });

//     const req = { params: { id: courseId } };
//     const res = {
//       status: sinon.stub().returnsThis(),
//       json: sinon.stub(),
//     };

//     // Act
//     await getCourseById(req, res);

//     // Assert
//     sinon.assert.calledWith(res.status, 404);
//     sinon.assert.calledOnce(res.json);
//   });

//   it('should return a 400 status when no course ID is provided', async () => {
//     // Arrange
//     const req = { params: {} };
//     const res = {
//       status: sinon.stub().returnsThis(),
//       json: sinon.stub(),
//     };

//     // Act
//     await getCourseById(req, res);

//     // Assert
//     sinon.assert.calledWith(res.status, 400);
//     sinon.assert.calledOnce(res.json);
//   });

//   it('should handle internal server errors and return a 500 status', async () => {
//     // Arrange
//     const courseId = 'validCourseId';
//     mockFirestore.doc.withArgs(`courses/${courseId}`).throws(new Error('Internal Server Error'));

//     const req = { params: { id: courseId } };
//     const res = {
//       status: sinon.stub().returnsThis(),
//       json: sinon.stub(),
//     };

//     // Act
//     await getCourseById(req, res);

//     // Assert
//     sinon.assert.calledWith(res.status, 500);
//     sinon.assert.calledOnce(res.json);
//   });
// });


const { describe, it } = require('mocha');
const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const { getCourseById } = require('../utils/CourseUtil');
const { admin } = require('../firebaseAdmin.js');

let originalFirestore;

const adminMockInternalError = {
    firestore: () => ({
        collection: () => ({
            add: sinon.stub().throws(new Error('Internal Server Error')),
        }),
    }),
};

beforeEach(() => {
    // Backup the original firestore object
    originalFirestore = admin.firestore();

    admin.firestore = () => ({
        collection: (collectionName) => ({
            get: async () => {
                // Simulate fetching data from Firestore
                const snapshot = await originalFirestore().collection(collectionName).get();
                return {
                    docs: snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })),
                };
            },
        }),
    });
});

afterEach(() => {
    // Restore the original firestore object after each test
    admin.firestore = originalFirestore;
});

// Proxyquire to mock internal errors
const { getCourseById: getCourseByIdInternalError } = proxyquire('../utils/CourseUtil.js', { '../firebaseAdmin.js': { admin: adminMockInternalError } });

describe('Testing get Course by Id Function', () => {
    it('should return a course when a valid ID is provided', async () => {
        // Arrange
        const req = { params: { id: '2eOC6Pd7Tcx6OFqGKcPA' } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        // Act
        await getCourseById(req, res);

        // Assert
        sinon.assert.calledWith(res.status, 200);
        sinon.assert.calledOnce(res.json);

        expect(res.json.args[0][0].course).to.exist; 
    });

    it('should return a 404 status when the course ID is not found', async () => {
        // Arrange
        const req = { params: { id: 'nonexistentCourseId' } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        // Act
        await getCourseById(req, res);

        // Assert
        sinon.assert.calledWith(res.status, 404);
        sinon.assert.calledOnce(res.json);
        // Add more assertions based on your expected behavior
    });

    it('should return a 400 status when no course ID is provided', async () => {
        // Arrange
        const req = { params: {} };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        // Act
        await getCourseById(req, res);

        // Assert
        sinon.assert.calledWith(res.status, 400);
        sinon.assert.calledOnce(res.json);
        // Add more assertions based on your expected behavior
    });

    it('should handle internal server errors and return a 500 status', async () => {
        // Arrange
        const req = { params: { id: '2eOC6Pd7Tcx6OFqGKcPA' } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        // Act
        await getCourseByIdInternalError(req, res);

        // Assert
        sinon.assert.calledWith(res.status, 500);
        sinon.assert.calledOnce(res.json);
    });
});


