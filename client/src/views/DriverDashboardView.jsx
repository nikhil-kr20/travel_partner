import React, { useEffect, useState } from 'react';
import { Car, Star, Clock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { getMyRides } from '../services/ride.service.js';
import { getRideBookings, acceptBooking, completeBooking } from '../services/booking.service.js';

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
            <div className="hero" style={{ background: 'linear-gradient(135deg,var(--secondary) 0%,#059669 100%)' }}>
                <div className="hero-circles" />
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h1>Welcome back, {user?.name?.split(' ')[0]}!</h1>
                    <p>You have ride requests waiting for you in your area.</p>
                    <button className="btn btn-primary" style={{ background: 'white', color: 'var(--secondary)', marginTop: '16px' }} onClick={() => onNavigate('rides')}>
                        <Car size={18} /> View Requests
                    </button>
                </div>
            </div>
            <div className="section-header"><h2>Today's Overview</h2></div>
            {loading ? <div className="loader" /> : (
                <div className="grid-3" style={{ marginBottom: '40px' }}>
                    <div className="card" style={{ textAlign: 'center' }}><h3 style={{ fontSize: '2rem', color: 'var(--secondary)' }}>₹{totalEarnings.toFixed(0)}</h3><p>Total Earned</p></div>
                    <div className="card" style={{ textAlign: 'center' }}><h3 style={{ fontSize: '2rem', color: 'var(--primary)' }}>{completedRides}</h3><p>Rides Completed</p></div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <h3 style={{ fontSize: '2rem', color: '#eab308' }}>{user?.rating?.average?.toFixed(1) || '—'}</h3>
                        <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>Average Rating <Star size={16} fill="currentColor" /></p>
                    </div>
                </div>
            )}
        </div>
    );
}
