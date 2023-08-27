const express = require('express');
require('dotenv').config();

const db = require('./models/index');
const PORT = process.env.PORT || 8080;

const app = express();
db.sequelize
    .sync()
    .then(() => {
        app.listen(PORT);
    })
    .catch(error => {
        throw new Error(error);
    });
