const { describe, it } = require('mocha');
const { expect } = require('chai');
const fs = require('fs').promises;
const sinon = require('sinon');
const { login } = require('../utils/UserUtil');
const { admin } = require('../firebaseAdmin.js');

let getStub;

describe('Testing Login Function', () => {
    const users = [
        {
            username: 'jennieeain2',
            passwordHash: '$2b$10$Pl/TQWWefjaAawfqIqL/OeL8bfrFSg5HXhXTojuM31DYmxwr1BGr6', // bcrypt hash for 'password'
        },
    ];

    beforeEach(() => {
        getStub = sinon.stub(admin.firestore().collection('users'), 'get').callsFake(async () => {
            const queriedUsers = users.filter(user => user.username === 'newuser'); // Customize the filtering based on your test case
            return {
                docs: queriedUsers.map(user => ({
                    data: () => user
                }))
            };
        });
    });

    afterEach(() => {
        getStub.restore();
    });

    it('Should login successfully', async () => {
        const req = {
            body: {
                username: 'jennieeain2',
                password: 'Ilovefood123@',
            },
        };
        const res = {
            status: function (code) {
                expect(code).to.equal(200);
                return this;
            },
            json: function (data) {
                expect(data.message).to.equal('Login successful!');
            },
        };
        await login(req, res);
    });

    it('Should fail when username is missing', async () => {
        const req = {
            body: {
                password: 'password',
            },
        };
        const res = {
            status: function (code) {
                expect(code).to.equal(400);
                return this;
            },
            json: function (data) {
                expect(data.message).to.equal('Username and password are required');
            },
        };
        await login(req, res);
    });

    it('Should fail when password is missing', async () => {
        const req = {
            body: {
                username: 'newuser',
            },
        };
        const res = {
            status: function (code) {
                expect(code).to.equal(400);
                return this;
            },
            json: function (data) {
                expect(data.message).to.equal('Username and password are required');
            },
        };
        await login(req, res);
    });

    it('Should fail when username does not exist', async () => {
        const req = {
            body: {
                username: 'nonexistentuser',
                password: 'password',
            },
        };
        const res = {
            status: function (code) {
                expect(code).to.equal(401);
                return this;
            },
            json: function (data) {
                expect(data.message).to.equal('Invalid username');
            },
        };
        await login(req, res);
    });

    it('Should fail when password is incorrect', async () => {
        const req = {
            body: {
                username: 'jennieeain2',
                password: 'wrongpassword',
            },
        };
        const res = {
            status: function (code) {
                expect(code).to.equal(401);
                return this;
            },
            json: function (data) {
                expect(data.message).to.equal('Invalid password');
            },
        };
        await login(req, res);
    });

    it('Should fail with status 500 when there is a server error', async () => {
        const req = {
            body: {
                username: 'newuser',
                password: 'password',
            },
        };
        const res = {
            status: function (code) {
                expect(code).to.equal(500);
                return this;
            },
            json: function (data) {
                expect(data.message).to.equal('Internal server error');
            },
        };

        const loginStub = sinon
            .stub(require('../utils/UserUtil'), 'login')
            .throws(new Error('Internal server error'));

        await login(req, res);

        loginStub.restore();
    });
});
