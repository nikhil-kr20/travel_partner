// src/routes/auth.routes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validate.middleware");
const { upload } = require("../config/cloudinary");
const schema = require("../validations/auth.validation");

// Public
router.post("/register", validate(schema.register), controller.register);
router.post("/login", validate(schema.login), controller.login);
router.post("/refresh-token", controller.refreshToken);

// Protected
router.use(protect);
router.post("/logout", controller.logout);
router.get("/me", controller.getMe);
router.patch("/me", validate(schema.updateProfile), controller.updateProfile);
router.patch("/me/avatar", upload.single("avatar"), controller.uploadProfileImage);

// Get any public user profile by ID
router.get("/users/:id", controller.getUserById);
// Get any public user profile by username
router.get("/users/profile/:username", controller.getPublicProfile);

module.exports = router;
