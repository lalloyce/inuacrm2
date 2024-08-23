// src/api/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const connection = require('../config/db');
const transporter = require('./path-to-app.js').transporter;

const router = express.Router();

// setting up transporter correctly
const transporter = require('./path-to-app.js').transporter;

function sendPasswordResetEmail(email, token) {
    const mailOptions = {
        from: process.env.MAIL_FROM_ADDRESS,
        to: email,
        subject: 'Password Reset Request',
        text: `Please click the following link to reset your password: ${process.env.APP_URL}/reset-password?token=${token}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred while sending email:', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

// Usage example
sendPasswordResetEmail(userEmail, resetToken);

// Login route
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    connection.query('SELECT * FROM Users WHERE Email = ?', [email], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            const user = results[0];

            bcrypt.compare(password, user.Password, (err, isMatch) => {
                if (err) throw err;

                if (isMatch) {
                    const authToken = `Bearer ${user.UserID}-${Date.now()}`;
                    res.json({ authToken });
                } else {
                    res.status(401).json({ error: 'Invalid email or password' });
                }
            });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    });
});

// Password reset request route
router.post('/password-reset', (req, res) => {
    const { email } = req.body;

    connection.query('SELECT * FROM Users WHERE Email = ?', [email], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            const user = results[0];
            const resetToken = generateResetToken();

            connection.query(
                'INSERT INTO PasswordResetTokens (UserID, Token, ExpiresAt) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))',
                [user.UserID, resetToken],
                (err) => {
                    if (err) throw err;

                    sendPasswordResetEmail(user.Email, resetToken);
                    res.json({ message: 'Password reset instructions have been sent to your email.' });
                }
            );
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    });
});

// Password reset route
router.post('/reset-password', (req, res) => {
    const { token, newPassword } = req.body;

    connection.query('SELECT * FROM PasswordResetTokens WHERE Token = ? AND ExpiresAt > NOW()', [token], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            const { UserID } = results[0];

            bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
                if (err) throw err;

                connection.query('UPDATE Users SET Password = ? WHERE UserID = ?', [hashedPassword, UserID], (err) => {
                    if (err) throw err;

                    connection.query('DELETE FROM PasswordResetTokens WHERE Token = ?', [token], (err) => {
                        if (err) throw err;

                        res.json({ message: 'Password has been reset successfully.' });
                    });
                });
            });
        } else {
            res.status(400).json({ error: 'Invalid or expired password reset token' });
        }
    });
});

// Helper function to generate reset token
function generateResetToken() {
    return Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
}

module.exports = router;
