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
const errorHandler = (err, req, res, next) => {
    // Log the error stack trace to the console
    console.error(err.stack);

    // Set the status code to the error's status code or default to 500 (Internal Server Error)
    const statusCode = err.statusCode || 500;
    // Set the error message to the error's message or default to 'Internal Server Error'
    let message = err.message || 'Internal Server Error';

    // Check if the error is from the dashboard.html or index.html file
    if (req.url.includes('dashboard.html') || req.url.includes('index.html')) {
        // Handle specific errors for dashboard and index pages
        if (err.name === 'ModalError') {
            message = 'Error displaying modal. Please try again.';
            statusCode = 400;
        } else if (err.name === 'APIError') {
            message = 'Error fetching data from API. Please refresh the page.';
            statusCode = 503;
        } else if (err.name === 'AuthError') {
            message = 'Authentication error. Please log in again.';
            statusCode = 401;
        }
    }

    // Handle z-index issues for modals
    if (err.name === 'ModalZIndexError') {
        message = 'Modal display issue. Please refresh the page.';
        statusCode = 400;
        // Add CSS fix for z-index
        res.setHeader('Content-Type', 'text/html');
        res.write('<style>.modal-backdrop{z-index: 1040;} .modal{z-index: 1050;}</style>');
    }

    // For index.html specific errors
    if (req.url.includes('index.html')) {
        if (err.name === 'LoginError') {
            message = 'Login failed. Please check your credentials and try again.';
            statusCode = 401;
        } else if (err.name === 'SignupError') {
            message = 'Signup failed. Please try again later.';
            statusCode = 400;
        } else if (err.name === 'ForgotPasswordError') {
            message = 'Failed to send reset password link. Please try again later.';
            statusCode = 500;
        }
    }

    // Send the error response as JSON
    res.status(statusCode).json({
        error: {
            message: message,
            status: statusCode
        }
    });
};

module.exports = { errorHandler };