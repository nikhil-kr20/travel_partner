// src/config/db.js
const mongoose = require("mongoose");
const logger = require("../utils/logger");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // Production-ready options
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        logger.info(`MongoDB Connected: ${conn.connection.host}`);

        mongoose.connection.on("error", (err) => {
            logger.error(`MongoDB error: ${err.message}`);
        });

        mongoose.connection.on("disconnected", () => {
            logger.warn("MongoDB disconnected. Attempting to reconnect...");
        });

        mongoose.connection.on("reconnected", () => {
            logger.info("MongoDB reconnected.");
        });
    } catch (err) {
        logger.error(`MongoDB connection failed: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
