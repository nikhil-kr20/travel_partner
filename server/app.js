const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const tripRoutes = require('./src/routes/tripRoutes');

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.use('/api/trips', tripRoutes);
app.use('/api/auth', require('./src/routes/authRoutes'));

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
    });

    socket.on('send_trip_message', (data) => {
        io.to(data.tripId).emit('receive_trip_message', data);
    });

    // Private Chat
    socket.on('join_private', (userId) => {
        socket.join(userId);
    });

    socket.on('send_private_message', (data) => {
        // data must contain: toUserId, text, senderId, senderName, etc.
        io.to(data.toUserId).emit('receive_private_message', data);
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
