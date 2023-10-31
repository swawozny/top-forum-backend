const request = require("supertest");
const {StatusCodes} = require("http-status-codes");
const {faker} = require("@faker-js/faker");
const {expect} = require("expect");
const bcrypt = require("bcrypt");

const server = require("../server");
const {User, Topic, Forum, Post} = require("../database/models");
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

const EXAMPLE_FORUM = {
    id: faker.number.int({min: 1, max: 10}),
    title: faker.lorem.word({length: {min: 10, max: 20}}),
    description: faker.lorem.sentence({min: 3, max: 5}),
    creatorId: EXAMPLE_USER.id
};

const EXAMPLE_SUBFORUM = {
    id: faker.number.int({min: 15, max: 30}),
    title: faker.lorem.word({length: {min: 10, max: 20}}),
    description: faker.lorem.sentence({min: 3, max: 5}),
    creatorId: EXAMPLE_USER.id,
    parentForumId: EXAMPLE_FORUM.id
};

const EXAMPLE_TOPIC = {
    title: faker.lorem.word({length: {min: 10, max: 20}}),
    authorId: EXAMPLE_USER.id,
    forumId: EXAMPLE_FORUM.id
};

const EXAMPLE_FIRST_POST = {
    content: faker.lorem.sentence({min: 10, max: 20}),
    authorId: EXAMPLE_USER.id
};

const EXAMPLE_SECOND_POST = {
    content: faker.lorem.sentence({min: 10, max: 20}),
    authorId: EXAMPLE_USER.id
};

const SALT_LENGTH = 12;

