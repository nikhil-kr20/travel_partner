import React, { useEffect, useState } from 'react';
import { Car, Clock, User, Star, ChevronRight } from 'lucide-react';
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

    return (
        <div className="card" style={{ flexDirection: 'row', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                <Car size={32} />
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span className="text-sm" style={{ color: 'var(--accent)', fontWeight: 600 }}>{ride.vehicleType || 'Ride'}</span>
                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text-main)' }}>₹{ride.pricePerKm}/km</span>
                </div>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>{ride.fromLocation} → {ride.toLocation}</h3>
                <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '0.875rem', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {new Date(ride.date).toLocaleDateString()}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><User size={14} /> {ride.riderId?.name || 'Driver'}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Car size={14} /> {ride.availableSeats} seats</span>
                </div>
            </div>
            {booked ? (
                <span className="status-badge status-active">Booked!</span>
            ) : (
                <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem', flexShrink: 0 }}
                    onClick={handleBook} disabled={booking || ride.status !== 'available'}>
                    {booking ? '...' : ride.status === 'available' ? 'Book' : 'Full'}
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
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState('');

    const load = (params = {}) => {
        setLoading(true); setError('');
        getRides(params).then(d => { setRides(d.rides || []); setSearched(true); }).catch(() => setError('Failed to load rides.')).finally(() => setLoading(false));
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
            <div className="section-header">
                <div><h1>Book a Ride</h1><p>Find available rides from drivers in your area.</p></div>
            </div>
            <div className="booking-form">
                <form onSubmit={handleSearch} style={{ display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr auto', alignItems: 'end' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>From</label>
                        <input type="text" className="form-control" placeholder="Pickup location..." value={from} onChange={e => setFrom(e.target.value)} />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>To</label>
                        <input type="text" className="form-control" placeholder="Destination..." value={to} onChange={e => setTo(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ height: '45px' }}>Search</button>
                </form>
            </div>
            {error && <div className="error-banner">{error}</div>}
            <div className="section-header"><h2>Available Rides</h2></div>
            {loading ? <div className="loader" /> : (
                rides.length > 0
                    ? <div className="grid-2">{rides.map(r => <RideCard key={r._id} ride={r} onBook={handleBook} />)}</div>
                    : <div className="empty-state"><p>{searched ? 'No rides found for that route.' : 'No rides available right now.'}</p></div>
            )}
        </div>
    );
}
