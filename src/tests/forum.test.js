const request = require("supertest");
const bcrypt = require("bcrypt");
const {expect} = require("expect");
const {StatusCodes} = require("http-status-codes");
const {faker} = require("@faker-js/faker");

const server = require("../server");
const {Forum, User} = require("../database/models");

const EXAMPLE_USER = {
    id: faker.number.int({min: 1, max: 10}),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password({length: 10}),
    activationCode: faker.string.sample({min: 5, max: 10}),
    restoringCode: faker.string.sample({min: 5, max: 10}),
    isActive: true
};

const EXAMPLE_FIRST_FORUM = {
    title: faker.lorem.word({length: {min: 10, max: 20}}),
    description: faker.lorem.sentence({min: 3, max: 5}),
    creatorId: EXAMPLE_USER.id
};


const EXAMPLE_SECOND_FORUM = {
    title: faker.lorem.word({length: {min: 10, max: 20}}),
    description: faker.lorem.sentence({min: 3, max: 5}),
    creatorId: EXAMPLE_USER.id
};

const SALT_LENGTH = 12;

describe("Forum endpoints tests", () => {
    describe("GET /forums", () => {
        beforeAll(async () => {
            const hashedPassword = await bcrypt.hash(EXAMPLE_USER.password, SALT_LENGTH);

            const user = await User
                .create({...EXAMPLE_USER, password: hashedPassword});

            await user.save();
        });

        it("should return empty array", async () => {
            const result = await request(server).get("/forums");

            const {body, statusCode} = result;

            expect(statusCode).toEqual(StatusCodes.OK);
            expect(body.forums).toHaveLength(0);
        });

        it("should return array with two main forums", async () => {
            const firstForum = await Forum.create(EXAMPLE_FIRST_FORUM);

            await firstForum.save();

            const secondForum = await Forum.create(EXAMPLE_SECOND_FORUM);

            await secondForum.save();

            const result = await request(server).get("/forums");

            const {statusCode, body} = result;
            const {forums} = body;

            expect(statusCode).toEqual(StatusCodes.OK);
            expect(forums).toHaveLength(2);
            expect(forums.at(0).title).toEqual(EXAMPLE_SECOND_FORUM.title);
            expect(forums.at(0).description).toEqual(EXAMPLE_SECOND_FORUM.description);
            expect(forums.at(1).title).toEqual(EXAMPLE_FIRST_FORUM.title);
            expect(forums.at(1).description).toEqual(EXAMPLE_FIRST_FORUM.description);
        });

        it("should return array with forum and subForum", async () => {
            const forum = await Forum.create(EXAMPLE_FIRST_FORUM);


            await forum.save();

            const subForum = await Forum.create({
                ...EXAMPLE_SECOND_FORUM,
                parentForumId: forum.id.toString()
            });

            await subForum.save();

            const result = await request(server).get("/forums");

            const {statusCode, body} = result;
            const {forums} = body;
            const {title, description, children} = forums.at(0);

            expect(statusCode).toEqual(StatusCodes.OK);
            expect(forums).toHaveLength(1);
            expect(title).toEqual(EXAMPLE_FIRST_FORUM.title);
            expect(description).toEqual(EXAMPLE_FIRST_FORUM.description);
            expect(children).toHaveLength(1);
            expect(children.at(0).title).toEqual(EXAMPLE_SECOND_FORUM.title);
            expect(children.at(0).description).toEqual(EXAMPLE_SECOND_FORUM.description);
        });

        afterEach(async () => {
            await Forum.truncate({cascade: true})
        });

        afterAll(async () => {
            await User.truncate({cascade: true});
            server.close();
        });
    });
});