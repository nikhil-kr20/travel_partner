const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// Get private chat messages between two users
router.get('/private/:userId1/:userId2', messageController.getPrivateMessages);

// Get group chat messages for a trip
router.get('/group/:tripId', messageController.getGroupMessages);

// Get all chats for a user
router.get('/user/:userId', messageController.getUserChats);

// Mark messages as read
router.put('/mark-read', messageController.markAsRead);

// Delete a message
router.delete('/:messageId', messageController.deleteMessage);

module.exports = router;
