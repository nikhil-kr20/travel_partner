const Message = require('../models/Message');

// Get all messages for a private chat between two users
exports.getPrivateMessages = async (req, res) => {
    try {
        const { userId1, userId2 } = req.params;

        const messages = await Message.find({
            chatType: 'private',
            $or: [
                { senderId: userId1, recipientId: userId2 },
                { senderId: userId2, recipientId: userId1 }
            ]
        })
            .sort({ timestamp: 1 })
            .limit(100); // Limit to last 100 messages

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages', error: error.message });
    }
};

// Get all messages for a group chat (trip)
exports.getGroupMessages = async (req, res) => {
    try {
        const { tripId } = req.params;

        const messages = await Message.find({
            chatType: 'group',
            tripId: tripId
        })
            .sort({ timestamp: 1 })
            .limit(100); // Limit to last 100 messages

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages', error: error.message });
    }
};

// Get all chats for a user (both private and group)
exports.getUserChats = async (req, res) => {
    try {
        const { userId } = req.params;

        // Get all unique private chats
        const privateChats = await Message.aggregate([
            {
                $match: {
                    chatType: 'private',
                    $or: [
                        { senderId: userId },
                        { recipientId: userId }
                    ]
                }
            },
            {
                $sort: { timestamp: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ['$senderId', userId] },
                            '$recipientId',
                            '$senderId'
                        ]
                    },
                    lastMessage: { $first: '$$ROOT' }
                }
            }
        ]);

        // Get all group chats
        const groupChats = await Message.aggregate([
            {
                $match: {
                    chatType: 'group'
                }
            },
            {
                $sort: { timestamp: -1 }
            },
            {
                $group: {
                    _id: '$tripId',
                    lastMessage: { $first: '$$ROOT' }
                }
            }
        ]);

        res.json({
            privateChats: privateChats.map(chat => chat.lastMessage),
            groupChats: groupChats.map(chat => chat.lastMessage)
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chats', error: error.message });
    }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
    try {
        const { senderId, recipientId } = req.body;

        await Message.updateMany(
            {
                chatType: 'private',
                senderId: senderId,
                recipientId: recipientId,
                isRead: false
            },
            {
                $set: { isRead: true }
            }
        );

        res.json({ message: 'Messages marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating messages', error: error.message });
    }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;

        await Message.findByIdAndDelete(messageId);

        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting message', error: error.message });
    }
};
