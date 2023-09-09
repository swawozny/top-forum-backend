const request = require("supertest");
const {expect} = require("expect");
const {StatusCodes} = require("http-status-codes");

const app = require("../server");
const {User} = require("../database/models");
const bcrypt = require("bcrypt");

const EXAMPLE_USER = {
    username: "test",
    email: "test@test.pl",
    password: "test1234",
    activationCode: "testActivationCode",
    restoringCode: "testRestoringCode",
    isActive: true
};

const SALT_LENGTH = 12;
describe("Auth endpoints tests", () => {
    describe("POST /auth/signup", () => {
        it("should create new user", async () => {
            const result = await request(app)
                .post("/auth/signup")
                .send({
                    email: EXAMPLE_USER.email,
                    password: EXAMPLE_USER.password,
                    username: EXAMPLE_USER.username
            });

            expect(result.statusCode).toEqual(StatusCodes.CREATED);
            expect(result.body.message).toEqual("User created.");
        });

        it("should throw validation error", async () => {
            const result = await request(app)
                .post("/auth/signup")
                .send({
                    email: "test",
                    password: EXAMPLE_USER.password,
                    username: EXAMPLE_USER.username
                });

            expect(result.statusCode).toEqual(StatusCodes.BAD_REQUEST);
            expect(result.body.message).toEqual("Request data validation error!");
        });
    });

    describe("POST /auth/login", () => {
        it("should return auth token", async () => {
            const hashedPassword = await bcrypt.hash(EXAMPLE_USER.password, SALT_LENGTH);

            const user = await User
                .create({...EXAMPLE_USER, password: hashedPassword});

            await user.save();

            const loginResult = await request(app)
                .post("/auth/login")
                .send({
                    email: EXAMPLE_USER.email,
                    password: EXAMPLE_USER.password
                });

            expect(loginResult.statusCode).toEqual(StatusCodes.OK);
            expect(loginResult.body).toHaveProperty("token");
        });

        it("should throw password incorrect error ", async () => {
            const user = await User.create(EXAMPLE_USER);

            await user.save();

            const loginResult = await request(app)
                .post("/auth/login")
                .send({
                    email: EXAMPLE_USER.email,
                    password: EXAMPLE_USER.password
                });

            expect(loginResult.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
            expect(loginResult.body.message).toEqual("User password is not correct!");
        });
    });

    describe("POST /auth/confirm-email", () => {
        it("should confirm user email", async () => {
            const hashedActivationCode = await bcrypt.hash(EXAMPLE_USER.activationCode, SALT_LENGTH);

            const user = await User.create({
                ...EXAMPLE_USER,
                isActive: false,
                activationCode: hashedActivationCode
            });

            await user.save();

            const result = await request(app)
                .post("/auth/confirm-email")
                .send({
                    email: EXAMPLE_USER.email,
                    activationCode: EXAMPLE_USER.activationCode
            });


            expect(result.statusCode).toEqual(StatusCodes.OK);
            expect(result.body.message).toEqual("User email confirmed.");
        });

        it("should return message that email has been already confirmed", async () => {
            const hashedActivationCode = await bcrypt.hash(EXAMPLE_USER.activationCode, SALT_LENGTH);

            const user = await User.create({
                ...EXAMPLE_USER,
                activationCode: hashedActivationCode
            });

            await user.save();

            const result = await request(app)
                .post("/auth/confirm-email")
                .send({
                    email: EXAMPLE_USER.email,
                    activationCode: EXAMPLE_USER.activationCode
            });


            expect(result.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
            expect(result.body.message).toEqual("User email has already been confirmed!");
        });

        it("should return message that activationCode is not correct", async () => {
            const hashedActivationCode = await bcrypt.hash(EXAMPLE_USER.activationCode, SALT_LENGTH);

            const user = await User.create({
                ...EXAMPLE_USER,
                isActive: false,
                activationCode: hashedActivationCode
            });

            await user.save();

            const result = await request(app)
                .post("/auth/confirm-email")
                .send({
                    email: EXAMPLE_USER.email,
                    activationCode: "incorrectActivationCode"
            });

            expect(result.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
            expect(result.body.message).toEqual("Activation code is not correct!");
        });

    });

    describe("POST /auth/try-reset-password", () => {
        it("should send email with restoring link", async () => {
            const hashedActivationCode = await bcrypt.hash(EXAMPLE_USER.activationCode, SALT_LENGTH);

            const user = await User.create({
                ...EXAMPLE_USER,
                isActive: false,
                activationCode: hashedActivationCode
            });

            await user.save();

            const result = await request(app)
                .post("/auth/try-reset-password")
                .send({
                    email: EXAMPLE_USER.email,
                });


            expect(result.statusCode).toEqual(StatusCodes.OK);
            expect(result.body.message).toEqual("A password reset link was sent to email.");
        });
    });

    describe("POST /auth/reset-password", () => {
        it("should return message that password has been successfully reseted", async () => {
            const hashedRestoringCode = await bcrypt.hash(EXAMPLE_USER.restoringCode, SALT_LENGTH);
            const hashedActivationCode = await bcrypt.hash(EXAMPLE_USER.activationCode, SALT_LENGTH);

            const user = await User.create({
                ...EXAMPLE_USER,
                activationCode: hashedActivationCode,
                restoringCode: hashedRestoringCode
            });

            await user.save();

            const newPassword = "newTestPassword";

            const result = await request(app)
                .post(`/auth/reset-password?uid=${user.id.toString()}&restoringCode=${EXAMPLE_USER.restoringCode}`)
                .send({
                    password: newPassword
                });

            expect(result.statusCode).toEqual(StatusCodes.OK);
            expect(result.body.message).toEqual("Password has been successfully reseted.");
        });

        it("should return message that restoringCode is not correct", async () => {

            const hashedActivationCode = await bcrypt.hash(EXAMPLE_USER.activationCode, SALT_LENGTH);

            const user = await User.create({
                ...EXAMPLE_USER,
                activationCode: hashedActivationCode
            });

            await user.save();
            const newPassword = "newTestPassword";

            const result = await request(app)
                .post(`/auth/reset-password?uid=${user.id.toString()}&restoringCode=${EXAMPLE_USER.restoringCode}`)
                .send({
                    password: newPassword
                });

            expect(result.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
            expect(result.body.message).toEqual("Restoring code is not correct!");
        });
    });

    afterEach(async () => {
        await User.truncate();
    });
});
