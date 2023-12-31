const bcrypt = require("bcrypt");
const crypto = require("crypto");
const {StatusCodes} = require("http-status-codes");

const {User} = require("../database/models");

const {sendEmail} = require("../services/nodemailer");
const ApiError = require("../errors/apiError");
const {createEmailHtml} = require("../utils/emailTemplate");
const {createToken} = require("../services/jwt");
const {createHtmlLink} = require("../utils/linkTemplate");

const SALT_LENGTH = 12;
const RANDOM_BYTES_LENGTH = 10;

exports.signUp = async (req, res, next) => {
    try {
        const {username, email, password} = req.body;

        const hashedPassword = await bcrypt.hash(password, SALT_LENGTH);

        if (!hashedPassword) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Problem with hashing password!");
        }

        const activationCode = crypto.randomBytes(RANDOM_BYTES_LENGTH).toString("hex");

        const hashedActivationCode = await bcrypt.hash(activationCode, SALT_LENGTH);

        const user = await User.create({
                username,
                email,
                password: hashedPassword,
                activationCode: hashedActivationCode
            }
        );

        if (!user) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "User cannot be created!");
        }

        await sendEmail({
            to: email,
            subject: "E-mail confirmation",
            html: createEmailHtml({
                title: "Please confirm your email!",
                content: `Your activation code is: ${activationCode}`
            })
        });

        await user.save();

        return res.status(StatusCodes.CREATED).json({message: "User created."})
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        }
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({where: {email}});

        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, "User with provided email does not exist!");
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, "User password is not correct!");
        }

        if (!user.isActive) {
            throw new ApiError(StatusCodes.FORBIDDEN, "You must confirm your email!");
        }

        const token = createToken({email, userId: user.id.toString()});
        const {username} = user;
        return res.status(StatusCodes.OK).json({
            message: "User successfully logged in.",
            token,
            username
        });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        }
        next(error);
    }
};

exports.confirmEmail = async (req, res, next) => {
    try {
        const {email, activationCode} = req.body;

        const user = await User.findOne({where: {email}});

        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, "User with provided email does not exist!");
        }

        if (user.isActive) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, "User email has already been confirmed!");
        }

        const isCodeCorrect = await bcrypt.compare(activationCode, user.activationCode);

        if (!isCodeCorrect) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, "Activation code is not correct!");
        }

        user.isActive = true;

        await user.save();

        return res.status(StatusCodes.OK).json({message: "User email confirmed."})

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        }
        next(error);
    }
};

exports.tryResetPassword = async (req, res, next) => {
    try {
        const {email} = req.body;

        const user = await User.findOne({where: {email}});

        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, "User with provided email does not exist!");
        }

        const restoringCode = crypto.randomBytes(RANDOM_BYTES_LENGTH).toString("hex");

        const hashedRestoringCode = await bcrypt.hash(restoringCode, SALT_LENGTH);

        if (!hashedRestoringCode) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Problem with hashing restoring code!");
        }

        user.restoringCode = hashedRestoringCode;

        await user.save();

        await sendEmail({
            to: email,
            subject: "Reset your password",
            html: createEmailHtml({
                title: "Please reset your password",
                content: `Click ${createHtmlLink("link", "reset-password", {
                    uid: user.id.toString(),
                    restoringCode
                })} and set new password.`
            })
        });

        return res.status(StatusCodes.OK).json({
            message: "A password reset link was sent to email."
        });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        }
        next(error);
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const {uid, restoringCode} = req.query;
        const {password} = req.body;

        const user = await User.findByPk(uid);

        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, "User does not exist!");
        }

        const isCodeValid = await bcrypt.compare(restoringCode, user.restoringCode);

        if (!isCodeValid) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, "Restoring code is not correct!");
        }

        const hashedNewPassword = await bcrypt.hash(password, SALT_LENGTH);

        if (!hashedNewPassword) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Problem with hashing new password!");
        }

        user.password = hashedNewPassword;
        user.restoringCode = null;

        await user.save();

        return res.status(StatusCodes.OK).json({
            message: "Password has been successfully reseted."
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        }
        next(error);
    }
};
