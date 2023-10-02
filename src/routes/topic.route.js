const express = require("express");

const topicController = require("../controllers/topic.controller");
const {validateTopicData} = require("../validations/topicData");
const {validateCreateTopicData} = require("../validations/createTopicData");
const {checkValidationErrors} = require("../validations/checkValidationErrors");
const isAuth = require("../middlewares/isAuth");

const router = express.Router();

router.get("/topic/:id", validateTopicData, checkValidationErrors, topicController.getTopic);

router.post("/topic", isAuth, ...validateCreateTopicData, checkValidationErrors, topicController.createTopic);

module.exports = router;
