// src/services/booking.service.js
import api from '../lib/api';

export const createBooking = (body) =>
    api.post('/v1/bookings', body).then((r) => r.data.data.booking);

export const getMyBookings = () =>
    api.get('/v1/bookings/my').then((r) => r.data.data.bookings);

export const getBookingById = (id) =>
    api.get(`/v1/bookings/${id}`).then((r) => r.data.data.booking);

export const cancelBooking = (id) =>
    api.patch(`/v1/bookings/${id}/cancel`).then((r) => r.data.data.booking);

export const acceptBooking = (id) =>
    api.patch(`/v1/bookings/${id}/accept`).then((r) => r.data.data.booking);

export const completeBooking = (id) =>
    api.patch(`/v1/bookings/${id}/complete`).then((r) => r.data.data.booking);

export const getRideBookings = (rideId) =>
    api.get(`/v1/bookings/ride/${rideId}`).then((r) => r.data.data.bookings);
