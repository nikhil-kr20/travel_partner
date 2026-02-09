const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    // Message content
    text: {
        type: String,
        required: true,
        trim: true
    },

    // Sender information
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    senderName: {
        type: String,
        required: true
    },

    // Chat type and reference
    chatType: {
        type: String,
        enum: ['private', 'group'],
        required: true
    },

    // For private chats - the recipient user ID
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: function () {
            return this.chatType === 'private';
        }
    },

    // For group chats - the trip ID
    tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
        required: function () {
            return this.chatType === 'group';
        }
    },

    // Metadata
    timestamp: {
        type: Date,
        default: Date.now
    },

    // Read status (for private messages)
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for efficient queries
messageSchema.index({ senderId: 1, timestamp: -1 });
messageSchema.index({ recipientId: 1, timestamp: -1 });
messageSchema.index({ tripId: 1, timestamp: -1 });
messageSchema.index({ chatType: 1, timestamp: -1 });

// Create a compound index for private chat queries
messageSchema.index({
    senderId: 1,
    recipientId: 1,
    timestamp: -1
});

module.exports = mongoose.model('Message', messageSchema);
