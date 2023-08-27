const {Sequelize} = require('sequelize');

const {DATABASE, DB_USERNAME, DB_PASSWORD, DB_HOST} = process.env;

const sequelize = new Sequelize(DATABASE, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'postgres'
});

module.exports = sequelize;
