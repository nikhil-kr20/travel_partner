// src/services/ride.service.js
const Ride = require("../models/Ride");
const Chat = require("../models/Chat");
const logger = require("../utils/logger");

class RideService {
    /**
     * Create a new ride offer (rider only).
     */
    async createRide(riderId, data) {
        // Create a ride group chat
        const chat = await Chat.create({
            type: "ride_group",
            participants: [riderId],
        });

        const ride = await Ride.create({
            ...data,
            riderId,
            chatId: chat._id,
        });

        chat.rideId = ride._id;
        await chat.save();

        logger.info(`Ride created: ${ride._id} by rider ${riderId}`);
        return ride;
    }

    /**
     * Get all rides with optional filters.
     */
    async getRides({ fromLocation, toLocation, date, vehicleType, status, page = 1, limit = 10 }) {
        const query = {};
        if (fromLocation) query.fromLocation = { $regex: fromLocation, $options: "i" };
        if (toLocation) query.toLocation = { $regex: toLocation, $options: "i" };
        if (vehicleType) query.vehicleType = vehicleType;
        if (status) query.status = status;
        if (date) {
            const start = new Date(date);
            start.setHours(0, 0, 0, 0);
            const end = new Date(date);
            end.setHours(23, 59, 59, 999);
            query.date = { $gte: start, $lte: end };
        }

        const skip = (page - 1) * limit;
        const [rides, total] = await Promise.all([
            Ride.find(query)
                .populate("riderId", "name profileImage rating")
                .sort({ date: 1 })
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            Ride.countDocuments(query),
        ]);

        return {
            rides,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit),
                limit: parseInt(limit),
            },
        };
    }

    /**
     * Get a single ride by ID.
     */
    async getRideById(rideId) {
        const ride = await Ride.findById(rideId)
            .populate("riderId", "name profileImage rating bio phone");

        if (!ride) {
            const err = new Error("Ride not found.");
            err.statusCode = 404;
            throw err;
        }
        return ride;
    }

    /**
     * Update a ride (rider only).
     */
    async updateRide(rideId, riderId, updates) {
        const ride = await Ride.findById(rideId);
        if (!ride) {
            const err = new Error("Ride not found.");
            err.statusCode = 404;
            throw err;
        }
        if (ride.riderId.toString() !== riderId.toString()) {
            const err = new Error("Not authorised to update this ride.");
            err.statusCode = 403;
            throw err;
        }
        if (ride.status !== "available") {
            const err = new Error("Cannot edit a ride that is already booked or completed.");
            err.statusCode = 400;
            throw err;
        }

        const allowed = ["fromLocation", "toLocation", "date", "availableSeats", "pricePerKm", "estimatedDistance", "vehicleType", "vehicleNumber"];
        allowed.forEach((f) => {
            if (updates[f] !== undefined) ride[f] = updates[f];
        });

        await ride.save();
        return ride;
    }

    /**
     * Cancel a ride (rider only).
     */
    async cancelRide(rideId, riderId) {
        const ride = await Ride.findById(rideId);
        if (!ride) {
            const err = new Error("Ride not found.");
            err.statusCode = 404;
            throw err;
        }
        if (ride.riderId.toString() !== riderId.toString()) {
            const err = new Error("Not authorised to cancel this ride.");
            err.statusCode = 403;
            throw err;
        }
        if (["completed", "cancelled"].includes(ride.status)) {
            const err = new Error(`Ride is already ${ride.status}.`);
            err.statusCode = 400;
            throw err;
        }

        ride.status = "cancelled";
        await ride.save();
        logger.info(`Ride ${rideId} cancelled by rider ${riderId}`);
        return ride;
    }

    /**
     * Get rides created by a specific rider.
     */
    async getMyRides(riderId) {
        const rides = await Ride.find({ riderId }).sort({ date: -1 }).lean();
        return rides;
    }
}

module.exports = new RideService();
