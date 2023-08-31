const express = require('express');

const authController = require('../controllers/auth');
const {signUpDataValidate} = require("../validations/signUpData");
const {authDataValidate} = require("../validations/authData");

const router = express.Router();

router.post('/signup', signUpDataValidate, authController.signUp);

router.post('/login', authDataValidate, authController.login);

router.post('/confirm-email', authController.confirmEmail);

module.exports = router;
