"use strict";
const {
    Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Forum extends Model {
        static associate(models) {
            Forum.belongsTo(models.User, {
                foreignKey: "creatorId",
                as: "forumCreator",
                onDelete: "CASCADE"
            });

            Forum.hasMany(models.Forum, {as: "subForums", foreignKey: "parentForumId"});
            Forum.belongsTo(models.Forum, {as: "parentForum", foreignKey: "parentForumId", onDelete: "CASCADE"});
            Forum.hasMany(models.Topic, {
                foreignKey: "forumId",
                as: "forumTopics"
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
        modelName: "Forum",
        timestamps: true
    });
    return Forum;
};
