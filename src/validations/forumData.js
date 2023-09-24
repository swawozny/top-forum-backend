const {body} = require('express-validator');

const validateCreatorId = body('creatorId')
    .exists({checkFalsy: true})
    .withMessage('CreatorId is required');

const validateTitle = body('title')
    .exists({checkFalsy: true})
    .withMessage('Title is required')
    .isString()
    .withMessage('Title should be string')
    .isLength({min: 5, max: 30})
    .withMessage('Title should have min 5 and max 30 characters.');

const validateDescription = body('description')
    .exists()
    .withMessage('Description is required')
    .isString()
    .withMessage('Description should be string')
    .isLength({min: 10, max: 200})
    .withMessage('Description should have min 10 and max 200 characters.');

const validateForumData = [
    validateCreatorId,
    validateTitle,
    validateDescription
];

module.exports = {validateForumData};
