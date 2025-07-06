module.exports = (err, req, res, next) => {
    console.error("❌ Error occurred:", err.message);

    // Set the response status code and send the error message
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });

    // Call the next middleware in the stack
    next();
}