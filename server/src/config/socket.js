// src/config/socket.js
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const { getRedisClient } = require("./redis");
const { socketAuth } = require("../middlewares/auth.middleware");
const registerChatHandlers = require("../sockets/chat.socket");
const logger = require("../utils/logger");

/**
 * Initialise Socket.io on the given HTTP server.
 * Uses Redis adapter for horizontal scaling across multiple instances.
 */
const initSocket = async (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || "*",
            methods: ["GET", "POST"],
            credentials: true,
        },
        pingTimeout: 60000,
        pingInterval: 25000,
        transports: ["websocket", "polling"],
    });

    // ── Redis adapter for multi-instance scaling ──
    try {
        const pubClient = getRedisClient();
        const subClient = pubClient.duplicate();

        await pubClient.connect?.();
        await subClient.connect?.();

        io.adapter(createAdapter(pubClient, subClient));
        logger.info("Socket.io Redis adapter attached.");
    } catch (err) {
        logger.warn(`Redis adapter not available, using in-memory: ${err.message}`);
        // Falls back to in-memory adapter — still works for single instance
    }

    // ── Auth middleware ──
    io.use(socketAuth);

    // ── Connection handler ──
    io.on("connection", (socket) => {
        logger.info(`Socket connected: ${socket.id} (user ${socket.user._id})`);

        // Join personal room (for DM notifications)
        socket.join(socket.user._id.toString());

        // Register domain-specific handlers
        registerChatHandlers(io, socket);
    });

    return io;
};

module.exports = { initSocket };
