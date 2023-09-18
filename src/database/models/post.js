'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Post extends Model {
        static associate(models) {
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