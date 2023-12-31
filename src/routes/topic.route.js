const express = require("express");

const topicController = require("../controllers/topic.controller");
const {validateTopicData, validateId} = require("../validations/topicData");
const {validateCreateTopicData, validateTitle} = require("../validations/createTopicData");
const {checkValidationErrors} = require("../validations/checkValidationErrors");
const isAuth = require("../middlewares/isAuth");

const router = express.Router();

router.get("/topic/:id", validateTopicData, checkValidationErrors, topicController.getTopic);

router.post("/topic", isAuth, ...validateCreateTopicData, checkValidationErrors, topicController.createTopic);

router.put("/topic/:id", isAuth, validateId, validateTitle, checkValidationErrors, topicController.updateTopic);

router.delete("/topic/:id", isAuth, validateId, checkValidationErrors, topicController.deleteTopic);

module.exports = router;
