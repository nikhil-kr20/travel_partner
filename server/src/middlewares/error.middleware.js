// src/middlewares/error.middleware.js
const logger = require("../utils/logger");

/**
 * Global error handler — must be the last middleware registered.
 */
const errorHandler = (err, req, res, next) => {
    logger.error({
        message: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
        method: req.method,
        url: req.originalUrl,
    });

    // Mongoose Validation Error
    if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    // Mongoose Duplicate Key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(409).json({
            success: false,
            message: `Duplicate value for field: ${field}`,
        });
    }

    // Mongoose CastError (invalid ObjectId)
    if (err.name === "CastError") {
        return res.status(400).json({ success: false, message: `Invalid value for field: ${err.path}` });
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ success: false, message: "Invalid token." });
    }
    if (err.name === "TokenExpiredError") {
        return res.status(401).json({ success: false, message: "Token expired. Please login again." });
    }

    // Multer file size error
    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ success: false, message: "File too large. Maximum size is 10MB." });
    }

    const statusCode = err.statusCode || 500;
    const message = statusCode < 500 ? err.message : "Internal Server Error";

    res.status(statusCode).json({ success: false, message });
};

/**
 * Handle 404 — route not found.
 */
const notFound = (req, res) => {
    res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
};

module.exports = { errorHandler, notFound };
