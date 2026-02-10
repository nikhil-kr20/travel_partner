const express = require('express');
const router = express.Router();
const {
    getChats,
    getOrCreatePrivateChat,
    getOrCreateGlobalChat,
    getChatMessages,
    sendMessage
} = require('../controllers/chatController');

// Get all chats for a user
router.get('/', getChats);

// Create or get private chat
router.post('/private', getOrCreatePrivateChat);

// Create or get global chat for a trip
router.post('/global', getOrCreateGlobalChat);

// Get messages for a specific chat
router.get('/:chatId/messages', getChatMessages);

// Send a message in a chat
router.post('/:chatId/messages', sendMessage);

module.exports = router;
