import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import {
  MapPin,
  Calendar,
  Users,
  MessageCircle,
  Search,
  Plus,
  Home,
  Compass,
  Car,
  User,
  Navigation,
  Zap,
  Map as MapIcon,
  Send,
  Loader2,
  Lock,
  Mail,
  ArrowRight,
  X,
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Globe,
  ChevronDown
} from 'lucide-react';

// --- CSS Styles (No Tailwind) ---
const styles = `
:root {
  --primary: #06b6d4;
  --secondary: #8b5cf6;
  --accent: #ec4899;
  --bg-dark: #000000;
  --bg-card: rgba(20, 20, 20, 0.6);
  --bg-input: rgba(30, 30, 30, 0.8);
  --text-main: #ffffff;
  --text-muted: #9ca3af;
  --border-light: rgba(255, 255, 255, 0.1);
  --glass-blur: blur(12px);
  --gradient-main: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
  --safe-bottom: 80px;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--bg-dark);
  color: var(--text-main);
  -webkit-font-smoothing: antialiased;
}

/* --- Layout & Utilities --- */
.app-container {
  min-height: 100vh;
  width: 100%;
  margin: 0 auto;
  position: relative;
  background: radial-gradient(circle at top left, rgba(30, 58, 138, 0.2), transparent 40%),
              radial-gradient(circle at bottom right, rgba(88, 28, 135, 0.2), transparent 40%);
  overflow-x: hidden;
  padding-bottom: var(--safe-bottom);
}

.auth-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px;
  background: radial-gradient(circle at center, rgba(6, 182, 212, 0.1), transparent 70%);
}

.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

@media (max-width: 480px) {
  .grid-layout {
    grid-template-columns: 1fr;
  }
}

.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.justify-center { justify-content: center; }
.gap-1 { gap: 4px; }
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.gap-4 { gap: 16px; }
.w-full { width: 100%; }
.text-center { text-align: center; }

/* --- Header --- */
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: var(--glass-blur);
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-box {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--gradient-main);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.brand-text {
  font-size: 20px;
  font-weight: 800;
  background: linear-gradient(to right, #fff, #9ca3af);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}

.header-actions button {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;
}

.header-actions button:hover { color: white; }

/* --- Navigation --- */
.navbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: var(--glass-blur);
  border-top: 1px solid var(--border-light);
  padding: 12px 24px;
  display: flex;
  justify-content: center; 
  gap: 40px;
  align-items: center;
  z-index: 100;
}

.nav-item {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 10px;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 60px;
}

.nav-item.active {
  color: var(--primary);
  transform: translateY(-2px);
}

/* --- Cards (Feed & Companion) --- */
.view-container {
  padding: 24px;
  animation: fadeIn 0.5s ease;
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  margin-bottom: 24px;
}
.section-title h2 { margin: 0; font-size: 28px; font-weight: 700; }
.section-title p { margin: 4px 0 0; color: var(--text-muted); font-size: 16px; }

.card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s ease;
  height: 100%; 
  display: flex;
  flex-direction: column;
}

.card:hover { border-color: rgba(6, 182, 212, 0.4); }

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(6, 182, 212, 0.2);
}

.user-details h3 { margin: 0; font-size: 14px; font-weight: 600; color: white; }
.user-details p { margin: 0; font-size: 12px; color: var(--text-muted); }

.like-badge {
  font-size: 12px;
  font-family: monospace;
  color: var(--primary);
  background: rgba(6, 182, 212, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid rgba(6, 182, 212, 0.2);
}

.trip-route {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.route-point { flex: 1; }
.route-point .label { font-size: 10px; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px; }
.route-point .value { font-size: 18px; font-weight: 700; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.route-point.right { text-align: right; }

.route-line {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  position: relative;
}
.line { width: 100%; height: 2px; background: #4b5563; }
.car-icon { position: absolute; top: -10px; color: var(--text-muted); }

.trip-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #d1d5db;
  margin-bottom: 12px;
}

.trip-desc {
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-muted);
  margin-bottom: 16px;
  flex-grow: 1;
}

.tag-container { display: flex; flex-wrap: wrap; gap: 8px; }
.tag {
  font-size: 12px;
  background: rgba(255, 255, 255, 0.05);
  color: #d1d5db;
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid var(--border-light);
}

.trip-actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 16px;
}

.btn-secondary {
  background: rgba(255,255,255,0.1);
  color: white;
  border: 1px solid rgba(255,255,255,0.2);
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex: 1;
}
.btn-secondary:hover { background: rgba(255,255,255,0.2); }

/* --- Companion Specifics --- */
.companion-card {
  background: linear-gradient(135deg, rgba(30,30,30,0.8), rgba(20,20,20,0.9));
  border-radius: 24px;
  padding: 4px;
  position: relative;
  height: 100%;
}

.companion-inner {
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(4px);
  border-radius: 20px;
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.companion-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.activity-badge {
  background: rgba(139, 92, 246, 0.2);
  color: #d8b4fe;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.distance-badge {
  color: var(--text-muted);
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.btn-join {
  background: white;
  color: black;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-join:hover { background: #e5e7eb; }

/* --- Ride View --- */
.ride-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 100px;
  max-width: 600px; /* Limit ride width on desktop */
  margin: 0 auto;
}

.map-placeholder {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #1f2937;
  background-image: radial-gradient(#374151 1px, transparent 1px);
  background-size: 20px 20px;
  z-index: 0;
  opacity: 0.5;
}

.ride-panel {
  position: relative;
  z-index: 10;
  margin-top: auto;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 24px 24px 0 0;
  border-top: 1px solid var(--border-light);
  padding: 24px;
  box-shadow: 0 -10px 40px rgba(0,0,0,0.5);
}

.input-group {
  background: var(--bg-input);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  transition: border-color 0.2s;
}
.input-group:focus-within { border-color: var(--primary); }

.dot { width: 8px; height: 8px; border-radius: 50%; background: var(--primary); box-shadow: 0 0 10px rgba(6,182,212,0.5); }
.square { width: 8px; height: 8px; background: var(--accent); transform: rotate(45deg); box-shadow: 0 0 10px rgba(236,72,153,0.5); }

.ride-input {
  background: transparent;
  border: none;
  outline: none;
  color: white;
  width: 100%;
  font-size: 14px;
}

.vehicle-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin: 24px 0;
}

.vehicle-card {
  background: rgba(255,255,255,0.05);
  border: 1px solid transparent;
  border-radius: 12px;
  padding: 12px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
}
.vehicle-card.selected {
  background: rgba(6,182,212,0.15);
  border-color: var(--primary);
  color: white;
  transform: scale(1.05);
}

.vehicle-name { font-size: 10px; font-weight: 700; text-transform: uppercase; margin-top: 4px; }
.vehicle-price { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

.btn-primary {
  width: 100%;
  background: var(--gradient-main);
  border: none;
  padding: 16px;
  border-radius: 12px;
  color: white;
  font-weight: 700;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(6,182,212,0.3);
  transition: transform 0.2s;
}
.btn-primary:active { transform: scale(0.98); }
.btn-primary:disabled { background: #374151; color: #9ca3af; box-shadow: none; cursor: not-allowed; }

/* --- Profile --- */
.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
}
.profile-img-container {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  padding: 3px;
  background: linear-gradient(to top right, #06b6d4, #ec4899);
  margin-bottom: 16px;
}
.profile-img { width: 100%; height: 100%; border-radius: 50%; border: 4px solid black; object-fit: cover; }
.stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px; max-width: 400px; margin-left: auto; margin-right: auto; }
.stat-box { background: #111; border: 1px solid var(--border-light); border-radius: 16px; padding: 12px; text-align: center; }
.stat-val { display: block; font-size: 20px; font-weight: 700; color: white; }
.stat-label { font-size: 10px; text-transform: uppercase; color: var(--text-muted); letter-spacing: 1px; }

/* --- FAB & Modals --- */
.fab {
  position: fixed;
  bottom: 96px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--gradient-main);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 25px rgba(6, 182, 212, 0.4);
  cursor: pointer;
  z-index: 90;
  transition: transform 0.2s;
}
.fab:hover { transform: scale(1.1); }
.fab:active { transform: scale(0.95); }

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(4px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.modal-content {
  background: #121212;
  border: 1px solid var(--border-light);
  width: 100%;
  max-width: 400px;
  border-radius: 24px;
  padding: 24px;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}
.close-btn { position: absolute; top: 16px; right: 16px; background: none; border: none; color: var(--text-muted); cursor: pointer; }
.form-group { margin-bottom: 16px; }
.form-label { display: block; font-size: 12px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px; }
.form-input { 
  width: 100%; 
  background: rgba(255,255,255,0.05); 
  border: 1px solid var(--border-light); 
  border-radius: 12px; 
  padding: 12px; 
  color: white; 
  outline: none;
}
.form-input:focus { border-color: var(--primary); }

.auth-toggle {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: var(--text-muted);
}
.auth-link {
  color: var(--primary);
  font-weight: 700;
  cursor: pointer;
  background: none;
  border: none;
  margin-left: 4px;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* --- Split Chat Views (Instagram Style & Responsive) --- */
.chat-split-container {
  display: flex;
  height: calc(100vh - 140px);
  background: black;
  overflow: hidden;
  max-width: 1200px;
  margin: 0 auto;
  border: 1px solid var(--border-light);
  border-radius: 12px;
}

/* Default Desktop: Split View */
.chat-sidebar {
  width: 35%;
  min-width: 300px;
  border-right: 1px solid var(--border-light);
  overflow-y: auto;
  background: rgba(20,20,20,0.5);
  display: flex;
  flex-direction: column;
}

.chat-main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: black;
  position: relative;
}

/* Mobile Responsive Chat Logic */
@media (max-width: 768px) {
  .chat-split-container {
    border: none;
    border-radius: 0;
    margin: 0;
    height: calc(100vh - 120px);
  }
  
  .chat-sidebar {
    width: 100%;
    border-right: none;
    display: flex; /* Shown by default on mobile */
  }

  .chat-main-area {
    width: 100%;
    position: absolute;
    top: 0; left: 0; height: 100%;
    z-index: 50;
    background: black;
    display: none; /* Hidden by default on mobile */
  }

  /* When chat is active on mobile, hide list and show detail */
  .chat-split-container.mobile-active .chat-sidebar {
    display: none;
  }
  .chat-split-container.mobile-active .chat-main-area {
    display: flex;
  }
}

/* Visibility of Back Button: Only on Mobile */
.mobile-back-btn {
  display: none;
}
@media (max-width: 768px) {
  .mobile-back-btn {
    display: block;
  }
}

.empty-chat-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  gap: 16px;
}

.chat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid var(--border-light);
  cursor: pointer;
  transition: background 0.2s;
}
.chat-item:hover, .chat-item.active { background: rgba(255,255,255,0.08); }
.chat-avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.chat-info { flex: 1; overflow: hidden; }
.chat-header-row { display: flex; justify-content: space-between; margin-bottom: 4px; }
.chat-name { font-weight: 600; font-size: 14px; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.chat-time { font-size: 10px; color: var(--text-muted); }
.chat-preview { font-size: 12px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.unread-badge { background: var(--primary); color: white; font-size: 10px; padding: 2px 6px; border-radius: 10px; margin-left: auto; }

.chat-detail-container { display: flex; flex-direction: column; height: 100%; background: #0a0a0a; }
.chat-detail-header { 
  display: flex; 
  align-items: center; 
  gap: 12px; 
  padding: 12px 16px; 
  border-bottom: 1px solid var(--border-light); 
  background: rgba(20,20,20,0.9); 
  backdrop-filter: blur(10px);
  z-index: 10;
  height: 60px;
}
.chat-messages { 
  flex: 1; 
  overflow-y: auto; 
  padding: 16px; 
  display: flex; 
  flex-direction: column; 
  gap: 12px; 
  background-image: radial-gradient(#1f2937 1px, transparent 1px);
  background-size: 20px 20px;
}
.message-bubble { 
  max-width: 85%; 
  padding: 10px 14px; 
  border-radius: 18px; 
  font-size: 13px; 
  line-height: 1.4; 
  position: relative;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}
.message-bubble.sent { 
  align-self: flex-end; 
  background: var(--gradient-main); 
  color: white; 
  border-bottom-right-radius: 4px; 
}
.message-bubble.received { 
  align-self: flex-start; 
  background: #262626; 
  border: 1px solid var(--border-light); 
  color: var(--text-main); 
  border-bottom-left-radius: 4px; 
}
.message-time {
  font-size: 9px;
  margin-top: 4px;
  text-align: right;
  opacity: 0.7;
  display: block;
}
.chat-input-area { 
  padding: 12px; 
  border-top: 1px solid var(--border-light); 
  background: #0a0a0a; 
  display: flex; 
  gap: 8px; 
  align-items: center; 
}

/* --- Filter Dropdown --- */
.filter-dropdown-container {
  position: relative;
  display: inline-block;
  margin-left: auto;
}

.filter-dropdown-btn {
  background: transparent;
  border: 1px solid var(--border-light);
  color: var(--text-main);
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.filter-dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: #1f1f1f;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  z-index: 50;
  min-width: 120px;
  overflow: hidden;
}

.filter-option {
  padding: 8px 12px;
  font-size: 13px;
  color: var(--text-muted);
  cursor: pointer;
  transition: background 0.2s;
}

.filter-option:hover {
  background: rgba(255,255,255,0.1);
  color: white;
}

.filter-option.selected {
  color: var(--primary);
  font-weight: 600;
}
`;

