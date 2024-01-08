const { describe, it } = require('mocha');
const { expect } = require('chai');
const fs = require('fs').promises;
const { registerUser } = require('../utils/UserUtil');
const bcrypt = require('bcrypt');
const sinon = require('sinon');

describe('Testing Register Function', () => {
  const usersFilePath = 'utils/users.json';
  var orgContent = '';

  beforeEach(async () => {
    try {
      // Save the original content of users file
      orgContent = await fs.readFile(usersFilePath, 'utf8');
      orgContent = JSON.parse(orgContent);
    } catch (error) {
      // Handle the error (by failing the test or logging the error)
      throw error;
    }
  });

  afterEach(async () => {
    try {
      // Restore the original content of users file after each test
      await fs.writeFile(usersFilePath, JSON.stringify(orgContent), 'utf8');
    } catch (error) {
      // Handle the error (by failing the test or logging the error)
      throw error;
    }
  });

  it('Should register a new user successfully', async () => {
    const req = {
      body: {
        username: 'testuser',
        email: 'testuser@gmail.com',
        password: 'Password123!',
        fullName: 'Test User',
        role: 'student',
        contactNumber: '12345678',
      },
    };
    let status = 0;
    let responseData = {};
    const res = {
      status: function (code) {
        status = code;
        return this;
      },
      json: function (data) {
        responseData = data;
      },
    };

    // Create a Sinon stub for bcrypt.hash
    const bcryptStub = sinon.stub(bcrypt, 'hash');
    bcryptStub.resolves('hashedPassword'); // Configure the stub to resolve with a mock value

    try {
      await registerUser(req, res);

      // Assert that bcrypt.hash was called with the expected arguments
      sinon.assert.calledWith(bcryptStub, 'Password123!', 10);

      expect(status).to.equal(201);
      expect(responseData).to.deep.equal({
        message: 'User registered successfully',
      });
    } catch (error) {
      // Handle the error (by failing the test or logging the error)
      throw error;
    } finally {
      // Restore the stubbed method after the test
      bcryptStub.restore();
    }
  });

  const testMissingField = (fieldName) => {
    it(`Should fail when ${fieldName} is missing`, async () => {
      const req = {
        body: {
          username: 'testuser',
          email: 'testuser@gmail.com',
          password: 'Password123!',
          fullName: 'Test User',
          role: 'student',
          contactNumber: '12345678',
        },
      };
      delete req.body[fieldName]; // Remove the field to test

      let status = 0;
      let responseData = {};
      const res = {
        status: function (code) {
          status = code;
          return this;
        },
        json: function (data) {
          responseData = data;
        },
      };
      await registerUser(req, res);

      expect(status).to.equal(400);
      expect(responseData).to.deep.equal({
        message: 'All fields are required',
      });
    });
  };

  // Create a test for each required field
  [
    'username',
    'email',
    'password',
    'fullName',
    'role',
    'contactNumber',
  ].forEach((field) => {
    testMissingField(field);
  });

  it('Should fail when user already exists', async () => {
    const existingUser = orgContent[0];
    const req = {
      body: {
        username: existingUser.username,
        email: 'testuser@gmail.com',
        password: 'Password123!',
        fullName: 'Test User',
        role: 'student',
        contactNumber: '12345678',
      },
    };
    let status = 0;
    let responseData = {};
    const res = {
      status: function (code) {
        status = code;
        return this;
      },
      json: function (data) {
        responseData = data;
      },
    };
    await registerUser(req, res);

    expect(status).to.equal(400);
    expect(responseData).to.deep.equal({ message: 'User already exists' });
  });

  it('Should hash the password before storing', async () => {
    const req = {
      body: {
        username: 'testuser',
        email: 'testuser@gmail.com',
        password: 'Password123!',
        fullName: 'Test User',
        role: 'student',
        contactNumber: '12345678',
      },
    };

    let status = 0;
    const res = {
      status: function (code) {
        status = code;
        return this;
      },
      json: function () {},
    };

    try {
      await registerUser(req, res);
      const users = JSON.parse(await fs.readFile(usersFilePath, 'utf8'));
      const user = users.find((u) => u.username === req.body.username);

      expect(user).to.exist;
      expect(bcrypt.compareSync(req.body.password, user.passwordHash)).to.be
        .true;
    } catch (error) {
      // Handle the error (by failing the test or logging the error)
      throw error;
    }
  });

  it('Should handle errors and return a 500 status', async () => {
    // Mute console output temporarily
    const originalConsoleError = console.error;
    console.error = () => {}; // Replace console.error with an empty function

    // Create a stub that rejects to simulate an error in readJSON
    const readJSONStub = sinon.stub(fs, 'readFile');
    readJSONStub.rejects(new Error('Internal server error')); // Change the expected error message

    const req = {
      body: {
        username: 'testuser',
        email: 'testuser@gmail.com',
        password: 'Password123!',
        fullName: 'Test User',
        role: 'student',
        contactNumber: '12345678',
      },
    };

    let status = 0;
    let responseData = {};
    const res = {
      status: function (code) {
        status = code;
        return this;
      },
      json: function (data) {
        responseData = data;
      },
    };

    try {
      await registerUser(req, res);
      expect(status).to.equal(500);
      expect(responseData).to.deep.equal({ message: 'Internal server error' });
    } catch (error) {
      // Handle the error (by failing the test or logging the error)
      throw error;
    } finally {
      // Restore console.error to its original function
      console.error = originalConsoleError;
      // Restore the stubbed method after the test
      readJSONStub.restore();
    }
  });

  const testInvalidPassword = (password, expectedErrorMessage) => {
    it(`Should return 400 status with specific error message for invalid password: "${password}"`, async () => {
      const req = {
        body: {
          username: 'testuser',
          email: 'testuser@gmail.com',
          password,
          fullName: 'Test User',
          role: 'student',
          contactNumber: '12345678',
        },
      };

      let status = 0;
      let responseData = {};
      const res = {
        status: function (code) {
          status = code;
          return this;
        },
        json: function (data) {
          responseData = data;
        },
      };

      await registerUser(req, res);

      expect(status).to.equal(400);
      expect(responseData.message).to.include(expectedErrorMessage);
    });
  };

  // Include a test for each password validation rule
  testInvalidPassword(
    '1234567',
    'Password must be at least 8 characters long.'
  );
  testInvalidPassword(
    'abcdefgh',
    'Password must contain at least one uppercase letter.'
  );
  testInvalidPassword(
    'ABCDEFGH',
    'Password must contain at least one lowercase letter.'
  );
  testInvalidPassword('Abcdefgh', 'Password must contain at least one number.');
  testInvalidPassword(
    'Abc12345',
    'Password must contain at least one special character.'
  );
  testInvalidPassword(
    'Abc11111',
    'Password must not contain more than two identical characters in a row.'
  );
  testInvalidPassword(
    'testusertest',
    'Password must not contain the username.'
  );
  testInvalidPassword(
    'testuser@gmail.com',
    'Password must not contain part of the email address.'
  );
});
