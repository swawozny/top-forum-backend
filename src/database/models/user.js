'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.belongsTo(models.Role, {
                foreignKey: {
                    name: 'roleId',
                    defaultValue: 1
                }
            });

            User.hasMany(models.Forum, {
                foreignKey: 'creatorId',
            });

            User.hasMany(models.Topic, {
                foreignKey: 'authorId',
            });

            User.hasMany(models.Post, {
                foreignKey: 'authorId',
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
