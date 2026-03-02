import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate, Link } from 'react-router-dom';
import { Home, Car, MessageSquare, User, Search, Bell, Compass, MapPin } from 'lucide-react';
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
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  if (!user) return null;
  const isRider = user.role === 'rider';

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
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
          <div style={{ margin: '20px 0', borderBottom: '1px solid var(--border)' }} />
          <NavItem icon={<User size={20} />} label="Profile" to="/profile" />
        </nav>

        <div style={{ marginTop: 'auto', padding: '20px 0' }}>
          <div className="card" style={{ padding: '16px', background: 'var(--primary-light)', borderColor: 'var(--primary-light)' }}>
            <h4 style={{ color: 'var(--primary)', marginBottom: '8px' }}>Pro Plan</h4>
            <p className="text-sm" style={{ marginBottom: '12px' }}>Unlock all companion features.</p>
            <button className="btn btn-primary" style={{ width: '100%', padding: '8px', fontSize: '0.85rem' }}>
              Upgrade
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        <header className="top-header">
          <div className="search-bar">
            <Search size={18} color="var(--text-muted)" />
            <input type="text" placeholder="Search trips, rides, friends..." />
          </div>
          <div className="header-actions">
            <button className="icon-btn"><Bell size={20} /></button>
            <div className="user-avatar" onClick={() => navigate('/profile')} title="Profile">
              {user.profileImage?.url
                ? <img src={user.profileImage.url} alt={user.name}
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                : user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className={noPadding ? '' : 'page-content'}>
          {/* Pass unread setter to ChatView via context-like prop */}
          {React.isValidElement(children)
            ? React.cloneElement(children, { onUnreadChange: setUnreadCount })
            : children}
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
  const { logout } = useAuth();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />

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