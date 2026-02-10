const Chat = require('../models/Chat');
const Message = require('../models/Message');
const Trip = require('../models/Trip');

// @desc    Get all chats for a user
// @route   GET /api/chats
// @access  Public (should be protected in production)
const getChats = async (req, res) => {
    try {
        const { userId } = req.query; // In production, get from authenticated user

        if (!userId) {
            return res.status(400).json({ message: 'userId is required' });
        }

        // Find all chats where user is a participant
        const chats = await Chat.find({ participants: userId })
            .populate('tripId', 'destination origin')
            .populate('participants', 'name email avatar')
            .sort({ lastMessageTime: -1 });

        // Get unread message counts for each chat
        const chatsWithUnread = await Promise.all(chats.map(async (chat) => {
            let unreadCount = 0;

            if (chat.type === 'private') {
                // Count unread messages in private chat
                unreadCount = await Message.countDocuments({
                    chatType: 'private',
                    recipientId: userId,
                    senderId: { $ne: userId },
                    isRead: false,
                    $or: [
                        { senderId: chat.participants[0]._id, recipientId: userId },
                        { senderId: chat.participants[1]._id, recipientId: userId }
                    ]
                });

                // Get the other user in the private chat
                const otherUser = chat.participants.find(p => p._id.toString() !== userId);

                return {
                    id: chat._id,
                    type: chat.type,
                    user: {
                        name: otherUser.name,
                        avatar: otherUser.avatar || `https://i.pravatar.cc/150?u=${otherUser._id}`
                    },
                    lastMessage: chat.lastMessage,
                    time: formatTime(chat.lastMessageTime),
                    unread: unreadCount,
                    createdAt: chat.createdAt
                };
            } else {
                // For global chats
                return {
                    id: chat._id,
                    type: chat.type,
                    name: chat.name,
                    tripId: chat.tripId,
                    lastMessage: chat.lastMessage,
                    time: formatTime(chat.lastMessageTime),
                    unread: unreadCount,
                    createdAt: chat.createdAt
                };
            }
        }));

        res.json(chatsWithUnread);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get or create a private chat between two users
// @route   POST /api/chats/private
// @access  Public
const getOrCreatePrivateChat = async (req, res) => {
    try {
        const { userId, otherUserId } = req.body;

        if (!userId || !otherUserId) {
            return res.status(400).json({ message: 'userId and otherUserId are required' });
        }

        // Check if chat already exists
        let chat = await Chat.findOne({
            type: 'private',
            participants: { $all: [userId, otherUserId] }
        });

        if (!chat) {
            // Create new private chat
            chat = new Chat({
                type: 'private',
                participants: [userId, otherUserId],
                lastMessage: '',
                lastMessageTime: new Date()
            });
            await chat.save();
        }

        res.json({ chatId: chat._id, chat });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get or create a global chat for a trip
// @route   POST /api/chats/global
// @access  Public
const getOrCreateGlobalChat = async (req, res) => {
    try {
        const { tripId, userId } = req.body;

        if (!tripId || !userId) {
            return res.status(400).json({ message: 'tripId and userId are required' });
        }

        // Get trip details
        const trip = await Trip.findById(tripId);
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        // Check if global chat already exists for this trip
        let chat = await Chat.findOne({
            type: 'global',
            tripId: tripId
        });

        if (!chat) {
            // Create new global chat
            chat = new Chat({
                type: 'global',
                name: `${trip.destination} Trip Chat`,
                tripId: tripId,
                participants: [userId],
                lastMessage: 'Chat created',
                lastMessageTime: new Date()
            });
            await chat.save();
        } else {
            // Add user to participants if not already there
            if (!chat.participants.includes(userId)) {
                chat.participants.push(userId);
                await chat.save();
            }
        }

        res.json({ chatId: chat._id, chat });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get messages for a specific chat
// @route   GET /api/chats/:chatId/messages
// @access  Public
const getChatMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { userId } = req.query;

        // Get the chat
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        let messages;

        if (chat.type === 'private') {
            // Get private messages between the two participants
            const [user1, user2] = chat.participants;
            messages = await Message.find({
                chatType: 'private',
                $or: [
                    { senderId: user1, recipientId: user2 },
                    { senderId: user2, recipientId: user1 }
                ]
            }).sort({ timestamp: 1 });

            // Mark messages as read
            await Message.updateMany(
                {
                    chatType: 'private',
                    recipientId: userId,
                    senderId: { $ne: userId },
                    isRead: false,
                    $or: [
                        { senderId: user1, recipientId: user2 },
                        { senderId: user2, recipientId: user1 }
                    ]
                },
                { isRead: true }
            );
        } else {
            // Get global chat messages
            messages = await Message.find({
                chatType: 'group',
                tripId: chat.tripId
            }).sort({ timestamp: 1 });
        }

        // Format messages for frontend
        const formattedMessages = messages.map(msg => ({
            id: msg._id,
            text: msg.text,
            sender: msg.senderName,
            time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: msg.senderId.toString() === userId
        }));

        res.json(formattedMessages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Send a message in a chat
// @route   POST /api/chats/:chatId/messages
// @access  Public
const sendMessage = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { userId, userName, text } = req.body;

        if (!text || !userId || !userName) {
            return res.status(400).json({ message: 'text, userId, and userName are required' });
        }

        // Get the chat
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        // Create the message
        let message;

        if (chat.type === 'private') {
            const otherUserId = chat.participants.find(p => p.toString() !== userId);
            message = new Message({
                text,
                senderId: userId,
                senderName: userName,
                chatType: 'private',
                recipientId: otherUserId,
                timestamp: new Date()
            });
        } else {
            message = new Message({
                text,
                senderId: userId,
                senderName: userName,
                chatType: 'group',
                tripId: chat.tripId,
                timestamp: new Date()
            });
        }

        await message.save();

        // Update chat's last message
        chat.lastMessage = `${userName}: ${text}`;
        chat.lastMessageTime = new Date();
        await chat.save();

        // Format response
        const formattedMessage = {
            id: message._id,
            text: message.text,
            sender: message.senderName,
            time: new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true
        };

        res.status(201).json(formattedMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Helper function to format time
const formatTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
};

module.exports = {
    getChats,
    getOrCreatePrivateChat,
    getOrCreateGlobalChat,
    getChatMessages,
    sendMessage
};
