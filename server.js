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
const path = require('path');
const multer = require('multer');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Database connection
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false // set to console.log to see the raw SQL queries
});

// Test the connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
})();

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
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
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

    try {
        const result = await mg.messages.create(process.env.MAILGUN_DOMAIN, data);
        console.log('Email sent successfully:', result);
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
}

// File upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/avatars');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Routes
app.post('/api/register', async (req, res, next) => {
    try {
        const { email, password, full_name, role } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');

        const [result] = await pool.query(
            'INSERT INTO users (email, password, full_name, role, verification_token) VALUES (?, ?, ?, ?, ?)',
            [email, hashedPassword, full_name, role, verificationToken]
        );

        const verificationLink = `${process.env.BASE_URL}/verify?token=${verificationToken}`;
        await sendEmail(email, 'Verify your email', `Please click this link to verify your email: ${verificationLink}`);

        res.status(201).json({ message: 'User registered. Please check your email to verify your account.' });
    } catch (error) {
        next(error); // Pass the error to the error handler
    }
});

app.post('/api/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

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
        next(error); // Pass the error to the error handler
    }
});

app.post('/api/forgot-password', async (req, res, next) => {
    try {
        const { email } = req.body;

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour from now

        const [result] = await pool.query(
            'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?',
            [resetToken, resetTokenExpires, email]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const resetLink = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;
        await sendEmail(email, 'Reset your password', `Please click this link to reset your password: ${resetLink}`);

        res.json({ message: 'Password reset email sent' });
    } catch (error) {
        next(error); // Pass the error to the error handler
    }
});

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});