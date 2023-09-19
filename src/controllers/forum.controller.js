const {Forum} = require('../database/models');
const {StatusCodes} = require("http-status-codes");

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
