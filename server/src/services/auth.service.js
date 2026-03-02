// src/services/auth.service.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("../utils/logger");

const generateAccessToken = (userId) =>
    jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

const generateRefreshToken = (userId) =>
    jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });

class AuthService {
    /**
     * Register a new user.
     */
    async register({ name, email, password, phone, role }) {
        const existing = await User.findOne({ email });
        if (existing) {
            const err = new Error("An account with this email already exists.");
            err.statusCode = 409;
            throw err;
        }

        const user = await User.create({ name, email, password, phone, role });
        logger.info(`New user registered: ${user.email}`);

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { user, accessToken, refreshToken };
    }

    /**
     * Login a user with email + password + role.
     */
    async login({ email, password, role }) {
        const user = await User.findOne({ email }).select("+password +refreshToken");
        if (!user || !(await user.comparePassword(password))) {
            const err = new Error("Invalid email or password.");
            err.statusCode = 401;
            throw err;
        }

        if (role && user.role !== role) {
            const err = new Error(`Account exists as a ${user.role}, but you are trying to log in as a ${role}.`);
            err.statusCode = 403;
            throw err;
        }

        if (!user.isActive) {
            const err = new Error("Your account has been deactivated.");
            err.statusCode = 403;
            throw err;
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        logger.info(`User logged in: ${user.email}`);

        // Remove sensitive fields before returning
        user.password = undefined;
        user.refreshToken = undefined;

        return { user, accessToken, refreshToken };
    }

    /**
     * Refresh access token using a valid refresh token.
     */
    async refreshToken(token) {
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch {
            const err = new Error("Invalid or expired refresh token.");
            err.statusCode = 401;
            throw err;
        }

        const user = await User.findById(decoded.id).select("+refreshToken");
        if (!user || user.refreshToken !== token) {
            const err = new Error("Refresh token mismatch. Please login again.");
            err.statusCode = 401;
            throw err;
        }

        const accessToken = generateAccessToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);

        user.refreshToken = newRefreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken: newRefreshToken };
    }

    /**
     * Logout — invalidate refresh token.
     */
    async logout(userId) {
        await User.findByIdAndUpdate(userId, { refreshToken: null });
        logger.info(`User logged out: ${userId}`);
    }

    /**
     * Get public profile of a user by username (safe fields only).
     */
    async getPublicProfileByUsername(username) {
        const user = await User.findOne({ username }).select(
            "username name profileImage bio rating createdAt"
        );
        if (!user) {
            const err = new Error("User not found.");
            err.statusCode = 404;
            throw err;
        }
        return user;
    }

    /**
     * Get current user profile.
     */
    async getMe(userId) {
        const user = await User.findById(userId);
        if (!user) {
            const err = new Error("User not found.");
            err.statusCode = 404;
            throw err;
        }
        return user;
    }

    /**
     * Update profile (name, bio, phone).
     */
    async updateProfile(userId, updates) {
        const allowed = ["name", "bio", "phone"];
        const filtered = Object.fromEntries(
            Object.entries(updates).filter(([k]) => allowed.includes(k))
        );

        const user = await User.findByIdAndUpdate(userId, filtered, {
            new: true,
            runValidators: true,
        });

        if (!user) {
            const err = new Error("User not found.");
            err.statusCode = 404;
            throw err;
        }

        return user;
    }

    /**
     * Update profile image.
     */
    async updateProfileImage(userId, { url, publicId }) {
        const user = await User.findByIdAndUpdate(
            userId,
            { profileImage: { url, publicId } },
            { new: true }
        );
        return user;
    }
}

module.exports = new AuthService();
