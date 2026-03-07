import React, { useEffect, useState } from 'react';
import {
    MapPin, Car, Calendar, User, Plus, Search,
    Star, Clock, ChevronRight, Users, Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { getTrips } from '../services/trip.service.js';
import { getRides } from '../services/ride.service.js';
import { useNavigate } from 'react-router-dom';
import { AnimatedGradient } from '@/components/ui/animated-gradient-with-svg.jsx';

const DEFAULT_DESTINATIONS = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80', // mountains
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80', // beach
    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=600&q=80', // city
];

function TripCard({ trip, idx }) {
    const navigate = useNavigate();
    const img = trip.image || DEFAULT_DESTINATIONS[idx % DEFAULT_DESTINATIONS.length];
    const statusClass = trip.status === 'active' ? 'status-active'
        : trip.status === 'completed' ? 'status-completed'
            : 'status-open';

    return (
        <div
            className="trip-card-img"
            onClick={() => navigate(`/trips/${trip._id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate(`/trips/${trip._id}`)}
            aria-label={`View trip: ${trip.title || trip.fromLocation}`}
        >
            <img src={img} alt={trip.title || 'Trip destination'} />
            <div className="trip-card-img-overlay" />

            {/* Status badge */}
            <div className="trip-card-status">
                <span className={`status-badge ${statusClass}`}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                    {trip.status || 'open'}
                </span>
            </div>

            {/* Date */}
            <div className="trip-card-date">
                <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 20,
                    padding: '4px 10px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: 'white',
                }}>
                    <Calendar size={12} />
                    {trip.date ? new Date(trip.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                </span>
            </div>

            {/* Content overlay */}
            <div className="trip-card-content">
                <h3 style={{ color: 'white', fontSize: '1rem', marginBottom: 6, fontWeight: 700, lineHeight: 1.3 }}>
                    {trip.title || `${trip.fromLocation} → ${trip.toLocation}`}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
                    <MapPin size={13} />
                    <span>{trip.fromLocation} → {trip.toLocation}</span>
                </div>
            </div>
        </div>
    );
}

function RideCard({ ride }) {
    const price = ride.pricePerKm ? `₹${ride.pricePerKm}/km` : ride.price || '—';
    const route = ride.route || `${ride.fromLocation || '?'} → ${ride.toLocation || '?'}`;
    const driverName = ride.riderId?.name || ride.driver || 'Driver';
    const initials = driverName.charAt(0).toUpperCase();

    return (
        <div className="card" style={{ flexDirection: 'row', alignItems: 'center', gap: 16, padding: '16px 20px', cursor: 'default' }}>
            {/* Icon */}
            <div style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(139,92,246,0.15))',
                border: '1px solid rgba(6,182,212,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#06b6d4',
                flexShrink: 0,
            }}>
                <Car size={22} />
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.75rem', color: '#8b5cf6', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        {ride.vehicleType || 'Available Ride'}
                    </span>
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: '#06b6d4' }}>{price}</span>
                </div>

                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f1f5f9', marginBottom: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {route}
                </div>

                <div style={{ display: 'flex', gap: 14, color: '#64748b', fontSize: '0.78rem', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={12} />
                        {ride.date ? new Date(ride.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <User size={12} />
                        {driverName}
                    </span>
                    {ride.rating && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#fbbf24' }}>
                            <Star size={12} fill="currentColor" />
                            {ride.rating}
                        </span>
                    )}
                </div>
            </div>

            {/* Arrow */}
            <div style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'rgba(6,182,212,0.1)',
                border: '1px solid rgba(6,182,212,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#06b6d4',
                cursor: 'pointer',
                transition: 'all 0.2s',
                flexShrink: 0,
            }}>
                <ChevronRight size={16} />
            </div>
        </div>
    );
}

export default function DashboardView({ onNavigate }) {
    const { user } = useAuth();
    const [trips, setTrips] = useState([]);
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            getTrips({ limit: 3 }).catch(() => ({ trips: [] })),
            getRides({ limit: 3 }).catch(() => ({ rides: [] })),
        ]).then(([tripData, rideData]) => {
            setTrips(tripData.trips || []);
            setRides(rideData.rides || []);
        }).finally(() => setLoading(false));
    }, []);

    const firstName = user?.name?.split(' ')[0] || 'Explorer';
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return (
        <div>
            {/* ── Hero ────────────────────────────────── */}
            <div className="hero" style={{ position: 'relative' }}>
                {/* Live animated gradient blobs */}
                <AnimatedGradient
                    colors={['#06b6d4', '#8b5cf6', '#0e7490']}
                    speed={0.04}
                    blur="heavy"
                />
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        background: 'rgba(6,182,212,0.1)',
                        border: '1px solid rgba(6,182,212,0.2)',
                        borderRadius: 9999,
                        padding: '5px 14px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#06b6d4',
                        marginBottom: 18,
                    }}>
                        <Compass size={13} />
                        {greeting}, {firstName}!
                    </div>

                    <h1 style={{ fontSize: '2rem', marginBottom: 10, lineHeight: 1.25 }}>
                        Where to next, {' '}
                        <span style={{
                            background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>{firstName}?</span>
                    </h1>

                    <p style={{ marginBottom: 28, maxWidth: 480, fontSize: '0.95rem' }}>
                        Discover travel companions, plan seamless trips, and book reliable rides — all in one place.
                    </p>

                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        <button
                            className="btn btn-primary"
                            onClick={() => onNavigate('trips')}
                            id="hero-create-trip"
                            style={{ borderRadius: 12 }}
                        >
                            <Plus size={17} /> Create Trip
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => onNavigate('rides')}
                            id="hero-find-ride"
                            style={{ borderRadius: 12 }}
                        >
                            <Search size={17} /> Find a Ride
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Stats Row ───────────────────────────── */}
            <div className="grid-3" style={{ marginBottom: 36 }}>
                <div className="stat-card">
                    <div className="stat-icon stat-icon-teal"><MapPin size={20} /></div>
                    <div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f1f5f9', lineHeight: 1 }}>{trips.length}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 3 }}>Active Trips</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon stat-icon-purple"><Car size={20} /></div>
                    <div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f1f5f9', lineHeight: 1 }}>{rides.length}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 3 }}>Available Rides</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon stat-icon-pink"><Users size={20} /></div>
                    <div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f1f5f9', lineHeight: 1 }}>—</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 3 }}>Connections</div>
                    </div>
                </div>
            </div>

            {/* ── Upcoming Trips ──────────────────────── */}
            <div className="section-header">
                <div>
                    <h2 style={{ marginBottom: 2 }}>Upcoming Trips</h2>
                    <p style={{ fontSize: '0.825rem', color: '#64748b' }}>Your planned adventures</p>
                </div>
                <button
                    className="btn btn-outline"
                    onClick={() => onNavigate('trips')}
                    id="view-all-trips"
                    style={{ borderRadius: 10 }}
                >
                    View All <ChevronRight size={15} />
                </button>
            </div>

            {loading ? (
                <div className="loader" />
            ) : (
                <div className="grid-3" style={{ marginBottom: 40 }}>
                    {trips.length > 0
                        ? trips.slice(0, 3).map((t, i) => <TripCard key={t._id} trip={t} idx={i} />)
                        : (
                            <div className="empty-state" style={{ gridColumn: '1 / -1', padding: '40px 20px' }}>
                                <div className="empty-state-icon" style={{ width: 56, height: 56, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(6,182,212,0.08)', borderRadius: 14, color: '#06b6d4' }}>
                                    <MapPin size={22} />
                                </div>
                                <p style={{ fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>No trips yet</p>
                                <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: 16 }}>Create your first trip and find companions!</p>
                                <button className="btn btn-primary" onClick={() => onNavigate('trips')} style={{ borderRadius: 10 }}>
                                    <Plus size={16} /> Create Trip
                                </button>
                            </div>
                        )}
                </div>
            )}

            {/* ── Available Rides ────────────────────── */}
            <div className="section-header">
                <div>
                    <h2 style={{ marginBottom: 2 }}>Available Rides</h2>
                    <p style={{ fontSize: '0.825rem', color: '#64748b' }}>Book your next journey</p>
                </div>
                <button
                    className="btn btn-outline"
                    onClick={() => onNavigate('rides')}
                    id="view-all-rides"
                    style={{ borderRadius: 10 }}
                >
                    Book a Ride <ChevronRight size={15} />
                </button>
            </div>

            {loading ? (
                <div className="loader" />
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {rides.length > 0
                        ? rides.slice(0, 3).map(r => <RideCard key={r._id} ride={r} />)
                        : (
                            <div className="empty-state">
                                <div className="empty-state-icon" style={{ width: 56, height: 56, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(139,92,246,0.08)', borderRadius: 14, color: '#8b5cf6' }}>
                                    <Car size={22} />
                                </div>
                                <p style={{ fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>No rides available</p>
                                <p style={{ fontSize: '0.85rem', color: '#475569' }}>Check back soon or search for upcoming rides.</p>
                            </div>
                        )}
                </div>
            )}
        </div>
    );
}
