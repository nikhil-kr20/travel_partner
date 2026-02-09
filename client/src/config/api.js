// API Configuration - supports both production and local development
// Uses environment variables for flexible configuration

const PRODUCTION_API = import.meta.env.VITE_PRODUCTION_API_URL;
const PRODUCTION_SOCKET = import.meta.env.VITE_PRODUCTION_SOCKET_URL;
const LOCAL_API_PORT = import.meta.env.VITE_LOCAL_API_PORT || '3000';
const LOCAL_SOCKET_PORT = import.meta.env.VITE_LOCAL_SOCKET_PORT || '3000';

export const getApiBaseUrl = () => {
    // Check if we're in production (deployed) or development (localhost)
    const hostname = window.location.hostname;

    // If deployed (not localhost or IP address), use production backend
    if (hostname !== 'localhost' && !hostname.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) {
        return PRODUCTION_API;
    }

    // Otherwise, use local backend on same network
    return `http://${hostname}:3000/api`;
};

export const getSocketUrl = () => {
    const hostname = window.location.hostname;

    // If deployed (not localhost or IP address), use production Socket.IO
    if (hostname !== 'localhost' && !hostname.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) {
        return PRODUCTION_SOCKET;
    }

    // Otherwise, use local Socket.IO on same network
    return `http://${hostname}:3000`;
};

// Log configuration on startup
const apiUrl = getApiBaseUrl();
const socketUrl = getSocketUrl();
const environment = window.location.hostname === 'localhost' ? 'Development (Local)' : 'Production (Deployed)';

console.log('🌐 Backend Configuration:', {
    environment,
    apiUrl,
    socketUrl,
    hostname: window.location.hostname
});
