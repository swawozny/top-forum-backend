const nodemailer = require('nodemailer');

const {MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASSWORD, MAIL_DEFAULT} = process.env;

const transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: MAIL_PORT,
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD
    }
});

exports.sendEmail = async ({to, subject, html}) => {
    return await transporter.sendMail({
        to,
        from: MAIL_DEFAULT,
        subject,
        html
    });
};
