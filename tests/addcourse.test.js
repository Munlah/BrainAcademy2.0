const { describe, it } = require('mocha');
const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const { addCourse } = require('../utils/CourseUtil');
const { admin } = require('../firebaseAdmin.js');

let getStub;
const adminMockInternalError = {
    firestore: () => ({
        collection: () => ({
            add: sinon.stub().throws(new Error('Internal Server Error')),
        }),
    }),
};

const { addCourse: addCourseInternalError } = proxyquire('../utils/CourseUtil.js', { '../firebaseAdmin.js': { admin: adminMockInternalError } });

describe('Testing add Course Function', () => {
    const course = [
        {
            topic: 'Mutiplication and Division',
            description: 'Learn about simple division and multiplication for primary 6',
            video: 'https://youtu.be/nTn9gVqRfKY?si=c0QLpMvbBcquwsZV',
            category: 'Maths',

        },
    ];

    beforeEach(() => {
        getStub = sinon.stub(admin.firestore().collection('courses'), 'get').callsFake(async () => {
            const queriedCourse = course.filter(c => c.topic === 'newCourse');
            return {
                docs: queriedCourse.map(c => ({
                    data: () => c
                }))
            };
        });
    });

    afterEach(() => {
        getStub.restore();
    });


    it('Should addCourse successfully', async function () {
        this.timeout(5000);

        const req = {
            body: {
                topic: 'Mutiplication and Division',
                description: 'Learn about simple division and multiplication for primary 6',
                video: 'https://youtu.be/nTn9gVqRfKY?si=c0QLpMvbBcquwsZV',
                category: 'Maths',
            },
        };
        const res = {
            status: function (code) {
                if (code !== 201) {
                    console.error('Error status:', code);
                    console.error('Error details:', this.errorDetails); // Log the error details
                }
                expect(code).to.equal(201);
                return this;
            },
            json: function (data) {
                expect(data.message).to.equal('Add Course successful!');
            },
            errorDetails: null, // Add a property to store error details
        };

        try {
            await addCourse(req, res);
        } catch (error) {
            console.error('Caught an error in the test:', error);
        }
    });

    it('Should fail if same topic is being added', async () => {
        const req = {
            body: {
                topic: 'Mutiplication and Division',
                description: 'Learn about multiplication for primary 6',
                video: 'https://youtu.be/nTn9gVqRfKY?si=c0QLpMvbBcquwsZV',
                category: 'Maths',

            },
        };
        const res = {
            status: function (code) {
                if (code !== 409) {
                    console.error('Error status:', code);
                    console.error('Error details:', this.errorDetails); // Log the error details
                }
                expect(code).to.equal(409);
                return this;
            },
            json: function (data) {
                if (data.message !== 'Topic already exists') {
                    expect(data.message).to.equal('Topic already exists');
                }
            },
            errorDetails: null,
        };

        try {
            await addCourse(req, res);
        } catch (error) {
            console.error('Caught an error in the test:', error);
        }
    });
    // Test case for failure if same topic is being added

    it('Should fail if same description is being added', async () => {
        const req = {
            body: {
                topic: 'Division',
                description: 'Learn about simple division and multiplication for primary 6',
                video: 'https://youtu.be/nTn9gVqRfKY?si=c0QLpMvbBcquwsZV',
                category: 'Maths',
            },
        };
        const res = {
            status: function (code) {
                if (code !== 409) {
                    console.error('Error status:', code);
                    console.error('Error details:', this.errorDetails); // Log the error details
                }
                expect(code).to.equal(409);
                return this;
            },
            json: function (data) {
                if (data.message !== 'Description already exists') {
                    expect(data.message).to.equal('Description already exists');
                }
            },
        };
        await addCourse(req, res);
    });
    it('Should fail if topic is missing', async () => {
        const req = {
            body: {
                topic: '',
                description: 'Learn about simple division and multiplication for primary 6',
                video: 'https://youtu.be/nTn9gVqRfKY?si=c0QLpMvbBcquwsZV',
                category: 'Maths',
            },
        };
        const res = {
            status: function (code) {
                expect(code).to.equal(400);
                return this;
            },
            json: function (data) {
                expect(data.message).to.equal('Incomplete course data');
            },
        };
        await addCourse(req, res);
    });
    // Test case for failure when the description is missing
    it('Should fail if description is missing', async () => {
        const req = {
            body: {
                topic: 'Division and Multiplication',
                description: '',
                video: 'https://youtu.be/nTn9gVqRfKY?si=c0QLpMvbBcquwsZV',
                category: 'Maths',
            },
        };
        const res = {
            status: function (code) {
                expect(code).to.equal(400);
                return this;
            },
            json: function (data) {
                expect(data.message).to.equal('Incomplete course data');
            },
        };
        await addCourse(req, res);

    });

    // Test case for failure when the video is missing
    it('Should fail if video is missing', async () => {
        const req = {
            body: {
                topic: 'Division and Multiplication',
                description: 'Learn about simple division and multiplication for primary 6',
                video: '',
                category: 'Maths',
            },
        };
        const res = {
            status: function (code) {
                expect(code).to.equal(400);
                return this;
            },
            json: function (data) {
                expect(data.message).to.equal('Incomplete course data');
            },
        };
        await addCourse(req, res);

    });
    // Test case for failure when the category is missing
    it('Should fail if category is missing', async () => {
        const req = {
            body: {
                topic: 'Division and Multiplication',
                description: 'Learn about simple division and multiplication for primary 6',
                video: 'https://youtu.be/nTn9gVqRfKY?si=c0QLpMvbBcquwsZV',
                category: '',
            },
        };
        const res = {
            status: function (code) {
                expect(code).to.equal(400);
                return this;
            },
            json: function (data) {
                expect(data.message).to.equal('Incomplete course data');
            },
        };
        await addCourse(req, res);

    });
    // Test case for failure when the category is missing
    it('Should fail if more than 1 coulmn is missing', async () => {
        const req = {
            body: {
                topic: 'Division and Multiplication',
                description: '',
                video: 'https://youtu.be/nTn9gVqRfKY?si=c0QLpMvbBcquwsZV',
                category: '',
            },
        };
        const res = {
            status: function (code) {
                expect(code).to.equal(400);
                return this;
            },
            json: function (data) {
                expect(data.message).to.equal('Incomplete course data');
            },
        };
        await addCourse(req, res);

    });


    it('Should fail validation for topic length exceeding 100 characters', async () => {
        const req = {
            body: {
                topic: 'A'.repeat(101), // Creating a string with more than 100 characters
                description: 'Learn about simple division and multiplication for primary 6',
                video: 'https://youtu.be/valid-video-id',
                category: 'ValidCategory',
            },
        };
        const res = {
            status: function (code) {
                expect(code).to.equal(400);
                return this;
            },
            json: function (data) {
                expect(data.message).to.equal('Invalid input length');
            },
        };
        await addCourse(req, res);
    });

    it('Should fail validation for description length exceeding 500 characters', async () => {
        const req = {
            body: {
                topic: 'Equation',
                description: 'A'.repeat(501), // Creating a string with more than 500 characters
                video: 'https://youtu.be/valid-video-id',
                category: 'Maths',
            },
        };
        const res = {
            status: function (code) {
                expect(code).to.equal(400);
                return this;
            },
            json: function (data) {
                expect(data.message).to.equal('Invalid input length');
            },
        };
        await addCourse(req, res);
    });

    it('Should fail validation for category length exceeding 50 characters', async () => {
        const req = {
            body: {
                topic: 'Valid Topic',
                description: 'Learn about simple division and multiplication for primary 6',
                video: 'https://youtu.be/valid-video-id',
                category: 'A'.repeat(51), // Creating a string with more than 50 characters
            },
        };
        const res = {
            status: function (code) {
                expect(code).to.equal(400);
                return this;
            },
            json: function (data) {
                expect(data.message).to.equal('Invalid input length');
            },
        };
        await addCourse(req, res);
    });

    it('Should fail validation for invalid video URL format', async () => {
        const req = {
            body: {
                topic: 'Valid Topic',
                description: 'Learn about simple division and multiplication for primary 6',
                video: 'invalid-video-url', // Invalid video URL format
                category: 'ValidCategory',
            },
        };
        const res = {
            status: function (code) {
                expect(code).to.equal(400);
                return this;
            },
            json: function (data) {
                expect(data.message).to.equal('Invalid video URL format');
            },
        };
        await addCourse(req, res);
    });
    it('should handle internal server error', async () => {
        const newCourse = {
            topic: 'Mutiplication and Division',
            description: 'Learn about simple division and multiplication for primary 6',
            video: 'https://youtu.be/nTn9gVqRfKY?si=c0QLpMvbBcquwsZV',
            category: 'Maths',
        };

        const req = { body: newCourse };
        const res = {
            status: function (code) {
                this.statusCode = code;
                return this;
            },
            json: function (data) {
                this.data = data;
            },
        };

        await addCourseInternalError(req, res);

        // Expectations
        expect(res.statusCode).to.equal(500);
        expect(res.data.message).to.equal('Internal Server Error');
    });
});
