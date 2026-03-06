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
        } catch (e) { // eslint-disable-line no-unused-vars
            // handle error
        } finally {
            setBooking(false);
        }
    };

    return (
        <div className="card" style={{ flexDirection: 'row', alignItems: 'center', gap: '24px', background: 'rgba(30, 41, 59, 0.4)' }}>
            <div style={{ width: '90px', height: '90px', borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0, border: '1px solid var(--border)' }}>
                <Car size={36} />
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span className="text-sm" style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{ride.vehicleType || 'Standard'}</span>
                    <span style={{ fontWeight: '800', fontSize: '1.25rem', color: 'var(--text-main)' }}>₹{ride.pricePerKm}/km</span>
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>{ride.fromLocation} → {ride.toLocation}</h3>
                <div style={{ display: 'flex', gap: '20px', color: 'var(--text-muted)', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16} /> {new Date(ride.date).toLocaleDateString()}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><User size={16} /> {ride.riderId?.name || 'Driver'}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Car size={16} /> {ride.availableSeats} seats left</span>
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

    useEffect(() => {
        load();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        load({ fromLocation: from, toLocation: to });
    };

    const handleBook = async (rideId) => {
        await createBooking({ rideId, seatsBooked: 1 });
    };

    return (
        <div>
            <div style={{ marginBottom: '40px' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', marginBottom: '8px', display: 'block' }}>
                    Transportation
                </span>
                <h1 style={{ margin: 0 }}>Book a Ride</h1>
                <p style={{ marginTop: '8px' }}>Swift, reliable, and shared commutes at your fingertips.</p>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '40px', backdropFilter: 'blur(10px)' }}>
                <form onSubmit={handleSearch} style={{ display: 'grid', gap: '20px', gridTemplateColumns: '1fr 1fr auto', alignItems: 'end' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>Pickup Point</label>
                        <input type="text" className="form-control" placeholder="Where are we starting?" value={from} onChange={e => setFrom(e.target.value)} />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>Destination</label>
                        <input type="text" className="form-control" placeholder="Where to?" value={to} onChange={e => setTo(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ height: '52px', padding: '0 32px' }}>Search Rides</button>
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
