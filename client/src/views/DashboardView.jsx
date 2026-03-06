import React, { useEffect, useState, useRef } from 'react';
import { MapPin, Car, Calendar, User, Plus, Search, Star, Clock, ChevronRight, MoreVertical, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { getTrips } from '../services/trip.service.js';
import { getRides } from '../services/ride.service.js';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function TripCard({ trip }) {
    const navigate = useNavigate();
    const cardRef = useRef(null);
    const defaultImg = 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80';

    useEffect(() => {
        gsap.fromTo(cardRef.current,
            { y: 30, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.8,
                scrollTrigger: {
                    trigger: cardRef.current,
                    start: "top 90%",
                }
            }
        );
    }, []);

    return (
        <div className="card" ref={cardRef}>
            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
                <img src={trip.image || defaultImg} alt={trip.title || trip.fromLocation} className="card-img" style={{ marginBottom: 0, transition: 'transform 0.5s ease' }} />
                <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                     <span className="status-badge status-upcoming" style={{ backdropFilter: 'blur(8px)', background: 'rgba(99, 102, 241, 0.3)' }}>{trip.status || 'open'}</span>
                </div>
            </div>
            <h3 style={{ fontSize: '1.2rem' }}>{trip.title || `${trip.fromLocation} → ${trip.toLocation}`}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '12px' }}>
                <Calendar size={14} /> {new Date(trip.date).toLocaleDateString()}
            </div>
            <div style={{ marginTop: 'auto' }}>
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate(`/trips/${trip._id}`)}>
                    Details <ArrowRight size={16} />
                </button>
            </div>
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
    const heroRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(heroRef.current,
            { opacity: 0, scale: 0.98 },
            { opacity: 1, scale: 1, duration: 1.2, ease: "expo.out" }
        );

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
            <div className="hero" ref={heroRef}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.8rem', marginBottom: '16px', display: 'block' }}>
                        Adventure Awaits
                    </span>
                    <h1>Where to next, {user?.name?.split(' ')[0]}?</h1>
                    <p style={{ maxWidth: '600px', fontSize: '1.2rem' }}>Discover local companions, plan seamless trips, and book reliable rides all in one place.</p>
                    <div style={{ display: 'flex', gap: '20px', marginTop: '40px' }}>
                        <button className="btn btn-primary" onClick={() => onNavigate('trips')}>
                            <Plus size={20} /> Plan a Trip
                        </button>
                        <button className="btn btn-outline" style={{ border: '2px solid white' }} onClick={() => onNavigate('rides')}>
                            <Search size={20} /> Find a Ride
                        </button>
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
