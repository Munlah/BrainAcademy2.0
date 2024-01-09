const { describe, it } = require('mocha');
const { expect } = require('chai');
const sinon = require('sinon');
const { addCourse } = require('../utils/CourseUtil');
const { admin } = require('../firebaseAdmin.js');

let getStub;

describe.only('Testing add Course Function', () => {
    const course = [
        {
            topic: 'Division and Multiplication',
            description: 'Learn about simple division and multiplication for primary 4',
            video: 'https://youtu.be/nTn9gVqRfKY?si=c0QLpMvbBcquwsZV',  // Provide a valid video URL
            category: 'Maths',
            pic: 'panda.jpeg'
        },
    ];

    beforeEach(() => {
        getStub = sinon.stub(admin.firestore().collection('course'), 'get').callsFake(async () => {
            const queriedCourse = course.filter(course => course.name === 'newcourse');
            return {
                docs: queriedCourse.map(course => ({
                    data: () => course
                }))
            };
        });
    });

    afterEach(() => {
        getStub.restore();
    });

    it('Should addCourse successfully', async function () { // <-- Update this line
        this.timeout(5000); // Set a timeout of 5000ms (adjust as needed)

        const req = {
            body: {
                topic: 'Division and Multiplication',
                description: 'Learn about simple division and multiplication for primary 4',
                video: 'https://youtu.be/nTn9gVqRfKY?si=c0QLpMvbBcquwsZV',
                category: 'Maths',
                pic: 'panda.jpeg'
            },
        };
        const res = {
            status: function (code) {
                expect(code).to.equal(201); // Expect a status code of 201 for successful creation
                return this;
            },
            json: function (data) {
                expect(data.message).to.equal('Add Course successful!');
            },
        };
        await addCourse(req, res);
    });
});
