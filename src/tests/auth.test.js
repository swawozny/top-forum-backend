const request = require("supertest");
const {expect} = require("expect");
const {StatusCodes} = require("http-status-codes");

const app = require("../server");
const {User} = require("../database/models");

const EXAMPLE_USER = {
    username: "test",
    email: "test@test.pl",
    password: "test1234",
    activationCode: "testActivationCode",
    restoringCode: "testRestoringCode",
    isActive: true
};

describe("Auth endpoints tests", () => {
    describe("POST /auth/signup", () => {
        it("should create new user", async () => {
            const result = await request(app).post("/auth/signup").send({
                email: EXAMPLE_USER.email,
                password: EXAMPLE_USER.password,
                username: EXAMPLE_USER.username
            });

            expect(result.statusCode).toEqual(StatusCodes.CREATED);
            expect(result.body.message).toEqual("User created.");
        });

        it("should throw validation error", async () => {
            const result = await request(app).post("/auth/signup").send({
                email: "test",
                password: EXAMPLE_USER.password,
                username: EXAMPLE_USER.username
            });
            expect(result.statusCode).toEqual(StatusCodes.BAD_REQUEST);
            expect(result.body.message).toEqual("Request data validation error!");
        });
    });

    afterEach(async () => {
        await User.truncate();
    });
});
