const express = require('express');

const authController = require('../controllers/auth');
const {userDataValidate} = require("../validations/user");

const router = express.Router();

router.post('/signup', userDataValidate, authController.signUp);

module.exports = router;
