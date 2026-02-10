import React, { useState, useEffect } from 'react';
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
  ArrowRight
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
  max-width: 480px;
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
  padding: 24px;
  background: radial-gradient(circle at center, rgba(6, 182, 212, 0.1), transparent 70%);
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
  justify-content: space-between;
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
}

.nav-item.active {
  color: var(--primary);
  transform: translateY(-2px);
}

/* --- Cards (Feed & Companion) --- */
.view-container {
  padding: 16px;
  animation: fadeIn 0.5s ease;
}

.section-title {
  margin-bottom: 20px;
}
.section-title h2 { margin: 0; font-size: 24px; font-weight: 700; }
.section-title p { margin: 4px 0 0; color: var(--text-muted); font-size: 14px; }

.card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s ease;
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

/* --- Companion Specifics --- */
.companion-card {
  background: linear-gradient(135deg, rgba(30,30,30,0.8), rgba(20,20,20,0.9));
  border-radius: 24px;
  padding: 4px;
  position: relative;
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
.stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px; }
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

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
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
    return () => { if(document.body.contains(script)) document.body.removeChild(script); };
  }, []);
};

const API_BASE_URL = "https://travel-partner-7gbm.onrender.com/api";

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
      : { username: formData.name, email: formData.email, password: formData.password };

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      // Success - Save token/user and redirect
      onLoginSuccess(data.user || { name: formData.name || "User" });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="card gsap-fade-up" style={{maxWidth: 400, margin: '0 auto', width: '100%', padding: 32}}>
        <div className="text-center mb-8">
          <div className="logo-box" style={{width: 60, height: 60, margin: '0 auto 16px'}}>
            <Navigation size={32} />
          </div>
          <h1 className="brand-text" style={{fontSize: 28}}>TraveLink</h1>
          <p style={{color: '#9ca3af', marginTop: 8}}>
            {isLogin ? "Welcome back, traveler!" : "Start your adventure today."}
          </p>
        </div>

        {error && (
          <div style={{background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: 12, borderRadius: 8, fontSize: 13, textAlign: 'center', marginBottom: 16, border: '1px solid rgba(239,68,68,0.2)'}}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-group" style={{background: 'rgba(255,255,255,0.05)', marginBottom: 0}}>
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
            <div className="input-group" style={{background: 'rgba(255,255,255,0.05)', marginBottom: 0}}>
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
            <div className="input-group" style={{background: 'rgba(255,255,255,0.05)', marginBottom: 0}}>
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

          <button type="submit" className="btn-primary" style={{marginTop: 24}} disabled={loading}>
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

const Header = () => (
  <header className="header">
    <div className="brand">
      <div className="logo-box">
        <Navigation size={18} />
      </div>
      <h1 className="brand-text">TraveLink</h1>
    </div>
    <div className="header-actions">
      <button><Search size={22} /></button>
      <button style={{position: 'relative'}}>
        <MessageCircle size={22} />
        <span style={{position: 'absolute', top: 0, right: 0, width: 8, height: 8, background: '#ef4444', borderRadius: '50%'}}></span>
      </button>
    </div>
  </header>
);

const FeedView = ({ trips, loading, error }) => {
  if (loading) return <div className="flex justify-center items-center" style={{height: '50vh'}}><Loader2 className="animate-spin" color="#06b6d4" size={32} /></div>;
  if (error) return <div className="text-center p-4" style={{color: '#ef4444'}}>Failed to load trips</div>;

  return (
    <div className="view-container">
      <div className="section-title gsap-fade-up">
        <h2>Find Partners</h2>
        <p>Plan your next big adventure together.</p>
      </div>

      {trips.map((trip) => (
        <div key={trip.id} className="card gsap-fade-up">
          <div className="card-header">
            <div className="user-info">
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
        </div>
      ))}
    </div>
  );
};

const CompanionView = ({ companions, loading }) => {
  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" color="#8b5cf6" size={32} /></div>;

  return (
    <div className="view-container">
      <div className="section-title gsap-fade-up">
        <h2>Local Companions</h2>
        <p>Find someone nearby.</p>
      </div>

      <div className="flex-col gap-4">
        {companions.map((item) => (
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

              <h3 style={{fontSize: 18, fontWeight: 'bold', margin: '4px 0'}}>{item.destination}</h3>
              <p style={{fontSize: 13, color: '#9ca3af', marginBottom: 12}}>{item.date}</p>
              <p style={{fontStyle: 'italic', fontSize: 13, color: '#d1d5db', flexGrow: 1}}>"{item.description}"</p>

              <div className="flex justify-between items-center" style={{marginTop: 16, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.1)'}}>
                <div className="flex items-center gap-2">
                  <img src={item.user.avatar} className="avatar" style={{width: 28, height: 28, border: 'none'}} alt="u" />
                  <span style={{fontSize: 12, color: '#d1d5db'}}>{item.user.name}</span>
                </div>
                <button className="btn-join">Join</button>
              </div>
            </div>
          </div>
        ))}
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
    if(!pickup || !dropoff || !selectedRide) return;
    setStatus('searching');
    setTimeout(() => setStatus('found'), 2000);
  };

  return (
    <div className="ride-container relative">
      <div className="map-placeholder">
        <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 200, height: 200, background: 'rgba(6,182,212,0.1)', borderRadius: '50%', filter: 'blur(50px)'}}></div>
      </div>
      
      <div className="ride-panel gsap-fade-up">
        {status === 'found' ? (
          <div className="text-center py-4">
            <div style={{width: 60, height: 60, background: 'rgba(34,197,94,0.2)', borderRadius: '50%', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4ade80'}}>
              <Car size={32} />
            </div>
            <h3 style={{fontSize: 20, fontWeight: 'bold', marginBottom: 8}}>Driver Found!</h3>
            <p style={{color: '#9ca3af', marginBottom: 20}}>Rajesh is 3 mins away.</p>
            <button onClick={() => setStatus('idle')} className="btn-primary" style={{background: '#374151'}}>Cancel Ride</button>
          </div>
        ) : status === 'searching' ? (
          <div className="text-center py-8">
            <Loader2 size={40} className="animate-spin" color="#06b6d4" style={{margin: '0 auto 16px'}} />
            <p>Connecting to drivers...</p>
          </div>
        ) : (
          <>
            <h2 style={{fontSize: 20, fontWeight: 'bold', marginBottom: 16}}>Where to?</h2>
            
            <div className="input-group">
              <div className="dot"></div>
              <input value={pickup} onChange={e=>setPickup(e.target.value)} placeholder="Current Location" className="ride-input" />
            </div>
            <div className="input-group">
              <div className="square"></div>
              <input value={dropoff} onChange={e=>setDropoff(e.target.value)} placeholder="Enter Destination" className="ride-input" />
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

const ProfileView = ({ user }) => (
  <div className="view-container">
    <div className="profile-header gsap-fade-up">
      <div className="profile-img-container">
        <img src={user?.avatar || "https://i.pravatar.cc/150?u=me"} alt="Me" className="profile-img" />
      </div>
      <h2 style={{fontSize: 24, fontWeight: 'bold'}}>{user?.name || "Traveler"}</h2>
      <p style={{color: '#9ca3af', fontSize: 14, display: 'flex', alignItems: 'center', gap: 4, marginTop: 4}}>
        <MapPin size={12} /> {user?.location || "Global Citizen"}
      </p>
    </div>

    <div className="stat-grid gsap-fade-up">
      <div className="stat-box">
        <span className="stat-val">0</span>
        <span className="stat-label">Trips</span>
      </div>
      <div className="stat-box">
        <span className="stat-val">5.0</span>
        <span className="stat-label">Rating</span>
      </div>
      <div className="stat-box">
        <span className="stat-val">0</span>
        <span className="stat-label">Friends</span>
      </div>
    </div>

    <div className="gsap-fade-up">
      <h3 style={{fontSize: 18, fontWeight: 'bold', marginBottom: 16}}>Past Trips</h3>
      <div className="card" style={{padding: 16, textAlign: 'center', color: '#6b7280'}}>
        <p>No past trips yet. Join one today!</p>
      </div>
    </div>
  </div>
);

const CreateModal = ({ onClose, type }) => (
  <div className="modal-overlay">
    <div className="modal-content gsap-scale-in">
      <button onClick={onClose} className="close-btn"><Plus size={24} style={{transform: 'rotate(45deg)'}} /></button>
      <h2 style={{fontSize: 20, fontWeight: 'bold', marginBottom: 24}}>
        {type === 'partner' ? 'New Trip' : 'Find Buddy'}
      </h2>
      <div className="form-group">
        <label className="form-label">Destination</label>
        <input className="form-input" placeholder="Where are you going?" />
      </div>
      <div className="form-group">
        <label className="form-label">Date</label>
        <input type="date" className="form-input" />
      </div>
      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea className="form-input" style={{height: 100, resize: 'none'}} placeholder="Details..." />
      </div>
      <button className="btn-primary">Post</button>
    </div>
  </div>
);

// --- Main App ---
export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [showModal, setShowModal] = useState(false);
  const [createType, setCreateType] = useState('partner');
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useGSAP();

  useEffect(() => {
    // Check local storage for existing session
    const savedUser = localStorage.getItem('travel_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    // Only fetch trips if user is logged in
    if (!user) return;

    const fetchTrips = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/trips`);
        if(!res.ok) throw new Error('Error');
        const data = await res.json();
        const raw = Array.isArray(data) ? data : (data.trips || []);
        
        setTrips(raw.map(t => ({
          id: t._id || Math.random(),
          user: {
            name: t.host?.username || t.host?.name || "Traveler",
            avatar: t.host?.avatar || `https://i.pravatar.cc/150?u=${t._id}`
          },
          origin: t.origin,
          destination: t.destination,
          date: formatDate(t.startDate),
          description: t.description || "No description.",
          tags: t.tags || ["Travel"],
          likes: t.travelers?.length || 0,
          activity: "Exploring",
          distance: "Unknown"
        })));
      } catch (err) { setError(err.message); } 
      finally { setLoading(false); }
    };
    fetchTrips();
  }, [user]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('travel_user', JSON.stringify(userData));
  };

  const handleFab = () => {
    setCreateType(activeTab === 'companion' ? 'companion' : 'partner');
    setShowModal(true);
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
        <Header />
        
        <div style={{minHeight: 'calc(100vh - 140px)'}}>
          {activeTab === 'home' && <FeedView trips={trips} loading={loading} error={error} />}
          {activeTab === 'companion' && <CompanionView companions={trips} loading={loading} />}
          {activeTab === 'ride' && <RideView />}
          {activeTab === 'profile' && <ProfileView user={user} />}
        </div>

        {(activeTab === 'home' || activeTab === 'companion') && (
          <button onClick={handleFab} className="fab gsap-scale-in">
            <Plus size={28} />
          </button>
        )}

        {showModal && <CreateModal onClose={()=>setShowModal(false)} type={createType} />}
        
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </>
  );
}