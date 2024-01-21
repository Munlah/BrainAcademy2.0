const { describe, it } = require("mocha");
const { expect } = require("chai");
const sinon = require("sinon");
const { getUser } = require("../utils/UserUtil");
const { admin } = require("../firebaseAdmin.js");

let getStub;

describe("Testing Get User Function", () => {
  beforeEach(() => {
    getStub = sinon
      .stub(admin.firestore().collection("users"), "get")
      .callsFake(async () => {
        return {
          docs: users.map((user) => ({
            id: user.id,
            data: () => user,
          })),
        };
      });
  });

  afterEach(() => {
    getStub.restore();
  });

  it("Should successfully find and return a user", async () => {
    const req = { params: { username: "jennieeain2" } };
    const res = {
      status: function (code) {
        expect(code).to.equal(200);
        return this;
      },
      json: function (data) {
        expect(data.username).to.equal("jennieeain2");
      },
    };
    await getUser(req, res);
  });

  it("Should return 404 when user is not found", async () => {
    const req = { params: { username: "nonexistentuser" } };
    const res = {
      status: function (code) {
        expect(code).to.equal(404);
        return this;
      },
      json: function (data) {
        expect(data.message).to.equal("User not found");
      },
    };
    await getUser(req, res);
  });

  it("Should return 500 for a server error", async () => {
    const req = { params: { username: "testuser" } };
    const res = {
      status: function (code) {
        expect(code).to.equal(500);
        return this;
      },
      json: function (data) {
        expect(data.message).to.equal("Internal server error");
      },
    };

    const getUserStub = sinon
      .stub(require("../utils/UserUtil"), "getUser")
      .throws(new Error("Internal server error"));

    await getUser(req, res);

    getUserStub.restore();
  });
});
