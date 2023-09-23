const {StatusCodes} = require("http-status-codes");

const {Forum, Topic, User} = require("../database/models");
const ApiError = require("../errors/apiError");

exports.getForums = async (req, res, next) => {
    try {
        const attributes = ['id', 'title', 'description'];

        const forums = await Forum
            .findAll({
                where: {parentForumId: null},
                include: {
                    model: Forum,
                    as: 'children',
                    attributes
                },
                attributes
            });

        return res
            .status(StatusCodes.OK)
            .json({forums});
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        }
        next(error);
    }
};

exports.deleteForum = async (req, res, next) => {
    try {
        const {id} = req.params;

        const forum = await Forum.findByPk(id);

        if (!forum) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Forum id is not correct!');
        }

        await forum.destroy();

        return res.status(StatusCodes.OK).json({message: 'Forum deleted.'})

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        }
        next(error);
    }
};

exports.getForum = async (req, res, next) => {
    try {
        const {id} = req.params;

        const forumAttributes = ['id', 'title', 'description'];
        const topicAttributes = ['id', 'title', 'createdAt'];
        const userAttributes = ['username'];

        const forum = await Forum.findByPk(id,
            {
                include: [
                    {
                        model: Forum,
                        as: 'children',
                        attributes: forumAttributes
                    },
                    {
                        model: Topic,
                        attributes: topicAttributes,
                        include: {
                            model: User,
                            attributes: userAttributes
                        }
                    }],
                attributes: forumAttributes
            });

        if (!forum) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Forum id is not correct!');
        }

        return res
            .status(StatusCodes.OK)
            .json(forum);

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        }
        next(error);
    }
};
