// src/services/trip.service.js
const Trip = require("../models/Trip");
const Chat = require("../models/Chat");
const logger = require("../utils/logger");

class TripService {
    /**
     * Create a new trip and automatically provision a group chat.
     */
    async createTrip(creatorId, data) {
        // Create group chat for this trip
        const chat = await Chat.create({
            type: "trip_group",
            participants: [creatorId],
        });

        const trip = await Trip.create({
            ...data,
            creator: creatorId,
            chatId: chat._id,
        });

        // Update chat with tripId reference
        chat.tripId = trip._id;
        await chat.save();

        logger.info(`Trip created: ${trip._id} by user ${creatorId}`);
        return trip;
    }

    /**
     * Get all trips with optional filters.
     */
    async getTrips({ fromLocation, toLocation, date, status, page = 1, limit = 10 }) {
        const query = {};
        if (fromLocation) query.fromLocation = { $regex: fromLocation, $options: "i" };
        if (toLocation) query.toLocation = { $regex: toLocation, $options: "i" };
        if (status) query.status = status;
        if (date) {
            const start = new Date(date);
            start.setHours(0, 0, 0, 0);
            const end = new Date(date);
            end.setHours(23, 59, 59, 999);
            query.date = { $gte: start, $lte: end };
        }

        const skip = (page - 1) * limit;
        const [trips, total] = await Promise.all([
            Trip.find(query)
                .populate("creator", "name profileImage rating")
                .sort({ date: 1 })
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            Trip.countDocuments(query),
        ]);

        return {
            trips,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit),
                limit: parseInt(limit),
            },
        };
    }

    /**
     * Get a single trip by ID.
     */
    async getTripById(tripId) {
        const trip = await Trip.findById(tripId)
            .populate("creator", "name username profileImage rating bio");

        if (!trip) {
            const err = new Error("Trip not found.");
            err.statusCode = 404;
            throw err;
        }
        return trip;
    }

    /**
     * Update trip details (creator only).
     */
    async updateTrip(tripId, userId, updates) {
        const trip = await Trip.findById(tripId);
        if (!trip) {
            const err = new Error("Trip not found.");
            err.statusCode = 404;
            throw err;
        }
        if (trip.creator.toString() !== userId.toString()) {
            const err = new Error("Not authorised to update this trip.");
            err.statusCode = 403;
            throw err;
        }

        const allowedFields = ["fromLocation", "toLocation", "date", "transportMode", "description", "tags"];
        allowedFields.forEach((field) => {
            if (updates[field] !== undefined) trip[field] = updates[field];
        });

        await trip.save();
        return trip;
    }

    /**
     * Cancel a trip (creator only).
     */
    async cancelTrip(tripId, userId) {
        const trip = await Trip.findById(tripId);
        if (!trip) {
            const err = new Error("Trip not found.");
            err.statusCode = 404;
            throw err;
        }
        if (trip.creator.toString() !== userId.toString()) {
            const err = new Error("Not authorised to cancel this trip.");
            err.statusCode = 403;
            throw err;
        }
        if (["completed", "cancelled"].includes(trip.status)) {
            const err = new Error(`Trip is already ${trip.status}.`);
            err.statusCode = 400;
            throw err;
        }

        trip.status = "cancelled";
        await trip.save();
        logger.info(`Trip ${tripId} cancelled by user ${userId}`);
        return trip;
    }

    /**
     * Get trips created by a specific user (for public profile).
     */
    async getTripsByUserId(userId, limit = 6) {
        const trips = await Trip.find({ creator: userId, status: { $ne: "cancelled" } })
            .populate("creator", "name username profileImage")
            .sort({ date: -1 })
            .limit(parseInt(limit))
            .lean();
        return trips;
    }

    /**
     * Get trips created by a specific user.
     */
    async getMyTrips(userId) {
        const trips = await Trip.find({ creator: userId }).sort({ date: -1 }).lean();
        return trips;
    }
}

module.exports = new TripService();
