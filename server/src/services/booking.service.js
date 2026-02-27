// src/services/booking.service.js
const Booking = require("../models/Booking");
const Ride = require("../models/Ride");
const Chat = require("../models/Chat");
const { generateBillSummary } = require("../utils/generateBill");
const logger = require("../utils/logger");

class BookingService {
    /**
     * Create a booking for a ride.
     */
    async createBooking(userId, { rideId, seatsBooked }) {
        const ride = await Ride.findById(rideId);
        if (!ride) {
            const err = new Error("Ride not found.");
            err.statusCode = 404;
            throw err;
        }
        if (ride.status !== "available") {
            const err = new Error("This ride is not available for booking.");
            err.statusCode = 400;
            throw err;
        }
        if (ride.riderId.toString() === userId.toString()) {
            const err = new Error("Riders cannot book their own ride.");
            err.statusCode = 400;
            throw err;
        }
        if (seatsBooked > ride.availableSeats) {
            const err = new Error(`Only ${ride.availableSeats} seat(s) available.`);
            err.statusCode = 400;
            throw err;
        }

        // Check for duplicate booking
        const existing = await Booking.findOne({ rideId, userId, status: { $nin: ["cancelled"] } });
        if (existing) {
            const err = new Error("You already have an active booking for this ride.");
            err.statusCode = 409;
            throw err;
        }

        const totalAmount = parseFloat((ride.estimatedDistance * ride.pricePerKm * seatsBooked).toFixed(2));

        const booking = await Booking.create({
            rideId,
            userId,
            seatsBooked,
            totalAmount,
        });

        logger.info(`Booking created: ${booking._id} for ride ${rideId}`);
        return booking;
    }

    /**
     * Accept a booking (rider only).
     * Generates the bill and adds passenger to ride chat.
     */
    async acceptBooking(bookingId, riderId) {
        const booking = await Booking.findById(bookingId).populate("rideId");
        if (!booking) {
            const err = new Error("Booking not found.");
            err.statusCode = 404;
            throw err;
        }

        const ride = booking.rideId;
        if (ride.riderId.toString() !== riderId.toString()) {
            const err = new Error("Not authorised to accept this booking.");
            err.statusCode = 403;
            throw err;
        }
        if (booking.status !== "pending") {
            const err = new Error(`Booking is already ${booking.status}.`);
            err.statusCode = 400;
            throw err;
        }

        // Update available seats
        ride.availableSeats -= booking.seatsBooked;
        if (ride.availableSeats <= 0) ride.status = "booked";
        await ride.save();

        // Generate bill
        const bill = generateBillSummary(ride, booking);
        booking.status = "accepted";
        booking.billGenerated = true;
        booking.billDetails = bill;
        await booking.save();

        // Add passenger to ride chat
        if (ride.chatId) {
            await Chat.findByIdAndUpdate(ride.chatId, {
                $addToSet: { participants: booking.userId },
            });
        }

        logger.info(`Booking ${bookingId} accepted by rider ${riderId}`);
        return booking;
    }

    /**
     * Cancel a booking.
     */
    async cancelBooking(bookingId, userId) {
        const booking = await Booking.findById(bookingId).populate("rideId");
        if (!booking) {
            const err = new Error("Booking not found.");
            err.statusCode = 404;
            throw err;
        }

        const isPassenger = booking.userId.toString() === userId.toString();
        const isRider = booking.rideId?.riderId?.toString() === userId.toString();

        if (!isPassenger && !isRider) {
            const err = new Error("Not authorised to cancel this booking.");
            err.statusCode = 403;
            throw err;
        }
        if (["completed", "cancelled"].includes(booking.status)) {
            const err = new Error(`Booking is already ${booking.status}.`);
            err.statusCode = 400;
            throw err;
        }

        // Restore seats if booking was accepted
        if (booking.status === "accepted") {
            const ride = await Ride.findById(booking.rideId);
            if (ride) {
                ride.availableSeats += booking.seatsBooked;
                if (ride.status === "booked") ride.status = "available";
                await ride.save();
            }
        }

        booking.status = "cancelled";
        await booking.save();

        logger.info(`Booking ${bookingId} cancelled by user ${userId}`);
        return booking;
    }

    /**
     * Complete a booking (rider marks ride as done).
     */
    async completeBooking(bookingId, riderId) {
        const booking = await Booking.findById(bookingId).populate("rideId");
        if (!booking) {
            const err = new Error("Booking not found.");
            err.statusCode = 404;
            throw err;
        }

        const ride = booking.rideId;
        if (ride.riderId.toString() !== riderId.toString()) {
            const err = new Error("Not authorised.");
            err.statusCode = 403;
            throw err;
        }
        if (booking.status !== "accepted") {
            const err = new Error("Only accepted bookings can be marked as completed.");
            err.statusCode = 400;
            throw err;
        }

        booking.status = "completed";
        await booking.save();

        // Check if all bookings for this ride are completed
        const pendingBookings = await Booking.countDocuments({
            rideId: ride._id,
            status: { $in: ["pending", "accepted"] },
        });
        if (pendingBookings === 0) {
            ride.status = "completed";
            await ride.save();
        }

        logger.info(`Booking ${bookingId} completed.`);
        return booking;
    }

    /**
     * Get bookings for a user (as passenger).
     */
    async getMyBookings(userId) {
        const bookings = await Booking.find({ userId })
            .populate("rideId", "fromLocation toLocation date vehicleType riderId")
            .sort({ createdAt: -1 });
        return bookings;
    }

    /**
     * Get bookings for a rider's rides.
     */
    async getRideBookings(rideId, riderId) {
        const ride = await Ride.findById(rideId);
        if (!ride || ride.riderId.toString() !== riderId.toString()) {
            const err = new Error("Ride not found or not authorised.");
            err.statusCode = 403;
            throw err;
        }

        const bookings = await Booking.find({ rideId })
            .populate("userId", "name email phone profileImage rating")
            .sort({ createdAt: -1 });
        return bookings;
    }

    /**
     * Get booking details with bill.
     */
    async getBookingById(bookingId, userId) {
        const booking = await Booking.findById(bookingId)
            .populate("rideId")
            .populate("userId", "name email");

        if (!booking) {
            const err = new Error("Booking not found.");
            err.statusCode = 404;
            throw err;
        }

        const isPassenger = booking.userId._id.toString() === userId.toString();
        const isRider = booking.rideId?.riderId?.toString() === userId.toString();

        if (!isPassenger && !isRider) {
            const err = new Error("Not authorised to view this booking.");
            err.statusCode = 403;
            throw err;
        }

        return booking;
    }
}

module.exports = new BookingService();
