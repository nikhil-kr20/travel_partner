// src/models/Chat.js
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["personal", "trip_group", "ride_group"],
            required: [true, "Chat type is required"],
        },
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        ],
        // Only for trip_group
        tripId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trip",
            default: null,
        },
        // Only for ride_group
        rideId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ride",
            default: null,
        },
        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: null,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
chatSchema.index({ participants: 1 });
chatSchema.index({ tripId: 1 });
chatSchema.index({ rideId: 1 });
chatSchema.index({ type: 1 });

// Prevent duplicate personal chats between same two users
chatSchema.index(
    { type: 1, participants: 1 },
    {
        unique: false, // Not unique because array order can differ; enforced in service layer
    }
);

module.exports = mongoose.model("Chat", chatSchema);
