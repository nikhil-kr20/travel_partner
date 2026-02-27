// src/middlewares/role.middleware.js
const { sendError } = require("../utils/apiResponse");

/**
 * Restrict access to specific roles.
 * Usage: restrictTo("admin", "rider")
 */
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return sendError(res, { statusCode: 401, message: "Authentication required." });
        }
        if (!roles.includes(req.user.role)) {
            return sendError(res, {
                statusCode: 403,
                message: `Access denied. Required role: ${roles.join(" or ")}. Your role: ${req.user.role}`,
            });
        }
        next();
    };
};

module.exports = { restrictTo };
