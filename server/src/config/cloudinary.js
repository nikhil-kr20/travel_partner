// src/config/cloudinary.js
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const path = require("path");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

// Use memory storage — upload buffer directly to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedMimes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "application/pdf",
    ];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Unsupported file type. Allowed: JPEG, PNG, GIF, WEBP, PDF"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

/**
 * Upload a buffer to Cloudinary
 * @param {Buffer} buffer
 * @param {string} folder
 * @returns {Promise<{url: string, publicId: string}>}
 */
const uploadToCloudinary = (buffer, folder = "travel_partner") => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type: "auto" },
            (error, result) => {
                if (error) return reject(error);
                resolve({ url: result.secure_url, publicId: result.public_id });
            }
        );
        stream.end(buffer);
    });
};

/**
 * Delete a resource from Cloudinary
 * @param {string} publicId
 */
const deleteFromCloudinary = (publicId) =>
    cloudinary.uploader.destroy(publicId);

module.exports = { cloudinary, upload, uploadToCloudinary, deleteFromCloudinary };
