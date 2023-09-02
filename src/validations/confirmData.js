const {body} = require("express-validator");

const {validateEmail, validatePassword} = require("./signUpData");

const validateActivationCode = body('activationCode')
    .exists()
    .withMessage('Activation code is required')
    .isString()
    .withMessage('Activation code should be string');

const validateConfirmEmailData = [
    validateEmail,
    validateActivationCode
];

module.exports = {validateConfirmEmailData};
