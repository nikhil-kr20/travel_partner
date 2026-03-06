import React, { useEffect, useState } from 'react';
import { MapPin, Calendar, Plus, MoreVertical, Eye, Search, X } from 'lucide-react';
import { getTrips, createTrip } from '../services/trip.service.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

function TripCard({ trip, currentUserId }) {
    const navigate = useNavigate();
    const isCreator = trip.creator?._id === currentUserId || trip.creator === currentUserId;
    const defaultImg = 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80';

    return (
        <div className="card">
            <img src={trip.image || defaultImg} alt={trip.fromLocation} className="card-img" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span className="status-badge status-upcoming">{trip.status}</span>
                <button className="icon-btn" style={{ padding: 0 }} aria-label="Trip options"><MoreVertical size={18} /></button>
            </div>
            <h3 style={{ marginTop: '8px' }}>{trip.fromLocation} → {trip.toLocation}</h3>
            <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>{trip.description}</p>
            <div className="meta-info">
                <div className="meta-item"><MapPin size={16} /> {trip.transportMode}</div>
            </div>
            <div className="meta-info" style={{ borderTop: 'none', paddingTop: '8px', marginTop: '0' }}>
                <div className="meta-item"><Calendar size={16} /> {new Date(trip.date).toLocaleDateString()}</div>
            </div>
            <button
                className="btn btn-outline"
                style={{ marginTop: '12px', width: '100%', justifyContent: 'center' }}
                onClick={() => navigate(`/trips/${trip._id}`)}
            >
                <Eye size={16} /> View Details
            </button>
            {isCreator && <span className="status-badge status-active" style={{ marginTop: '8px', textAlign: 'center' }}>Your Trip</span>}
        </div>
    );
}

function CreateTripModal({ onClose, onCreated }) {
    const [form, setForm] = useState({ fromLocation: '', toLocation: '', date: '', transportMode: 'train', description: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true); setError('');
        try {
            const trip = await createTrip(form); onCreated(trip); onClose();
        } catch (err) {
            const detail = err.response?.data?.errors?.join(' | ');
            setError(detail || err.response?.data?.message || 'Failed to create trip.');
        } finally { setLoading(false); }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="auth-card" style={{ maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
                <h2 style={{ marginBottom: '24px' }}>Create New Trip</h2>
                {error && <div className="error-banner">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group"><label>From</label><input className="form-control" required placeholder="Mumbai" value={form.fromLocation} onChange={set('fromLocation')} /></div>
                    <div className="form-group"><label>To</label><input className="form-control" required placeholder="Delhi" value={form.toLocation} onChange={set('toLocation')} /></div>
                    <div className="form-group"><label>Date</label><input type="date" className="form-control" required value={form.date} onChange={set('date')} /></div>
                    <div className="form-group">
                        <label>Transport Mode</label>
                        <select className="form-control" value={form.transportMode} onChange={set('transportMode')}>
                            {['Train', 'Bus', 'Flight', 'Car', 'Bike', 'Other'].map(m => <option key={m} value={m.toLowerCase()}>{m}</option>)}
                        </select>
                    </div>
                    <div className="form-group"><label>Description</label><textarea className="form-control" rows="3" placeholder="Tell others about your trip..." value={form.description} onChange={set('description')} /></div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button type="button" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={loading}>{loading ? 'Creating...' : 'Create Trip'}</button>
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
        getTrips(params).then(d => setTrips(d.trips || [])).catch(() => setTrips([])).finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!from.trim() && !to.trim()) {
            setSearchError('Please enter at least one location to search.');
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
        setFrom('');
        setTo('');
        setSearched(false);
        setSearchError('');
        load();
    };

    return (
        <div>
            {showCreate && <CreateTripModal onClose={() => setShowCreate(false)} onCreated={(t) => { setTrips(p => [t, ...p]); }} />}

            {/* Page Header */}
            <div className="section-header">
                <div><h1>Trips</h1><p>Find companions for your next journey.</p></div>
                <button className="btn btn-primary" onClick={() => setShowCreate(true)}><Plus size={18} /> New Trip</button>
            </div>

            {/* Search Bar */}
            <form
                onSubmit={handleSearch}
                style={{
                    display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
                    background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
                    padding: '16px 20px', marginBottom: '28px', boxShadow: 'var(--shadow-sm)'
                }}
            >
                {/* From input */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '160px', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', padding: '10px 16px' }}>
                    <MapPin size={16} color="var(--text-muted)" />
                    <input
                        type="text"
                        placeholder="From (e.g. Mumbai)"
                        value={from}
                        onChange={e => setFrom(e.target.value)}
                        style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.9rem', color: 'var(--text-main)' }}
                    />
                </div>
                {/* To input */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '160px', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', padding: '10px 16px' }}>
                    <MapPin size={16} color="var(--primary)" />
                    <input
                        type="text"
                        placeholder="To (e.g. Delhi)"
                        value={to}
                        onChange={e => setTo(e.target.value)}
                        style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.9rem', color: 'var(--text-main)' }}
                    />
                </div>
                <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px', whiteSpace: 'nowrap' }}>
                    <Search size={16} /> Find
                </button>
                {searched && (
                    <button type="button" className="btn btn-outline" style={{ padding: '10px 16px' }} onClick={handleClear}>
                        <X size={16} /> Clear
                    </button>
                )}
            </form>

            {searchError && <div className="error-banner" style={{ marginBottom: '16px' }}>{searchError}</div>}
            {searched && !loading && (
                <p style={{ marginBottom: '16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {trips.length} result{trips.length !== 1 ? 's' : ''} found
                    {from && ` from "${from}"`}{to && ` to "${to}"`}
                </p>
            )}

            {/* Trips Grid */}
            {loading ? <div className="loader" /> : (
                <div className="grid-3">
                    {trips.map(t => <TripCard key={t._id} trip={t} currentUserId={user._id} />)}
                    <div
                        className="card"
                        style={{ borderStyle: 'dashed', background: 'transparent', justifyContent: 'center', alignItems: 'center', minHeight: '340px', cursor: 'pointer' }}
                        onClick={() => setShowCreate(true)}
                    >
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: 'var(--primary)' }}>
                            <Plus size={24} />
                        </div>
                        <h3 style={{ margin: 0 }}>Plan a new journey</h3>
                        <p style={{ textAlign: 'center', marginTop: '8px' }}>Start inviting companions.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
