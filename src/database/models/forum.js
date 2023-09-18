'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Forum extends Model {
        static associate(models) {
            Forum.belongsTo(models.User, {
                foreignKey: 'creatorId',
                onDelete: 'CASCADE'
            });

            Forum.hasMany(models.Forum, {as: 'children', foreignKey: 'parentForumId'});
            Forum.belongsTo(models.Forum, {as: 'parent', foreignKey: 'parentForumId'});
            Forum.hasMany(models.Topic, {
                foreignKey: 'forumId',
            });
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
