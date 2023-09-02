const express = require('express');

const authController = require('../controllers/auth');
const {validateSignUpData, validateEmail, validatePassword} = require("../validations/signUpData");
const {validateLoginData} = require("../validations/loginData");
const {validateConfirmEmailData} = require("../validations/confirmData");
const {validateResetPasswordData} = require("../validations/resetPasswordData");

const router = express.Router();

router.post('/signup', validateSignUpData, authController.signUp);

router.post('/login', validateLoginData, authController.login);

router.post('/confirm-email', validateConfirmEmailData, authController.confirmEmail);

router.post('/try-reset-password', validateEmail, authController.tryResetPassword);

router.post('/reset-password', validateResetPasswordData, authController.resetPassword);

module.exports = router;
