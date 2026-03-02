// src/app.js
require("dotenv").config(); // load env

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const tripRoutes = require("./routes/trip.routes");
const rideRoutes = require("./routes/ride.routes");
const bookingRoutes = require("./routes/booking.routes");
const chatRoutes = require("./routes/chat.routes");

const { errorHandler, notFound } = require("./middlewares/error.middleware");
const logger = require("./utils/logger");

const app = express();

// ─── Security Headers ────────────────────────────────────────
app.use(helmet());

// ─── CORS ────────────────────────────────────────────────────
const corsOptions = {
    origin: (origin, callback) => {
        const allowed = (process.env.CLIENT_URL || "").split(",").map((o) => o.trim());
        // Allow requests with no origin (mobile apps, Postman, curl, etc.)
        if (!origin) return callback(null, true);
        // Allow wildcard
        if (allowed.includes("*")) return callback(null, true);
        // Allow explicit origins from CLIENT_URL env var
        if (allowed.includes(origin)) return callback(null, true);
        // Allow ALL Vercel preview & production deployments automatically
        if (origin.endsWith(".vercel.app")) return callback(null, true);
        // Allow localhost for development
        if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) return callback(null, true);

        callback(new Error(`CORS: origin '${origin}' not allowed`));
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// ─── Request Parsing ─────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ─── HTTP Logging ────────────────────────────────────────────
const morganFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";
app.use(
    morgan(morganFormat, {
        stream: { write: (msg) => logger.http(msg.trim()) },
    })
);

// ─── Global Rate Limiting ────────────────────────────────────
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests. Please try again later." },
});
app.use(globalLimiter);


// ─── Health Check ────────────────────────────────────────────
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        status: "healthy",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

// ─── API Routes (versioned) ──────────────────────────────────
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/trips", tripRoutes);
app.use("/api/v1/rides", rideRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/chats", chatRoutes);

// Legacy aliases (non-versioned, for backwards compat)
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/chats", chatRoutes);

// ─── 404 Handler ─────────────────────────────────────────────
app.use(notFound);

// ─── Global Error Handler ────────────────────────────────────
app.use(errorHandler);

module.exports = app;