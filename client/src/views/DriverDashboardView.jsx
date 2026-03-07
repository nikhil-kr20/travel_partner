import React, { useEffect, useState } from 'react';
import { Car, Star, DollarSign, CheckCircle, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { getMyRides } from '../services/ride.service.js';

export default function DriverDashboardView({ onNavigate }) {
    const { user } = useAuth();
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMyRides().then(r => setRides(r || [])).catch(() => setRides([])).finally(() => setLoading(false));
    }, []);

    const totalEarnings = rides.filter(r => r.status === 'completed')
        .reduce((s, r) => s + (r.estimatedDistance * r.pricePerKm || 0), 0);
    const completedRides = rides.filter(r => r.status === 'completed').length;
    const firstName = user?.name?.split(' ')[0] || 'Driver';
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return (
        <div>
            {/* ── Hero ────────────────────────────────── */}
            <div className="hero" style={{
                background: 'linear-gradient(135deg, rgba(52,211,153,0.12) 0%, rgba(6,182,212,0.12) 50%, rgba(10,15,30,0.8) 100%)',
                marginBottom: 28,
            }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.25)',
                        borderRadius: 9999, padding: '5px 14px', fontSize: '0.75rem', fontWeight: 600,
                        color: '#34d399', marginBottom: 18,
                    }}>
                        <Compass size={13} /> {greeting}, {firstName}!
                    </div>

                    <h1 style={{ fontSize: '2rem', marginBottom: 10, lineHeight: 1.25 }}>
                        Ready to drive,{' '}
                        <span style={{
                            background: 'linear-gradient(135deg, #34d399, #06b6d4)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        }}>{firstName}?</span>
                    </h1>
                    <p style={{ marginBottom: 28, maxWidth: 480, fontSize: '0.95rem' }}>
                        You have ride requests waiting in your area. Keep your status active to accept bookings.
                    </p>
                    <button
                        className="btn btn-primary"
                        onClick={() => onNavigate('rides')}
                        id="driver-view-requests"
                        style={{ borderRadius: 12, background: 'linear-gradient(135deg, #34d399, #06b6d4)' }}
                    >
                        <Car size={17} /> View Ride Requests
                    </button>
                </div>
            </div>

            {/* ── Stats ──────────────────────────────── */}
            <div className="section-header">
                <h2 style={{ marginBottom: 2 }}>Your Overview</h2>
            </div>

            {loading ? <div className="loader" /> : (
                <div className="grid-3" style={{ marginBottom: 36 }}>
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399', width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <DollarSign size={20} />
                        </div>
                        <div>
                            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399', lineHeight: 1 }}>
                                ₹{totalEarnings.toFixed(0)}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 3 }}>Total Earned</div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon stat-icon-teal">
                            <CheckCircle size={20} />
                        </div>
                        <div>
                            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f1f5f9', lineHeight: 1 }}>
                                {completedRides}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 3 }}>Rides Completed</div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(251,191,36,0.12)', color: '#fbbf24', width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Star size={20} />
                        </div>
                        <div>
                            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24', lineHeight: 1 }}>
                                {user?.rating?.average?.toFixed(1) || '—'}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 3 }}>Average Rating</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
