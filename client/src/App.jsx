import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate, Link } from 'react-router-dom';
import { Home, Car, MessageSquare, User, Compass, MapPin, LogOut } from 'lucide-react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import gsap from 'gsap';
import { useAuth } from './context/AuthContext.jsx';
import { globalStyles } from './styles/globalStyles.js';

import LoginView from './views/LoginView.jsx';
import SignupView from './views/SignupView.jsx';
import DashboardView from './views/DashboardView.jsx';
import TripsView from './views/TripsView.jsx';
import TripDetailView from './views/TripDetailView.jsx';
import RidesView from './views/RidesView.jsx';
import ChatView from './views/ChatView.jsx';
import ProfileView from './views/ProfileView.jsx';
import PublicProfileView from './views/PublicProfileView.jsx';
import DriverDashboardView from './views/DriverDashboardView.jsx';
import DriverRidesView from './views/DriverRidesView.jsx';

// ─── Loading Spinner ──────────────────────────────────────────
function Spinner() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loader" />
      </div>
    </>
  );
}

// ─── Route Guards ─────────────────────────────────────────────
function ProtectedRoute({ children, userOnly = false, riderOnly = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (userOnly && user.role === 'rider') return <Navigate to="/dashboard" replace />;
  if (riderOnly && user.role !== 'rider') return <Navigate to="/dashboard" replace />;
  return children;
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

// ─── Sidebar NavItem (uses Link) ─────────────────────────────
function NavItem({ icon, label, to, badge }) {
  const { pathname } = useLocation();
  const isActive = pathname === to || pathname.startsWith(to + '/');
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <div className={`nav-item ${isActive ? 'active' : ''}`}>
        {icon}
        <span style={{ flex: 1 }}>{label}</span>
        {badge && (
          <span className="badge" style={{ position: 'relative', top: 0, right: 0 }}>
            {badge}
          </span>
        )}
      </div>
    </Link>
  );
}

// ─── Shared Layout Shell ──────────────────────────────────────
function Shell({ children, noPadding = false }) {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const sidebarRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(sidebarRef.current,
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, ease: "power4.out" }
    );
  }, []);

  if (!user) return null;
  const isRider = user.role === 'rider';

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar" ref={sidebarRef}>
        <div className="logo" style={{ marginBottom: '32px' }}>
          <div className="logo-icon"><Compass size={24} /></div>
          TravelPartner
        </div>

        <nav className="nav-menu">
          <NavItem icon={<Home size={20} />} label="Dashboard" to="/dashboard" />
          {!isRider && (
            <NavItem icon={<MapPin size={20} />} label="Trips" to="/trips" />
          )}
          <NavItem icon={<Car size={20} />} label={isRider ? 'My Rides' : 'Book Ride'} to="/rides" />
          <NavItem icon={<MessageSquare size={20} />} label="Messages" to="/chat" badge={unreadCount || null} />

          <div style={{ margin: '24px 0', borderBottom: '1px solid var(--border)' }} />

          <NavItem icon={<User size={20} />} label="Profile" to="/profile" />
          <div className="nav-item" onClick={logout} style={{ color: '#f87171' }}>
             <LogOut size={20} />
             <span>Logout</span>
          </div>
        </nav>

        <div style={{ marginTop: 'auto', padding: '20px 0' }}>
          <div className="glass-card" style={{ padding: '20px', background: 'rgba(99, 102, 241, 0.1)', borderColor: 'rgba(99, 102, 241, 0.2)' }}>
            <h4 style={{ color: 'var(--primary)', marginBottom: '8px' }}>Pro Plan</h4>
            <p className="text-sm" style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>Explore the world with zero limits.</p>
            <button className="btn btn-primary" style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}>
              Upgrade Now
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        {/* Page content */}
        <div className={noPadding ? '' : 'page-content'}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Pass unread setter to ChatView via context-like prop */}
            {React.isValidElement(children)
              ? React.cloneElement(children, { onUnreadChange: setUnreadCount })
              : children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

// ─── Role-switch wrappers ─────────────────────────────────────
function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const go = (section) => navigate(`/${section}`);
  return user?.role === 'rider'
    ? <DriverDashboardView onNavigate={go} />
    : <DashboardView onNavigate={go} />;
}

function RidesPage() {
  const { user } = useAuth();
  return user?.role === 'rider' ? <DriverRidesView /> : <RidesView />;
}

// ─── App ──────────────────────────────────────────────────────
export default function App() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // navigate is used in the header click handler below
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      <header className="top-header">
        <div className="logo" style={{ marginBottom: 0, padding: 0 }}>
          <div className="logo-icon"><Compass size={24} /></div>
          TravelPartner
        </div>
        <div className="header-actions">
          <div className="user-avatar" onClick={() => navigate('/profile')} title="Profile" aria-label="Go to profile">
            {user?.profileImage?.url
              ? <img src={user.profileImage.url} alt={user?.name}
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              : user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      </header>
      <Routes>
        {/* ── Guest routes ────────────────────────────── */}
        <Route path="/login" element={<GuestRoute><LoginView /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><SignupView /></GuestRoute>} />

        {/* ── Protected routes (inside shell) ─────────── */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Shell><DashboardPage /></Shell>
          </ProtectedRoute>
        } />

        <Route path="/trips" element={
          <ProtectedRoute userOnly>
            <Shell><TripsView /></Shell>
          </ProtectedRoute>
        } />

        <Route path="/trips/:id" element={
          <ProtectedRoute>
            <Shell><TripDetailView /></Shell>
          </ProtectedRoute>
        } />

        <Route path="/user/:username" element={
          <ProtectedRoute>
            <Shell><PublicProfileView /></Shell>
          </ProtectedRoute>
        } />

        <Route path="/rides" element={
          <ProtectedRoute>
            <Shell><RidesPage /></Shell>
          </ProtectedRoute>
        } />

        <Route path="/chat" element={
          <ProtectedRoute>
            <Shell noPadding><ChatView /></Shell>
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <Shell><ProfileView onLogout={logout} /></Shell>
          </ProtectedRoute>
        } />

        {/* ── Fallback ─────────────────────────────────── */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}