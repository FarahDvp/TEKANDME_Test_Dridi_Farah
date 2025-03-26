const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Email sending failed:', error.message);
                reject(new Error('Failed to send email'));
            } else {
                console.log('Email successfully sent to:', to);
                console.log('Message ID:', info.messageId);
                resolve(info);
            }
        });
    });
};

module.exports = sendEmail;