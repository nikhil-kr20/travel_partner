// src/validations/booking.validation.js
const Joi = require("joi");

const createBooking = Joi.object({
    rideId: Joi.string().hex().length(24).required(),
    seatsBooked: Joi.number().integer().min(1).required(),
});

module.exports = { createBooking };
