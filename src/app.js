const express = require('express');
const apiRoutes = require('./api'); // Import the combined API routes
const sequelize = require('../config/database'); // Import the Sequelize instance (updated to reflect the path)
const jwt = require('jsonwebtoken'); // Import JWT for authentication
const nodemailer = require('nodemailer'); // Import Nodemailer for email
const pagesRoutes = require('../routes/pages'); // Import the pages.js routes
require('dotenv').config(); // Load environment variables

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Use the combined API routes under '/api'
app.use('/api', apiRoutes);

// Use the pages routes under the root path '/'
app.use('/', pagesRoutes);

// JWT Authentication example
const generateToken = (user) => {
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Email sending example
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_ENCRYPTION === 'tls',
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    },
});

// Sync the models with the database
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database & tables synced!');
    })
    .catch((err) => {
        console.error('Failed to sync database:', err);
    });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
