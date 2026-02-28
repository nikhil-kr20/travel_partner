// src/validations/ride.validation.js
const Joi = require("joi");

// Start of today (midnight local) so that today's date is always valid
const startOfToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
};

const createRide = Joi.object({
    vehicleType: Joi.string().valid("car", "bike", "auto", "van", "bus").required(),
    vehicleNumber: Joi.string().required(),
    fromLocation: Joi.string().required(),
    toLocation: Joi.string().required(),
    date: Joi.date().min(startOfToday()).required(),
    availableSeats: Joi.number().integer().min(1).max(20).required(),
    pricePerKm: Joi.number().min(0).required(),
    estimatedDistance: Joi.number().min(0).required(),
});

const updateRide = Joi.object({
    vehicleType: Joi.string().valid("car", "bike", "auto", "van", "bus").optional(),
    vehicleNumber: Joi.string().optional(),
    fromLocation: Joi.string().optional(),
    toLocation: Joi.string().optional(),
    date: Joi.date().min(startOfToday()).optional(),
    availableSeats: Joi.number().integer().min(1).max(20).optional(),
    pricePerKm: Joi.number().min(0).optional(),
    estimatedDistance: Joi.number().min(0).optional(),
});

module.exports = { createRide, updateRide };
