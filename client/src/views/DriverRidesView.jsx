import React, { useEffect, useState } from 'react';
import { Car, Clock, User, Plus } from 'lucide-react';
import { getMyRides, createRide } from '../services/ride.service.js';
import { getRideBookings, acceptBooking, completeBooking } from '../services/booking.service.js';

function CreateRideModal({ onClose, onCreated }) {
    const [form, setForm] = useState({ fromLocation: '', toLocation: '', date: '', vehicleType: 'car', vehicleNumber: '', availableSeats: 1, pricePerKm: 10, estimatedDistance: 10 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true); setError('');
        try {
            const payload = {
                ...form,
                availableSeats: Number(form.availableSeats),
                pricePerKm: Number(form.pricePerKm),
                estimatedDistance: Number(form.estimatedDistance),
            };
            const ride = await createRide(payload); onCreated(ride); onClose();
        }
        catch (err) {
            const detail = err.response?.data?.errors?.join(' | ');
            setError(detail || err.response?.data?.message || 'Failed to create ride.');
        }
        finally { setLoading(false); }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="auth-card" style={{ maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
                <h2 style={{ marginBottom: '24px' }}>Post a Ride</h2>
                {error && <div className="error-banner">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group"><label>From</label><input className="form-control" required value={form.fromLocation} onChange={set('fromLocation')} /></div>
                    <div className="form-group"><label>To</label><input className="form-control" required value={form.toLocation} onChange={set('toLocation')} /></div>
                    <div className="form-group"><label>Date</label><input type="date" className="form-control" required value={form.date} onChange={set('date')} /></div>
                    <div className="form-group">
                        <label>Vehicle Type</label>
                        <select className="form-control" value={form.vehicleType} onChange={set('vehicleType')}>
                            {['Car', 'Bike', 'Auto', 'Van', 'Bus'].map(v => <option key={v} value={v.toLowerCase()}>{v}</option>)}
                        </select>
                    </div>
                    <div className="form-group"><label>Vehicle Number</label><input className="form-control" required value={form.vehicleNumber} onChange={set('vehicleNumber')} placeholder="MH01AB1234" /></div>
                    <div className="grid-2">
                        <div className="form-group"><label>Seats</label><input type="number" className="form-control" min="1" max="20" value={form.availableSeats} onChange={set('availableSeats')} /></div>
                        <div className="form-group"><label>Price/km (₹)</label><input type="number" className="form-control" min="1" value={form.pricePerKm} onChange={set('pricePerKm')} /></div>
                    </div>
                    <div className="form-group"><label>Est. Distance (km)</label><input type="number" className="form-control" min="1" value={form.estimatedDistance} onChange={set('estimatedDistance')} /></div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button type="button" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} disabled={loading}>{loading ? 'Posting...' : 'Post Ride'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function BookingRow({ booking, onAccept, onComplete }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
            <div>
                <p style={{ fontWeight: 600, marginBottom: '2px', color: 'var(--text-main)' }}>{booking.userId?.name || 'Passenger'}</p>
                <p style={{ fontSize: '0.8rem' }}>{booking.seatsBooked} seat(s) · ₹{booking.totalAmount}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
                {booking.status === 'pending' && <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }} onClick={() => onAccept(booking._id)}>Accept</button>}
                {booking.status === 'accepted' && <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem' }} onClick={() => onComplete(booking._id)}>Complete</button>}
                {(booking.status === 'completed' || booking.status === 'cancelled') && <span className="status-badge status-active">{booking.status}</span>}
            </div>
        </div>
    );
}

export default function DriverRidesView() {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [expandedRide, setExpandedRide] = useState(null);
    const [bookings, setBookings] = useState([]);

    const load = () => {
        setLoading(true);
        getMyRides().then(r => setRides(r || [])).catch(() => setRides([])).finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const handleExpand = async (rideId) => {
        if (expandedRide === rideId) { setExpandedRide(null); return; }
        setExpandedRide(rideId);
        const data = await getRideBookings(rideId).catch(() => []);
        setBookings(data);
    };

    const handleAccept = async (id) => {
        await acceptBooking(id).catch(() => { });
        setBookings(b => b.map(bk => bk._id === id ? { ...bk, status: 'accepted' } : bk));
    };

    const handleComplete = async (id) => {
        await completeBooking(id).catch(() => { });
        setBookings(b => b.map(bk => bk._id === id ? { ...bk, status: 'completed' } : bk));
    };

    return (
        <div>
            {showCreate && <CreateRideModal onClose={() => setShowCreate(false)} onCreated={(r) => setRides(p => [r, ...p])} />}
            <div className="section-header">
                <div><h1>My Rides</h1><p>Manage your posted rides and passenger bookings.</p></div>
                <button className="btn btn-secondary" onClick={() => setShowCreate(true)}><Plus size={18} /> Post Ride</button>
            </div>
            {loading ? <div className="loader" /> : rides.length === 0 ? (
                <div className="empty-state"><p>No rides posted yet. Post your first ride!</p></div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {rides.map(ride => (
                        <div key={ride._id} className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ margin: 0 }}>{ride.fromLocation} → {ride.toLocation}</h3>
                                    <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {new Date(ride.date).toLocaleDateString()}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Car size={14} /> {ride.vehicleType}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><User size={14} /> {ride.availableSeats} seats</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <span className={`status-badge ${ride.status === 'completed' ? 'status-active' : 'status-upcoming'}`}>{ride.status}</span>
                                    <button className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.8rem' }} onClick={() => handleExpand(ride._id)}>
                                        {expandedRide === ride._id ? 'Hide' : 'Bookings'}
                                    </button>
                                </div>
                            </div>
                            {expandedRide === ride._id && (
                                <div style={{ marginTop: '16px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                                    <h4 style={{ marginBottom: '8px' }}>Passenger Bookings</h4>
                                    {bookings.length === 0 ? <p>No bookings yet.</p> : bookings.map(b => (
                                        <BookingRow key={b._id} booking={b} onAccept={handleAccept} onComplete={handleComplete} />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
