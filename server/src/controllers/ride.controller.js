// src/controllers/ride.controller.js
const rideService = require("../services/ride.service");
const { sendSuccess } = require("../utils/apiResponse");

const createRide = async (req, res, next) => {
    try {
        const ride = await rideService.createRide(req.user._id, req.body);
        sendSuccess(res, { statusCode: 201, message: "Ride created.", data: { ride } });
    } catch (err) { next(err); }
};

const getRides = async (req, res, next) => {
    try {
        const result = await rideService.getRides(req.query);
        sendSuccess(res, { data: result });
    } catch (err) { next(err); }
};

const getRideById = async (req, res, next) => {
    try {
        const ride = await rideService.getRideById(req.params.id);
        sendSuccess(res, { data: { ride } });
    } catch (err) { next(err); }
};

const updateRide = async (req, res, next) => {
    try {
        const ride = await rideService.updateRide(req.params.id, req.user._id, req.body);
        sendSuccess(res, { message: "Ride updated.", data: { ride } });
    } catch (err) { next(err); }
};

const cancelRide = async (req, res, next) => {
    try {
        const ride = await rideService.cancelRide(req.params.id, req.user._id);
        sendSuccess(res, { message: "Ride cancelled.", data: { ride } });
    } catch (err) { next(err); }
};

const getMyRides = async (req, res, next) => {
    try {
        const rides = await rideService.getMyRides(req.user._id);
        sendSuccess(res, { data: { rides } });
    } catch (err) { next(err); }
};

module.exports = { createRide, getRides, getRideById, updateRide, cancelRide, getMyRides };
