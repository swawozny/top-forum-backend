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
            .json(forums);
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

exports.createForum = async (req, res, next) => {
    try {
        const {creatorId, parentForumId, title, description} = req.body;

        const creator = await User.findByPk(creatorId);

        if (!creator) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Creator id is not correct!');
        }

        const parentForum = await Forum.findByPk(parentForumId);

        if (parentForumId !== null && !parentForum) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Parent forum id is not correct!');
        }

        const forum = await Forum.create({
            creatorId,
            parentForumId,
            title,
            description
        });

        if (!forum) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Forum cannot be created!');
        }

        await forum.save();

        return res.status(StatusCodes.CREATED).json({
            forumId: forum.id.toString(),
            message: 'Forum created.'
        });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        }
        next(error);
    }
};

exports.updateForum = async (req, res, next) => {
  try {
      const {id} = req.params;
      const {parentForumId, title, description} = req.body;

      const forum = await Forum.findByPk(id);

      if (!forum) {
          throw new ApiError(StatusCodes.NOT_FOUND, 'Forum id is not correct!');
      }

      const parentForum = await Forum.findByPk(parentForumId);

      if (parentForumId !== null && !parentForum) {
          throw new ApiError(StatusCodes.NOT_FOUND, 'New parent forum id is not correct!');
      }

      await forum.update({
          parentForumId,
          title,
          description
      });

      await forum.save();

      return res.status(StatusCodes.OK).json({
          forumId: id,
          message: 'Forum updated.'
      });

  } catch (error) {
      if (!error.statusCode) {
          error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      }
      next(error);
  }
};
