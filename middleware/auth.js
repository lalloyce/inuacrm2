const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await User.findOne({ where: { id: req.session.userId } });
        if (!user) {
            return res.status(401).json({ message: 'User not found in database' });
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied' });
        }
        next();
    };
};

module.exports = { authMiddleware, roleMiddleware };