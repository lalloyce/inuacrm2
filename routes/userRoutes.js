/**
 * This file defines the routes for handling user operations.
 * It uses Express.js to create a router that handles HTTP requests for creating, reading, updating, and deleting users.
 * The routes are protected by an error handler middleware to catch and handle any errors that might occur.
 */

const express = require('express');
const router = express.Router();
const { User } = require('../models');
const jwt = require('jsonwebtoken');

/**
 * POST /users
 * Creates a new user.
 * 
 * @param {Object} req.body - The request body containing the user details.
 * @returns {JSON} The newly created user.
 */
router.post('/', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOrCreate({
            where: { email: decodedToken.email },
            defaults: {
                username: req.body.name,
                email: decodedToken.email,
                role: req.body.role,
                password: 'netlify-managed' // We don't manage passwords directly
            }
        });

        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating/updating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;