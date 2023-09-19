const express = require('express');

const forumController = require("../controllers/forum.controller");

const router = express.Router();

router.get('/forums', forumController.getForums);

module.exports = router;
