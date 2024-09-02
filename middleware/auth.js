const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
    try {
        // Check if the session has a user ID
        if (!req.session.userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Find the user based on the session user ID
        const user = await User.findOne({ where: { id: req.session.userId } });
        if (!user) {
            return res.status(401).json({ message: 'User not found in database' });
        }

        // Attach the user to the request object
        req.user = user;
        next();
    } catch (error) {
        next(error); // Pass the error to the error handler
    }
};

module.exports = authMiddleware;