const express = require('express');

const authController = require('../controllers/auth.controller');
const {validateSignUpData, validateEmail, validatePassword} = require("../validations/signUpData");
const {validateLoginData} = require("../validations/loginData");
const {validateConfirmEmailData} = require("../validations/confirmData");
const {validateResetPasswordData} = require("../validations/resetPasswordData");
const {checkValidationErrors} = require("../validations/checkValidationErrors");

const router = express.Router();

router.post('/signup', validateSignUpData, checkValidationErrors, authController.signUp);

router.post('/login', validateLoginData, checkValidationErrors, authController.login);

router.post('/confirm-email', validateConfirmEmailData, checkValidationErrors, authController.confirmEmail);

router.post('/try-reset-password', validateEmail, checkValidationErrors, authController.tryResetPassword);

router.post('/reset-password', validateResetPasswordData, checkValidationErrors, authController.resetPassword);

module.exports = router;
