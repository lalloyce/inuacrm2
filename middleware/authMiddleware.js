const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Authentication middleware
 * 
 * This middleware verifies the JWT token in the request header and attaches the user to the request object.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authMiddleware = async (req, res, next) => {
    try {
        // Extract the token from the Authorization header
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find the user associated with the token
        const user = await User.findOne({ where: { id: decoded.id } });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Attach the user to the request object
        req.user = user;
        next();
    } catch (error) {
        // Handle JWT-specific errors
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        next(error);
    }
};

/**
 * Role-based access control middleware
 * 
 * This middleware checks if the authenticated user has one of the allowed roles.
 * 
 * @param {Array} allowedRoles - Array of roles allowed to access the route
 * @returns {Function} Middleware function
 */
const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied' });
        }
        next();
    };
};

module.exports = { authMiddleware, roleMiddleware };