// --- GSAP Helper ---
const useGSAP = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
    script.async = true;
    script.onload = () => {
      if (window.gsap) {
        window.gsap.from(".gsap-fade-up", {
          y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out"
        });
        window.gsap.from(".gsap-scale-in", {
          scale: 0.8, opacity: 0, duration: 0.5, ease: "back.out(1.7)"
        });
      }
    };
    document.body.appendChild(script);
    return () => { if (document.body.contains(script)) document.body.removeChild(script); };
  }, []);
};

// Single-tunnel friendly defaults: frontend and backend share one public origin via Vite proxy.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD
    ? "https://travel-partner-7gbm.onrender.com/api"
    : "/api");

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ||
  (import.meta.env.PROD
    ? "https://travel-partner-7gbm.onrender.com"
    : window.location.origin);

// Initialize Socket.IO connection
let socket = null;
const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true
    });
  }
  return socket;
};

const RIDE_OPTIONS = [
  { id: 'auto', name: 'Auto', icon: Zap, price: '₹45', eta: '3m' },
  { id: 'bike', name: 'Moto', icon: Navigation, price: '₹25', eta: '1m' },
  { id: 'mini', name: 'Mini', icon: Car, price: '₹120', eta: '8m' },
  { id: 'suv', name: 'SUV', icon: Car, price: '₹190', eta: '12m' },
];

