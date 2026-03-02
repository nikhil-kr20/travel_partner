// src/routes/trip.routes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/trip.controller");
const { protect } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validate.middleware");
const schema = require("../validations/trip.validation");

// All trip routes require authentication
router.use(protect);

router.route("/")
    .get(controller.getTrips)
    .post(validate(schema.createTrip), controller.createTrip);

router.get("/my", controller.getMyTrips);
router.get("/by-user/:userId", controller.getTripsByUser);

router.route("/:id")
    .get(controller.getTripById)
    .patch(validate(schema.updateTrip), controller.updateTrip);

router.post("/:id/join", controller.joinTrip);
router.post("/:id/leave", controller.leaveTrip);
router.patch("/:id/cancel", controller.cancelTrip);

module.exports = router;
