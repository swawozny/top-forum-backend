const {body} = require('express-validator');

const validateEmail = body('email')
    .exists({checkFalsy: true})
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Provide valid email');

const validatePassword = body('password')
    .exists()
    .withMessage('Password is required')
    .isString()
    .withMessage('Password should be string')
    .isLength({min: 5})
    .withMessage('Password should be at least 5 characters');

const validateUsername = body('username')
    .exists({checkFalsy: true})
    .withMessage('User name is required')
    .isString()
    .withMessage('User name should be string');

const validateSignUpData = [
    validateEmail,
    validatePassword,
    validateUsername
];

module.exports = {
    validateEmail,
    validatePassword,
    validateUsername,
    validateSignUpData
};
