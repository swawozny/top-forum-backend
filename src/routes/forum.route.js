const express = require('express');

const forumController = require("../controllers/forum.controller");
const {validateForumData} = require("../validations/forumData");
const {checkValidationErrors} = require("../validations/checkValidationErrors");

const router = express.Router();

router.get('/forums', forumController.getForums);

router.get('/forum/:id', forumController.getForum);

router.delete('/forum/:id', forumController.deleteForum);

router.post('/forum', validateForumData, checkValidationErrors, forumController.createForum);

router.put('/forum/:id', validateForumData, checkValidationErrors, forumController.updateForum);

module.exports = router;
