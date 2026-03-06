import React, { useEffect, useState, useRef } from 'react';
import { Car, Clock, User, Plus, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { gsap } from 'gsap';
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
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="glass-card"
                style={{ maxWidth: '540px', width: '90%', maxHeight: '90vh', overflowY: 'auto', padding: '40px', border: '1px solid rgba(255,255,255,0.1)' }}
            >
                <h2 style={{ marginBottom: '8px', fontSize: '1.8rem', fontWeight: 800 }}>Create New Ride</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Offer your ride to other travelers.</p>

                {error && <div className="error-banner" style={{ marginBottom: '24px' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="grid-2">
                        <div className="form-group"><label>From</label><input className="form-control" required value={form.fromLocation} onChange={set('fromLocation')} placeholder="Origin City" /></div>
                        <div className="form-group"><label>To</label><input className="form-control" required value={form.toLocation} onChange={set('toLocation')} placeholder="Destination" /></div>
                    </div>
                    <div className="grid-2">
                        <div className="form-group"><label>Date</label><input type="date" className="form-control" required value={form.date} onChange={set('date')} /></div>
                        <div className="form-group">
                            <label>Vehicle Type</label>
                            <select className="form-control" value={form.vehicleType} onChange={set('vehicleType')}>
                                {['Car', 'Bike', 'Auto', 'Van', 'Bus'].map(v => <option key={v} value={v.toLowerCase()}>{v}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="form-group"><label>Vehicle Number</label><input className="form-control" required value={form.vehicleNumber} onChange={set('vehicleNumber')} placeholder="MH01AB1234" /></div>
                    <div className="grid-3">
                        <div className="form-group"><label>Seats</label><input type="number" className="form-control" min="1" max="20" value={form.availableSeats} onChange={set('availableSeats')} /></div>
                        <div className="form-group"><label>₹/km</label><input type="number" className="form-control" min="1" value={form.pricePerKm} onChange={set('pricePerKm')} /></div>
                        <div className="form-group"><label>Dist (km)</label><input type="number" className="form-control" min="1" value={form.estimatedDistance} onChange={set('estimatedDistance')} /></div>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                        <button type="button" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center', height: '48px' }} onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', height: '48px' }} disabled={loading}>{loading ? 'Posting...' : 'Post Ride'}</button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}

function BookingRow({ booking, onAccept, onComplete }) {
    const isCompleted = booking.status === 'completed';
    const isCancelled = booking.status === 'cancelled';

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.05)' }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 700 }}>
                    {booking.userId?.name?.charAt(0).toUpperCase() || 'P'}
                </div>
                <div>
                    <p style={{ fontWeight: 700, marginBottom: '4px', color: 'white', fontSize: '1rem' }}>{booking.userId?.name || 'Passenger'}</p>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', opacity: 0.7 }}>
                        <span>{booking.seatsBooked} seat(s)</span>
                        <span>•</span>
                        <span style={{ color: 'var(--primary)', fontWeight: 700 }}>₹{booking.totalAmount}</span>
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
                {booking.status === 'pending' && (
                    <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.75rem', height: '36px' }} onClick={() => onAccept(booking._id)}>
                        <CheckCircle2 size={14} /> Accept
                    </button>
                )}
                {booking.status === 'accepted' && (
                    <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.75rem', height: '36px' }} onClick={() => onComplete(booking._id)}>
                        <CheckCircle2 size={14} /> Complete
                    </button>
                )}
                {(isCompleted || isCancelled) && (
                    <span style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        background: isCompleted ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: isCompleted ? '#34d399' : '#f87171',
                        border: `1px solid ${isCompleted ? '#34d39933' : '#f8717133'}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}>
                        {isCompleted ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                        {booking.status}
                    </span>
                )}
            </div>
        </motion.div>
    );
}

export default function DriverRidesView() {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [expandedRide, setExpandedRide] = useState(null);
    const [bookings, setBookings] = useState([]);
    const containerRef = useRef(null);

    const load = () => {
        setLoading(true);
        getMyRides().then(r => setRides(r || [])).catch(() => setRides([])).finally(() => setLoading(false));
    };

    useEffect(() => {
        load();
    }, []);

    useEffect(() => {
        if (!loading && rides.length > 0) {
            const ctx = gsap.context(() => {
                gsap.from('.stagger-ride', {
                    y: 30,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power3.out',
                    clearProps: 'all'
                });
            }, containerRef);
            return () => ctx.revert();
        }
    }, [loading, rides]);

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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            ref={containerRef}
        >
            <AnimatePresence>
                {showCreate && <CreateRideModal onClose={() => setShowCreate(false)} onCreated={(r) => setRides(p => [r, ...p])} />}
            </AnimatePresence>

            <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <span style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', marginBottom: '8px', display: 'block' }}>
                        Driver Dashboard
                    </span>
                    <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800 }}>My Rides</h1>
                    <p style={{ marginTop: '8px', opacity: 0.8 }}>Manage your active listings and accept passenger requests.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
                    <Plus size={20} /> Create Listing
                </button>
            </div>

            {loading ? (
                <div style={{ display: 'flex', height: '40vh', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="loader" />
                </div>
            ) : rides.length === 0 ? (
                <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
                    <Car size={48} style={{ margin: '0 auto 20px', opacity: 0.2 }} />
                    <h3 style={{ marginBottom: '8px' }}>No rides posted</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Start earning by sharing your journey with others.</p>
                    <button className="btn btn-outline" style={{ margin: '0 auto' }} onClick={() => setShowCreate(true)}>Post Your First Ride</button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {rides.map(ride => (
                        <div key={ride._id} className="glass-card stagger-ride" style={{ padding: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                                        <div style={{ padding: '10px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', color: 'var(--primary)' }}>
                                            <Car size={24} />
                                        </div>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>
                                                {ride.fromLocation}
                                                <ChevronRight size={18} style={{ margin: '0 8px', opacity: 0.5 }} />
                                                {ride.toLocation}
                                            </h3>
                                            <div style={{ display: 'flex', gap: '20px', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16} className="text-primary" /> {new Date(ride.date).toLocaleDateString()}</span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><User size={16} className="text-primary" /> {ride.availableSeats} slots left</span>
                                                <span style={{ fontWeight: 700, color: 'white' }}>₹{ride.pricePerKm}/km</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                    <span style={{
                                        padding: '6px 14px',
                                        borderRadius: '20px',
                                        fontSize: '0.75rem',
                                        fontWeight: 800,
                                        textTransform: 'uppercase',
                                        background: ride.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                                        color: ride.status === 'completed' ? '#34d399' : 'var(--primary)',
                                        border: `1px solid ${ride.status === 'completed' ? '#34d39933' : 'rgba(99, 102, 241, 0.3)'}`
                                    }}>{ride.status}</span>
                                    <button
                                        className={`btn ${expandedRide === ride._id ? 'btn-primary' : 'btn-outline'}`}
                                        style={{ height: '40px', padding: '0 20px', borderRadius: '10px' }}
                                        onClick={() => handleExpand(ride._id)}
                                    >
                                        {expandedRide === ride._id ? 'Hide Details' : 'Manage Bookings'}
                                    </button>
                                </div>
                            </div>

                            <AnimatePresence>
                                {expandedRide === ride._id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        <div style={{ marginTop: '32px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '32px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Passenger Requests</h4>
                                                <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{bookings.length} total bookings</span>
                                            </div>
                                            {bookings.length === 0 ? (
                                                <div style={{ padding: '40px', textAlign: 'center', background: 'rgba(255,255,255,0.01)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                                                    <p style={{ opacity: 0.5 }}>No one has booked this ride yet.</p>
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    {bookings.map(b => (
                                                        <BookingRow key={b._id} booking={b} onAccept={handleAccept} onComplete={handleComplete} />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
