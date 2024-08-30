const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const FormData = require('form-data');
const Mailgun = require('mailgun.js');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Database connection
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

const pool = mysql.createPool(dbConfig);

// Session store
const sessionStore = new MySQLStore(dbConfig);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Set to true in production with HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

// Mailgun configuration
const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY
});

// Email sending function
async function sendEmail(to, subject, text) {
    const data = {
        from: process.env.EMAIL_FROM,
        to: to,
        subject: subject,
        text: text,
        html: `<h1>${text}</h1>`
    };
    
    return mg.messages.create(process.env.MAILGUN_DOMAIN, data);
}

// Routes
app.post('/api/register', async (req, res) => {
    const { email, password, full_name } = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');
        
        const [result] = await pool.query(
            'INSERT INTO users (email, password, full_name, verification_token) VALUES (?, ?, ?, ?)',
            [email, hashedPassword, full_name, verificationToken]
        );
        
        const verificationLink = `${process.env.BASE_URL}/verify?token=${verificationToken}`;
        await sendEmail(email, 'Verify your email', `Please click this link to verify your email: ${verificationLink}`);
        
        res.status(201).json({ message: 'User registered. Please check your email to verify your account.' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.get('/verify', async (req, res) => {
    const { token } = req.query;
    
    try {
        const [result] = await pool.query(
            'UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE verification_token = ?',
            [token]
        );
        
        if (result.affectedRows === 0) {
            return res.status(400).json({ error: 'Invalid or expired verification token' });
        }
        
        res.redirect('/login.html?verified=true');
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ error: 'Verification failed' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = rows[0];
        
        if (!user.is_verified) {
            return res.status(401).json({ error: 'Please verify your email before logging in' });
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        req.session.userId = user.id;
        req.session.userRole = user.role;
        
        res.json({ message: 'Login successful', role: user.role });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.clearCookie('session_cookie_name');
        res.json({ message: 'Logout successful' });
    });
});

app.post('/api/forgot-password', async (req, res) => {
    const { email } = req.body;
    
    try {
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour from now
        
        await pool.query(
            'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?',
            [resetToken, resetTokenExpires, email]
        );
        
        const resetLink = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;
        await sendEmail(email, 'Reset your password', `Please click this link to reset your password: ${resetLink}`);
        
        res.json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Failed to send password reset email' });
    }
});

app.post('/api/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    
    try {
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()',
            [token]
        );
        
        if (rows.length === 0) {
            return res.status(400).json({ error: 'Invalid or expired reset token' });
        }
        
        const user = rows[0];
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        await pool.query(
            'UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
            [hashedPassword, user.id]
        );
        
        res.json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Failed to reset password' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});