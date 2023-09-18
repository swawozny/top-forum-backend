'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Forum extends Model {
        static associate(models) {
        }
    }

    Forum.init({
        title: DataTypes.STRING,
        description: DataTypes.STRING,
        creatorId: DataTypes.INTEGER,
        parentForumId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Forum',
        timestamps: true
    });
    return Forum;
};
