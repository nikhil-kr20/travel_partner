// src/models/Trip.js
const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
    {
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Creator is required"],
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
            required: [true, "Trip date is required"],
        },
        transportMode: {
            type: String,
            enum: ["flight", "train", "bus", "car", "bike", "other"],
            required: [true, "Transport mode is required"],
        },
        description: {
            type: String,
            maxlength: [1000, "Description cannot exceed 1000 characters"],
            default: "",
        },
        chatId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat",
        },
        status: {
            type: String,
            enum: ["open", "confirmed", "completed", "cancelled"],
            default: "open",
        },
        tags: [{ type: String, trim: true }],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes for fast search
tripSchema.index({ fromLocation: 1, toLocation: 1, date: 1 });
tripSchema.index({ creator: 1 });
tripSchema.index({ status: 1 });
tripSchema.index({ date: 1 });

module.exports = mongoose.model("Trip", tripSchema);
