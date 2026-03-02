// src/controllers/auth.controller.js
const authService = require("../services/auth.service");
const { uploadToCloudinary } = require("../config/cloudinary");
const { sendSuccess, sendError } = require("../utils/apiResponse");

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

const register = async (req, res, next) => {
    try {
        const { username, name, email, password, phone, role } = req.body;
        const { user, accessToken, refreshToken } = await authService.register({ username, name, email, password, phone, role });
        res.cookie("refreshToken", refreshToken, cookieOptions);
        sendSuccess(res, {
            statusCode: 201,
            message: "Account created successfully.",
            data: { user, accessToken },
        });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password, role } = req.body;
        const { user, accessToken, refreshToken } = await authService.login({ email, password, role });
        res.cookie("refreshToken", refreshToken, cookieOptions);
        sendSuccess(res, {
            message: "Logged in successfully.",
            data: { user, accessToken },
        });
    } catch (err) {
        next(err);
    }
};

const logout = async (req, res, next) => {
    try {
        await authService.logout(req.user._id);
        res.clearCookie("refreshToken");
        sendSuccess(res, { message: "Logged out successfully." });
    } catch (err) {
        next(err);
    }
};

const refreshToken = async (req, res, next) => {
    try {
        const token = req.cookies?.refreshToken || req.body?.refreshToken;
        if (!token) return sendError(res, { statusCode: 401, message: "Refresh token not provided." });

        const tokens = await authService.refreshToken(token);
        res.cookie("refreshToken", tokens.refreshToken, cookieOptions);
        sendSuccess(res, { message: "Token refreshed.", data: { accessToken: tokens.accessToken } });
    } catch (err) {
        next(err);
    }
};

const getMe = async (req, res, next) => {
    try {
        const user = await authService.getMe(req.user._id);
        sendSuccess(res, { data: { user } });
    } catch (err) {
        next(err);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const user = await authService.updateProfile(req.user._id, req.body);
        sendSuccess(res, { message: "Profile updated.", data: { user } });
    } catch (err) {
        next(err);
    }
};

const uploadProfileImage = async (req, res, next) => {
    try {
        if (!req.file) return sendError(res, { statusCode: 400, message: "No file uploaded." });
        const { url, publicId } = await uploadToCloudinary(req.file.buffer, "travel_partner/profiles");
        const user = await authService.updateProfileImage(req.user._id, { url, publicId });
        sendSuccess(res, { message: "Profile image updated.", data: { user } });
    } catch (err) {
        next(err);
    }
};

const getUserById = async (req, res, next) => {
    try {
        const user = await authService.getMe(req.params.id);
        sendSuccess(res, { data: { user } });
    } catch (err) {
        next(err);
    }
};

const getPublicProfile = async (req, res, next) => {
    try {
        const user = await authService.getPublicProfileByUsername(req.params.username);
        sendSuccess(res, { data: { user } });
    } catch (err) {
        next(err);
    }
};

module.exports = { register, login, logout, refreshToken, getMe, updateProfile, uploadProfileImage, getUserById, getPublicProfile };
