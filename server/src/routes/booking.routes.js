// src/routes/booking.routes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/booking.controller");
const { protect } = require("../middlewares/auth.middleware");
const { restrictTo } = require("../middlewares/role.middleware");
const { validate } = require("../middlewares/validate.middleware");
const schema = require("../validations/booking.validation");

router.use(protect);

// Passenger: create and view own bookings
router.post("/", validate(schema.createBooking), controller.createBooking);
router.get("/my", controller.getMyBookings);
router.get("/:id", controller.getBookingById);
router.patch("/:id/cancel", controller.cancelBooking);

// Rider: accept / complete bookings, view bookings for their ride
router.patch("/:id/accept", restrictTo("rider"), controller.acceptBooking);
router.patch("/:id/complete", restrictTo("rider"), controller.completeBooking);
router.get("/ride/:rideId", restrictTo("rider"), controller.getRideBookings);

module.exports = router;
