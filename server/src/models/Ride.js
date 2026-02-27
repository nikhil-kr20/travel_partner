// src/models/Ride.js
const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
    {
        riderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Rider ID is required"],
        },
        vehicleType: {
            type: String,
            enum: ["car", "bike", "auto", "van", "truck"],
            required: [true, "Vehicle type is required"],
        },
        vehicleNumber: {
            type: String,
            required: [true, "Vehicle number is required"],
            trim: true,
            uppercase: true,
        },
        fromLocation: {
            type: String,
            required: [true, "From location is required"],
            trim: true,
        },
        toLocation: {
            type: String,
            required: [true, "To location is required"],
            trim: true,
        },
        date: {
            type: Date,
            required: [true, "Ride date is required"],
        },
        availableSeats: {
            type: Number,
            required: [true, "Available seats is required"],
            min: [1, "At least 1 seat required"],
            max: [20, "Cannot exceed 20 seats"],
        },
        pricePerKm: {
            type: Number,
            required: [true, "Price per km is required"],
            min: [0, "Price cannot be negative"],
        },
        estimatedDistance: {
            type: Number,
            required: [true, "Estimated distance is required"],
            min: [0, "Distance cannot be negative"],
        },
        chatId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat",
        },
        status: {
            type: String,
            enum: ["available", "booked", "completed", "cancelled"],
            default: "available",
        },
        // Computed from formula, stored for quick access
        estimatedTotalPrice: {
            type: Number,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Pre-save: compute estimated total price
rideSchema.pre("save", function (next) {
    this.estimatedTotalPrice = parseFloat(
        (this.estimatedDistance * this.pricePerKm).toFixed(2)
    );
    next();
});

// Indexes
rideSchema.index({ fromLocation: 1, toLocation: 1, date: 1 });
rideSchema.index({ riderId: 1 });
rideSchema.index({ status: 1 });

module.exports = mongoose.model("Ride", rideSchema);
