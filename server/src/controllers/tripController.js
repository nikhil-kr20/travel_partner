const Trip = require('../models/Trip');
const User = require('../models/User');

// @desc    Get all trips
// @route   GET /api/trips
// @access  Public
const getTrips = async (req, res) => {
    try {
        const trips = await Trip.find().sort({ createdAt: -1 }); // Newest first

        // Populate host user data
        const tripsWithHostData = await Promise.all(trips.map(async (trip) => {
            let hostUser = null;

            // Try to find the host user in the database
            if (trip.hostId) {
                try {
                    hostUser = await User.findById(trip.hostId).select('name email avatar');
                } catch (err) {
                    console.log('Could not find user for hostId:', trip.hostId);
                }
            }

            return {
                ...trip.toObject(),
                id: trip._id,
                hostName: hostUser?.name || trip.hostName || 'Anonymous',
                hostAvatar: hostUser?.avatar || `https://i.pravatar.cc/150?u=${trip._id}`
            };
        }));

        res.json(tripsWithHostData);
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
