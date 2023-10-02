const express = require("express");

const topicController = require("../controllers/topic.controller");
const {validateTopicData} = require("../validations/topicData");
const {checkValidationErrors} = require("../validations/checkValidationErrors");

const router = express.Router();

router.get('/topic/:id', validateTopicData, checkValidationErrors, topicController.getTopic);

module.exports = router;
