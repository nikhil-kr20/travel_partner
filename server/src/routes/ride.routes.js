// src/routes/ride.routes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/ride.controller");
const { protect } = require("../middlewares/auth.middleware");
const { restrictTo } = require("../middlewares/role.middleware");
const { validate } = require("../middlewares/validate.middleware");
const schema = require("../validations/ride.validation");

router.use(protect);

// Any authenticated user can browse rides
router.get("/", controller.getRides);
router.get("/my", restrictTo("rider"), controller.getMyRides);
router.get("/:id", controller.getRideById);

// Rider-only actions
router.post("/", restrictTo("rider"), validate(schema.createRide), controller.createRide);
router.patch("/:id", restrictTo("rider"), validate(schema.updateRide), controller.updateRide);
router.patch("/:id/cancel", restrictTo("rider"), controller.cancelRide);

module.exports = router;
