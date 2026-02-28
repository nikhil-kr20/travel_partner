// src/validations/trip.validation.js
const Joi = require("joi");

// Start of today (midnight local) so that today's date is always valid
const startOfToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
};

const createTrip = Joi.object({
    fromLocation: Joi.string().required(),
    toLocation: Joi.string().required(),
    date: Joi.date().min(startOfToday()).required(),
    transportMode: Joi.string().valid("flight", "train", "bus", "car", "bike", "other").required(),
    seatsAvailable: Joi.number().integer().min(1).max(50).required(),
    description: Joi.string().max(1000).optional().allow(""),
    tags: Joi.array().items(Joi.string()).optional(),
});

const updateTrip = Joi.object({
    fromLocation: Joi.string().optional(),
    toLocation: Joi.string().optional(),
    date: Joi.date().min(startOfToday()).optional(),
    transportMode: Joi.string().valid("flight", "train", "bus", "car", "bike", "other").optional(),
    seatsAvailable: Joi.number().integer().min(1).max(50).optional(),
    description: Joi.string().max(1000).optional().allow(""),
    tags: Joi.array().items(Joi.string()).optional(),
});

module.exports = { createTrip, updateTrip };