const formatDate = (dateString) => {
  if (!dateString) return 'TBD';
  const options = { month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// --- Authentication View ---
const AuthView = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : { name: formData.name, email: formData.email, password: formData.password };

    try {
      console.log('Sending auth request:', endpoint, payload);
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      console.log('Auth response:', data);

      if (!res.ok) {
        console.error('Auth failed:', data);
        throw new Error(data.message || 'Authentication failed');
      }

      // Success - Save token/user and redirect
      console.log('Login successful, raw data:', data);

      let userData = data.user;
      if (!userData && (data._id || data.id)) {
        console.log('User data found at root level, using root object');
        userData = data;
      }

      userData = userData || {};

      // Ensure user has all required fields
      if (!userData.name) {
        console.warn('User object missing name field!', userData);
        // Extract name from email if missing
        userData.name = userData.email ? userData.email.split('@')[0] : 'User';
      }

      console.log('Final user data to save:', userData);
      onLoginSuccess(userData);

    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="card gsap-fade-up" style={{ maxWidth: 400, margin: '0 auto', width: '100%', padding: 32 }}>
        <div className="text-center mb-8">
          <div className="logo-box" style={{ width: 60, height: 60, margin: '0 auto 16px' }}>
            <Navigation size={32} />
          </div>
          <h1 className="brand-text" style={{ fontSize: 28 }}>TraveLink</h1>
          <p style={{ color: '#9ca3af', marginTop: 8 }}>
            {isLogin ? "Welcome back, traveler!" : "Start your adventure today."}
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: 12, borderRadius: 8, fontSize: 13, textAlign: 'center', marginBottom: 16, border: '1px solid rgba(239,68,68,0.2)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-group" style={{ background: 'rgba(255,255,255,0.05)', marginBottom: 0 }}>
                <User size={18} color="#9ca3af" />
                <input
                  name="name"
                  type="text"
                  className="ride-input"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-group" style={{ background: 'rgba(255,255,255,0.05)', marginBottom: 0 }}>
              <Mail size={18} color="#9ca3af" />
              <input
                name="email"
                type="email"
                className="ride-input"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-group" style={{ background: 'rgba(255,255,255,0.05)', marginBottom: 0 }}>
              <Lock size={18} color="#9ca3af" />
              <input
                name="password"
                type="password"
                className="ride-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: 24 }} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? "Sign In" : "Create Account")}
          </button>
        </form>

        <div className="auth-toggle">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button className="auth-link" onClick={() => { setIsLogin(!isLogin); setError(null); }}>
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Sub-Components ---

const Navbar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Trips' },
    { id: 'companion', icon: Compass, label: 'Meet' },
    { id: 'ride', icon: Car, label: 'Ride' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="navbar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
        >
          <tab.icon size={24} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

const Header = ({ showSearch, setShowSearch, searchQuery, setSearchQuery, onOpenChats }) => (
  <header className="header">
    {showSearch ? (
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '12px' }}>
        <Search size={20} color="#9ca3af" />
        <input
          type="text"
          autoFocus
          placeholder="Search places..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'white',
            flex: 1,
            fontSize: '16px'
          }}
        />
        <button onClick={() => { setShowSearch(false); setSearchQuery(''); }} style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', color: '#9ca3af' }}>
          <X size={20} />
        </button>
      </div>
    ) : (
      <>
        <div className="brand">
          <div className="logo-box">
            <Navigation size={18} />
          </div>
          <h1 className="brand-text">TraveLink</h1>
        </div>
        <div className="header-actions">
          <button onClick={() => setShowSearch(true)}><Search size={22} /></button>
          <button onClick={onOpenChats} style={{ position: 'relative' }}>
            <MessageCircle size={22} />
            <span style={{ position: 'absolute', top: 0, right: 0, width: 8, height: 8, background: '#ef4444', borderRadius: '50%' }}></span>
          </button>
        </div>
      </>
    )}
  </header>
);

