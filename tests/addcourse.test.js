const { describe, it } = require('mocha');
const { expect } = require('chai');
const sinon = require('sinon');
const { addCourse } = require('../utils/CourseUtil');
const { admin } = require('../firebaseAdmin.js');

let getStub;

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
                description: 'Learn about simple multiplication for primary 6',
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
    it('Should fail if topic is missing', async () => {
        const req = {
            body: {
                topic: '',
                description: 'Learn about simple division and multiplication for primary 4',
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
                description: 'Learn about simple division and multiplication for primary 4',
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
                description: 'Learn about simple division and multiplication for primary 4',
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

    it('Should fail validation for topic length exceeding 100 characters', async () => {
        const req = {
            body: {
                topic: 'A'.repeat(101), // Creating a string with more than 100 characters
                description: 'Valid description within the allowed length',
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
                description: 'Valid description within the allowed length',
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
                description: 'Valid description within the allowed length',
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
});
