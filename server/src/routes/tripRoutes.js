const express = require('express');
const router = express.Router();
const { getTrips, createTrip } = require('../controllers/tripController');

router.route('/')
    .get(getTrips)
    .post(createTrip);

module.exports = router;
