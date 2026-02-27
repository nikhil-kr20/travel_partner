// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../lib/api';
import { connectSocket, disconnectSocket } from '../lib/socket';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // loading initial session

    // ── Bootstrap: restore session from localStorage ────────────
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) { setLoading(false); return; }

        api.get('/v1/auth/me')
            .then(({ data }) => {
                const u = data.data.user;
                setUser(u);
                connectSocket(token);
            })
            .catch(() => {
                localStorage.removeItem('accessToken');
            })
            .finally(() => setLoading(false));
    }, []);

    // ── Listen for forced logout (token refresh failed) ─────────
    useEffect(() => {
        const handler = () => { setUser(null); disconnectSocket(); };
        window.addEventListener('auth:logout', handler);
        return () => window.removeEventListener('auth:logout', handler);
    }, []);

    // ── Login ───────────────────────────────────────────────────
    const login = useCallback(async ({ email, password, role }) => {
        const { data } = await api.post('/v1/auth/login', { email, password, role });
        const { user: u, accessToken } = data.data;
        localStorage.setItem('accessToken', accessToken);
        setUser(u);
        connectSocket(accessToken);
        return u;
    }, []);

    // ── Register ────────────────────────────────────────────────
    const register = useCallback(async ({ name, email, password, phone, role }) => {
        const { data } = await api.post('/v1/auth/register', { name, email, password, phone, role });
        const { user: u, accessToken } = data.data;
        localStorage.setItem('accessToken', accessToken);
        setUser(u);
        connectSocket(accessToken);
        return u;
    }, []);

    // ── Logout ──────────────────────────────────────────────────
    const logout = useCallback(async () => {
        try { await api.post('/v1/auth/logout'); } catch (_) { }
        localStorage.removeItem('accessToken');
        setUser(null);
        disconnectSocket();
    }, []);

    // ── Update profile in context after edit ────────────────────
    const updateUser = useCallback((updatedUser) => setUser(updatedUser), []);

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};
