// src/controllers/chat.controller.js
const chatService = require("../services/chat.service");
const { uploadToCloudinary } = require("../config/cloudinary");
const { sendSuccess } = require("../utils/apiResponse");

const getChats = async (req, res, next) => {
    try {
        const { type = "all" } = req.query;
        const chats = await chatService.getChats(req.user._id, type);
        sendSuccess(res, { data: { chats } });
    } catch (err) { next(err); }
};

const getChatById = async (req, res, next) => {
    try {
        const chat = await chatService.getChatById(req.params.chatId, req.user._id);
        sendSuccess(res, { data: { chat } });
    } catch (err) { next(err); }
};

const createPersonalChat = async (req, res, next) => {
    try {
        const { receiverId } = req.body;
        const chat = await chatService.getOrCreatePersonalChat(req.user._id, receiverId);
        sendSuccess(res, { statusCode: 201, message: "Chat ready.", data: { chat } });
    } catch (err) { next(err); }
};

const getMessages = async (req, res, next) => {
    try {
        const result = await chatService.getMessages(req.params.chatId, req.user._id, req.query);
        sendSuccess(res, { data: result });
    } catch (err) { next(err); }
};

const markRead = async (req, res, next) => {
    try {
        await chatService.markRead(req.params.chatId, req.user._id);
        sendSuccess(res, { message: "Messages marked as read." });
    } catch (err) { next(err); }
};

const deleteMessage = async (req, res, next) => {
    try {
        const message = await chatService.deleteMessage(req.params.messageId, req.user._id);
        sendSuccess(res, { message: "Message deleted.", data: { message } });
    } catch (err) { next(err); }
};

const sendMediaMessage = async (req, res, next) => {
    try {
        if (!req.file) return next(new Error("No file uploaded."));

        const { url, publicId } = await uploadToCloudinary(req.file.buffer, "travel_partner/chat_media");
        const isImage = req.file.mimetype.startsWith("image/");
        const messageType = isImage ? "image" : "file";

        const message = await chatService.saveMessage({
            chatId: req.params.chatId,
            senderId: req.user._id,
            content: req.file.originalname,
            messageType,
            mediaUrl: url,
            mediaPublicId: publicId,
        });

        sendSuccess(res, { statusCode: 201, message: "Media sent.", data: { message } });
    } catch (err) { next(err); }
};

module.exports = { getChats, getChatById, createPersonalChat, getMessages, markRead, deleteMessage, sendMediaMessage };
