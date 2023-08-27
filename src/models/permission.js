const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Permission extends Model {
    }

    Permission.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        sequelize,
        modelName: 'Permission',
        tableName: 'permissions'
    });


    return Permission;
};
