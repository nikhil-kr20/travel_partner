// src/utils/generateBill.js

/**
 * Calculate ride booking total amount.
 * Formula: estimatedDistance * pricePerKm * seatsBooked
 *
 * @param {Object} params
 * @param {number} params.estimatedDistance - Distance in km
 * @param {number} params.pricePerKm - Price per km set by rider
 * @param {number} params.seatsBooked - Number of seats booked
 * @returns {number} totalAmount
 */
const calculateRideBill = ({ estimatedDistance, pricePerKm, seatsBooked }) => {
    if (!estimatedDistance || !pricePerKm || !seatsBooked) {
        throw new Error("Invalid billing parameters: distance, pricePerKm and seatsBooked are required.");
    }

    const total = parseFloat(
        (estimatedDistance * pricePerKm * seatsBooked).toFixed(2)
    );
    return total;
};

/**
 * Generate a formatted bill object for a ride booking.
 *
 * @param {Object} ride - Ride document
 * @param {Object} booking - Booking document
 * @returns {Object} Bill details
 */
const generateBillSummary = (ride, booking) => {
    const totalAmount = calculateRideBill({
        estimatedDistance: ride.estimatedDistance,
        pricePerKm: ride.pricePerKm,
        seatsBooked: booking.seatsBooked,
    });

    return {
        rideId: ride._id,
        bookingId: booking._id,
        riderId: ride.riderId,
        passengerId: booking.userId,
        vehicleType: ride.vehicleType,
        fromLocation: ride.fromLocation,
        toLocation: ride.toLocation,
        date: ride.date,
        seatsBooked: booking.seatsBooked,
        pricePerKm: ride.pricePerKm,
        estimatedDistance: ride.estimatedDistance,
        totalAmount,
        paymentNote: "Please pay the rider directly via UPI or Cash.",
        generatedAt: new Date().toISOString(),
    };
};

module.exports = { calculateRideBill, generateBillSummary };
