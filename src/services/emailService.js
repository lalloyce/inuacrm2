// src/services/emailService.js
const nodemailer = require('nodemailer');

function sendPasswordResetEmail(email, token) {
    const transporter = nodemailer.createTransport({
        // Configure your email service
        service: 'Gmail', // Example: Gmail
        auth: {
            user: 'inuasasasolutions@gmail.com',
            pass: '*Em}k%s$fEAj6M['
        }
    });

    const mailOptions = {
        from: 'inuasasasolutions@gmail.com',
        to: email,
        subject: 'Password Reset Request',
        text: `Please click the following link to reset your password: http://your-app.com/reset-password?token=${token}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred while sending email:', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = {
    sendPasswordResetEmail
};
