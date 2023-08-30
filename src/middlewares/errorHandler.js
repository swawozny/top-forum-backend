const {StatusCodes} = require("http-status-codes");

exports.errorHandler = (error, req, res, next) => {
    const {
        statusCode,
        message,
        data
    } = error;

    res.status(statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
        message,
        data
    });
};
