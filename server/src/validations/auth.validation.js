// src/validations/auth.validation.js
const Joi = require("joi");

const register = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    phone: Joi.string().pattern(/^\+?[1-9]\d{7,14}$/).optional(),
    role: Joi.string().valid("user", "rider").default("user"),
});

const login = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const updateProfile = Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    bio: Joi.string().max(300).optional(),
    phone: Joi.string().pattern(/^\+?[1-9]\d{7,14}$/).optional(),
});

module.exports = { register, login, updateProfile };
