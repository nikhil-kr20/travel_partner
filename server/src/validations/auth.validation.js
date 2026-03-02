// src/validations/auth.validation.js
const Joi = require("joi");

const phoneSchema = Joi.string()
    .pattern(/^\+?[1-9]\d{7,14}$/)
    .allow("", null)  // allow blank — we strip it before saving
    .optional();

const register = Joi.object({
    username: Joi.string().pattern(/^[a-zA-Z0-9_.]+$/).min(3).max(20).required()
        .messages({ 'string.pattern.base': 'Username can only contain letters, numbers, underscores and dots.' }),
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    phone: phoneSchema,
    role: Joi.string().valid("user", "rider").default("user"),
}).options({ stripUnknown: true });

const login = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string().valid("user", "rider").optional(), // sent from the role-selector UI
}).options({ stripUnknown: true });

const updateProfile = Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    bio: Joi.string().max(300).allow("").optional(),
    phone: phoneSchema,
}).options({ stripUnknown: true });

module.exports = { register, login, updateProfile };

