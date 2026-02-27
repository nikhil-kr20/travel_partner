// server.js — Application Entry Point
require("dotenv").config();

const http = require("http");
const app = require("./src/app");
const connectDB = require("./src/config/db");
const { initSocket } = require("./src/config/socket");
const logger = require("./src/utils/logger");

const PORT = process.env.PORT || 5000;

const start = async () => {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Create HTTP server
    const server = http.createServer(app);

    // 3. Initialise Socket.io (with Redis adapter)
    await initSocket(server);

    // 4. Start listening
    server.listen(PORT, () => {
        logger.info(`🚀 Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
        logger.info(`📡 Health check: http://localhost:${PORT}/health`);
    });

    // ─── Graceful Shutdown ──────────────────────────────────────
    const shutdown = async (signal) => {
        logger.warn(`${signal} received. Shutting down gracefully...`);

        server.close(async () => {
            logger.info("HTTP server closed.");

            const mongoose = require("mongoose");
            await mongoose.connection.close();
            logger.info("MongoDB connection closed.");

            process.exit(0);
        });

        // Force exit after 10s
        setTimeout(() => {
            logger.error("Forceful shutdown after timeout.");
            process.exit(1);
        }, 10000);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    // ─── Unhandled Errors ───────────────────────────────────────
    process.on("unhandledRejection", (reason) => {
        logger.error(`Unhandled Rejection: ${reason}`);
        shutdown("unhandledRejection");
    });

    process.on("uncaughtException", (err) => {
        logger.error(`Uncaught Exception: ${err.message}`);
        shutdown("uncaughtException");
    });
};

start();