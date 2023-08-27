const express = require('express');
const sequelize = require('./utils/database');

const PORT = process.env.PORT || 8080;

const app = express();
sequelize
    .sync()
    .then(() => {
        app.listen(PORT);
    })
    .catch(error => {
        throw new Error(error);
    });