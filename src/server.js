const express = require('express');
const dotenv = require('dotenv');
const helmet = require("helmet");
const xss = require('xss-clean');
const cors = require('cors');

dotenv.config();
const PORT = process.env.PORT || 8080;

const {authRoutes, forumRoutes} = require('./routes');
const {errorHandler} = require('./middlewares/errorHandler');

const app = express();

app.use(
    helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false
    })
);

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(xss());

app.use(
    cors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    })
);

app.use('/auth', authRoutes);
app.use(forumRoutes);
app.use(errorHandler);

app.listen(PORT);

module.exports = app;
