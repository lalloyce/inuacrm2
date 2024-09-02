/**
 * Error handling middleware for Express.js applications.
 * Logs the error stack trace and sends a JSON response with the error message and status code.
 * Handles specific errors for dashboard.html and index.html pages, as well as modal z-index issues.
 *
 * @param {Object} err - The error object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const { ErrorLog } = require('../models');

/**
 * Middleware function to handle errors in the application.
 * 
 * @param {Object} err - The error object containing error details.
 * @param {Object} req - The request object representing the HTTP request.
 * @param {Object} res - The response object representing the HTTP response.
 * @param {Function} next - The next middleware function in the stack.
 */
const errorHandler = async (err, req, res, next) => {
    // Log the error stack trace to the console
    console.error(err.stack);

    // Determine the status code and message to send in the response
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    try {
        // Log the error details to the database
        await ErrorLog.create({
            message: message,
            stack: err.stack,
            statusCode: statusCode,
            url: req.url,
            method: req.method,
            userId: req.user ? req.user.id : null,
            createdAt: new Date().toLocaleString('en-US', { timeZone: 'Africa/Nairobi' }),
            updatedAt: new Date().toLocaleString('en-US', { timeZone: 'Africa/Nairobi' }),
        });
    } catch (dbError) {
        // Log any errors that occur while logging to the database
        console.error('Error logging to database:', dbError);
    }

    // Send a JSON response with the error message and status code
    res.status(statusCode).json({
        error: {
            message: message,
            status: statusCode
        }
    });
};

module.exports = errorHandler;