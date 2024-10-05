/**
 * Importing the AuditLog model from the models directory.
 */
const { AuditLog } = require('../models');

/**
 * Middleware function to log audit trails for each request.
 * 
 * @param {NextFunction} next - The next middleware function in the application's request-response cycle.
 */
const auditMiddleware = async (req, res, next) => {
    /**
     * Recording the start time of the request.
     */
    const start = Date.now();
    /**
     * Listening for the 'finish' event on the response object to log the audit trail after the response is sent.
     */
    res.on('finish', async () => {
        /**
         * Calculating the duration of the request.
         */
        const duration = Date.now() - start;
        try {
            /**
             * Creating a new AuditLog entry with the request details.
             */
            await AuditLog.create({
                userId: req.user ? req.user.id : null, // User ID from the request user object, or null if not available
                action: `${req.method} ${req.originalUrl}`, // The action performed, including the request method and original URL
                endpoint: req.originalUrl, // The original URL of the request
                method: req.method, // The request method (e.g., GET, POST, PUT, DELETE)
                statusCode: res.statusCode, // The status code of the response
                message: res.statusMessage, // The status message of the response
                duration, // The duration of the request in milliseconds
            });
        } catch (error) {
            /**
             * Logging any errors that occur during the audit trail logging process.
             */
            console.error('Error logging audit trail:', error);
        }
    });
    /**
     * Calling the next middleware function in the application's request-response cycle.
     */
    next();
};

/**
 * Exporting the auditMiddleware function for use in the application.
 */
module.exports = auditMiddleware;