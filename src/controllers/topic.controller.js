const {StatusCodes} = require("http-status-codes");

const {sequelize, Topic, Post, User, Role, Forum} = require("../database/models");
const ApiError = require("../errors/apiError");

const POSTS_PER_PAGE = 25;

exports.getTopic = async (req, res, next) => {
    try {
        const {id} = req.params;
        const {page} = req.query;

        if (page <= 0) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'The page number is not correct!');
        }

        const topicAttributes = ["title", "createdAt", "updatedAt"];
        const userAttributes = ["id", "username"]
        const postAttributes = ["id", "content", "createdAt", "updatedAt"];

        const topic = await Topic.findByPk(id, {
            include: {
                model: Post,
                include: {
                    model: User,
                    include: {
                        model: Role,
                        attributes: ["name"]
                    },
                    attributes: userAttributes
                },
                attributes: postAttributes,
                offset: POSTS_PER_PAGE * (page - 1),
                limit: POSTS_PER_PAGE,
                order: ["createdAt"]
            },
            attributes: topicAttributes
        });

        if (!topic) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Topic id is not correct!');
        }

        const totalPosts = await Post.count({where: {topicId: id}});
        const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

        if (page > totalPages) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'The page number is greater than total pages!');
        }

        return res.status(StatusCodes.OK).json({
            topic,
            page,
            totalPages
        });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        }
        next(error);
    }
};

exports.createTopic = async (req, res, next) => {
    try {
        await sequelize.transaction(async transaction => {
            const {title, firstPostContent, forumId} = req.body;
            const {userId} = req;

            const forum = await Forum.findByPk(forumId);

            if (!forum || forum.parentForumId === null) {
                throw new ApiError(StatusCodes.BAD_REQUEST, "Forum id is not correct!");
            }

            const topic = await Topic.create({
                title,
                authorId: userId,
                forumId
            }, {transaction});

            await Post.create({
                authorId: userId,
                topicId: topic.id,
                content: firstPostContent
            }, {transaction});

            return res.status(StatusCodes.CREATED).json({
                message: "Topic created!",
                topicId: topic.id.toString()
            });
        });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        }
        next(error);
    }
};
