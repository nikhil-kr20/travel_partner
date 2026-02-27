// src/services/ride.service.js
import api from '../lib/api';

export const getRides = (params = {}) =>
    api.get('/v1/rides', { params }).then((r) => r.data.data);

export const getMyRides = () =>
    api.get('/v1/rides/my').then((r) => r.data.data.rides);

export const getRideById = (id) =>
    api.get(`/v1/rides/${id}`).then((r) => r.data.data.ride);

export const createRide = (body) =>
    api.post('/v1/rides', body).then((r) => r.data.data.ride);

export const updateRide = (id, body) =>
    api.patch(`/v1/rides/${id}`, body).then((r) => r.data.data.ride);

export const cancelRide = (id) =>
    api.patch(`/v1/rides/${id}/cancel`).then((r) => r.data.data.ride);
