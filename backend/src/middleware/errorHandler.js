// Step 8 — Global Error Handler
// Catch-all middleware for handling server errors

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: err.message || 'An unexpected error occurred on the server'
    });
};

export default errorHandler;
