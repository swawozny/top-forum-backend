'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Post extends Model {
        static associate(models) {
            Post.belongsTo(models.User, {
                foreignKey: 'authorId',
                onDelete: 'CASCADE'
            });

            Post.belongsTo(models.Topic, {
                foreignKey: 'topicId',
                onDelete: 'CASCADE'
            });
        }
    }

    Post.init({
        content: DataTypes.STRING,
        topicId: DataTypes.INTEGER,
        authorId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Post',
        timestamps: true
    });
    return Post;
};
