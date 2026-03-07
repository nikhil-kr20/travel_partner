import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate, Link } from 'react-router-dom';
import { Home, Car, MessageSquare, User, MapPin, Compass, Bell, Search, Zap } from 'lucide-react';
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
      <div style={{
        display: 'flex',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-main)',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          border: '3px solid rgba(6,182,212,0.2)',
          borderTop: '3px solid #06b6d4',
          animation: 'spin 0.8s linear infinite'
        }} />
        <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Loading...</span>
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

// ─── NavItem ────────────────────────────────────────────────
function NavItem({ icon, label, to, badge }) {
  const { pathname } = useLocation();
  const isActive = pathname === to || pathname.startsWith(to + '/');
  return (
    <Link to={to} style={{ textDecoration: 'none', display: 'flex', flex: 1 }}>
      <div className={`nav-item ${isActive ? 'active' : ''}`} style={{ flex: 1 }}>
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

// ─── App Shell ────────────────────────────────────────────────
function Shell({ children, noPadding = false }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  if (!user) return null;
  const isRider = user.role === 'rider';
  const initials = user?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="app-layout">
      {/* ── Sidebar ─────────────────────────────── */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="logo-icon">
            <Compass size={18} />
          </div>
          <span className="logo-text" style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            TravelPartner
          </span>
        </div>

        <nav className="nav-menu">
          <NavItem icon={<Home size={19} />} label="Dashboard" to="/dashboard" />
          {!isRider && (
            <NavItem icon={<MapPin size={19} />} label="Trips" to="/trips" />
          )}
          <NavItem icon={<Car size={19} />} label={isRider ? 'My Rides' : 'Book Ride'} to="/rides" />
          <NavItem
            icon={<MessageSquare size={19} />}
            label="Messages"
            to="/chat"
            badge={unreadCount || null}
          />
          <div className="nav-divider" />
          <NavItem icon={<User size={19} />} label="Profile" to="/profile" />
        </nav>

        <div className="sidebar-pro-card">
          <h4>✦ Pro Plan</h4>
          <p>Unlock unlimited trips, priority rides & more.</p>
          <button
            className="btn btn-primary"
            style={{ width: '100%', padding: '8px 14px', fontSize: '0.8rem' }}
          >
            <Zap size={14} /> Upgrade Now
          </button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────── */}
      <main className="main-content">
        {/* Top Header */}
        <header className="top-header">
          {/* Search */}
          <div className="search-bar">
            <Search size={16} color="var(--text-faint)" />
            <input placeholder="Search trips, rides, people..." aria-label="Search" />
          </div>

          {/* Actions */}
          <div className="header-actions">
            <button className="icon-btn" aria-label="Notifications">
              <Bell size={18} />
            </button>
            <div
              className="user-avatar"
              onClick={() => navigate('/profile')}
              title="Go to profile"
              role="button"
              aria-label="Go to profile"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate('/profile')}
            >
              {user?.profileImage?.url
                ? <img src={user.profileImage.url} alt={user?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : initials}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className={noPadding ? '' : 'page-content'}>
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
        {/* Guest routes */}
        <Route path="/login" element={<GuestRoute><LoginView /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><SignupView /></GuestRoute>} />

        {/* Protected routes */}
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

        {/* Fallback */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}