// --- Chat Components (Split Layout) ---

const ChatsListView = ({ onSelectChat, activeChatId, userId }) => {
  const [filter, setFilter] = useState('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real chats from backend
  useEffect(() => {
    const fetchChats = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/chats?userId=${userId}`);
        const data = await res.json();
        setChats(data);
      } catch (error) {
        console.error('Error fetching chats:', error);
        setChats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();

    // Refresh chats every 10 seconds
    const interval = setInterval(fetchChats, 10000);
    return () => clearInterval(interval);
  }, [userId]);

  const filteredChats = chats.filter(chat => {
    if (filter === 'All') return true;
    if (filter === 'Personal') return chat.type === 'private';
    if (filter === 'Group') return chat.type === 'global';
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: 16, fontWeight: 'bold', margin: 0 }}>Messages</h2>

        {/* Filter Dropdown */}
        <div className="filter-dropdown-container">
          <button className="filter-dropdown-btn" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            {filter} <ChevronDown size={14} />
          </button>

          {isDropdownOpen && (
            <div className="filter-dropdown-menu">
              {['All', 'Personal', 'Group'].map((opt) => (
                <div
                  key={opt}
                  className={`filter-option ${filter === opt ? 'selected' : ''}`}
                  onClick={() => { setFilter(opt); setIsDropdownOpen(false); }}
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {loading ? (
          <div className="flex justify-center items-center" style={{ padding: '40px' }}>
            <Loader2 className="animate-spin" color="#06b6d4" size={28} />
          </div>
        ) : (
          <>
            {filteredChats.map(chat => (
              <div
                key={chat.id}
                className={`chat-item ${activeChatId === chat.id ? 'active' : ''}`}
                onClick={() => onSelectChat(chat)}
              >
                {chat.type === 'global' ? (
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Globe size={20} color="white" />
                  </div>
                ) : (
                  <img src={chat.user.avatar} className="chat-avatar" alt={chat.user.name} />
                )}

                <div className="chat-info">
                  <div className="chat-header-row">
                    <span className="chat-name">{chat.type === 'global' ? chat.name : chat.user.name}</span>
                    <span className="chat-time">{chat.time}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="chat-preview">{chat.lastMessage}</span>
                    {chat.unread > 0 && <span className="unread-badge">{chat.unread}</span>}
                  </div>
                </div>
              </div>
            ))}
            {filteredChats.length === 0 && !loading && (
              <div style={{ padding: '20px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
                No {filter !== 'All' ? filter.toLowerCase() : ''} chats found.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const ChatDetailView = ({ chat, onBack, userId, userName }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // Fetch messages from backend
  useEffect(() => {
    const fetchMessages = async () => {
      if (!chat || !chat.id || !userId) return;

      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/chats/${chat.id}/messages?userId=${userId}`);
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chat, userId]);

  // Socket.IO setup for real-time messages
  useEffect(() => {
    if (!chat || !userId) return;

    const socket = getSocket();
    socketRef.current = socket;

    // Join appropriate room
    if (chat.type === 'global') {
      socket.emit('join_trip', chat.tripId || chat.id);

      // Listen for trip messages
      const handleTripMessage = (data) => {
        const formattedMessage = {
          id: data._id || Date.now(),
          text: data.text,
          sender: data.senderName,
          time: new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: data.senderId === userId
        };
        setMessages(prev => [...prev, formattedMessage]);
      };

      socket.on('receive_trip_message', handleTripMessage);

      return () => {
        socket.off('receive_trip_message', handleTripMessage);
      };
    } else {
      // Private chat
      socket.emit('join_private', userId);

      const handlePrivateMessage = (data) => {
        const formattedMessage = {
          id: data._id || Date.now(),
          text: data.text,
          sender: data.senderName,
          time: new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: data.senderId === userId
        };
        setMessages(prev => [...prev, formattedMessage]);
      };

      socket.on('receive_private_message', handlePrivateMessage);
      socket.on('message_sent', handlePrivateMessage);

      return () => {
        socket.off('receive_private_message', handlePrivateMessage);
        socket.off('message_sent', handlePrivateMessage);
      };
    }
  }, [chat, userId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || !userId || !userName) return;

    const socket = socketRef.current;
    const now = new Date();

    try {
      // Send via HTTP API
      const res = await fetch(`${API_BASE_URL}/chats/${chat.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          userName: userName,
          text: inputText
        })
      });

      const newMessage = await res.json();

      // Also emit via Socket.IO for real-time updates
      if (chat.type === 'global') {
        socket?.emit('send_trip_message', {
          text: inputText,
          senderId: userId,
          senderName: userName,
          tripId: chat.tripId || chat.id,
          timestamp: now
        });
      } else {
        const otherUserId = chat.participants?.find(p => p !== userId);
        socket?.emit('send_private_message', {
          text: inputText,
          senderId: userId,
          senderName: userName,
          toUserId: otherUserId,
          timestamp: now
        });
      }

      setInputText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chat-detail-container">
      <div className="chat-detail-header">
        <button className="mobile-back-btn" onClick={onBack} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 8, marginLeft: -8 }}>
          <ArrowLeft size={24} />
        </button>

        {chat.type === 'global' ? (
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Globe size={18} color="white" />
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <img src={chat.user.avatar} style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid #262626' }} alt="u" />
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 8, height: 8, background: '#10b981', borderRadius: '50%', border: '1px solid #1a1a1a' }}></div>
          </div>
        )}

        <div style={{ flex: 1 }}>
          <span style={{ fontWeight: 'bold', color: 'white', display: 'block', fontSize: 14 }}>
            {chat.type === 'global' ? chat.name : chat.user.name}
          </span>
          <span style={{ fontSize: 10, color: chat.type === 'global' ? '#9ca3af' : '#10b981' }}>
            {chat.type === 'global' ? '12 Members' : 'Active Now'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12, color: 'white' }}>
          <Phone size={18} />
          <Video size={20} />
          <MoreVertical size={18} />
        </div>
      </div>

      <div className="chat-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`message-bubble ${msg.isMe ? 'sent' : 'received'}`}>
            {/* Show sender name in Global Chat if not me */}
            {chat.type === 'global' && !msg.isMe && (
              <div style={{ fontSize: '10px', color: '#ec4899', marginBottom: '2px', fontWeight: 'bold' }}>{msg.sender}</div>
            )}
            <div>{msg.text}</div>
            <span className="message-time">{msg.time}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <button style={{ background: 'none', border: 'none', color: '#9ca3af', padding: 4 }}><Plus size={20} /></button>
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Message..."
            className="ride-input"
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '24px',
              background: '#262626',
              border: '1px solid #404040',
              fontSize: '13px'
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
        </div>
        <button
          onClick={handleSend}
          className="btn-primary"
          style={{
            width: 36,
            height: 36,
            padding: 0,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: inputText.trim() ? 'var(--primary)' : '#262626',
            color: inputText.trim() ? 'white' : '#525252',
            boxShadow: 'none'
          }}
          disabled={!inputText.trim()}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

const InstagramChatLayout = ({ activeChat, onSelectChat, onClearChat, userId, userName }) => {
  const containerClass = `chat-split-container gsap-fade-up ${activeChat ? 'mobile-active' : ''}`;

  return (
    <div className={containerClass}>
      <div className="chat-sidebar">
        <ChatsListView onSelectChat={onSelectChat} activeChatId={activeChat?.id} userId={userId} />
      </div>
      <div className="chat-main-area">
        {activeChat ? (
          <ChatDetailView chat={activeChat} onBack={onClearChat} userId={userId} userName={userName} />
        ) : (
          <div className="empty-chat-state">
            <div style={{ width: 80, height: 80, borderRadius: '50%', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageCircle size={40} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 'bold' }}>Your Messages</h3>
            <p style={{ fontSize: 13, color: '#6b7280' }}>Send private photos and messages to a friend.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const FeedView = ({ trips, loading, error, onJoinChat, onViewProfile }) => {
  if (loading) return <div className="flex justify-center items-center" style={{ height: '50vh' }}><Loader2 className="animate-spin" color="#06b6d4" size={32} /></div>;
  if (error) return <div className="text-center p-4" style={{ color: '#ef4444' }}>Failed to load trips</div>;

  return (
    <div className="view-container">
      <div className="section-title gsap-fade-up">
        <h2>Find Partners</h2>
        <p>Plan your next big adventure together.</p>
      </div>

      <div className="grid-layout">
        {trips.length > 0 ? trips.map((trip) => (
          <div key={trip.id} className="card gsap-fade-up">
            <div className="card-header">
              <div
                className="user-info"
                onClick={() => onViewProfile && onViewProfile(trip.user)}
                style={{ cursor: 'pointer' }}
              >
                <img src={trip.user.avatar} className="avatar" onError={(e) => e.target.src = 'https://i.pravatar.cc/150?u=def'} alt="user" />
                <div className="user-details">
                  <h3>{trip.user.name}</h3>
                  <p>Trip Host</p>
                </div>
              </div>
              <span className="like-badge">{trip.likes || 0} Likes</span>
            </div>

            <div className="trip-route">
              <div className="route-point">
                <div className="label">Origin</div>
                <div className="value">{trip.origin || "Anywhere"}</div>
              </div>
              <div className="route-line">
                <div className="line"></div>
                <Car size={16} className="car-icon" />
              </div>
              <div className="route-point right">
                <div className="label">Dest</div>
                <div className="value">{trip.destination}</div>
              </div>
            </div>

            <div className="trip-meta">
              <Calendar size={14} color="#06b6d4" />
              <span>{trip.date}</span>
            </div>

            <p className="trip-desc">{trip.description}</p>

            <div className="tag-container">
              {trip.tags && trip.tags.map((tag, idx) => (
                <span key={idx} className="tag">#{tag}</span>
              ))}
            </div>

            {/* Added: Actions Bar for Chat */}
            <div className="trip-actions">
              <button className="btn-secondary">
                <Plus size={14} /> Join Trip
              </button>
              <button
                className="btn-secondary"
                style={{ background: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4', borderColor: 'rgba(6, 182, 212, 0.3)' }}
                onClick={() => onJoinChat(trip)}
              >
                <MessageCircle size={14} /> Global Chat
              </button>
            </div>
          </div>
        )) : (
          <div className="text-center text-gray-500 py-10 w-full col-span-full">No trips found.</div>
        )}
      </div>
    </div>
  );
};

const CompanionView = ({ companions, loading, onViewProfile }) => {
  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" color="#8b5cf6" size={32} /></div>;

  return (
    <div className="view-container">
      <div className="section-title gsap-fade-up">
        <h2>Local Companions</h2>
        <p>Find someone nearby.</p>
      </div>

      <div className="grid-layout">
        {companions.length > 0 ? companions.map((item) => (
          <div key={item.id} className="companion-card gsap-fade-up">
            <div className="companion-inner">
              <div className="companion-header">
                <div className="activity-badge">
                  <MapIcon size={12} /> {item.activity || "Explore"}
                </div>
                <div className="distance-badge">
                  <MapPin size={12} /> {item.distance || "Nearby"}
                </div>
              </div>

              <h3 style={{ fontSize: 18, fontWeight: 'bold', margin: '4px 0' }}>{item.destination}</h3>
              <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 12 }}>{item.date}</p>
              <p style={{ fontStyle: 'italic', fontSize: 13, color: '#d1d5db', flexGrow: 1 }}>"{item.description}"</p>

              <div className="flex justify-between items-center" style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div
                  className="flex items-center gap-2"
                  onClick={() => onViewProfile && onViewProfile(item.user)}
                  style={{ cursor: 'pointer' }}
                >
                  <img src={item.user.avatar} className="avatar" style={{ width: 28, height: 28, border: 'none' }} alt="u" />
                  <span style={{ fontSize: 12, color: '#d1d5db' }}>{item.user.name}</span>
                </div>
                <button className="btn-join">Join</button>
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center text-gray-500 py-10 w-full col-span-full">No companions found matching your search.</div>
        )}
      </div>
    </div>
  );
};

const RideView = () => {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [selectedRide, setSelectedRide] = useState(null);
  const [status, setStatus] = useState('idle');

  const handleBook = () => {
    if (!pickup || !dropoff || !selectedRide) return;
    setStatus('searching');
    setTimeout(() => setStatus('found'), 2000);
  };

  return (
    <div className="ride-container relative">
      <div className="map-placeholder">
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 200, height: 200, background: 'rgba(6,182,212,0.1)', borderRadius: '50%', filter: 'blur(50px)' }}></div>
      </div>

      <div className="ride-panel gsap-fade-up">
        {status === 'found' ? (
          <div className="text-center py-4">
            <div style={{ width: 60, height: 60, background: 'rgba(34,197,94,0.2)', borderRadius: '50%', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4ade80' }}>
              <Car size={32} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>Driver Found!</h3>
            <p style={{ color: '#9ca3af', marginBottom: 20 }}>Rajesh is 3 mins away.</p>
            <button onClick={() => setStatus('idle')} className="btn-primary" style={{ background: '#374151' }}>Cancel Ride</button>
          </div>
        ) : status === 'searching' ? (
          <div className="text-center py-8">
            <Loader2 size={40} className="animate-spin" color="#06b6d4" style={{ margin: '0 auto 16px' }} />
            <p>Connecting to drivers...</p>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Where to?</h2>

            <div className="input-group">
              <div className="dot"></div>
              <input value={pickup} onChange={e => setPickup(e.target.value)} placeholder="Current Location" className="ride-input" />
            </div>
            <div className="input-group">
              <div className="square"></div>
              <input value={dropoff} onChange={e => setDropoff(e.target.value)} placeholder="Enter Destination" className="ride-input" />
            </div>

            <div className="vehicle-grid">
              {RIDE_OPTIONS.map(ride => (
                <div key={ride.id} onClick={() => setSelectedRide(ride.id)} className={`vehicle-card ${selectedRide === ride.id ? 'selected' : ''}`}>
                  <ride.icon size={20} />
                  <div className="vehicle-name">{ride.name}</div>
                  <div className="vehicle-price">{ride.price}</div>
                </div>
              ))}
            </div>

            <button disabled={!pickup || !dropoff || !selectedRide} onClick={handleBook} className="btn-primary">
              <span>Request Ride</span> <Send size={18} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const ProfileView = ({ user, currentUser, onMessage }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfileData = async () => {
    // If no user at all, show error
    if (!user) {
      console.log('No user object provided');
      setProfileData(null);
      setLoading(false);
      return;
    }

    // Try to get userId from various possible fields
    const userId = user._id || user.id || user.user?._id || user.user?.id;

    if (!userId) {
      console.log('No user ID found in user object:', user);
      // Just use whatever data we have
      setProfileData(user.user || user);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Fetching profile for userId:', userId);

      // Add timeout to prevent infinite loading
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const res = await fetch(`${API_BASE_URL}/auth/user/${userId}`, {
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Failed to fetch profile: ${res.status}`);
      }

      const data = await res.json();
      console.log('Profile data received:', data);
      setProfileData(data);

      // Only update localStorage if this is the current user's profile
      if (currentUser && (userId === currentUser._id || userId === currentUser.id)) {
        const updatedUser = { ...currentUser, ...data };
        localStorage.setItem('travel_user', JSON.stringify(updatedUser));
      }

    } catch (error) {
      if (!error.message.includes('404')) {
        console.error('Error fetching profile:', error);
        setError(error.name === 'AbortError' ? 'Request timeout' : error.message);
      }
      // Fallback to user object
      setProfileData(user.user || user);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [user]);

  if (loading) {
    return (
      <div className="view-container">
        <div className="flex justify-center items-center" style={{ height: '50vh' }}>
          <Loader2 className="animate-spin" color="#06b6d4" size={32} />
        </div>
      </div>
    );
  }

  const displayUser = profileData || user?.user || user;
  const isOwnProfile = !currentUser || !displayUser || (displayUser._id === currentUser._id) || (displayUser.id === currentUser.id);

  return (
    <div className="view-container">
      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: 12, borderRadius: 8, fontSize: 13, textAlign: 'center', marginBottom: 16, border: '1px solid rgba(239,68,68,0.2)' }}>
          Error loading profile: {error}
          <button
            onClick={fetchProfileData}
            style={{ marginLeft: 10, padding: '4px 12px', borderRadius: 6, background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer', fontSize: 12 }}
          >
            Retry
          </button>
        </div>
      )}

      <div className="profile-header gsap-fade-up">
        <div className="profile-img-container">
          <img src={displayUser?.avatar || "https://i.pravatar.cc/150?u=me"} alt="Me" className="profile-img" />
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 'bold' }}>{displayUser?.name || "User"}</h2>
        <p style={{ color: '#9ca3af', fontSize: 14, display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
          <MapPin size={12} /> {displayUser?.email || "No email"}
        </p>

        {/* Message Button - Only visible for other users */}
        {!isOwnProfile && (
          <button
            onClick={() => onMessage && onMessage(displayUser)}
            className="btn-primary"
            style={{ marginTop: 16, width: 'auto', padding: '8px 24px', display: 'flex', alignItems: 'center', gap: 8, margin: '16px auto 0' }}
          >
            <MessageCircle size={18} /> Message
          </button>
        )}
        {/* Debug info - remove in production */}
        <p style={{ color: '#6b7280', fontSize: 10, marginTop: 8 }}>
          ID: {displayUser?._id || displayUser?.id || 'No ID'}
        </p>
      </div>

      <div className="stat-grid gsap-fade-up">
        <div className="stat-box">
          <span className="stat-val">{displayUser?.stats?.trips || 0}</span>
          <span className="stat-label">Trips</span>
        </div>
        <div className="stat-box">
          <span className="stat-val">{displayUser?.stats?.rating || 5.0}</span>
          <span className="stat-label">Rating</span>
        </div>
        <div className="stat-box">
          <span className="stat-val">{displayUser?.stats?.friends || 0}</span>
          <span className="stat-label">Friends</span>
        </div>
      </div>

      <div className="gsap-fade-up">
        <h3 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Past Trips</h3>
        <div className="card" style={{ padding: 16, textAlign: 'center', color: '#6b7280' }}>
          <p>No past trips yet. Join one today!</p>
        </div>
      </div>
    </div>
  );
};

