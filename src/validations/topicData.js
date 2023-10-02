const {query, param} = require("express-validator");

const validatePage = query("page")
    .exists({checkFalsy: true})
    .withMessage("Page is required")
    .isNumeric()
    .withMessage("Page should be numeric!");

const validateId = param("id")
    .exists({checkFalsy: true})
    .withMessage("Topic id is required")
    .isNumeric()
    .withMessage("Topic id should be numeric!");

const validateTopicData = [
    validatePage,
    validateId
];

module.exports = {validateTopicData};
