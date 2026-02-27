import React, { useState } from 'react';
import { 
  MapPin, 
  Car, 
  MessageSquare, 
  Home, 
  User, 
  Search, 
  Bell, 
  Plus, 
  Calendar, 
  Clock, 
  Star, 
  Send,
  MoreVertical,
  ChevronRight,
  Compass
} from 'lucide-react';

// ==========================================
// CUSTOM CSS DESIGN SYSTEM (NO TAILWIND)
// ==========================================
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  :root {
    --primary: #1E3A8A;
    --primary-light: #eff6ff;
    --secondary: #10B981;
    --accent: #F97316;
    --accent-light: #fff7ed;
    --bg-main: #F8FAFC;
    --bg-surface: #FFFFFF;
    --text-main: #0F172A;
    --text-muted: #64748B;
    --border: #E2E8F0;
    
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 24px;
    --radius-full: 9999px;
    
    --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
    --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
    
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Inter', sans-serif;
    background-color: var(--bg-main);
    color: var(--text-main);
    overflow-x: hidden;
  }

  /* Layout */
  .app-layout {
    display: flex;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }

  .sidebar {
    width: 260px;
    background: var(--bg-surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    padding: 24px 16px;
    z-index: 10;
  }

  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow-y: auto;
    position: relative;
  }

  /* Typography */
  h1 { font-size: 2.5rem; font-weight: 700; color: var(--primary); letter-spacing: -0.02em; }
  h2 { font-size: 1.75rem; font-weight: 600; margin-bottom: 16px; }
  h3 { font-size: 1.25rem; font-weight: 600; margin-bottom: 8px; }
  p { line-height: 1.6; color: var(--text-muted); }
  .text-sm { font-size: 0.875rem; }

  /* Components */
  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary);
    margin-bottom: 40px;
    padding: 0 12px;
  }

  .logo-icon {
    background: var(--primary);
    color: white;
    padding: 8px;
    border-radius: var(--radius-md);
  }

  .nav-menu {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: var(--radius-md);
    cursor: pointer;
    color: var(--text-muted);
    font-weight: 500;
    transition: var(--transition);
  }

  .nav-item:hover {
    background-color: var(--primary-light);
    color: var(--primary);
  }

  .nav-item.active {
    background-color: var(--primary);
    color: white;
    box-shadow: var(--shadow-md);
  }

  /* Header */
  .top-header {
    height: 80px;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(12px);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    position: sticky;
    top: 0;
    z-index: 5;
    border-bottom: 1px solid var(--border);
  }

  .search-bar {
    display: flex;
    align-items: center;
    background: var(--bg-main);
    padding: 10px 16px;
    border-radius: var(--radius-full);
    width: 300px;
    border: 1px solid var(--border);
  }

  .search-bar input {
    border: none;
    background: transparent;
    outline: none;
    margin-left: 8px;
    width: 100%;
    color: var(--text-main);
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .icon-btn {
    background: transparent;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    position: relative;
    transition: var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .icon-btn:hover {
    color: var(--primary);
  }

  .badge {
    position: absolute;
    top: -4px;
    right: -4px;
    background: var(--accent);
    color: white;
    font-size: 0.65rem;
    font-weight: bold;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--primary-light);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary);
    font-weight: 600;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: var(--shadow-sm);
  }

  /* Buttons */
  .btn {
    padding: 12px 24px;
    border-radius: var(--radius-full);
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    border: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 0.95rem;
  }

  .btn-primary {
    background: var(--primary);
    color: white;
    box-shadow: var(--shadow-md);
  }

  .btn-primary:hover {
    background: #152c6b;
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  .btn-secondary {
    background: var(--secondary);
    color: white;
  }

  .btn-outline {
    background: transparent;
    border: 2px solid var(--border);
    color: var(--text-main);
  }
  
  .btn-outline:hover {
    border-color: var(--primary);
    color: var(--primary);
  }

  /* Content Area */
  .page-content {
    padding: 32px;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }

  /* Grids & Cards */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }

  .card {
    background: var(--bg-surface);
    border-radius: var(--radius-lg);
    padding: 24px;
    border: 1px solid var(--border);
    transition: var(--transition);
    box-shadow: var(--shadow-sm);
    display: flex;
    flex-direction: column;
  }

  .card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--primary-light);
  }

  .card-img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: var(--radius-md);
    margin-bottom: 16px;
    background: var(--border);
  }

  .status-badge {
    padding: 6px 12px;
    border-radius: var(--radius-full);
    font-size: 0.75rem;
    font-weight: 600;
    display: inline-block;
  }
  .status-upcoming { background: var(--primary-light); color: var(--primary); }
  .status-active { background: #dcfce7; color: var(--secondary); }
  
  .meta-info {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: auto;
    padding-top: 16px;
    border-top: 1px solid var(--border);
    font-size: 0.875rem;
    color: var(--text-muted);
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  /* Hero Section (Landing) */
  .hero {
    background: linear-gradient(135deg, var(--primary) 0%, #3b82f6 100%);
    border-radius: var(--radius-lg);
    padding: 64px 40px;
    color: white;
    margin-bottom: 40px;
    position: relative;
    overflow: hidden;
  }

  .hero h1 { color: white; margin-bottom: 16px; }
  .hero p { color: rgba(255,255,255,0.8); font-size: 1.125rem; margin-bottom: 32px; max-width: 600px; }
  
  .hero-circles {
    position: absolute;
    top: -50%;
    right: -10%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
    border-radius: 50%;
  }

  /* Chat Specific */
  .chat-layout {
    display: flex;
    height: calc(100vh - 80px);
    background: var(--bg-surface);
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    border: 1px solid var(--border);
    overflow: hidden;
    margin: 0 32px;
  }

  .chat-sidebar {
    width: 320px;
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    background: #fafafa;
  }
  
  .chat-sidebar-header {
    padding: 20px;
    border-bottom: 1px solid var(--border);
  }

  .contact-list {
    flex: 1;
    overflow-y: auto;
  }

  .contact-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    transition: var(--transition);
  }

  .contact-item:hover, .contact-item.active {
    background: white;
  }

  .contact-item.active {
    border-left: 4px solid var(--primary);
  }

  .chat-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: white;
  }

  .chat-header {
    padding: 20px;
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .chat-messages {
    flex: 1;
    padding: 24px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
    background: var(--bg-main);
  }

  .message {
    max-width: 70%;
    padding: 12px 16px;
    border-radius: 16px;
    line-height: 1.5;
    position: relative;
  }

  .message.received {
    align-self: flex-start;
    background: white;
    border: 1px solid var(--border);
    border-bottom-left-radius: 4px;
  }

  .message.sent {
    align-self: flex-end;
    background: var(--primary);
    color: white;
    border-bottom-right-radius: 4px;
  }

  .message-time {
    font-size: 0.7rem;
    margin-top: 4px;
    opacity: 0.7;
    text-align: right;
  }

  .chat-input-area {
    padding: 20px;
    border-top: 1px solid var(--border);
    display: flex;
    gap: 12px;
    background: white;
  }

  .chat-input-area input {
    flex: 1;
    padding: 14px 20px;
    border-radius: var(--radius-full);
    border: 1px solid var(--border);
    outline: none;
    font-size: 1rem;
    background: var(--bg-main);
  }
  
  .chat-input-area input:focus {
    border-color: var(--primary);
    background: white;
  }

  .send-btn {
    background: var(--primary);
    color: white;
    border: none;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: var(--transition);
  }
  
  .send-btn:hover {
    transform: scale(1.05);
    background: #152c6b;
  }

  /* Section Headers */
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }
  
  /* Auth & Forms */
  .auth-wrapper {
    display: flex; align-items: center; justify-content: center;
    height: 100vh; width: 100vw; background: var(--bg-main);
  }
  .auth-card {
    background: white; padding: 40px; border-radius: var(--radius-lg);
    width: 100%; max-width: 400px; box-shadow: var(--shadow-lg);
  }
  .form-group { margin-bottom: 20px; }
  .form-group label { display: block; margin-bottom: 8px; font-weight: 500; font-size: 0.9rem; }
  .form-control {
    width: 100%; padding: 12px 16px; border-radius: var(--radius-md);
    border: 1px solid var(--border); outline: none; font-family: inherit;
    transition: var(--transition);
  }
  .form-control:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-light); }
  .role-selector { display: flex; gap: 10px; margin-bottom: 20px; }
  .role-btn {
    flex: 1; padding: 10px; text-align: center; border: 1px solid var(--border);
    border-radius: var(--radius-md); cursor: pointer; transition: var(--transition);
  }
  .role-btn.active { background: var(--primary-light); border-color: var(--primary); color: var(--primary); font-weight: 600; }
  
  /* Ride Booking */
  .booking-form {
    background: white; padding: 24px; border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm); border: 1px solid var(--border); margin-bottom: 32px;
  }
  .loader {
    border: 4px solid var(--border); border-top: 4px solid var(--primary);
    border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite;
    margin: 20px auto;
  }
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
`;

// ==========================================
// MOCK DATA
// ==========================================
const MOCK_TRIPS = [
  { id: 1, title: "Euro Trip 2026", location: "Paris, France", date: "Oct 12 - Oct 20", members: 4, type: "Group", img: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80" },
  { id: 2, title: "Kyoto Temple Run", location: "Kyoto, Japan", date: "Nov 05 - Nov 15", members: 1, type: "Solo", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80" },
  { id: 3, title: "Swiss Alps Hiking", location: "Zermatt, Switzerland", date: "Dec 01 - Dec 10", members: 3, type: "Group", img: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80" }
];

const MOCK_RIDES = [
  { id: 1, driver: "Michael D.", route: "CDG Airport → City Center", time: "10:30 AM", price: "€45", rating: 4.8, type: "Airport Transfer" },
  { id: 2, driver: "Sarah W.", route: "Eiffel Tower → Louvre", time: "2:00 PM", price: "€15", rating: 4.9, type: "City Ride" },
];

const MOCK_CHATS = [
  { id: 1, name: "Euro Trip Group", lastMsg: "Don't forget your passports!", time: "10m ago", unread: 2, type: 'group' },
  { id: 2, name: "Michael (Driver)", lastMsg: "I have arrived at terminal 2.", time: "1h ago", unread: 0, type: 'personal' },
  { id: 3, name: "Anna Smith", lastMsg: "Are we still meeting at 8?", time: "Yesterday", unread: 0, type: 'personal' },
];

// ==========================================
// COMPONENTS
// ==========================================

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null); // null if not logged in
  const [showLogin, setShowLogin] = useState(true);

  if (!user) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
        {showLogin ? (
          <LoginView onLogin={setUser} onSwitch={() => setShowLogin(false)} />
        ) : (
          <SignupView onSignup={setUser} onSwitch={() => setShowLogin(true)} />
        )}
      </>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      <div className="app-layout">
        
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="logo">
            <div className="logo-icon"><Compass size={24} /></div>
            TravelPartner
          </div>
          
          <nav className="nav-menu">
            <NavItem icon={<Home />} label="Dashboard" isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            {user.role === 'user' && (
              <NavItem icon={<MapPin />} label="Trips" isActive={activeTab === 'trips'} onClick={() => setActiveTab('trips')} />
            )}
            <NavItem icon={<Car />} label={user.role === 'user' ? "Book Ride" : "Requests"} isActive={activeTab === 'rides'} onClick={() => setActiveTab('rides')} />
            <NavItem icon={<MessageSquare />} label="Messages" isActive={activeTab === 'chat'} onClick={() => setActiveTab('chat')} badge={2} />
            <div style={{ margin: '20px 0', borderBottom: '1px solid var(--border)' }}></div>
            <NavItem icon={<User />} label="Profile" isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
          </nav>
          
          <div style={{ marginTop: 'auto', padding: '20px 0' }}>
            <div className="card" style={{ padding: '16px', background: 'var(--primary-light)', borderColor: 'var(--primary-light)' }}>
              <h4 style={{ color: 'var(--primary)', marginBottom: '8px' }}>Pro Plan</h4>
              <p className="text-sm" style={{ marginBottom: '12px' }}>Unlock all companion features.</p>
              <button className="btn btn-primary" style={{ width: '100%', padding: '8px', fontSize: '0.85rem' }}>Upgrade</button>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="main-content">
          
          {/* TOP HEADER */}
          <header className="top-header">
            <div className="search-bar">
              <Search size={18} color="var(--text-muted)" />
              <input type="text" placeholder="Search trips, rides, friends..." />
            </div>
            
            <div className="header-actions">
              <button className="icon-btn">
                <Bell size={20} />
                <span className="badge">3</span>
              </button>
              <div className="user-avatar">{user.name.charAt(0)}</div>
            </div>
          </header>

          {/* DYNAMIC VIEWS */}
          <div className={activeTab === 'chat' ? '' : 'page-content'}>
            {activeTab === 'dashboard' && (user.role === 'user' ? <DashboardView onNavigate={setActiveTab} user={user} /> : <DriverDashboardView onNavigate={setActiveTab} user={user} />)}
            {activeTab === 'trips' && user.role === 'user' && <TripsView />}
            {activeTab === 'rides' && (user.role === 'user' ? <RidesView /> : <DriverRidesView />)}
            {activeTab === 'chat' && <ChatView />}
            {activeTab === 'profile' && (
              <div>
                <h2>Profile Settings</h2>
                <p>Logged in as: <strong>{user.name}</strong> ({user.role})</p>
                <button className="btn btn-outline" style={{marginTop: '20px'}} onClick={() => setUser(null)}>Logout</button>
              </div>
            )}
          </div>

        </main>
      </div>
    </>
  );
}

// --- View Components ---

function DashboardView({ onNavigate, user }) {
  return (
    <div>
      <div className="hero">
        <div className="hero-circles"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1>Where to next, {user?.name.split(' ')[0]}?</h1>
          <p>Discover local companions, plan seamless trips, and book reliable rides all in one place.</p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button className="btn btn-primary" onClick={() => onNavigate('trips')}>
              <Plus size={18} /> Create Trip
            </button>
            <button className="btn btn-secondary" style={{ background: 'white', color: 'var(--primary)' }} onClick={() => onNavigate('rides')}>
              <Search size={18} /> Find a Ride
            </button>
          </div>
        </div>
      </div>

      <div className="section-header">
        <h2>Upcoming Trips</h2>
        <button className="btn btn-outline" onClick={() => onNavigate('trips')}>View All</button>
      </div>
      
      <div className="grid-3" style={{ marginBottom: '40px' }}>
        {MOCK_TRIPS.slice(0, 3).map(trip => <TripCard key={trip.id} trip={trip} />)}
      </div>

      <div className="section-header">
        <h2>Recent Ride Searches</h2>
        <button className="btn btn-outline" onClick={() => onNavigate('rides')}>Book a Ride</button>
      </div>
      
      <div className="grid-2">
        {MOCK_RIDES.map(ride => <RideCard key={ride.id} ride={ride} />)}
      </div>
    </div>
  );
}

function TripsView() {
  return (
    <div>
      <div className="section-header">
        <div>
          <h1>Your Trips</h1>
          <p>Manage your travel companions and itineraries.</p>
        </div>
        <button className="btn btn-primary"><Plus size={18} /> New Trip</button>
      </div>
      
      <div className="grid-3">
        {MOCK_TRIPS.map(trip => <TripCard key={trip.id} trip={trip} />)}
        {/* Empty state card for UI completeness */}
        <div className="card" style={{ borderStyle: 'dashed', background: 'transparent', justifyContent: 'center', alignItems: 'center', minHeight: '340px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: 'var(--primary)' }}>
            <Plus size={24} />
          </div>
          <h3 style={{ margin: 0 }}>Plan a new journey</h3>
          <p style={{ textAlign: 'center', marginTop: '8px' }}>Start inviting companions.</p>
        </div>
      </div>
    </div>
  );
}

function RidesView() {
  const [bookingState, setBookingState] = useState('idle'); // idle, searching, found
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  const handleBook = (e) => {
    e.preventDefault();
    setBookingState('searching');
    setTimeout(() => {
      setBookingState('found');
    }, 2000); // simulate API matching delay
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1>Book a Ride</h1>
          <p>Enter your location and destination to automatically match with a driver.</p>
        </div>
      </div>
      
      <div className="booking-form">
        {bookingState === 'idle' && (
          <form onSubmit={handleBook} style={{ display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr auto', alignItems: 'end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Pickup Location</label>
              <input type="text" className="form-control" placeholder="Current location..." required value={origin} onChange={e => setOrigin(e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Destination</label>
              <input type="text" className="form-control" placeholder="Where to?" required value={destination} onChange={e => setDestination(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ height: '45px' }}>Find Ride</button>
          </form>
        )}
        
        {bookingState === 'searching' && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div className="loader"></div>
            <h3>Finding the best driver...</h3>
            <p>Please wait while we locate a driver near {origin}.</p>
          </div>
        )}
        
        {bookingState === 'found' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dcfce7', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Car size={32} />
            </div>
            <h3>Ride Matched!</h3>
            <p style={{ marginBottom: '24px' }}>Your driver is on the way.</p>
            <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'left' }}>
              <RideCard ride={{ id: 99, driver: "Alex T.", route: `${origin} → ${destination}`, time: "Arriving in 5 mins", price: "Est. €18", rating: 4.9, type: "Standard Ride" }} />
            </div>
            <button className="btn btn-outline" style={{ marginTop: '24px' }} onClick={() => { setBookingState('idle'); setOrigin(''); setDestination(''); }}>Book Another</button>
          </div>
        )}
      </div>

      <div className="section-header">
        <h2>Available & Scheduled Rides</h2>
      </div>
      <div className="grid-2">
        {MOCK_RIDES.map(ride => <RideCard key={ride.id} ride={ride} />)}
      </div>
    </div>
  );
}

function ChatView() {
  const [activeChatId, setActiveChatId] = useState(1);
  const activeChat = MOCK_CHATS.find(c => c.id === activeChatId);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px 32px 12px' }}>
        <h2>Messages</h2>
      </div>
      
      <div className="chat-layout">
        <div className="chat-sidebar">
          <div className="chat-sidebar-header">
            <div className="search-bar" style={{ width: '100%', background: 'white' }}>
              <Search size={16} color="var(--text-muted)" />
              <input type="text" placeholder="Search chats..." style={{ fontSize: '0.9rem' }} />
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <span className="status-badge status-upcoming" style={{ cursor: 'pointer' }}>All</span>
              <span className="status-badge" style={{ background: '#f1f5f9', cursor: 'pointer' }}>Groups</span>
              <span className="status-badge" style={{ background: '#f1f5f9', cursor: 'pointer' }}>Personal</span>
            </div>
          </div>
          
          <div className="contact-list">
            {MOCK_CHATS.map(chat => (
              <div 
                key={chat.id} 
                className={`contact-item ${activeChatId === chat.id ? 'active' : ''}`}
                onClick={() => setActiveChatId(chat.id)}
              >
                <div className="user-avatar" style={{ background: chat.type === 'group' ? 'var(--accent-light)' : 'var(--primary-light)', color: chat.type === 'group' ? 'var(--accent)' : 'var(--primary)' }}>
                  {chat.type === 'group' ? <Compass size={20} /> : chat.name.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <h4 style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.95rem' }}>{chat.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{chat.time}</span>
                  </div>
                  <p className="text-sm" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                    {chat.lastMsg}
                  </p>
                </div>
                {chat.unread > 0 && (
                  <div style={{ background: 'var(--accent)', color: 'white', fontSize: '0.7rem', fontWeight: 'bold', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {chat.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="chat-main">
          {activeChat ? (
            <>
              <div className="chat-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="user-avatar">{activeChat.type === 'group' ? 'G' : activeChat.name.charAt(0)}</div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{activeChat.name}</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>Online</span>
                  </div>
                </div>
                <button className="icon-btn"><MoreVertical size={20} /></button>
              </div>
              
              <div className="chat-messages">
                <div className="message received">
                  Hey everyone! So excited for the trip next week! ✈️
                  <div className="message-time">10:24 AM</div>
                </div>
                <div className="message received">
                  <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 'bold', marginBottom: '4px' }}>Anna</div>
                  Don't forget your passports!
                  <div className="message-time">10:26 AM</div>
                </div>
                <div className="message sent">
                  Packed and ready to go! See you all at the airport.
                  <div className="message-time">10:30 AM</div>
                </div>
              </div>
              
              <div className="chat-input-area">
                <button className="icon-btn" style={{ padding: '0 8px' }}><Plus size={24} /></button>
                <input type="text" placeholder="Type a message..." />
                <button className="send-btn"><Send size={18} style={{ marginLeft: '-2px' }} /></button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Micro Components ---

function NavItem({ icon, label, isActive, onClick, badge }) {
  return (
    <div className={`nav-item ${isActive ? 'active' : ''}`} onClick={onClick}>
      {icon}
      <span style={{ flex: 1 }}>{label}</span>
      {badge && <span className="badge" style={{ position: 'relative', top: 0, right: 0 }}>{badge}</span>}
    </div>
  );
}

function TripCard({ trip }) {
  return (
    <div className="card">
      <img src={trip.img} alt={trip.title} className="card-img" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <span className="status-badge status-upcoming">{trip.type}</span>
        <button className="icon-btn" style={{ padding: 0 }}><MoreVertical size={18} /></button>
      </div>
      <h3 style={{ marginTop: '8px' }}>{trip.title}</h3>
      <div className="meta-info">
        <div className="meta-item"><MapPin size={16} /> {trip.location}</div>
      </div>
      <div className="meta-info" style={{ borderTop: 'none', paddingTop: '8px', marginTop: '0' }}>
        <div className="meta-item"><Calendar size={16} /> {trip.date}</div>
        <div className="meta-item" style={{ marginLeft: 'auto' }}><User size={16} /> {trip.members}</div>
      </div>
      <button className="btn btn-outline" style={{ marginTop: '20px', width: '100%', justifyContent: 'center' }}>View Details</button>
    </div>
  );
}

function RideCard({ ride }) {
  return (
    <div className="card" style={{ flexDirection: 'row', alignItems: 'center', gap: '20px' }}>
      <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
        <Car size={32} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span className="text-sm" style={{ color: 'var(--accent)', fontWeight: '600' }}>{ride.type}</span>
          <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--text-main)' }}>{ride.price}</span>
        </div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{ride.route}</h3>
        <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {ride.time}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><User size={14} /> {ride.driver}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#eab308' }}><Star size={14} fill="currentColor" /> {ride.rating}</span>
        </div>
      </div>
      <button className="icon-btn" style={{ background: 'var(--bg-main)', width: '40px', height: '40px', borderRadius: '50%' }}>
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

// --- New Role & Auth Components ---
function DriverDashboardView({ onNavigate, user }) {
  return (
    <div>
      <div className="hero" style={{ background: 'linear-gradient(135deg, var(--secondary) 0%, #059669 100%)' }}>
        <div className="hero-circles"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1>Welcome back, {user?.name.split(' ')[0]}!</h1>
          <p>You have new ride requests waiting for you in your area.</p>
          <button className="btn btn-primary" style={{ background: 'white', color: 'var(--secondary)', marginTop: '16px' }} onClick={() => onNavigate('rides')}>
            <Car size={18} /> View Requests
          </button>
        </div>
      </div>
      <div className="section-header">
        <h2>Today's Earnings</h2>
      </div>
      <div className="grid-3" style={{ marginBottom: '40px' }}>
         <div className="card" style={{ textAlign: 'center' }}><h3 style={{ fontSize: '2rem', color: 'var(--secondary)' }}>€124.50</h3><p>Total Earned</p></div>
         <div className="card" style={{ textAlign: 'center' }}><h3 style={{ fontSize: '2rem', color: 'var(--primary)' }}>5</h3><p>Rides Completed</p></div>
         <div className="card" style={{ textAlign: 'center' }}><h3 style={{ fontSize: '2rem', color: '#eab308' }}>4.9</h3><p style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px'}}>Average Rating <Star size={16} fill="currentColor"/></p></div>
      </div>
    </div>
  );
}

function DriverRidesView() {
  return (
    <div>
      <div className="section-header">
        <div>
          <h1>Ride Requests</h1>
          <p>Accept new passengers in your vicinity.</p>
        </div>
      </div>
      <div className="grid-2">
        {[
          { route: 'Airport CDG → Eiffel Tower', price: '€35', dist: 'Pickup in 5m', pax: 2 },
          { route: 'Louvre → Latin Quarter', price: '€12', dist: 'Pickup in 12m', pax: 1 },
          { route: 'Montmartre → Gare du Nord', price: '€18', dist: 'Pickup in 3m', pax: 3 }
        ].map((req, i) => (
          <div key={i} className="card" style={{ gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{req.route}</h3>
              <span style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.2rem' }}>{req.price}</span>
            </div>
            <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={16} /> {req.dist}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><User size={16} /> {req.pax} Passengers</span>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Accept</button>
              <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>Decline</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LoginView({ onLogin, onSwitch }) {
  const [role, setRole] = useState('user');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ name: role === 'driver' ? 'Driver Dan' : 'Jane Doe', role }); 
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="logo" style={{ justifyContent: 'center', marginBottom: '24px' }}>
          <div className="logo-icon"><Compass size={24} /></div>
          TravelPartner
        </div>
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Welcome Back</h2>
        
        <div className="role-selector">
          <div className={`role-btn ${role === 'user' ? 'active' : ''}`} onClick={() => setRole('user')}>Traveler</div>
          <div className={`role-btn ${role === 'driver' ? 'active' : ''}`} onClick={() => setRole('driver')}>Driver</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" className="form-control" required placeholder="name@example.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" required placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}>Log In</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
          Don't have an account? <span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '600' }} onClick={onSwitch}>Sign up</span>
        </p>
      </div>
    </div>
  );
}

function SignupView({ onSignup, onSwitch }) {
  const [role, setRole] = useState('user');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignup({ name: name || 'New User', role });
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="logo" style={{ justifyContent: 'center', marginBottom: '24px' }}>
          <div className="logo-icon"><Compass size={24} /></div>
          TravelPartner
        </div>
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Create Account</h2>
        
        <div className="role-selector">
          <div className={`role-btn ${role === 'user' ? 'active' : ''}`} onClick={() => setRole('user')}>Traveler</div>
          <div className={`role-btn ${role === 'driver' ? 'active' : ''}`} onClick={() => setRole('driver')}>Driver</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" className="form-control" required placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" className="form-control" required placeholder="name@example.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" required placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}>Sign Up</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
          Already have an account? <span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '600' }} onClick={onSwitch}>Log in</span>
        </p>
      </div>
    </div>
  );
}