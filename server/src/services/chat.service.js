// src/services/chat.service.js
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const logger = require("../utils/logger");

class ChatService {
    /**
     * Get all chats for a user with optional type filter.
     */
    async getChats(userId, type) {
        const query = { participants: userId, isActive: true };
        if (type === "personal") query.type = "personal";
        else if (type === "group") query.type = { $in: ["trip_group", "ride_group"] };
        // "all" -> no type filter

        const chats = await Chat.find(query)
            .populate("participants", "name profileImage")
            .populate("lastMessage")
            .sort({ updatedAt: -1 });

        return chats;
    }

    /**
     * Get or create a personal chat between two users.
     */
    async getOrCreatePersonalChat(userId, receiverId) {
        if (userId.toString() === receiverId.toString()) {
            const err = new Error("Cannot create a chat with yourself.");
            err.statusCode = 400;
            throw err;
        }

        // Check if a personal chat already exists between these two users
        let chat = await Chat.findOne({
            type: "personal",
            participants: { $all: [userId, receiverId], $size: 2 },
        }).populate("participants", "name profileImage");

        if (!chat) {
            chat = await Chat.create({
                type: "personal",
                participants: [userId, receiverId],
            });
            chat = await chat.populate("participants", "name profileImage");
            logger.info(`Personal chat created between ${userId} and ${receiverId}`);
        }

        return chat;
    }

    /**
     * Get messages for a chat (paginated, newest-first).
     */
    async getMessages(chatId, userId, { page = 1, limit = 30 }) {
        // Verify user is a participant
        const chat = await Chat.findById(chatId);
        if (!chat) {
            const err = new Error("Chat not found.");
            err.statusCode = 404;
            throw err;
        }
        if (!chat.participants.map(String).includes(userId.toString())) {
            const err = new Error("Not a participant in this chat.");
            err.statusCode = 403;
            throw err;
        }

        const skip = (page - 1) * limit;
        const [messages, total] = await Promise.all([
            Message.find({ chatId, isDeleted: false })
                .populate("sender", "name profileImage")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Message.countDocuments({ chatId, isDeleted: false }),
        ]);

        return {
            messages: messages.reverse(), // return chronological order
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit),
                limit: parseInt(limit),
            },
        };
    }

    /**
     * Save a new message (called from socket + REST).
     */
    async saveMessage({ chatId, senderId, content, messageType = "text", mediaUrl = null, mediaPublicId = null }) {
        // Validate sender is participant
        const chat = await Chat.findById(chatId);
        if (!chat) {
            const err = new Error("Chat not found.");
            err.statusCode = 404;
            throw err;
        }
        if (!chat.participants.map(String).includes(senderId.toString())) {
            const err = new Error("Not a participant in this chat.");
            err.statusCode = 403;
            throw err;
        }

        const message = await Message.create({
            chatId,
            sender: senderId,
            content,
            messageType,
            mediaUrl,
            mediaPublicId,
            readBy: [senderId],
        });

        // Update lastMessage on chat
        chat.lastMessage = message._id;
        await chat.save();

        const populated = await message.populate("sender", "name profileImage");
        return populated;
    }

    /**
     * Mark all messages in a chat as read by a user.
     */
    async markRead(chatId, userId) {
        await Message.updateMany(
            { chatId, readBy: { $ne: userId } },
            { $addToSet: { readBy: userId } }
        );
    }

    /**
     * Get a chat by ID (participant only).
     */
    async getChatById(chatId, userId) {
        const chat = await Chat.findById(chatId)
            .populate("participants", "name profileImage rating")
            .populate("lastMessage");

        if (!chat) {
            const err = new Error("Chat not found.");
            err.statusCode = 404;
            throw err;
        }
        if (!chat.participants.map((p) => p._id.toString()).includes(userId.toString())) {
            const err = new Error("Not a participant in this chat.");
            err.statusCode = 403;
            throw err;
        }
        return chat;
    }

    /**
     * Delete a message (soft delete, sender only).
     */
    async deleteMessage(messageId, userId) {
        const message = await Message.findById(messageId);
        if (!message) {
            const err = new Error("Message not found.");
            err.statusCode = 404;
            throw err;
        }
        if (message.sender.toString() !== userId.toString()) {
            const err = new Error("Not authorised to delete this message.");
            err.statusCode = 403;
            throw err;
        }
        message.isDeleted = true;
        message.content = "This message was deleted.";
        await message.save();
        return message;
    }
}

module.exports = new ChatService();
