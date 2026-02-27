import React, { useEffect, useState } from 'react';
import { MapPin, Calendar, User, Plus, MoreVertical } from 'lucide-react';
import { getTrips, createTrip, joinTrip } from '../services/trip.service.js';
import { useAuth } from '../context/AuthContext.jsx';

function TripCard({ trip, onJoin, currentUserId }) {
    const [joining, setJoining] = useState(false);
    const isCreator = trip.creator?._id === currentUserId || trip.creator === currentUserId;
    const isParticipant = trip.participants?.some(p => (p._id || p) === currentUserId);

    const handleJoin = async () => {
        setJoining(true);
        try { await onJoin(trip._id); } catch (_) { }
        finally { setJoining(false); }
    };

    const defaultImg = 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80';
    return (
        <div className="card">
            <img src={trip.image || defaultImg} alt={trip.fromLocation} className="card-img" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span className="status-badge status-upcoming">{trip.status}</span>
                <button className="icon-btn" style={{ padding: 0 }}><MoreVertical size={18} /></button>
            </div>
            <h3 style={{ marginTop: '8px' }}>{trip.fromLocation} → {trip.toLocation}</h3>
            <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>{trip.description}</p>
            <div className="meta-info">
                <div className="meta-item"><MapPin size={16} /> {trip.transportMode}</div>
            </div>
            <div className="meta-info" style={{ borderTop: 'none', paddingTop: '8px', marginTop: '0' }}>
                <div className="meta-item"><Calendar size={16} /> {new Date(trip.date).toLocaleDateString()}</div>
                <div className="meta-item" style={{ marginLeft: 'auto' }}><User size={16} /> {trip.seatsAvailable} seats</div>
            </div>
            {!isCreator && !isParticipant && trip.status === 'open' && (
                <button className="btn btn-primary" style={{ marginTop: '16px', width: '100%', justifyContent: 'center' }}
                    onClick={handleJoin} disabled={joining}>
                    {joining ? 'Joining...' : 'Join Trip'}
                </button>
            )}
            {isCreator && <span className="status-badge status-active" style={{ marginTop: '16px', textAlign: 'center' }}>Your Trip</span>}
            {isParticipant && !isCreator && <span className="status-badge status-active" style={{ marginTop: '16px', textAlign: 'center' }}>Joined</span>}
        </div>
    );
}

function CreateTripModal({ onClose, onCreated }) {
    const [form, setForm] = useState({ fromLocation: '', toLocation: '', date: '', transportMode: 'Train', seatsAvailable: 1, description: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true); setError('');
        try { const trip = await createTrip(form); onCreated(trip); onClose(); }
        catch (err) { setError(err.response?.data?.message || 'Failed to create trip.'); }
        finally { setLoading(false); }
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
                            {['Train', 'Bus', 'Flight', 'Car', 'Bike', 'Other'].map(m => <option key={m}>{m}</option>)}
                        </select>
                    </div>
                    <div className="form-group"><label>Seats Available</label><input type="number" className="form-control" min="1" max="20" value={form.seatsAvailable} onChange={set('seatsAvailable')} /></div>
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

    const load = () => {
        setLoading(true);
        getTrips().then(d => setTrips(d.trips || [])).catch(() => setTrips([])).finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const handleJoin = async (id) => {
        await joinTrip(id);
        load();
    };

    return (
        <div>
            {showCreate && <CreateTripModal onClose={() => setShowCreate(false)} onCreated={(t) => { setTrips(p => [t, ...p]); }} />}
            <div className="section-header">
                <div><h1>Trips</h1><p>Find companions for your next journey.</p></div>
                <button className="btn btn-primary" onClick={() => setShowCreate(true)}><Plus size={18} /> New Trip</button>
            </div>
            {loading ? <div className="loader" /> : (
                <div className="grid-3">
                    {trips.map(t => <TripCard key={t._id} trip={t} onJoin={handleJoin} currentUserId={user._id} />)}
                    <div className="card" style={{ borderStyle: 'dashed', background: 'transparent', justifyContent: 'center', alignItems: 'center', minHeight: '340px', cursor: 'pointer' }} onClick={() => setShowCreate(true)}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: 'var(--primary)' }}><Plus size={24} /></div>
                        <h3 style={{ margin: 0 }}>Plan a new journey</h3>
                        <p style={{ textAlign: 'center', marginTop: '8px' }}>Start inviting companions.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
