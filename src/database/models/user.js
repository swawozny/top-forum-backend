'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            User.belongsTo(models.Role, {
                foreignKey: {
                    name: 'roleId',
                    defaultValue: 1
                }
            });
        }
    }

    User.init({
        username: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        roleId: DataTypes.INTEGER,
        isActive: DataTypes.BOOLEAN,
        activationCode: DataTypes.STRING,
        restoringCode: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'User',
        timestamps: true
    });
    return User;
};
