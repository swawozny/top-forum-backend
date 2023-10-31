const request = require("supertest");
const bcrypt = require("bcrypt");
const {expect} = require("expect");
const {StatusCodes} = require("http-status-codes");
const {faker} = require("@faker-js/faker");

const server = require("../server");
const {Forum, User, Topic} = require("../database/models");
const {createToken} = require("../services/jwt");

let AUTH_TOKEN;

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

const EXAMPLE_TOPIC = {
    title: faker.lorem.word({length: {min: 10, max: 20}}),
    authorId: EXAMPLE_USER.id,
    forumId: EXAMPLE_USER.id
};

const SALT_LENGTH = 12;

describe("Forum endpoints tests", () => {
    beforeAll(async () => {
        const hashedPassword = await bcrypt.hash(EXAMPLE_USER.password, SALT_LENGTH);

        const user = await User
            .create({...EXAMPLE_USER, password: hashedPassword});

        await user.save();

        const {email, id} = EXAMPLE_USER;

        AUTH_TOKEN = createToken({email, userId: id.toString()});
    });
    describe("GET /forums", () => {

        it("should return empty array", async () => {
            const result = await request(server).get("/forums");

            const {body, statusCode} = result;

            expect(statusCode).toEqual(StatusCodes.OK);
            expect(body).toHaveLength(0);
        });

        it("should return array with two main forums", async () => {
            const firstForum = await Forum.create(EXAMPLE_FIRST_FORUM);

            await firstForum.save();

            const secondForum = await Forum.create(EXAMPLE_SECOND_FORUM);

            await secondForum.save();

            const result = await request(server).get("/forums");

            const {statusCode, body} = result;
            const forums = body;

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
            const forums = body;
            const {title, description, subForums} = forums.at(0);

            expect(statusCode).toEqual(StatusCodes.OK);
            expect(forums).toHaveLength(1);
            expect(title).toEqual(EXAMPLE_FIRST_FORUM.title);
            expect(description).toEqual(EXAMPLE_FIRST_FORUM.description);
            expect(subForums).toHaveLength(1);
            expect(subForums.at(0).title).toEqual(EXAMPLE_SECOND_FORUM.title);
            expect(subForums.at(0).description).toEqual(EXAMPLE_SECOND_FORUM.description);
        });
        afterEach(async () => {
            await Forum.truncate({cascade: true})
        });
    });

    describe("POST /forum", () => {
        it("should create new forum", async () => {
            const result = await request(server)
                .post("/forum")
                .send({
                    ...EXAMPLE_FIRST_FORUM,
                    parentForumId: null
                });

            expect(result.statusCode).toEqual(StatusCodes.CREATED);
            expect(result.body.message).toEqual("Forum created.");
        });

        it("should throw validation error", async () => {
            const result = await request(server)
                .post("/forum")
                .send({
                    ...EXAMPLE_FIRST_FORUM,
                    title: faker.lorem.word({length: 3}),
                    parentForumId: null
                });

            expect(result.statusCode).toEqual(StatusCodes.BAD_REQUEST);
            expect(result.body.message).toEqual("Request data validation error!");
        });

        it("should throw error parent forum id is not correct", async () => {
            const result = await request(server)
                .post("/forum")
                .send({
                    ...EXAMPLE_FIRST_FORUM,
                    parentForumId: 4
                });

            expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
            expect(result.body.message).toEqual("Parent forum id is not correct!");
        });
        afterEach(async () => {
            await Forum.truncate({cascade: true})
        });
    });

    describe("DELETE /forum/:id", () => {
        it("should delete forum", async () => {
            const forum = await Forum.create(EXAMPLE_FIRST_FORUM);

            await forum.save();

            const forumId = forum.id.toString();

            const result = await request(server)
                .delete(`/forum/${forumId}`)
                .set("Authorization", `Bearer ${AUTH_TOKEN}`);

            const deletedForum = await Forum.findByPk(forumId);

            expect(result.statusCode).toEqual(StatusCodes.OK);
            expect(result.body.message).toEqual("Forum deleted.");
            expect(deletedForum).toEqual(null);

        });

        it("should throw error that forum id is not correct", async () => {
            const randomForumId = faker.number.int({min: 1, max: 10});
            const result = await request(server)
                .delete(`/forum/${randomForumId}`)
                .set("Authorization", `Bearer ${AUTH_TOKEN}`);

            expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
            expect(result.body.message).toEqual("Forum id is not correct!");
        });

        afterEach(async () => {
            await Forum.truncate({cascade: true})
        });
    });

    describe("GET /forum/:id", () => {
        it("should return forum with one subforum", async () => {
            const firstForum = await Forum.create(EXAMPLE_FIRST_FORUM);

            await firstForum.save();

            const secondForum = await Forum.create({
                ...EXAMPLE_SECOND_FORUM,
                parentForumId: firstForum.id
            });

            await secondForum.save();

            const result = await request(server).get(`/forum/${firstForum.id.toString()}`);

            const {body, statusCode} = result;

            expect(statusCode).toEqual(StatusCodes.OK);
            expect(body.id).toEqual(firstForum.id);
            expect(body.title).toEqual(firstForum.title);
            expect(body.description).toEqual(firstForum.description);

            expect(body.subForums.at(0).id).toEqual(secondForum.id);
            expect(body.subForums.at(0).title).toEqual(secondForum.title);
            expect(body.subForums.at(0).description).toEqual(secondForum.description);
        });

        it("should return forum with one topic", async () => {
            const forum = await Forum.create(EXAMPLE_FIRST_FORUM);

            await forum.save();

            const topic = await Topic.create({
                ...EXAMPLE_TOPIC,
                forumId: forum.id
            });

            await topic.save();

            const result = await request(server).get(`/forum/${forum.id.toString()}`);

            const {body, statusCode} = result;

            expect(statusCode).toEqual(StatusCodes.OK);
            expect(body.id).toEqual(forum.id);
            expect(body.title).toEqual(forum.title);
            expect(body.description).toEqual(forum.description);

            expect(body.forumTopics.at(0).id).toEqual(topic.id);
            expect(body.forumTopics.at(0).title).toEqual(topic.title);
            expect(body.forumTopics.at(0).description).toEqual(topic.description);
        });

        it("should throw error that forum id is not correct", async () => {
            const randomForumId = faker.number.int({min: 1, max: 10});
            const result = await request(server).get(`/forum/${randomForumId}`);

            expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
            expect(result.body.message).toEqual("Forum id is not correct!");
        });

        afterEach(async () => {
            await Forum.truncate({cascade: true})
        });
    });

    describe("PUT /forum/:id", () => {
        it("should update forum", async () => {
            const forum = await Forum.create(EXAMPLE_FIRST_FORUM);

            await forum.save();

            const {id, parentForumId, creatorId} = forum;

            const result = await request(server)
                .put(`/forum/${id}`)
                .send({
                    ...EXAMPLE_SECOND_FORUM,
                    parentForumId,
                    creatorId
                })
                .set("Authorization", `Bearer ${AUTH_TOKEN}`);

            const updatedForum = await Forum.findByPk(id.toString());

            expect(result.statusCode).toEqual(StatusCodes.OK);
            expect(result.body.message).toEqual("Forum updated.");
            expect(result.body.forumId).toEqual(id.toString());
            expect(updatedForum.title).toEqual(EXAMPLE_SECOND_FORUM.title);
            expect(updatedForum.description).toEqual(EXAMPLE_SECOND_FORUM.description);
        });

        it("should throw validation error", async () => {
            const forum = await Forum.create(EXAMPLE_FIRST_FORUM);

            await forum.save();

            const {id, parentForumId, creatorId} = forum;

            const result = await request(server)
                .put(`/forum/${id}`)
                .send({
                    ...EXAMPLE_SECOND_FORUM,
                    title: faker.word.sample({length: 3}),
                    parentForumId,
                    creatorId
                })
                .set("Authorization", `Bearer ${AUTH_TOKEN}`);

            expect(result.statusCode).toEqual(StatusCodes.BAD_REQUEST);
            expect(result.body.message).toEqual("Request data validation error!");
        });

        it("should throw error that forum id is not correct", async () => {
            const randomForumId = faker.number.int({min: 1, max: 10});

            const result = await request(server)
                .put(`/forum/${randomForumId}`)
                .send({
                    ...EXAMPLE_SECOND_FORUM,
                    parentForumId: null
                })
                .set("Authorization", `Bearer ${AUTH_TOKEN}`);

            expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
            expect(result.body.message).toEqual("Forum id is not correct!");
        });

        afterEach(async () => {
            await Forum.truncate({cascade: true})
        });
    });

    afterAll(async () => {
        await User.truncate({cascade: true});
        server.close();
    });
});