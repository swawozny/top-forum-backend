const checkUserPermission = require("./checkPermission");

module.exports = async (creatorId, userId, permission) => {
    if (creatorId != userId) {
        await checkUserPermission(userId, permission);
    }
};