const CreateModal = ({ onClose, type, onSuccess, user }) => {
  const [formData, setFormData] = useState({ origin: '', destination: '', date: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.destination || !formData.date || !formData.origin) {
      setError('All fields are required!');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        origin: formData.origin,
        destination: formData.destination,
        date: formData.date,
        description: formData.description || 'No description provided',
        hostName: user?.name || user?.username || 'Anonymous',
        hostId: user?.id || user?._id || 'guest'
      };

      const res = await fetch(`${API_BASE_URL}/trips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create post');

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content gsap-scale-in">
        <button onClick={onClose} className="close-btn"><Plus size={24} style={{ transform: 'rotate(45deg)' }} /></button>
        <h2 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 24 }}>
          {type === 'partner' ? 'New Trip' : 'Find Buddy'}
        </h2>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: 12, borderRadius: 8, fontSize: 13, textAlign: 'center', marginBottom: 16, border: '1px solid rgba(239,68,68,0.2)' }}>            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Origin</label>
            <input name="origin" className="form-input" placeholder="Where are you starting?" value={formData.origin} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Destination</label>
            <input name="destination" className="form-input" placeholder={type === 'partner' ? "Where are you going?" : "Where do you want to meet?"} value={formData.destination} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input name="date" type="date" className="form-input" value={formData.date} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea name="description" className="form-input" style={{ height: 100, resize: 'none' }} placeholder="Details..." value={formData.description} onChange={handleChange} />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <><Loader2 className="animate-spin" size={20} /> Posting...</> : 'Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Main App ---
export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [showModal, setShowModal] = useState(false);
  const [createType, setCreateType] = useState('partner');
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Chat State
  const [activeChat, setActiveChat] = useState(null);

  useGSAP();

  useEffect(() => {
    // Check local storage for existing session
    const savedUser = localStorage.getItem('travel_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      console.log('Loaded user from localStorage:', parsedUser);

      // Check if user data is incomplete (missing name or other fields)
      if (!parsedUser.name || !parsedUser._id) {
        console.warn('Incomplete user data in localStorage, clearing...');
        localStorage.removeItem('travel_user');
        return;
      }

      setUser(parsedUser);

      // Fetch fresh user data from backend to ensure it's up-to-date
      const refreshUserData = async () => {
        try {
          const userId = parsedUser._id || parsedUser.id;
          if (!userId) return;

          console.log('Refreshing user data from backend...');
          const res = await fetch(`${API_BASE_URL}/auth/user/${userId}`);

          if (res.status === 404) {
            // User not found on server - likely stale local ID.
            // Silently ignore and use local data.
            return;
          }

          if (res.ok) {
            const freshData = await res.json();
            console.log('Fresh user data from backend:', freshData);

            // Update localStorage with fresh data
            localStorage.setItem('travel_user', JSON.stringify(freshData));
            setUser(freshData);
          }
        } catch (error) {
          console.error('Error refreshing user data:', error);
        }
      };

      refreshUserData();
    }
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/trips`);
      if (!res.ok) throw new Error('Error');
      const data = await res.json();
      const raw = Array.isArray(data) ? data : (data.trips || []);

      setTrips(raw.map(t => ({
        id: t._id || t.id || Math.random(),
        user: {
          name: t.hostName || "Traveler",
          avatar: t.hostAvatar || `https://i.pravatar.cc/150?u=${t._id || t.id}`
        },
        origin: t.origin,
        destination: t.destination,
        date: formatDate(t.date),
        description: t.description || "No description.",
        tags: t.tags || ["Travel"],
        likes: t.likes || 0,
        activity: "Exploring",
        distance: "Unknown"
      })));
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!user) return;
    console.log('Current user state:', user);
    fetchTrips();
  }, [user]);

  const handleLoginSuccess = (userData) => {
    console.log('handleLoginSuccess called with:', userData);

    // Validate user data
    if (!userData || (!userData._id && !userData.id)) {
      console.error('Invalid user data received - missing ID:', userData);
      return;
    }

    // Normalize ID
    if (!userData._id && userData.id) {
      userData._id = userData.id;
    } else if (!userData.id && userData._id) {
      userData.id = userData._id;
    }

    setUser(userData);
    localStorage.setItem('travel_user', JSON.stringify(userData));
    console.log('User data saved to state and localStorage:', userData);
  };

  const handleFab = () => {
    setCreateType(activeTab === 'companion' ? 'companion' : 'partner');
    setShowModal(true);
  };

  // Handler for joining a Global Chat from the Trip Card
  const handleJoinGlobalChat = async (trip) => {
    try {
      const res = await fetch(`${API_BASE_URL}/chats/global`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripId: trip.id || trip._id,
          userId: user?._id || user?.id
        })
      });

      const { chat } = await res.json();
      setActiveChat(chat);
      setActiveTab('chat-list');
    } catch (error) {
      console.error('Error joining global chat:', error);
    }
  };

  // Filter Logic
  const filteredTrips = trips.filter(t =>
    (t.destination && t.destination.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (t.origin && t.origin.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Profile View State
  const [viewingProfile, setViewingProfile] = useState(null);

  const handleViewProfile = (profileUser) => {
    setViewingProfile(profileUser);
    setActiveTab('profile');
  };

  const handleMessageUser = async (targetUser) => {
    // 1. Create/Get private chat
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/chats/private`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id || user.id, otherUserId: targetUser._id || targetUser.id })
      });

      const data = await res.json();
      if (res.ok) {
        // 2. Set active chat and switch tab
        setActiveChat({
          id: data.chatId,
          type: 'private',
          participants: data.chat.participants,
          user: targetUser // Frontend expects 'user' object for private chat header
        });
        setActiveTab('chat-list');
      }
    } catch (error) {
      setError('Failed to start chat');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <>
        <style>{styles}</style>
        <AuthView onLoginSuccess={handleLoginSuccess} />
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="app-container">

        <Header
          showSearch={showSearch}
          setShowSearch={setShowSearch}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenChats={() => setActiveTab('chat-list')}
        />

        <div style={{ minHeight: 'calc(100vh - 140px)' }}>
          {activeTab === 'home' && (
            <FeedView
              trips={filteredTrips}
              loading={loading}
              error={error}
              onJoinChat={handleJoinGlobalChat}
              onViewProfile={handleViewProfile}
            />
          )}
          {activeTab === 'companion' && (
            <CompanionView
              companions={filteredTrips}
              loading={loading}
              onViewProfile={handleViewProfile}
            />
          )}
          {activeTab === 'ride' && <RideView />}
          {activeTab === 'profile' && (
            <ProfileView
              user={viewingProfile || user}
              currentUser={user}
              onMessage={handleMessageUser}
            />
          )}

          {/* New Split View Logic for Chats */}
          {activeTab === 'chat-list' && (
            <InstagramChatLayout
              activeChat={activeChat}
              onSelectChat={setActiveChat}
              onClearChat={() => setActiveChat(null)}
              userId={user?._id || user?.id}
              userName={user?.name || user?.username || 'User'}
            />
          )}
        </div>

        {(activeTab === 'home' || activeTab === 'companion') && (
          <button onClick={handleFab} className="fab gsap-scale-in">
            <Plus size={28} />
          </button>
        )}

        {showModal && <CreateModal onClose={() => setShowModal(false)} type={createType} onSuccess={fetchTrips} user={user} />}

        <Navbar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            if (tab === 'profile') setViewingProfile(null);
            setActiveTab(tab);
          }}
        />

      </div>
    </>
  );
}
