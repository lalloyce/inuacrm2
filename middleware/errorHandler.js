/**
 * Middleware function to handle errors in the application.
 * 
 * @param {Error} err - The error object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next function to be called.
 */
const errorHandler = (err, req, res, next) => {
    // Logging the error stack to the console for debugging purposes.
    console.error(err.stack);
    
    // Determining the error message to be sent to the client based on the environment.
    // In production, a generic error message is sent to avoid exposing internal error details.
    const message = process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message;
    
    // Sending the error response to the client with a status code of 500 if not already set.
    res.status(err.status || 500).json({ error: message });
};

// Exporting the errorHandler middleware function for use in the application.
module.exports = errorHandler;