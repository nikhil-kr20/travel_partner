// src/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            trim: true,
            minlength: [3, "Username must be at least 3 characters"],
            maxlength: [20, "Username must be at most 20 characters"],
        },
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters"],
            maxlength: [50, "Name must be at most 50 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters"],
            select: false,
        },
        phone: {
            type: String,
            trim: true,
            match: [/^\+?[1-9]\d{7,14}$/, "Please enter a valid phone number"],
        },
        role: {
            type: String,
            enum: ["user", "rider", "admin"],
            default: "user",
        },
        profileImage: {
            url: { type: String, default: "" },
            publicId: { type: String, default: "" },
        },
        bio: {
            type: String,
            maxlength: [300, "Bio cannot exceed 300 characters"],
            default: "",
        },
        rating: {
            average: { type: Number, default: 0, min: 0, max: 5 },
            count: { type: Number, default: 0 },
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        refreshToken: {
            type: String,
            select: false,
        },
        passwordResetToken: {
            type: String,
            select: false,
        },
        passwordResetExpires: {
            type: Date,
            select: false,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                delete ret.password;
                delete ret.refreshToken;
                delete ret.passwordResetToken;
                delete ret.passwordResetExpires;
                delete ret.__v;
                return ret;
            },
        },
    }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

// Hash password before save
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Update rating helper
userSchema.methods.updateRating = async function (newRating) {
    const total = this.rating.average * this.rating.count + newRating;
    this.rating.count += 1;
    this.rating.average = parseFloat((total / this.rating.count).toFixed(2));
    await this.save();
};

module.exports = mongoose.model("User", userSchema);
