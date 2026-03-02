import React, { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Calendar, Star, Compass } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPublicProfile } from '../services/auth.service.js';
import { getTripsByUser } from '../services/trip.service.js';

const defaultImg = 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80';

function MiniTripCard({ trip }) {
    const navigate = useNavigate();
    return (
        <div
            className="card"
            style={{ cursor: 'pointer', gap: '10px', transition: 'transform 0.15s', padding: '16px' }}
            onClick={() => navigate(`/trips/${trip._id}`)}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
            <img
                src={trip.image || defaultImg}
                alt={trip.fromLocation}
                style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '4px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>
                    {trip.fromLocation} → {trip.toLocation}
                </h4>
            </div>
            <div style={{ display: 'flex', gap: '12px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} /> {new Date(trip.date).toLocaleDateString()}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={13} /> {trip.transportMode}
                </span>
            </div>
        </div>
    );
}

export default function PublicProfileView() {
    const { username } = useParams();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        getPublicProfile(username)
            .then(async (user) => {
                setProfile(user);
                try {
                    const t = await getTripsByUser(user._id);
                    setTrips(t || []);
                } catch (_) { setTrips([]); }
            })
            .catch(() => setError('User not found.'))
            .finally(() => setLoading(false));
    }, [username]);

    if (loading) {
        return (
            <div style={{ display: 'flex', height: '60vh', alignItems: 'center', justifyContent: 'center' }}>
                <div className="loader" />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div style={{ textAlign: 'center', paddingTop: '80px', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '1.1rem', marginBottom: '16px' }}>😕 {error || 'User not found.'}</p>
                <button className="btn btn-outline" onClick={() => navigate(-1)}>
                    <ArrowLeft size={16} /> Go Back
                </button>
            </div>
        );
    }

    const avatarUrl = profile.profileImage?.url;
    const initial = profile.name?.charAt(0)?.toUpperCase() || '?';

    return (
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
            {/* Back */}
            <button className="btn btn-outline" style={{ marginBottom: '24px' }} onClick={() => navigate(-1)}>
                <ArrowLeft size={16} /> Back
            </button>

            {/* Profile hero */}
            <div style={{
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                borderRadius: 'var(--radius-lg)',
                padding: '40px 36px',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '28px',
                marginBottom: '28px',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', top: '-30px', right: '-30px',
                    width: '180px', height: '180px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.07)'
                }} />

                {/* Avatar */}
                <div style={{
                    width: '96px', height: '96px', borderRadius: '50%',
                    background: 'white', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    color: 'var(--primary)', fontSize: '2.2rem', fontWeight: 800,
                    overflow: 'hidden', border: '4px solid rgba(255,255,255,0.4)',
                    flexShrink: 0, position: 'relative', zIndex: 1,
                }}>
                    {avatarUrl
                        ? <img src={avatarUrl} alt={profile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : initial
                    }
                </div>

                {/* Info */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h1 style={{ margin: '0 0 4px', fontSize: '1.6rem', fontWeight: 800 }}>{profile.name}</h1>
                    <p style={{ margin: '0 0 10px', opacity: 0.85, fontSize: '1rem', fontWeight: 500 }}>
                        @{profile.username}
                    </p>
                    {profile.bio && (
                        <p style={{ margin: 0, opacity: 0.85, fontSize: '0.9rem', maxWidth: '480px', lineHeight: 1.5 }}>
                            {profile.bio}
                        </p>
                    )}
                    {profile.rating?.average > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', opacity: 0.9 }}>
                            <Star size={16} fill="currentColor" color="#fbbf24" />
                            <span style={{ fontWeight: 700 }}>{profile.rating.average.toFixed(1)}</span>
                            <span style={{ fontSize: '0.82rem', opacity: 0.75 }}>({profile.rating.count} ratings)</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Trips */}
            <div>
                <div className="section-header" style={{ marginBottom: '16px' }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Compass size={20} color="var(--primary)" /> Recent Trips
                    </h2>
                </div>

                {trips.length === 0 ? (
                    <div className="card" style={{
                        alignItems: 'center', justifyContent: 'center',
                        padding: '40px', gap: '12px', color: 'var(--text-muted)'
                    }}>
                        <Compass size={40} strokeWidth={1.2} />
                        <p style={{ margin: 0 }}>No trips created yet.</p>
                    </div>
                ) : (
                    <div className="grid-3">
                        {trips.map(t => <MiniTripCard key={t._id} trip={t} />)}
                    </div>
                )}
            </div>
        </div>
    );
}
