import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin, Calendar, User, MessageCircle, Plus, Search,
  Navigation, Bus, Train, Car, Plane, Send, X, LogIn, LogOut, ChevronRight, Mail, Lock
} from 'lucide-react';

const API_BASE = 'http://localhost:3000/api';

export default function App() {
  // State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('travel_user');
    try { return saved ? JSON.parse(saved) : null; } catch (e) { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('travel_token'));

  const [view, setView] = useState('home'); // home, post, chat
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTrip, setActiveTrip] = useState(null);
  const [messages, setMessages] = useState({});

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
    if (user && view === 'home') {
      loadTrips();
    }
  }, [user, view]);

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
    setView('home');
  };

  const handlePostTrip = async (tripData) => {
    if (!user) return;
    try {
      await apiFetch('/trips', {
        method: 'POST',
        body: JSON.stringify({ ...tripData, hostName: user.name, hostId: user.id }),
      });
      setView('home');
      loadTrips();
    } catch (err) {
      alert(err.message);
    }
  };

  // --- RENDER ---
  if (!user) {
    return <AuthScreen onAuth={handleAuth} />;
  }

  return (
    <div className="app-container">
      <Header user={user} setView={setView} onLogout={handleLogout} />

      {view === 'home' && (
        <HomeView
          trips={trips}
          loading={loading}
          onPostClick={() => setView('post')}
          onConnect={(trip) => { setActiveTrip(trip); setView('chat'); }}
          user={user}
        />
      )}

      {view === 'post' && (
        <PostTripView
          onCancel={() => setView('home')}
          onSubmit={handlePostTrip}
        />
      )}

      {view === 'chat' && activeTrip && (
        <ChatView
          trip={activeTrip}
          user={user}
          messages={messages[activeTrip.id] || []}
          onSend={(text) => {
            const newMsg = { id: Date.now(), text, senderId: user.id, senderName: user.name };
            setMessages(prev => ({ ...prev, [activeTrip.id]: [...(prev[activeTrip.id] || []), newMsg] }));
          }}
          onBack={() => setView('home')}
        />
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---

const AuthScreen = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAuth(isLogin, formData);
  };

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            background: 'var(--primary)',
            width: '3rem', height: '3rem',
            borderRadius: '0.75rem',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '1rem',
            color: 'white',
            boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.4)'
          }}>
            <Navigation size={24} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {isLogin ? 'Login to access your travel plans' : 'Join the community of travelers details'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <div className="input-wrapper">
                <User className="input-icon" />
                <input
                  className="form-input has-icon"
                  placeholder="e.g. Alex"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>
          )}

          <div className="input-group">
            <label className="input-label">Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" />
              <input
                type="email"
                className="form-input has-icon"
                placeholder="name@example.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                type="password"
                className="form-input has-icon"
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>

          <button className="btn btn-primary w-full" style={{ padding: '0.75rem' }}>
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', padding: 0 }}
          >
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Header = ({ user, setView, onLogout }) => (
  <header className="app-header">
    <div className="container" style={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'space-between' }}>
      <div
        onClick={() => setView('home')}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--primary-dark)' }}
      >
        <Navigation style={{ color: 'var(--primary)' }} />
        TravelMates
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="hidden block" style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>{user.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Traveler</div>
        </div>
        <button onClick={onLogout} className="btn btn-ghost" style={{ padding: '0.5rem' }}>
          <LogOut size={20} />
        </button>
      </div>
    </div>
  </header>
);

const HomeView = ({ trips, loading, onPostClick, onConnect, user }) => (
  <>
    <div className="hero-section">
      <div className="container text-center">
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Find Your Travel Partner</h1>
        <p style={{ opacity: 0.9, maxWidth: '600px', margin: '0 auto 2rem' }}>
          Stop traveling alone. Connect with verified travelers going your way.
        </p>

        <div style={{
          background: 'white', padding: '0.5rem', borderRadius: '0.75rem',
          display: 'flex', gap: '0.5rem', maxWidth: '600px', margin: '0 auto',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
        }} className="flex-col md:flex-row">
          <div style={{ position: 'relative', flex: 1 }}>
            <MapPin size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input placeholder="From (e.g. London)" style={{ width: '100%', border: 'none', padding: '1rem 1rem 1rem 2.8rem', borderRadius: '0.5rem', outline: 'none' }} />
          </div>
          <div style={{ width: '1px', background: '#e5e7eb', margin: '0.5rem 0' }} className="hidden md:block"></div>
          <div style={{ position: 'relative', flex: 1 }}>
            <Navigation size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input placeholder="To (e.g. Paris)" style={{ width: '100%', border: 'none', padding: '1rem 1rem 1rem 2.8rem', borderRadius: '0.5rem', outline: 'none' }} />
          </div>
          <button className="btn btn-primary" style={{ padding: '0 2rem' }}>
            Search
          </button>
        </div>
      </div>
    </div>

    <div className="container" style={{ marginTop: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Upcoming Trips</h2>
        <button onClick={onPostClick} className="btn btn-primary hidden md:inline-flex">
          <Plus size={18} /> Post Trip
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading trips...</div>
      ) : trips.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '1rem', border: '1px dashed #e5e7eb' }}>
          <MapPin size={48} style={{ color: '#e5e7eb', marginBottom: '1rem' }} />
          <h3>No trips found</h3>
          <p style={{ color: '#6b7280', margin: '0.5rem 0 1.5rem' }}>Be the first to create a trip!</p>
          <button onClick={onPostClick} className="btn btn-primary">Create Trip</button>
        </div>
      ) : (
        <div className="cards-grid">
          {trips.map(trip => (
            <TripCard key={trip.id} trip={trip} onConnect={onConnect} isOwner={trip.hostId === user.id} />
          ))}
        </div>
      )}
    </div>

    <button className="fab md:hidden" onClick={onPostClick}>
      <Plus size={24} />
    </button>
  </>
);

