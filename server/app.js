const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const tripRoutes = require('./src/routes/tripRoutes');
const messageRoutes = require('./src/routes/messageRoutes');
const Message = require('./src/models/Message');

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.use('/api/trips', tripRoutes);
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/messages', messageRoutes);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Group Chat (Trip)
    socket.on('join_trip', (tripId) => {
        socket.join(tripId);
        console.log(`User joined trip: ${tripId}`);
    });

    socket.on('send_trip_message', async (data) => {
        try {
            // Save message to database
            const message = new Message({
                text: data.text,
                senderId: data.senderId,
                senderName: data.senderName,
                chatType: 'group',
                tripId: data.tripId,
                timestamp: data.timestamp || new Date()
            });

            await message.save();

            // Emit to all users in the trip room
            io.to(data.tripId).emit('receive_trip_message', {
                ...data,
                _id: message._id
            });

            console.log(`Group message saved: ${message._id}`);
        } catch (error) {
            console.error('Error saving group message:', error);
        }
    });

    // Private Chat
    socket.on('join_private', (userId) => {
        socket.join(userId);
        console.log(`User joined private room: ${userId}`);
    });

    socket.on('send_private_message', async (data) => {
        try {
            // Save message to database
            const message = new Message({
                text: data.text,
                senderId: data.senderId,
                senderName: data.senderName,
                chatType: 'private',
                recipientId: data.toUserId,
                timestamp: data.timestamp || new Date()
            });

            await message.save();

            // Emit to the recipient
            io.to(data.toUserId).emit('receive_private_message', {
                ...data,
                _id: message._id
            });

            // Also send back to sender for confirmation
            socket.emit('message_sent', {
                ...data,
                _id: message._id
            });

            console.log(`Private message saved: ${message._id}`);
        } catch (error) {
            console.error('Error saving private message:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    console.log(`Access locally at: http://localhost:${PORT}`);
    console.log(`Access on network at: http://<your-ip>:${PORT}`);
});
