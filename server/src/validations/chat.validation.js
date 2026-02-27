// src/validations/chat.validation.js
const Joi = require("joi");

const createPersonalChat = Joi.object({
    receiverId: Joi.string().hex().length(24).required(),
});

module.exports = { createPersonalChat };
