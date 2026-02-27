// src/services/auth.service.js
import api from '../lib/api';

export const getMe = () =>
    api.get('/v1/auth/me').then((r) => r.data.data.user);

export const updateProfile = (body) =>
    api.patch('/v1/auth/me', body).then((r) => r.data.data.user);

export const uploadAvatar = (file) => {
    const form = new FormData();
    form.append('avatar', file);
    return api.patch('/v1/auth/me/avatar', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data.data.user);
};

export const getUserById = (id) =>
    api.get(`/v1/auth/users/${id}`).then((r) => r.data.data.user);
