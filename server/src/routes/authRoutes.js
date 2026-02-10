const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const User = require('../models/User');
const Trip = require('../models/Trip');

router.post('/register', registerUser);
router.post('/login', loginUser);

// Get user profile with stats
router.get('/user/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get trip count
        const tripCount = await Trip.countDocuments({ hostId: req.params.userId });

        res.json({
            _id: user._id,
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar || `https://i.pravatar.cc/150?u=${user._id}`,
            stats: {
                trips: tripCount,
                rating: 5.0,
                friends: 0
            }
        });
    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({ message: 'Error fetching user profile' });
    }
});

module.exports = router;
