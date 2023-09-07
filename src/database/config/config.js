const dotenv = require('dotenv');

dotenv.config();
const {TEST_DB, PROD_DB, DEV_DB, DB_USERNAME, DB_HOST, DB_PASSWORD} = process.env;
const DB_DIALECT = 'postgres';

module.exports = {
    "development": {
        "username": DB_USERNAME,
        "password": DB_PASSWORD,
        "database": DEV_DB,
        "host": DB_HOST,
        "dialect": DB_DIALECT
    },
    "test": {
        "username": DB_USERNAME,
        "password": DB_PASSWORD,
        "database": TEST_DB,
        "host": DB_HOST,
        "dialect": DB_DIALECT
    },
    "production": {
        "username": DB_USERNAME,
        "password": DB_PASSWORD,
        "database": PROD_DB,
        "host": DB_HOST,
        "dialect": DB_DIALECT
    }
};
