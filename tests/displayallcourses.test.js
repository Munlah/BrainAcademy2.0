const { describe, it } = require('mocha');
const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const { getAllCourses, writeFirestore } = require('../utils/CourseUtil');
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
const { getAllCourses: getAllCourseInternalError } = proxyquire('../utils/CourseUtil.js', { '../firebaseAdmin.js': { admin: adminMockInternalError } });

describe('Testing Get All Courses Function', () => {


    it('Should return all courses', async () => {
        const CourseUtil = proxyquire('../utils/CourseUtil', { '../firebaseAdmin.js': { admin } });

        // Set up a sample response from Firestore with some courses
        const firestoreResponse = {
            docs: [
                { id: 'courseId1', data: () => ({ topic: 'Topic 1', description: 'Description 1', video: 'video1.mp4', category: 'Category 1' }) },
                { id: 'courseId2', data: () => ({ topic: 'Topic 2', description: 'Description 2', video: 'video2.mp4', category: 'Category 2' }) },
            ],
        };

        // Create a stub for the Firestore get method
        const getStub = sinon.stub().resolves(firestoreResponse);

        // Replace the original collection method with the stub
        sinon.stub(admin.firestore(), 'collection').returns({ get: getStub });

        const req = {};
        const res = {
            status: function (code) {
                if (code === 200) {
                    return this;
                } else {
                    throw new Error(`Unexpected status code: ${code}`);
                }
            },
            json: function (data) {
                expect(data).to.be.an('object').that.has.property('courses');
                expect(data.courses).to.be.an('array').that.is.not.empty;
            },
        };

        // Wrap the test logic in an async function to allow awaiting
        await CourseUtil.getAllCourses(req, res);

        // Restore the original collection method after the test
        admin.firestore().collection.restore();
    });


    it('Should return no courses', async () => {
        const CourseUtil = proxyquire('../utils/CourseUtil', { '../firebaseAdmin.js': { admin } });

        // Set up a sample response from Firestore with no courses
        const firestoreResponse = {
            docs: [],
        };

        // Create a stub for the Firestore get method
        const getStub = sinon.stub().resolves(firestoreResponse);

        // Replace the original collection method with the stub
        sinon.stub(admin.firestore(), 'collection').returns({ get: getStub });

        const req = {};
        const res = {
            status: function (code) {
                if (code === 200) {
                    return this;
                } else {
                    throw new Error(`Unexpected status code: ${code}`);
                }
            },
            json: function (data) {
                expect(data).to.be.an('object').that.has.property('message', 'No courses available');
            },
        };

        // Wrap the test logic in an async function to allow awaiting
        await CourseUtil.getAllCourses(req, res);

        // Restore the original collection method after the test
        admin.firestore().collection.restore();
    });
    it('should handle internal server error', async () => {
        // Create a mock request object
        const req = {};

        const res = {
            status: function (code) {
                this.statusCode = code;
                return this;
            },
            json: function (data) {
                this.data = data;
            },
        };

        // Use the mocked getAllCourseInternalError from proxyquire
        await getAllCourseInternalError(req, res);

        // Expectations
        expect(res.statusCode).to.equal(500);
        expect(res.data.message).to.equal('Internal Server Error');
    });

});
