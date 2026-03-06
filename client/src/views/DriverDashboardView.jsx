import React, { useEffect, useState } from 'react';
import { Car, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { getMyRides } from '../services/ride.service.js';

export default function DriverDashboardView({ onNavigate }) {
    const { user } = useAuth();
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMyRides().then(r => setRides(r || [])).catch(() => setRides([])).finally(() => setLoading(false));
    }, []);

    const totalEarnings = rides.filter(r => r.status === 'completed').reduce((s, r) => s + (r.estimatedDistance * r.pricePerKm || 0), 0);
    const completedRides = rides.filter(r => r.status === 'completed').length;

    return (
        <div>
            <div className="hero" style={{ background: 'radial-gradient(circle at top right, rgba(16, 185, 129, 0.2), transparent), rgba(30, 41, 59, 0.4)' }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <span style={{ color: 'var(--secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', marginBottom: '8px', display: 'block' }}>
                        Driver Dashboard
                    </span>
                    <h1>Welcome back, {user?.name?.split(' ')[0]}!</h1>
                    <p style={{ maxWidth: '600px', fontSize: '1.2rem' }}>You have ride requests waiting for you in your area. Ready to hit the road?</p>
                    <button className="btn btn-primary" style={{ background: 'var(--secondary)', color: 'white', marginTop: '32px' }} onClick={() => onNavigate('rides')}>
                        <Car size={20} /> View Ride Requests
                    </button>
                </div>
            </div>
            <div style={{ marginBottom: '24px' }}><h2 style={{ fontSize: '1.5rem' }}>Today's Performance</h2></div>
            {loading ? <div className="loader" /> : (
                <div className="grid-3" style={{ marginBottom: '40px' }}>
                    <div className="card" style={{ textAlign: 'center', background: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                        <h3 style={{ fontSize: '2.5rem', color: 'var(--secondary)', marginBottom: '8px' }}>₹{totalEarnings.toFixed(0)}</h3>
                        <p style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Total Earnings</p>
                    </div>
                    <div className="card" style={{ textAlign: 'center', background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.2)' }}>
                        <h3 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '8px' }}>{completedRides}</h3>
                        <p style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Rides Completed</p>
                    </div>
                    <div className="card" style={{ textAlign: 'center', background: 'rgba(245, 158, 11, 0.05)', borderColor: 'rgba(245, 158, 11, 0.2)' }}>
                        <h3 style={{ fontSize: '2.5rem', color: 'var(--accent)', marginBottom: '8px' }}>{user?.rating?.average?.toFixed(1) || '—'}</h3>
                        <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--text-muted)' }}>Average Rating <Star size={18} fill="currentColor" /></p>
                    </div>
                </div>
            )}
        </div>
    );
}
