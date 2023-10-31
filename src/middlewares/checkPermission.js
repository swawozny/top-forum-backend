const {StatusCodes} = require("http-status-codes");

const {User, Permission, Role} = require("../database/models");
const ApiError = require("../errors/apiError");

module.exports = async (userId, permissionToCheck) => {
    const user = await User.findByPk(userId, {
        include: {
            model: Role,
            as: "userRole"
        }
    });

    if (!user) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "User invalid!");
    }

    const attributes = ["name"];
    const {rolePermissions} = await Role.findOne({
        where: {
            id: user.roleId,
        },
        attributes,
        include: {
            model: Permission,
            as: "rolePermissions",
            attributes
        },
    });

    const isAuthorized = rolePermissions.some(permission => permission.name === permissionToCheck);

    if (!isAuthorized) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "User does not have right permissions!");
    }
};
