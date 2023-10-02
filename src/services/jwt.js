const jwt = require("jsonwebtoken");

const {JWT_PRIVATE_KEY, JWT_EXPIRATION} = process.env;

exports.createToken = data => {
    return jwt.sign(data, JWT_PRIVATE_KEY, {
        expiresIn: JWT_EXPIRATION
    });
};

exports.decodeToken = token => {
    return jwt.verify(token, JWT_PRIVATE_KEY);
};
