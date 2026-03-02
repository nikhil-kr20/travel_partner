// src/services/trip.service.js
import api from '../lib/api';

export const getTrips = (params = {}) =>
    api.get('/v1/trips', { params }).then((r) => r.data.data);

export const getMyTrips = () =>
    api.get('/v1/trips/my').then((r) => r.data.data.trips);

export const getTripById = (id) =>
    api.get(`/v1/trips/${id}`).then((r) => r.data.data.trip);

export const createTrip = (body) =>
    api.post('/v1/trips', body).then((r) => r.data.data.trip);


export const cancelTrip = (id) =>
    api.patch(`/v1/trips/${id}/cancel`).then((r) => r.data.data.trip);

export const getTripsByUser = (userId) =>
    api.get(`/v1/trips/by-user/${userId}`).then((r) => r.data.data.trips);
