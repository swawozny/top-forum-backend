const {validateEmail, validatePassword} = require("./signUpData");

const validateLoginData = [
    validateEmail,
    validatePassword
];

module.exports = {validateLoginData};
