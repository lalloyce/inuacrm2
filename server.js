const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const FormData = require('form-data');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');
const errorHandler = require('./public/js/errorHandler');
const bodyParser = require('body-parser');
const authMiddleware = require('./middleware/auth');
const url = require('url');

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Parse DATABASE_URL from .env
const dbUrl = new URL(process.env.DATABASE_URL);
const sessionStore = new MySQLStore({
    host: dbUrl.hostname,
    port: dbUrl.port,
    user: dbUrl.username,
    password: decodeURIComponent(dbUrl.password),
    database: dbUrl.pathname.substr(1) // Remove the leading slash
});

app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

const sequelize = require('./config/database');
const User = require('./models/User');

const sendEmail = async (to, subject, text) => {
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    });

    try {
        let info = await transporter.sendMail({
            from: `"Inua CRM" <${process.env.SMTP_USER}>`, // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            text: text, // plain text body
        });

        console.log('Email sent:', info);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Routes
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.userId = user.id;
            res.json({ message: 'Login successful' });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/signup', async (req, res) => {
    try {
        const { email, password, full_name, role } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = await User.create({ email, password: hashedPassword, full_name, role });
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        console.error('Validation Error:', error);
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.reset_token = resetToken;
        user.reset_token_expires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Send email with reset token
        await sendEmail(user.email, 'Password Reset', `Your password reset token is: ${resetToken}`);

        res.json({ message: 'Password reset email sent' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to test database connection
app.get('/api/test-db', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.json({ message: 'Database connection has been established successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Unable to connect to the database:', details: error.message });
    }
});

// Default route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Protected route example
app.get('/api/protected-route', authMiddleware, (req, res) => {
    res.json({ message: 'This is a protected route' });
});

// Error handling middleware
app.use(errorHandler);

// Start the server
sequelize.authenticate().then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});