const express = require('express');

const forumController = require("../controllers/forum.controller");
const {validateForumData} = require("../validations/forumData");
const {checkValidationErrors} = require("../validations/checkValidationErrors");
const isAuth = require("../middlewares/isAuth");

const router = express.Router();

router.get('/forums', forumController.getForums);

router.get('/forum/:id', forumController.getForum);

router.delete('/forum/:id', isAuth, forumController.deleteForum);

router.post('/forum', validateForumData, checkValidationErrors, forumController.createForum);

router.put('/forum/:id', isAuth, ...validateForumData, checkValidationErrors, forumController.updateForum);

module.exports = router;