describe("Topic endpoints tests", () => {
    beforeAll(async () => {
        const hashedPassword = await bcrypt.hash(EXAMPLE_USER.password, SALT_LENGTH);
        const user = await User.create({...EXAMPLE_USER, password: hashedPassword});
        await user.save();

        const {email, id} = EXAMPLE_USER;

        AUTH_TOKEN = createToken({email, userId: id.toString()});

        const forum = await Forum.create({...EXAMPLE_FORUM});
        await forum.save();

        const subForum = await Forum.create({...EXAMPLE_SUBFORUM});
        await subForum.save();
    });

    describe("GET /topic", () => {
        it("should return topic with empty array of posts", async () => {
            const topic = await Topic.create({...EXAMPLE_TOPIC});
            await topic.save();

            const result = await request(server).get(`/topic/${topic.id}?page=1`);

            const {body, statusCode} = result;
            const {id, title, topicPosts} = body.topic;

            expect(statusCode).toEqual(StatusCodes.OK);
            expect(title).toEqual(topic.title);
            expect(id).toEqual(topic.id);
            expect(topicPosts).toHaveLength(0);
        });

        it("should return topic id is not correct error", async () => {
            const randomTopicId = faker.number.int({min: 1, max: 10});

            const result = await request(server).get(`/topic/${randomTopicId}?page=1`);

            const {body, statusCode} = result;

            expect(statusCode).toEqual(StatusCodes.NOT_FOUND);
            expect(body.message).toEqual("Topic id is not correct!");
        });

        it("should return validation error", async () => {
            const randomTopicId = faker.number.int({min: 1, max: 10});

            const result = await request(server).get(`/topic/${randomTopicId}`);

            const {body, statusCode} = result;

            expect(statusCode).toEqual(StatusCodes.BAD_REQUEST);
            expect(body.message).toEqual("Request data validation error!");
        });

        it("should return topic with two posts", async () => {
            const topic = await Topic.create({...EXAMPLE_TOPIC});
            await topic.save();

            const firstPost = await Post.create({...EXAMPLE_FIRST_POST, topicId: topic.id});
            await firstPost.save();

            const secondPost = await Post.create({...EXAMPLE_SECOND_POST, topicId: topic.id});
            await secondPost.save();

            const result = await request(server).get(`/topic/${topic.id}?page=1`);

            const {body, statusCode} = result;
            const {id, title, topicPosts} = body.topic;

            expect(statusCode).toEqual(StatusCodes.OK);
            expect(title).toEqual(topic.title);
            expect(id).toEqual(topic.id);
            expect(topicPosts).toHaveLength(2);
            expect(topicPosts.at(0).id).toEqual(firstPost.id);
            expect(topicPosts.at(0).content).toEqual(EXAMPLE_FIRST_POST.content);
            expect(topicPosts.at(1).id).toEqual(secondPost.id);
            expect(topicPosts.at(1).content).toEqual(EXAMPLE_SECOND_POST.content);
        });

        it("should return page number is greater than total pages error", async () => {
            const topic = await Topic.create({...EXAMPLE_TOPIC});
            await topic.save();

            const result = await request(server).get(`/topic/${topic.id}?page=10`);

            const {body, statusCode} = result;

            expect(statusCode).toEqual(StatusCodes.BAD_REQUEST);
            expect(body.message).toEqual("The page number is greater than total pages!");
        });

        afterEach(async () => {
            await Topic.truncate({cascade: true});
            await Post.truncate({cascade: true});
        });
    });

    describe("DELETE /topic", () => {
        it("should return topic id is not correct error", async () => {
            const randomTopicId = faker.number.int({min: 1, max: 10});

            const result = await request(server)
                .delete(`/topic/${randomTopicId}`)
                .set("Authorization", `Bearer ${AUTH_TOKEN}`);

            const {body, statusCode} = result;

            expect(statusCode).toEqual(StatusCodes.NOT_FOUND);
            expect(body.message).toEqual("Topic id is not correct!");
        });

        it("should delete topic", async () => {
            const topic = await Topic.create({...EXAMPLE_TOPIC});
            await topic.save();
            const topicId = topic.id;

            const result = await request(server)
                .delete(`/topic/${topicId}`)
                .set("Authorization", `Bearer ${AUTH_TOKEN}`);

            const topicAfterDelete = await Topic.findByPk(topicId);

            const {body, statusCode} = result;

            expect(topicAfterDelete).toEqual(null);
            expect(statusCode).toEqual(StatusCodes.OK);
            expect(body.message).toEqual("Topic deleted.");
        });
    });

    describe("PUT /topic", () => {
        it("should return validation error", async () => {
            const topic = await Topic.create({...EXAMPLE_TOPIC});
            await topic.save();

            const result = await request(server)
                .put(`/topic/${topic.id}`)
                .set("Authorization", `Bearer ${AUTH_TOKEN}`);

            const {body, statusCode} = result;

            expect(statusCode).toEqual(StatusCodes.BAD_REQUEST);
            expect(body.message).toEqual("Request data validation error!");
        });

        it("should update topic", async () => {
            const topic = await Topic.create({...EXAMPLE_TOPIC});
            await topic.save();

            const newTitle = faker.lorem.word({length: {min: 10, max: 20}});

            const result = await request(server)
                .put(`/topic/${topic.id}`)
                .send({title: newTitle})
                .set("Authorization", `Bearer ${AUTH_TOKEN}`);

            const updatedTopic = await Topic.findByPk(topic.id);

            const {body, statusCode} = result;

            expect(updatedTopic.title).toEqual(newTitle);
            expect(statusCode).toEqual(StatusCodes.OK);
            expect(body.message).toEqual("Topic updated.");
        });

        afterEach(async () => {
            await Topic.truncate({cascade: true});
        });
    });

    describe("POST /topic", () => {
        it("should not allow the creation of a topic in the main forum", async () => {
            const mainForum = await Forum.findByPk(EXAMPLE_FORUM.id);

            const result = await request(server)
                .post("/topic")
                .send({
                    title: EXAMPLE_TOPIC.title,
                    forumId: EXAMPLE_FORUM.id,
                    firstPostContent: faker.string.sample({min: 70, max: 300})
                })
                .set("Authorization", `Bearer ${AUTH_TOKEN}`);

            const {body, statusCode} = result;

            expect(mainForum.parentForumId).toEqual(null);
            expect(body.message).toEqual("Forum id is not correct!");
            expect(statusCode).toEqual(StatusCodes.BAD_REQUEST);
        });

        it("should throw validation error", async () => {
            const result = await request(server)
                .post("/topic")
                .send({
                    title: EXAMPLE_TOPIC.title,
                    forumId: EXAMPLE_SUBFORUM.id,
                    firstPostContent: faker.string.sample({min: 20, max: 30})
                })
                .set("Authorization", `Bearer ${AUTH_TOKEN}`);

            const {body, statusCode} = result;

            expect(statusCode).toEqual(StatusCodes.BAD_REQUEST);
            expect(body.message).toEqual("Request data validation error!");
        });

        it("should create new topic", async () => {
            const result = await request(server)
                .post("/topic")
                .send({
                    title: EXAMPLE_TOPIC.title,
                    forumId: EXAMPLE_SUBFORUM.id,
                    firstPostContent: faker.string.sample({min: 70, max: 300})
                })
                .set("Authorization", `Bearer ${AUTH_TOKEN}`);

            const {body, statusCode} = result;

            expect(statusCode).toEqual(StatusCodes.CREATED);
            expect(body.message).toEqual("Topic created!");
        });

        afterEach(async () => {
            await Topic.truncate({cascade: true});
        });
    });

    afterAll(async () => {
        await User.truncate({cascade: true});
        await Forum.truncate({cascade: true});
        server.close();
    });
});
