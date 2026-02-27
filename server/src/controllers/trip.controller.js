// src/controllers/trip.controller.js
const tripService = require("../services/trip.service");
const { sendSuccess } = require("../utils/apiResponse");

const createTrip = async (req, res, next) => {
    try {
        const trip = await tripService.createTrip(req.user._id, req.body);
        sendSuccess(res, { statusCode: 201, message: "Trip created.", data: { trip } });
    } catch (err) { next(err); }
};

const getTrips = async (req, res, next) => {
    try {
        const result = await tripService.getTrips(req.query);
        sendSuccess(res, { data: result });
    } catch (err) { next(err); }
};

const getTripById = async (req, res, next) => {
    try {
        const trip = await tripService.getTripById(req.params.id);
        sendSuccess(res, { data: { trip } });
    } catch (err) { next(err); }
};

const joinTrip = async (req, res, next) => {
    try {
        const trip = await tripService.joinTrip(req.params.id, req.user._id);
        sendSuccess(res, { message: "Joined trip successfully.", data: { trip } });
    } catch (err) { next(err); }
};

const leaveTrip = async (req, res, next) => {
    try {
        const trip = await tripService.leaveTrip(req.params.id, req.user._id);
        sendSuccess(res, { message: "Left trip successfully.", data: { trip } });
    } catch (err) { next(err); }
};

const updateTrip = async (req, res, next) => {
    try {
        const trip = await tripService.updateTrip(req.params.id, req.user._id, req.body);
        sendSuccess(res, { message: "Trip updated.", data: { trip } });
    } catch (err) { next(err); }
};

const cancelTrip = async (req, res, next) => {
    try {
        const trip = await tripService.cancelTrip(req.params.id, req.user._id);
        sendSuccess(res, { message: "Trip cancelled.", data: { trip } });
    } catch (err) { next(err); }
};

const getMyTrips = async (req, res, next) => {
    try {
        const trips = await tripService.getMyTrips(req.user._id);
        sendSuccess(res, { data: { trips } });
    } catch (err) { next(err); }
};

module.exports = { createTrip, getTrips, getTripById, joinTrip, leaveTrip, updateTrip, cancelTrip, getMyTrips };
