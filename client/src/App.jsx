import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { io } from "socket.io-client";
import Header from './components/Header';
import AuthScreen from './views/AuthScreen';
import HomeView from './views/HomeView';
import BrowseTripsView from './views/BrowseTripsView';
import PostTripView from './views/PostTripView';
import ProfileView from './views/ProfileView';
import ChatView from './views/ChatView';
import ChatsListView from './views/ChatsListView';
import './App.css';

// Use dynamic hostname - works with both localhost and IP address
const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  return `http://${hostname}:3000/api`;
};

const getSocketUrl = () => {
  const hostname = window.location.hostname;
  return `http://${hostname}:3000`;
};

const API_BASE = getApiBaseUrl();

function AppContent() {
  const navigate = useNavigate();

  // State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('travel_user');
    try { return saved ? JSON.parse(saved) : null; } catch (e) { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('travel_token'));

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState({ from: '', to: '' });

  // Chat & Profile State
  const [activeChat, setActiveChat] = useState(null);
  const [activeProfile, setActiveProfile] = useState(null);
  const [messages, setMessages] = useState({});
  const [socket, setSocket] = useState(null);

  // --- API HELPERS ---
  const apiFetch = async (endpoint, options = {}) => {
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // --- EFFECTS ---
  useEffect(() => {
    if (user) {
      const newSocket = io(getSocketUrl());
      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log("Connected to socket");
        newSocket.emit('join_private', user.id);
      });

      newSocket.on('receive_trip_message', (data) => {
        setMessages(prev => ({
          ...prev,
          [data.tripId]: [...(prev[data.tripId] || []), data]
        }));
      });

      newSocket.on('receive_private_message', (data) => {
        const partnerId = data.senderId;
        setMessages(prev => ({
          ...prev,
          [partnerId]: [...(prev[partnerId] || []), data]
        }));
      });

      return () => newSocket.close();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadTrips();
    }
  }, [user]);

  const loadTrips = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/trips');
      setTrips(data);
    } catch (e) {/* ignore */ }
    setLoading(false);
  };

  // --- HANDLERS ---
  const handleAuth = async (isLogin, formData) => {
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const data = await apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      setUser({ name: data.name, email: data.email, id: data._id });
      setToken(data.token);
      localStorage.setItem('travel_user', JSON.stringify({ name: data.name, email: data.email, id: data._id }));
      localStorage.setItem('travel_token', data.token);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('travel_user');
    localStorage.removeItem('travel_token');
    if (socket) socket.close();
    navigate('/');
  };

  const handlePostTrip = async (tripData) => {
    if (!user) return;
    try {
      await apiFetch('/trips', {
        method: 'POST',
        body: JSON.stringify({ ...tripData, hostName: user.name, hostId: user.id }),
      });
      loadTrips();
    } catch (err) {
      alert(err.message);
    }
  };

  const loadGroupMessages = async (tripId) => {
    try {
      const data = await apiFetch(`/messages/group/${tripId}`);
      setMessages(prev => ({
        ...prev,
        [tripId]: data
      }));
    } catch (error) {
      console.error('Error loading group messages:', error);
    }
  };

  const loadPrivateMessages = async (userId1, userId2) => {
    try {
      const data = await apiFetch(`/messages/private/${userId1}/${userId2}`);
      setMessages(prev => ({
        ...prev,
        [userId2]: data
      }));
    } catch (error) {
      console.error('Error loading private messages:', error);
    }
  };

  const startGroupChat = async (trip) => {
    setActiveChat({ type: 'group', id: trip.id, name: `${trip.origin} to ${trip.destination}`, data: trip });
    if (socket) {
      socket.emit('join_trip', trip.id);
    }
    // Load existing messages
    await loadGroupMessages(trip.id);
    navigate(`/chat/${trip.id}`);
  };

  const startPrivateChat = async (targetUser) => {
    setActiveChat({ type: 'private', id: targetUser.id, name: targetUser.name, data: targetUser });
    // Load existing messages
    await loadPrivateMessages(user.id, targetUser.id);
    navigate(`/chat/${targetUser.id}`);
  };

  const handleSendMessage = (text) => {
    if (!text.trim()) return;

    const timestamp = new Date().toISOString();
    const msgData = {
      text,
      senderId: user.id,
      senderName: user.name,
      timestamp,
      id: Date.now()
    };

    if (activeChat.type === 'group') {
      socket.emit('send_trip_message', { ...msgData, tripId: activeChat.id });
    } else {
      socket.emit('send_private_message', { ...msgData, toUserId: activeChat.id });
      setMessages(prev => ({
        ...prev,
        [activeChat.id]: [...(prev[activeChat.id] || []), msgData]
      }));
    }
  };

  const openProfile = (hostId, hostName) => {
    if (hostId === user.id) return;
    setActiveProfile({ id: hostId, name: hostName });
  };

  // --- RENDER ---
  if (!user) {
    return <AuthScreen onAuth={handleAuth} />;
  }

  return (
    <div className="app-container">
      <Header user={user} onLogout={handleLogout} />

      <Routes>
        <Route
          path="/"
          element={
            <HomeView
              trips={trips}
              loading={loading}
              onConnect={startGroupChat}
              onViewProfile={openProfile}
              user={user}
            />
          }
        />

        <Route
          path="/browse"
          element={
            <BrowseTripsView
              trips={trips}
              initialFilters={searchFilters}
              loading={loading}
              onConnect={startGroupChat}
              onViewProfile={openProfile}
              user={user}
            />
          }
        />

        <Route
          path="/post"
          element={
            <PostTripView
              onSubmit={handlePostTrip}
            />
          }
        />

        <Route
          path="/profile"
          element={
            <ProfileView
              user={user}
              onMessage={() => { }}
              isOwnProfile={true}
              trips={trips}
            />
          }
        />

        <Route
          path="/profile/:userId"
          element={
            activeProfile ? (
              <ProfileView
                user={activeProfile}
                onMessage={() => startPrivateChat(activeProfile)}
                isOwnProfile={false}
                trips={trips}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/chats"
          element={
            <ChatsListView
              messages={messages}
              user={user}
              onOpenChat={(chat) => {
                if (chat.type === 'group') {
                  setActiveChat({ type: 'group', id: chat.id, name: chat.name });
                } else {
                  setActiveChat({ type: 'private', id: chat.id, name: chat.name });
                }
              }}
            />
          }
        />

        <Route
          path="/chat/:chatId"
          element={
            activeChat ? (
              <ChatView
                chat={activeChat}
                user={user}
                messages={messages[activeChat.id] || []}
                onSend={handleSendMessage}
              />
            ) : (
              <Navigate to="/chats" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}