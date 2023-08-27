const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class RolePermission extends Model {
        static associate(models) {
            models.Role.belongsToMany(models.Permission, {through: this});
            models.Permission.belongsToMany(models.Role, {through: this});
        }
    }

    RolePermission.init({}, {
        sequelize,
        modelName: 'RolePermission',
        tableName: 'rolePermissions'
    });


    return RolePermission;
};
