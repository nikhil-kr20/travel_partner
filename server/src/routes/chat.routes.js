// src/routes/chat.routes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/chat.controller");
const { protect } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validate.middleware");
const { upload } = require("../config/cloudinary");
const schema = require("../validations/chat.validation");

router.use(protect);

// Chat list (type=personal|group|all)
router.get("/", controller.getChats);

// Create personal chat
router.post("/personal", validate(schema.createPersonalChat), controller.createPersonalChat);

// Get specific chat
router.get("/:chatId", controller.getChatById);

// Messages
router.get("/:chatId/messages", controller.getMessages);
router.patch("/:chatId/read", controller.markRead);
router.post("/:chatId/media", upload.single("file"), controller.sendMediaMessage);

// Delete a message
router.delete("/messages/:messageId", controller.deleteMessage);

module.exports = router;
