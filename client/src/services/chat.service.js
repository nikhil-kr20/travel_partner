// src/services/chat.service.js
import api from '../lib/api';

export const getChats = (type = 'all') =>
    api.get('/v1/chats', { params: { type } }).then((r) => r.data.data.chats);

export const getChatById = (chatId) =>
    api.get(`/v1/chats/${chatId}`).then((r) => r.data.data.chat);

export const getMessages = (chatId, params = {}) =>
    api.get(`/v1/chats/${chatId}/messages`, { params }).then((r) => r.data.data);

export const createPersonalChat = (receiverId) =>
    api.post('/v1/chats/personal', { receiverId }).then((r) => r.data.data.chat);

export const markRead = (chatId) =>
    api.patch(`/v1/chats/${chatId}/read`).then((r) => r.data);

export const deleteMessage = (messageId) =>
    api.delete(`/v1/chats/messages/${messageId}`).then((r) => r.data);

export const joinTripGroupChat = (tripId) =>
    api.post(`/v1/chats/trip/${tripId}/join`).then((r) => r.data.data.chat);
