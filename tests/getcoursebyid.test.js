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

const { getCourseById: getCourseByIdInternalError } = proxyquire('../utils/CourseUtil.js', { '../firebaseAdmin.js': { admin: adminMockInternalError } });

describe('Testing get Course by Id Function', () => {
    it('should return a course when a valid ID is provided', async () => {
        // Arrange
        const req = { params: { id: '1705375395303' } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        // Act
        await getCourseById(req, res);

        // Assert
        sinon.assert.calledWith(res.status, 200);
        sinon.assert.calledOnce(res.json);
        // Add more assertions based on your expected behavior
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
        const req = { params: { id: 'validCourseId' } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        // Act
        await getCourseByIdInternalError(req, res);

        // Assert
        sinon.assert.calledWith(res.status, 500);
        sinon.assert.calledOnce(res.json);
        // Add more assertions based on your expected behavior
    });
});
