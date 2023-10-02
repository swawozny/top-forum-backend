const {body} = require("express-validator");

const validateForumId = body("forumId")
    .exists({checkFalsy: true})
    .withMessage("ForumId is required!")
    .isNumeric()
    .withMessage("ForumId must be numeric!");

const validateTitle = body("title")
    .exists()
    .withMessage("Forum title is required!")
    .isString()
    .withMessage("Forum title should be a string!")
    .isLength({min: 5, max: 50})
    .withMessage("Forum title should have min 5 and max 50 chars.");

const validateFirstPostContent = body("firstPostContent")
    .exists({checkFalsy: true})
    .withMessage("First post content is required!")
    .isString()
    .withMessage("First post content should be string")
    .isLength({min: 50, max: 500})
    .withMessage("First post content should have min 50 and max 500 chars.");

const validateCreateTopicData = [
    validateForumId,
    validateTitle,
    validateFirstPostContent
];

module.exports = {
    validateCreateTopicData
};
