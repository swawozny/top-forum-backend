const {StatusCodes} = require("http-status-codes");

const ApiError = require("../errors/apiError");
const {decodeToken} = require("../services/jwt");

module.exports = (req, res, next) => {
    const authHeader = req.get("Authorization");

    if (!authHeader) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "No authorization header!");
    }

    const encodedToken = authHeader.split(" ").at(1);
    let decodedToken;

    try {
        decodedToken = decodeToken(encodedToken);
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        }
        next(error);
    }

    if (!decodedToken) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Auth token is invalid!");
    }

    req.userId = decodedToken.userId;
    next();
};
