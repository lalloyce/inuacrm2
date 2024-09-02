const { AuditLog } = require('../models');

const auditMiddleware = async (req, res, next) => {
    const start = Date.now();
    res.on('finish', async () => {
        const duration = Date.now() - start;
        try {
            await AuditLog.create({
                userId: req.user ? req.user.id : null,
                action: `${req.method} ${req.originalUrl}`,
                endpoint: req.originalUrl,
                method: req.method,
                statusCode: res.statusCode,
                message: res.statusMessage,
                duration,
            });
        } catch (error) {
            console.error('Error logging audit trail:', error);
        }
    });
    next();
};

module.exports = auditMiddleware;