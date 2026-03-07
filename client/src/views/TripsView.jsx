import React, { useEffect, useState } from 'react';
import { MapPin, Calendar, Plus, Eye, Search, X, Train, Bus, Plane, Car, Bike } from 'lucide-react';
import { getTrips, createTrip } from '../services/trip.service.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const DEST_IMAGES = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=600&q=80',
];

const MODE_ICONS = {
    train: <Train size={13} />,
    bus: <Bus size={13} />,
    flight: <Plane size={13} />,
    car: <Car size={13} />,
    bike: <Bike size={13} />,
};

function TripCard({ trip, currentUserId, idx }) {
    const navigate = useNavigate();
    const isCreator = trip.creator?._id === currentUserId || trip.creator === currentUserId;
    const img = trip.image || DEST_IMAGES[idx % DEST_IMAGES.length];
    const statusClass = trip.status === 'open' ? 'status-open'
        : trip.status === 'active' ? 'status-active'
            : trip.status === 'completed' ? 'status-completed'
                : 'status-upcoming';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {/* Image card */}
            <div
                className="trip-card-img"
                onClick={() => navigate(`/trips/${trip._id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/trips/${trip._id}`)}
                aria-label={`View trip from ${trip.fromLocation}`}
            >
                <img src={img} alt={`${trip.fromLocation} destination`} />
                <div className="trip-card-img-overlay" />

                {/* Badges */}
                <div className="trip-card-status">
                    <span className={`status-badge ${statusClass}`}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                        {trip.status || 'open'}
                    </span>
                </div>

                <div className="trip-card-date">
                    <span style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 20, padding: '4px 10px', fontSize: '0.7rem', fontWeight: 700, color: 'white',
                    }}>
                        <Calendar size={11} />
                        {trip.date ? new Date(trip.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                    </span>
                </div>

                <div className="trip-card-content">
                    <h3 style={{ fontSize: '1rem', color: 'white', fontWeight: 700, marginBottom: 6, lineHeight: 1.3 }}>
                        {trip.title || `${trip.fromLocation} → ${trip.toLocation}`}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem' }}>
                            <MapPin size={12} /> {trip.fromLocation} → {trip.toLocation}
                        </span>
                        {trip.transportMode && (
                            <span style={{
                                display: 'flex', alignItems: 'center', gap: 4,
                                background: 'rgba(6,182,212,0.2)', color: '#67e8f9',
                                borderRadius: 9999, padding: '2px 8px', fontSize: '0.68rem', fontWeight: 600,
                            }}>
                                {MODE_ICONS[trip.transportMode?.toLowerCase()] || <Train size={12} />}
                                {trip.transportMode}
                            </span>
                        )}
                        {isCreator && (
                            <span style={{
                                background: 'rgba(139,92,246,0.3)', color: '#c4b5fd',
                                borderRadius: 9999, padding: '2px 8px', fontSize: '0.68rem', fontWeight: 600,
                            }}>Your Trip</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Description below */}
            {trip.description && (
                <p style={{
                    fontSize: '0.8rem', color: '#64748b', marginTop: 8,
                    overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box',
                    WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                }}>
                    {trip.description}
                </p>
            )}
        </div>
    );
}

function CreateTripModal({ onClose, onCreated }) {
    const [form, setForm] = useState({
        fromLocation: '', toLocation: '', date: '',
        transportMode: 'train', description: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const trip = await createTrip(form);
            onCreated(trip);
            onClose();
        } catch (err) {
            const detail = err.response?.data?.errors?.join(' | ');
            setError(detail || err.response?.data?.message || 'Failed to create trip.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div style={{
                background: '#141B2D',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 24,
                padding: 32,
                width: '100%',
                maxWidth: 500,
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Create New Trip</h2>
                    <button onClick={onClose} aria-label="Close modal" style={{
                        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                        color: '#94a3b8', width: 34, height: 34, borderRadius: 8, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <X size={16} />
                    </button>
                </div>

                {error && <div className="error-banner">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                        <div className="form-group" style={{ margin: 0 }}>
                            <label>From</label>
                            <div className="form-control-icon">
                                <MapPin size={15} className="form-icon" style={{ color: '#06b6d4' }} />
                                <input className="form-control" required placeholder="Mumbai" value={form.fromLocation} onChange={set('fromLocation')} />
                            </div>
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                            <label>To</label>
                            <div className="form-control-icon">
                                <MapPin size={15} className="form-icon" style={{ color: '#8b5cf6' }} />
                                <input className="form-control" required placeholder="Manali" value={form.toLocation} onChange={set('toLocation')} />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                        <div className="form-group" style={{ margin: 0 }}>
                            <label>Date</label>
                            <input type="date" className="form-control" required value={form.date} onChange={set('date')}
                                style={{ colorScheme: 'dark' }} />
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                            <label>Transport</label>
                            <select className="form-control" value={form.transportMode} onChange={set('transportMode')}
                                style={{ colorScheme: 'dark' }}>
                                {['Train', 'Bus', 'Flight', 'Car', 'Bike', 'Other'].map(m => (
                                    <option key={m} value={m.toLowerCase()}>{m}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            className="form-control"
                            rows={3}
                            placeholder="Tell companions about this trip..."
                            value={form.description}
                            onChange={set('description')}
                            style={{ resize: 'vertical' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                        <button type="button" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }} disabled={loading}>
                            {loading ? 'Creating...' : <><Plus size={16} /> Create Trip</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function TripsView() {
    const { user } = useAuth();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [searched, setSearched] = useState(false);
    const [searchError, setSearchError] = useState('');

    const load = (params = {}) => {
        setLoading(true);
        getTrips(params)
            .then(d => setTrips(d.trips || []))
            .catch(() => setTrips([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!from.trim() && !to.trim()) {
            setSearchError('Enter at least one location to search.');
            return;
        }
        setSearchError('');
        const params = {};
        if (from.trim()) params.fromLocation = from.trim();
        if (to.trim()) params.toLocation = to.trim();
        setSearched(true);
        load(params);
    };

    const handleClear = () => {
        setFrom(''); setTo('');
        setSearched(false); setSearchError('');
        load();
    };

    return (
        <div>
            {showCreate && (
                <CreateTripModal
                    onClose={() => setShowCreate(false)}
                    onCreated={(t) => setTrips(p => [t, ...p])}
                />
            )}

            {/* ── Header ─────────────────────────────── */}
            <div className="section-header" style={{ marginBottom: 20 }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: 4 }}>Explore Trips</h1>
                    <p style={{ fontSize: '0.875rem' }}>Find companions for your next journey</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowCreate(true)}
                    id="create-trip-btn"
                    style={{ borderRadius: 12 }}
                >
                    <Plus size={17} /> New Trip
                </button>
            </div>

            {/* ── Search ─────────────────────────────── */}
            <form
                onSubmit={handleSearch}
                style={{
                    display: 'flex',
                    gap: 10,
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    background: '#141B2D',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 16,
                    padding: '14px 18px',
                    marginBottom: 24,
                }}
            >
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 140,
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 9999, padding: '9px 14px',
                }}>
                    <MapPin size={15} color="#06b6d4" />
                    <input
                        placeholder="From (e.g. Mumbai)"
                        value={from}
                        onChange={e => setFrom(e.target.value)}
                        style={{
                            border: 'none', background: 'transparent', outline: 'none',
                            width: '100%', fontSize: '0.875rem', color: '#f1f5f9', fontFamily: 'inherit',
                        }}
                    />
                </div>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 140,
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 9999, padding: '9px 14px',
                }}>
                    <MapPin size={15} color="#8b5cf6" />
                    <input
                        placeholder="To (e.g. Manali)"
                        value={to}
                        onChange={e => setTo(e.target.value)}
                        style={{
                            border: 'none', background: 'transparent', outline: 'none',
                            width: '100%', fontSize: '0.875rem', color: '#f1f5f9', fontFamily: 'inherit',
                        }}
                    />
                </div>
                <button type="submit" className="btn btn-primary" id="search-trips-btn" style={{ borderRadius: 9999 }}>
                    <Search size={15} /> Search
                </button>
                {searched && (
                    <button type="button" className="btn btn-secondary" onClick={handleClear} style={{ borderRadius: 9999 }}>
                        <X size={15} /> Clear
                    </button>
                )}
            </form>

            {searchError && <div className="error-banner" style={{ marginBottom: 16 }}>{searchError}</div>}
            {searched && !loading && (
                <p style={{ marginBottom: 16, color: '#64748b', fontSize: '0.875rem' }}>
                    {trips.length} result{trips.length !== 1 ? 's' : ''} found
                    {from && ` from "${from}"`}{to && ` to "${to}"`}
                </p>
            )}

            {/* ── Trips Grid ─────────────────────────── */}
            {loading ? (
                <div className="loader" />
            ) : (
                <div className="grid-3">
                    {trips.map((t, i) => (
                        <TripCard key={t._id} trip={t} currentUserId={user._id} idx={i} />
                    ))}

                    {/* Create new card */}
                    <div
                        role="button"
                        tabIndex={0}
                        onClick={() => setShowCreate(true)}
                        onKeyDown={(e) => e.key === 'Enter' && setShowCreate(true)}
                        aria-label="Create new trip"
                        style={{
                            height: 220,
                            border: '2px dashed rgba(6,182,212,0.25)',
                            borderRadius: 20,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 12,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            background: 'transparent',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.borderColor = 'rgba(6,182,212,0.5)';
                            e.currentTarget.style.background = 'rgba(6,182,212,0.04)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = 'rgba(6,182,212,0.25)';
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <div style={{
                            width: 52, height: 52, borderRadius: '50%',
                            background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06b6d4',
                        }}>
                            <Plus size={22} />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontWeight: 600, color: '#94a3b8', marginBottom: 2, fontSize: '0.9rem' }}>Plan a new journey</p>
                            <p style={{ fontSize: '0.78rem', color: '#475569' }}>Start inviting companions</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
