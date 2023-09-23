const express = require('express');

const forumController = require("../controllers/forum.controller");

const router = express.Router();

router.get('/forums', forumController.getForums);

router.delete('/forum/:id', forumController.deleteForum);

module.exports = router;
