import React, { useEffect, useState } from 'react';
import { Car, Clock, User, Star, MapPin, Search, ChevronRight } from 'lucide-react';
import { getRides } from '../services/ride.service.js';
import { createBooking } from '../services/booking.service.js';

function RideCard({ ride, onBook }) {
    const [booking, setBooking] = useState(false);
    const [booked, setBooked] = useState(false);

    const handleBook = async () => {
        setBooking(true);
        try {
            await onBook(ride._id);
            setBooked(true);
        } catch (_) { }
        finally { setBooking(false); }
    };

    const price = `₹${ride.pricePerKm || '—'}/km`;
    const route = `${ride.fromLocation || '?'} → ${ride.toLocation || '?'}`;
    const driverName = ride.riderId?.name || 'Driver';
    const isAvailable = ride.status === 'available';

    return (
        <div className="card" style={{ flexDirection: 'row', alignItems: 'center', gap: 16, padding: '16px 20px' }}>
            {/* Car Icon */}
            <div style={{
                width: 56, height: 56, borderRadius: 14, flexShrink: 0,
                background: 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(139,92,246,0.1))',
                border: '1px solid rgba(6,182,212,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06b6d4',
            }}>
                <Car size={24} />
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {ride.vehicleType || 'Available Ride'}
                    </span>
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: '#06b6d4' }}>{price}</span>
                </div>

                <h3 style={{ fontSize: '0.95rem', marginBottom: 7, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {route}
                </h3>

                <div style={{ display: 'flex', gap: 14, color: '#64748b', fontSize: '0.78rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={12} />
                        {ride.date ? new Date(ride.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <User size={12} /> {driverName}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Car size={12} /> {ride.availableSeats || '—'} seats
                    </span>
                </div>
            </div>

            {/* Book button */}
            {booked ? (
                <span className="status-badge status-active" style={{ flexShrink: 0 }}>✓ Booked</span>
            ) : (
                <button
                    className="btn btn-primary"
                    style={{ padding: '9px 18px', fontSize: '0.82rem', flexShrink: 0, borderRadius: 10 }}
                    onClick={handleBook}
                    disabled={booking || !isAvailable}
                    id={`book-ride-${ride._id}`}
                >
                    {booking ? '...' : isAvailable ? 'Book' : 'Full'}
                </button>
            )}
        </div>
    );
}

export default function RidesView() {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);

    const load = (params = {}) => {
        setLoading(true); setError('');
        getRides(params)
            .then(d => { setRides(d.rides || []); setSearched(true); })
            .catch(() => setError('Failed to load rides.'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        load({ fromLocation: from, toLocation: to });
    };

    const handleBook = async (rideId) => {
        await createBooking({ rideId, seatsBooked: 1 });
    };

    return (
        <div>
            {/* ── Header ─────────────────────────────── */}
            <div className="section-header" style={{ marginBottom: 20 }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: 4 }}>Book a Ride</h1>
                    <p style={{ fontSize: '0.875rem' }}>Find available rides from verified drivers</p>
                </div>
            </div>

            {/* ── Search Form ─────────────────────────── */}
            <div className="booking-form" style={{ marginBottom: 28 }}>
                <form
                    onSubmit={handleSearch}
                    style={{ display: 'grid', gap: 14, gridTemplateColumns: '1fr 1fr auto', alignItems: 'end' }}
                    id="ride-search-form"
                >
                    <div className="form-group" style={{ margin: 0 }}>
                        <label>From</label>
                        <div className="form-control-icon">
                            <MapPin size={15} className="form-icon" style={{ color: '#06b6d4' }} />
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Pickup location"
                                value={from}
                                onChange={e => setFrom(e.target.value)}
                                id="ride-from"
                            />
                        </div>
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                        <label>To</label>
                        <div className="form-control-icon">
                            <MapPin size={15} className="form-icon" style={{ color: '#8b5cf6' }} />
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Destination"
                                value={to}
                                onChange={e => setTo(e.target.value)}
                                id="ride-to"
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary" id="search-rides-btn" style={{ borderRadius: 10, height: 44 }}>
                        <Search size={16} /> Search
                    </button>
                </form>
            </div>

            {error && <div className="error-banner">{error}</div>}

            {/* ── Rides List ──────────────────────────── */}
            <div className="section-header">
                <div>
                    <h2 style={{ marginBottom: 2 }}>Available Rides</h2>
                    {searched && !loading && (
                        <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            {rides.length} ride{rides.length !== 1 ? 's' : ''} found
                        </p>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="loader" />
            ) : rides.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {rides.map(r => <RideCard key={r._id} ride={r} onBook={handleBook} />)}
                </div>
            ) : (
                <div className="empty-state">
                    <div style={{
                        width: 60, height: 60, borderRadius: 16, margin: '0 auto 14px',
                        background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6',
                    }}>
                        <Car size={26} />
                    </div>
                    <p style={{ fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>
                        {searched ? 'No rides found for that route' : 'No rides available right now'}
                    </p>
                    <p style={{ fontSize: '0.85rem', color: '#475569' }}>Try different locations or check back later.</p>
                </div>
            )}
        </div>
    );
}
