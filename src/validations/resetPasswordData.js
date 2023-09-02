const {query} = require("express-validator");

const {validatePassword} = require("./signUpData");

const validateUserId = query('uid')
    .exists()
    .withMessage('User id is required');

const validateRestoringCode = query('restoringCode')
    .exists()
    .withMessage('Restoring code is required');

const validateResetPasswordData = [
    validatePassword,
    validateUserId,
    validateRestoringCode
];

module.exports = {validateResetPasswordData};