const TripCard = ({ trip, onConnect, isOwner }) => {
  const ModeIcon = {
    'Bus': Bus, 'Train': Train, 'Car/Cab': Car, 'Flight': Plane, 'Bike': Navigation
  }[trip.mode] || Bus;

  const date = new Date(trip.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <div className="trip-card">
      <div style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: trip.avatarColor || '#e2e8f0', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {trip.hostName?.[0]}
            </div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{trip.hostName}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Host</div>
            </div>
          </div>
          <div style={{ background: '#f1f5f9', padding: '0.25rem 0.75rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.25rem', height: 'fit-content' }}>
            <ModeIcon size={12} /> {trip.mode}
          </div>
        </div>

        <div style={{ position: 'relative', paddingLeft: '1rem', marginBottom: '1rem' }}>
          <div style={{ position: 'absolute', left: 0, top: '0.5rem', bottom: '0.5rem', width: '2px', background: '#e2e8f0', borderLeft: '2px dashed #cbd5e1' }}></div>

          <div style={{ marginBottom: '1rem', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '-1.35rem', width: '0.75rem', height: '0.75rem', borderRadius: '50%', background: '#fff', border: '2px solid var(--primary)' }}></div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>From</div>
            <div style={{ fontWeight: '600' }}>{trip.origin}</div>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '-1.35rem', width: '0.75rem', height: '0.75rem', borderRadius: '50%', background: '#fff', border: '2px solid var(--secondary)' }}></div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>To</div>
            <div style={{ fontWeight: '600' }}>{trip.destination}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', background: '#f8fafc', padding: '0.5rem', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#475569' }}>
          <Calendar size={16} /> {date}
        </div>
      </div>

      <div style={{ padding: '1rem', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
        <button
          onClick={() => onConnect(trip)}
          className={`btn w-full ${isOwner ? 'btn-secondary' : 'btn-primary'}`}
        >
          <MessageCircle size={16} /> {isOwner ? 'View Chat' : 'Connect'}
        </button>
      </div>
    </div>
  );
};

const PostTripView = ({ onCancel, onSubmit }) => {
  const [data, setData] = useState({ origin: '', destination: '', date: '', mode: 'Bus', description: '' });

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '0 1rem' }}>
      <button onClick={onCancel} className="btn btn-ghost" style={{ marginBottom: '1rem', paddingLeft: 0 }}>
        <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} /> Back
      </button>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Share Your Journey</h2>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(data); }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="input-group">
              <label className="input-label">From</label>
              <input className="form-input" required placeholder="Origin" value={data.origin} onChange={e => setData({ ...data, origin: e.target.value })} />
            </div>
            <div className="input-group">
              <label className="input-label">To</label>
              <input className="form-input" required placeholder="Destination" value={data.destination} onChange={e => setData({ ...data, destination: e.target.value })} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Date</label>
              <input type="date" className="form-input" required value={data.date} onChange={e => setData({ ...data, date: e.target.value })} />
            </div>
            <div className="input-group">
              <label className="input-label">Mode</label>
              <select className="form-input" value={data.mode} onChange={e => setData({ ...data, mode: e.target.value })}>
                <option>Bus</option>
                <option>Train</option>
                <option>Car/Cab</option>
                <option>Flight</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Note</label>
            <textarea className="form-input" rows="3" placeholder="Any details..." value={data.description} onChange={e => setData({ ...data, description: e.target.value })}></textarea>
          </div>

          <button className="btn btn-primary w-full">Post Trip</button>
        </form>
      </div>
    </div>
  );
};

const ChatView = ({ trip, user, messages, onSend, onBack }) => {
  const [text, setText] = useState('');
  const endRef = useRef(null);

  useEffect(() => endRef.current?.scrollIntoView(), [messages]);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'white', zIndex: 100, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={onBack} className="btn btn-ghost" style={{ borderRadius: '50%', padding: '0.5rem' }}><ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} /></button>
        <div>
          <div style={{ fontWeight: 'bold' }}>{trip.origin} to {trip.destination}</div>
          <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Host: {trip.hostName}</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#f8fafc' }}>
        {messages.map((m) => (
          <div key={m.id} style={{ alignSelf: m.senderId === user.id ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
            <div style={{
              padding: '0.5rem 1rem',
              borderRadius: '1rem',
              background: m.senderId === user.id ? 'var(--primary)' : 'white',
              color: m.senderId === user.id ? 'white' : 'black',
              border: m.senderId === user.id ? 'none' : '1px solid #e2e8f0',
              borderBottomRightRadius: m.senderId === user.id ? '0' : '1rem',
              borderBottomLeftRadius: m.senderId !== user.id ? '0' : '1rem'
            }}>
              {m.text}
            </div>
          </div>
        ))}
        <div ref={endRef}></div>
      </div>

      <div style={{ padding: '1rem', borderTop: '1px solid #e2e8f0' }}>
        <form onSubmit={e => { e.preventDefault(); onSend(text); setText(''); }} style={{ display: 'flex', gap: '0.5rem' }}>
          <input className="form-input" style={{ borderRadius: '2rem' }} placeholder="Message..." value={text} onChange={e => setText(e.target.value)} />
          <button className="btn btn-primary" style={{ borderRadius: '50%', width: '3rem', padding: 0 }}><Send size={18} /></button>
        </form>
      </div>
    </div>
  );
};