const { User } = require('../models');
const { isAuthenticated, getCurrentUser } = require('../utils/auth');

const authMiddleware = async (req, res, next) => {
    try {
        if (!isAuthenticated()) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const goTrueUser = getCurrentUser();
        const user = await User.findOne({ where: { email: goTrueUser.email } });

        if (!user) {
            return res.status(401).json({ message: 'User not found in database' });
        }

        req.user = user;
        next();
    } catch (error) {
        next(error); // Pass the error to the error handler
    }
};

module.exports = authMiddleware;