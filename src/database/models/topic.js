'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Topic extends Model {
    static associate(models) {
      Topic.belongsTo(models.User, {
        foreignKey: 'authorId',
        onDelete: 'CASCADE'
      });

      Topic.belongsTo(models.Forum, {
        foreignKey: 'forumId',
        onDelete: 'CASCADE'
      });
    }
  }
  Topic.init({
    title: DataTypes.STRING,
    authorId: DataTypes.INTEGER,
    forumId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Topic',
    timestamps: true
  });
  return Topic;
};
