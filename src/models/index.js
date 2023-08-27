const {DataTypes} = require("sequelize");

const sequelize = require('../config/database');

const User = require('../models/user')(sequelize, DataTypes);
const Role = require('../models/role')(sequelize, DataTypes);
const Permission = require('../models/permission')(sequelize, DataTypes);
const RolePermission = require('../models/rolePermission')(sequelize, DataTypes);

const models = {
    User,
    Role,
    Permission,
    RolePermission
};

Object.values(models)
    .filter(model => typeof model.associate === "function")
    .forEach(model => model.associate(models));

const db = {
    ...models,
    sequelize
};

module.exports = db;
