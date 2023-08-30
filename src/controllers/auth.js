const {validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const {StatusCodes} = require('http-status-codes');

const {User} = require('../models/index');
const {sendEmail} = require('../services/nodemailer');
const ApiError = require('../errors/apiError');
const {createEmailHtml} = require('../utils/emailTemplate');

const SALT_LENGTH = 12;
const RANDOM_BYTES_LENGTH = 10;

exports.signUp = async (req, res, next) => {
    try {
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Request data validation error!', validationErrors.array());
        }

        const {username, email, password} = req.body;

        const hashedPassword = await bcrypt.hash(password, SALT_LENGTH);

        if (!hashedPassword) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Problem with hashing password!');
        }

        const activationCode = crypto.randomBytes(RANDOM_BYTES_LENGTH).toString('hex');

        const user = await User.create({
                username,
                email,
                password: hashedPassword,
                activationCode
            }
        );

        if (!user) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'User cannot be created!');
        }

        await sendEmail({
            to: email,
            subject: 'E-mail confirmation',
            html: createEmailHtml({
                title: 'Please confirm your email!',
                content: `Your activation code is: ${activationCode}`
            })
        });

        await user.save();

        return res.status(StatusCodes.CREATED).json({message: 'User created.'})
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        }
        next(err);
    }
};
