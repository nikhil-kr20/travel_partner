// src/sockets/chat.socket.js
const chatService = require("../services/chat.service");
const logger = require("../utils/logger");

/**
 * Register all chat-related socket event handlers.
 * @param {import("socket.io").Server} io
 * @param {import("socket.io").Socket} socket
 */
const registerChatHandlers = (io, socket) => {
    const userId = socket.user._id.toString();

    // ─── join_chat ───────────────────────────────────────────
    socket.on("join_chat", async ({ chatId }) => {
        try {
            socket.join(chatId);
            logger.info(`Socket ${socket.id} (user ${userId}) joined chat ${chatId}`);
        } catch (err) {
            socket.emit("error", { message: "Failed to join chat." });
        }
    });

    // ─── send_message ─────────────────────────────────────────
    socket.on("send_message", async ({ chatId, content, messageType = "text" }) => {
        try {
            if (!chatId || !content?.trim()) return;

            const message = await chatService.saveMessage({
                chatId,
                senderId: userId,
                content: content.trim(),
                messageType,
            });

            // Broadcast to all members of the chat room (including sender)
            io.to(chatId).emit("receive_message", { message });
        } catch (err) {
            logger.error(`send_message error: ${err.message}`);
            socket.emit("error", { message: err.message || "Failed to send message." });
        }
    });

    // ─── typing ───────────────────────────────────────────────
    socket.on("typing", ({ chatId }) => {
        socket.to(chatId).emit("user_typing", {
            userId,
            name: socket.user.name,
            chatId,
        });
    });

    // ─── stop_typing ──────────────────────────────────────────
    socket.on("stop_typing", ({ chatId }) => {
        socket.to(chatId).emit("user_stop_typing", { userId, chatId });
    });

    // ─── mark_read ────────────────────────────────────────────
    socket.on("mark_read", async ({ chatId }) => {
        try {
            await chatService.markRead(chatId, userId);
            // Notify other participants that messages were read
            socket.to(chatId).emit("message_read", { chatId, readBy: userId });
        } catch (err) {
            logger.error(`mark_read error: ${err.message}`);
        }
    });

    // ─── disconnect ───────────────────────────────────────────
    socket.on("disconnect", () => {
        logger.info(`Socket disconnected: ${socket.id} (user ${userId})`);
    });
};

module.exports = registerChatHandlers;
