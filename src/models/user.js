// src/models/user.js
const connection = require('../config/db');

const User = {
    findByEmail: (email, callback) => {
        connection.query('SELECT * FROM Users WHERE Email = ?', [email], callback);
    },
    createResetToken: (userID, token, callback) => {
        connection.query(
            'INSERT INTO PasswordResetTokens (UserID, Token, ExpiresAt) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))',
            [userID, token],
            callback
        );
    },
    findResetToken: (token, callback) => {
        connection.query('SELECT * FROM PasswordResetTokens WHERE Token = ? AND ExpiresAt > NOW()', [token], callback);
    },
    updatePassword: (userID, hashedPassword, callback) => {
        connection.query('UPDATE Users SET Password = ? WHERE UserID = ?', [hashedPassword, userID], callback);
    },
    deleteResetToken: (token, callback) => {
        connection.query('DELETE FROM PasswordResetTokens WHERE Token = ?', [token], callback);
    }
};

module.exports = User;
