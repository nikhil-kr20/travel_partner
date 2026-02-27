// src/middlewares/auth.middleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendError } = require("../utils/apiResponse");
const logger = require("../utils/logger");

/**
 * Verify JWT access token.
 * Attaches req.user with the authenticated user document.
 */
const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return sendError(res, { statusCode: 401, message: "Authentication required. No token provided." });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return sendError(res, { statusCode: 401, message: "Token expired. Please login again." });
            }
            return sendError(res, { statusCode: 401, message: "Invalid token." });
        }

        const user = await User.findById(decoded.id).select("-password -refreshToken");
        if (!user || !user.isActive) {
            return sendError(res, { statusCode: 401, message: "User not found or account deactivated." });
        }

        req.user = user;
        next();
    } catch (err) {
        logger.error(`Auth middleware error: ${err.message}`);
        return sendError(res, { statusCode: 500, message: "Internal server error during authentication." });
    }
};

/**
 * Socket.io JWT authentication middleware.
 * Attaches socket.user if valid.
 */
const socketAuth = async (socket, next) => {
    try {
        const token =
            socket.handshake.auth?.token ||
            socket.handshake.headers?.authorization?.split(" ")[1];

        if (!token) return next(new Error("Authentication error: No token."));

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("_id name role");
        if (!user) return next(new Error("Authentication error: User not found."));

        socket.user = user;
        next();
    } catch (err) {
        next(new Error("Authentication error: Invalid token."));
    }
};

module.exports = { protect, socketAuth };
