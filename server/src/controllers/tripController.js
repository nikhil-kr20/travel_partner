const Trip = require('../models/Trip');

// @desc    Get all trips
// @route   GET /api/trips
// @access  Public
const getTrips = async (req, res) => {
    try {
        const trips = await Trip.find().sort({ createdAt: -1 }); // Newest first

        // Transform _id to id for frontend compatibility if needed, though Mongo uses _id
        const tripsWithId = trips.map(trip => ({
            ...trip.toObject(),
            id: trip._id // Ensure frontend sees 'id' property
        }));

        res.json(tripsWithId);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new trip
// @route   POST /api/trips
// @access  Public
const createTrip = async (req, res) => {
    const { origin, destination, date, mode, description, hostName, hostId, avatarColor } = req.body;

    if (!origin || !destination || !date) {
        return res.status(400).json({ message: 'Origin, destination and date are required' });
    }

    const trip = new Trip({
        origin,
        destination,
        date,
        mode,
        description,
        hostName: hostName || 'Anonymous',
        hostId: hostId || 'guest',
        avatarColor: avatarColor || '#0d9488'
    });

    try {
        const newTrip = await trip.save();
        // Return with id field
        res.status(201).json({ ...newTrip.toObject(), id: newTrip._id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getTrips,
    createTrip,
};
