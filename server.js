const express = require('express');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const mysql = require('mysql');
const crypto = require('crypto'); // For generating secure tokens

const app = express();
app.use(express.json());

// MySQL connection setup
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'D#FR$GG#D',
    database: 'inua_crm'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    }
    console.log('Connected to the database!');
});

// Login endpoint
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    // Check if the user exists in the database
    connection.query('SELECT * FROM Users WHERE Email = ?', [email], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length > 0) {
            const user = results[0];

            // Compare the supplied password with the hashed password in the database
            bcrypt.compare(password, user.Password, (err, isMatch) => {
                if (err) {
                    console.error('Bcrypt comparison error:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                if (isMatch) {
                    // Generate an authentication token and send it back to the client
                    const authToken = generateAuthToken(user);
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

// Password reset request endpoint
app.post('/api/password-reset', (req, res) => {
    const { email } = req.body;

    // Check if the user exists in the database
    connection.query('SELECT * FROM Users WHERE Email = ?', [email], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length > 0) {
            const user = results[0];

            // Generate a password reset token
            const resetToken = generateResetToken();

            // Store the reset token in the PasswordResetTokens table
            connection.query('INSERT INTO PasswordResetTokens (UserID, Token, ExpiresAt) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))', [user.UserID, resetToken], (err) => {
                if (err) {
                    console.error('Database insertion error:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                // Send the password reset email to the user
                sendPasswordResetEmail(user.Email, resetToken);
                res.json({ message: 'Password reset instructions have been sent to your email.' });
            });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    });
});

// Password reset endpoint
app.post('/api/reset-password', (req, res) => {
    const { token, newPassword } = req.body;

    // Check if the reset token is valid
    connection.query('SELECT * FROM PasswordResetTokens WHERE Token = ? AND ExpiresAt > NOW()', [token], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length > 0) {
            const { UserID } = results[0];

            // Hash the new password
            bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
                if (err) {
                    console.error('Bcrypt hashing error:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }

                // Update the user's password in the Users table
                connection.query('UPDATE Users SET Password = ? WHERE UserID = ?', [hashedPassword, UserID], (err) => {
                    if (err) {
                        console.error('Database update error:', err);
                        return res.status(500).json({ error: 'Internal server error' });
                    }

                    // Remove the reset token from the PasswordResetTokens table
                    connection.query('DELETE FROM PasswordResetTokens WHERE Token = ?', [token], (err) => {
                        if (err) {
                            console.error('Database deletion error:', err);
                            return res.status(500).json({ error: 'Internal server error' });
                        }

                        res.json({ message: 'Password has been reset successfully.' });
                    });
                });
            });
        } else {
            res.status(400).json({ error: 'Invalid or expired password reset token' });
        }
    });
});

// Helper functions
function generateAuthToken(user) {
    // Implement your own token generation logic here, e.g., JWT
    return `Bearer ${user.UserID}-${Date.now()}`;
}

function generateResetToken() {
    // Securely generate a random token
    return crypto.randomBytes(32).toString('hex');
}

function sendPasswordResetEmail(email, token) {
    // Use a proper email service or library (e.g., Nodemailer) to send the password reset email
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'inuasasasolutions@gmail.com', // Replace with your email
            pass: '*Em}k%s$fEAj6M[' // Replace with your email password
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
            console.error('Error occurred while sending email:', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
