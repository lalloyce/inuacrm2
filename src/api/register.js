const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models/user.js'); // Adjust the path according to your project structure
const router = express.Router();

router.post('/', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        // Successful registration
        req.session.user = user;
        res.status(201).json({ success: true, message: 'Registration successful.' });

    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'An error occurred during registration.' });
    }
});

module.exports = router;
