// src/models/Message.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        chatId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat",
            required: [true, "Chat ID is required"],
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Sender is required"],
        },
        content: {
            type: String,
            required: [true, "Message content is required"],
            maxlength: [5000, "Message cannot exceed 5000 characters"],
        },
        messageType: {
            type: String,
            enum: ["text", "image", "file"],
            default: "text",
        },
        // For image / file messages
        mediaUrl: {
            type: String,
            default: null,
        },
        mediaPublicId: {
            type: String,
            default: null,
        },
        readBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for efficient pagination
messageSchema.index({ chatId: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });

module.exports = mongoose.model("Message", messageSchema);
