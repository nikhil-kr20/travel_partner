// src/controllers/booking.controller.js
const bookingService = require("../services/booking.service");
const { sendSuccess } = require("../utils/apiResponse");

const createBooking = async (req, res, next) => {
    try {
        const booking = await bookingService.createBooking(req.user._id, req.body);
        sendSuccess(res, { statusCode: 201, message: "Booking created.", data: { booking } });
    } catch (err) { next(err); }
};

const acceptBooking = async (req, res, next) => {
    try {
        const booking = await bookingService.acceptBooking(req.params.id, req.user._id);
        sendSuccess(res, { message: "Booking accepted. Bill generated.", data: { booking } });
    } catch (err) { next(err); }
};

const cancelBooking = async (req, res, next) => {
    try {
        const booking = await bookingService.cancelBooking(req.params.id, req.user._id);
        sendSuccess(res, { message: "Booking cancelled.", data: { booking } });
    } catch (err) { next(err); }
};

const completeBooking = async (req, res, next) => {
    try {
        const booking = await bookingService.completeBooking(req.params.id, req.user._id);
        sendSuccess(res, { message: "Booking marked as completed.", data: { booking } });
    } catch (err) { next(err); }
};

const getMyBookings = async (req, res, next) => {
    try {
        const bookings = await bookingService.getMyBookings(req.user._id);
        sendSuccess(res, { data: { bookings } });
    } catch (err) { next(err); }
};

const getRideBookings = async (req, res, next) => {
    try {
        const bookings = await bookingService.getRideBookings(req.params.rideId, req.user._id);
        sendSuccess(res, { data: { bookings } });
    } catch (err) { next(err); }
};

const getBookingById = async (req, res, next) => {
    try {
        const booking = await bookingService.getBookingById(req.params.id, req.user._id);
        sendSuccess(res, { data: { booking } });
    } catch (err) { next(err); }
};

module.exports = { createBooking, acceptBooking, cancelBooking, completeBooking, getMyBookings, getRideBookings, getBookingById };
