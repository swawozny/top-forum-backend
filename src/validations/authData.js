const {body} = require('express-validator');

const authDataValidate = [
    body('email').optional().isEmail().withMessage('Provide valid email'),
    body('password')
        .exists()
        .withMessage('Password is required')
        .isString()
        .withMessage('Password should be string')
        .isLength({min: 5})
        .withMessage('Password should be at least 5 characters')
];

module.exports = {authDataValidate};
