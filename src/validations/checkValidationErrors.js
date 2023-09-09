const {validationResult} = require("express-validator");
const ApiError = require("../errors/apiError");
const {StatusCodes} = require("http-status-codes");

const checkValidationErrors = (req, res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Request data validation error!', validationErrors.array());
    }

    next();
};

module.exports = {checkValidationErrors};
