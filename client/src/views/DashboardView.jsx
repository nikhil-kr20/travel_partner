import React, { useEffect, useState } from 'react';
import { MapPin, Car, Calendar, User, Plus, Search, Star, Clock, ChevronRight, MoreVertical } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { getTrips } from '../services/trip.service.js';
import { getRides } from '../services/ride.service.js';
import { useNavigate } from 'react-router-dom';

function TripCard({ trip }) {
    const navigate = useNavigate();
    const defaultImg = 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80';
    return (
        <div className="card">
            <img src={trip.image || defaultImg} alt={trip.title || trip.fromLocation} className="card-img" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span className="status-badge status-upcoming">{trip.status || 'open'}</span>
                <button className="icon-btn" style={{ padding: 0 }} aria-label="Trip options"><MoreVertical size={18} /></button>
            </div>
            <h3 style={{ marginTop: '8px' }}>{trip.title || `${trip.fromLocation} → ${trip.toLocation}`}</h3>
            <div className="meta-info">
                <div className="meta-item"><MapPin size={16} /> {trip.fromLocation} → {trip.toLocation}</div>
            </div>
            <div className="meta-info" style={{ borderTop: 'none', paddingTop: '8px', marginTop: '0' }}>
                <div className="meta-item"><Calendar size={16} /> {new Date(trip.date).toLocaleDateString()}</div>
            </div>
            <button className="btn btn-outline" style={{ marginTop: '20px', width: '100%', justifyContent: 'center' }} onClick={() => navigate(`/trips/${trip._id}`)}>View Details</button>
        </div>
    );
}

function RideCard({ ride }) {
    const price = ride.pricePerKm ? `₹${ride.pricePerKm}/km` : ride.price || '—';
    const route = ride.route || `${ride.fromLocation} → ${ride.toLocation}`;
    const driverName = ride.riderId?.name || ride.driver || 'Driver';
    return (
        <div className="card" style={{ flexDirection: 'row', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <Car size={32} />
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span className="text-sm" style={{ color: 'var(--accent)', fontWeight: 600 }}>{ride.vehicleType || 'Ride'}</span>
                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--text-main)' }}>{price}</span>
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{route}</h3>
                <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {ride.date ? new Date(ride.date).toLocaleDateString() : '—'}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><User size={14} /> {driverName}</span>
                    {ride.rating && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#eab308' }}><Star size={14} fill="currentColor" /> {ride.rating}</span>}
                </div>
            </div>
            <button className="icon-btn" style={{ background: 'var(--bg-main)', width: '40px', height: '40px', borderRadius: '50%' }} aria-label="View ride details">
                <ChevronRight size={20} />
            </button>
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
            getRides({ limit: 2 }).catch(() => ({ rides: [] })),
        ]).then(([tripData, rideData]) => {
            setTrips(tripData.trips || []);
            setRides(rideData.rides || []);
        }).finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <div className="hero">
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h1>Where to next, {user?.name?.split(' ')[0]}?</h1>
                    <p>Discover local companions, plan seamless trips, and book reliable rides all in one place.</p>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <button className="btn btn-primary" onClick={() => onNavigate('trips')}><Plus size={18} /> Create Trip</button>
                        <button className="btn btn-secondary" style={{ background: 'white', color: 'var(--primary)' }} onClick={() => onNavigate('rides')}><Search size={18} /> Find a Ride</button>
                    </div>
                </div>
            </div>

            <div className="section-header">
                <h2>Upcoming Trips</h2>
                <button className="btn btn-outline" onClick={() => onNavigate('trips')}>View All</button>
            </div>
            {loading ? <div className="loader" /> : (
                <div className="grid-3" style={{ marginBottom: '40px' }}>
                    {trips.length > 0 ? trips.slice(0, 3).map(t => <TripCard key={t._id} trip={t} />) : (
                        <p style={{ color: 'var(--text-muted)' }}>No trips yet. Create your first trip!</p>
                    )}
                </div>
            )}

            <div className="section-header">
                <h2>Recent Ride Searches</h2>
                <button className="btn btn-outline" onClick={() => onNavigate('rides')}>Book a Ride</button>
            </div>
            {loading ? <div className="loader" /> : (
                <div className="grid-2">
                    {rides.length > 0 ? rides.slice(0, 2).map(r => <RideCard key={r._id} ride={r} />) : (
                        <p style={{ color: 'var(--text-muted)' }}>No rides available right now.</p>
                    )}
                </div>
            )}
        </div>
    );
}
