const {Sequelize} = require('sequelize');

const {DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'postgres'
});

module.exports = sequelize;
