const { describe, it, beforeEach, afterEach } = require("mocha");
const { expect } = require("chai");
const sinon = require("sinon");
const bcrypt = require("bcrypt");
const { registerUser } = require("../utils/UserUtil");
const { admin } = require("../firebaseAdmin.js");
const proxyquire = require("proxyquire");

let getStub, addStub, hashStub;

// Mock for admin to simulate internal server error
const adminMockInternalError = {
  firestore: () => ({
    collection: () => ({
      add: sinon.stub().throws(new Error("Internal Server Error")),
    }),
  }),
};

const { registerUser: registerUserInternalError } = proxyquire(
  "../utils/UserUtil.js",
  { "../firebaseAdmin.js": { admin: adminMockInternalError } }
);

describe("Testing Register User Function", () => {
  let req;

  beforeEach(() => {
    // Stub Firestore's get method to simulate reading users
    getStub = sinon
      .stub(admin.firestore().collection("users"), "get")
      .callsFake(async () => {
        return {
          docs: [], // Return an empty array to simulate no existing user
        };
      });

    // Stub Firestore's add method to simulate adding a new user
    addStub = sinon
      .stub(admin.firestore().collection("users"), "add")
      .callsFake(async () => {
        return { id: "newUserId" }; // Return a fake user ID
      });

    // Stub bcrypt's hash method to simulate password hashing
    hashStub = sinon.stub(bcrypt, "hash").resolves("hashedPassword");
  });

  afterEach(async () => {
    getStub.restore();
    addStub.restore();
    hashStub.restore();

    if (req.body.username) {
      const usersCollection = admin.firestore().collection("users");
      const snapshot = await usersCollection.where('username', '==', req.body.username).get();
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        await usersCollection.doc(doc.id).delete();
      }
    }
  });

  it("Should register a user successfully", async () => {
    req = {
      body: {
        username: "newuser",
        email: "newuser@gmail.com",
        password: "ValidPass123!",
        fullName: "New User",
        role: "student",
        contactNumber: "12345678",
      },
    };
    const res = {
      status: function (code) {
        expect(code).to.equal(201);
        return this;
      },
      json: function (data) {
        expect(data.message).to.equal("User registered successfully");
        expect(data.userId).to.be.a("string");
      },
    };
    await registerUser(req, res);
  });

  const testMissingField = (fieldName) => {
    it(`Should fail when ${fieldName} is missing`, async () => {
      req = {
        body: {
          username: "newuser",
          email: "newuser@gmail.com",
          password: "ValidPass123!",
          fullName: "New User",
          role: "student",
          contactNumber: "12345678",
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
        message: "All fields are required",
      });
    });
  };

  // Create a test for each required field
  [
    "username",
    "email",
    "password",
    "fullName",
    "role",
    "contactNumber",
  ].forEach((field) => {
    testMissingField(field);
  });

  it("Should fail when user already exists", async () => {
    const existingUser = {
      username: "ForTesting",
      email: "ForTesting@gmail.com",
      password: "Ilovefood123@",
      fullName: "Test1112",
      role: "student",
      contactNumber: "12345678"
    };

    req = {
      body: {
        username: existingUser.username,
        email: "anotheruser@gmail.com",
        password: "Password123!",
        fullName: "Another User",
        role: "student",
        contactNumber: "12345678",
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
    expect(responseData).to.deep.equal({ message: "User already exists" });
  });

  it("Should hash the password before storing", async () => {
    req = {
      body: {
        username: "hashpwduser",
        email: "hashpwduser@gmail.com",
        password: "ValidPass123!",
        fullName: "Hash User",
        role: "student",
        contactNumber: "12345678",
      },
    };
    const res = {
      status: function (code) {
        expect(code).to.equal(201);
        return this;
      },
      json: function (data) {
        expect(data.message).to.equal("User registered successfully");
        expect(data.userId).to.be.a("string");
      },
    };

    await registerUser(req, res);

    // Check if the bcrypt hash method was called with the correct password
    expect(hashStub.calledWith("ValidPass123!")).to.be.true;
  });

  const testInvalidPassword = (password, expectedErrorMessage) => {
    it(`Should return 400 status with specific error message for invalid password: "${password}"`, async () => {
      req = {
        body: {
          username: "invaliduser",
          email: "invaliduser@gmail.com",
          password,
          fullName: "Invalid User",
          role: "student",
          contactNumber: "12345678",
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
      } catch (error) {
        // Handle cases where registerUser throws an error
      }

      expect(status).to.equal(400);
      expect(responseData.message).to.include(expectedErrorMessage);
    });
  };

  // Include a test for each password validation rule
  testInvalidPassword(
    "1234567",
    "Password must be at least 8 characters long."
  );
  testInvalidPassword(
    "abcdefgh",
    "Password must contain at least one uppercase letter."
  );
  testInvalidPassword(
    "ABCDEFGH",
    "Password must contain at least one lowercase letter."
  );
  testInvalidPassword("Abcdefgh", "Password must contain at least one number.");
  testInvalidPassword(
    "Abc12345",
    "Password must contain at least one special character."
  );
  testInvalidPassword(
    "Abc11111",
    "Password must not contain more than two identical characters in a row."
  );
  testInvalidPassword(
    "invalidusertest",
    "Password must not contain the username."
  );
  testInvalidPassword(
    "invaliduser@gmail.com",
    "Password must not contain part of the email address."
  );

  it("Should handle internal server error during user registration", async () => {
    const newUser = {
      username: "erroruser",
      email: "erroruser@gmail.com",
      password: "ValidPass123!",
      fullName: "Error User",
      role: "student",
      contactNumber: "12345678",
    };

    const req = { body: newUser };
    const res = {
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.data = data;
      },
    };

    await registerUserInternalError(req, res);

    expect(res.statusCode).to.equal(500);
    expect(res.data.message).to.equal("Internal server error");
  });
});