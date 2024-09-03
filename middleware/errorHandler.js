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

/**
 * Middleware function to handle errors in the application.
 * 
 * @param {Object} err - The error object containing error details.
 * @param {Object} req - The request object representing the HTTP request.
 * @param {Object} res - The response object representing the HTTP response.
 * @param {Function} next - The next middleware function in the stack.
 */
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
};

module.exports = errorHandler;