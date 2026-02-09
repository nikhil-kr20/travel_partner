const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    origin: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    mode: {
        type: String,
        default: 'Bus',
    },
    description: {
        type: String,
        default: '',
    },
    hostName: {
        type: String,
        required: true,
    },
    hostId: {
        type: String, // We'll just generate a random ID or use Name
        default: 'unknown'
    },
    avatarColor: {
        type: String,
        default: '#0d9488'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Trip', tripSchema);
