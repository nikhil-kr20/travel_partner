// src/models/Booking.js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        rideId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ride",
            required: [true, "Ride ID is required"],
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
        },
        seatsBooked: {
            type: Number,
            required: [true, "Number of booked seats is required"],
            min: [1, "Must book at least 1 seat"],
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        billGenerated: {
            type: Boolean,
            default: false,
        },
        billDetails: {
            type: mongoose.Schema.Types.Mixed,
            default: null,
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "completed", "cancelled"],
            default: "pending",
        },
        cancellationReason: {
            type: String,
            maxlength: 500,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
bookingSchema.index({ rideId: 1, userId: 1 });
bookingSchema.index({ userId: 1 });
bookingSchema.index({ status: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
