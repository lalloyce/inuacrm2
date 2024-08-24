// Import the transporter from app.js
const { transporter } = require('../../app');

/**
 * Sends a password reset email to the specified user.
 *
 * @param {string} email - The recipient's email address.
 * @param {string} token - The password reset token.
 */
function sendPasswordResetEmail(email, token) {
    const mailOptions = {
        from: process.env.MAIL_FROM_ADDRESS, // Sender address from .env
        to: email, // Recipient address
        subject: 'Password Reset Request', // Subject line
        text: `Please click the following link to reset your password: ${process.env.APP_URL}/reset-password?token=${token}` // Plain text body
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred while sending email:', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

/**
 * Sends a confirmation email after password reset.
 *
 * @param {string} email - The recipient's email address.
 */
function sendPasswordResetConfirmationEmail(email) {
    const mailOptions = {
        from: process.env.MAIL_FROM_ADDRESS, // Sender address from .env
        to: email, // Recipient address
        subject: 'Your Password Has Been Reset', // Subject line
        text: `Your password has been successfully reset. If you did not initiate this change, please contact our support team immediately.` // Plain text body
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred while sending confirmation email:', error);
        } else {
            console.log('Password reset confirmation email sent: ' + info.response);
        }
    });
}

module.exports = {
    sendPasswordResetEmail,
    sendPasswordResetConfirmationEmail,
    sendWelcomeEmail,
};
