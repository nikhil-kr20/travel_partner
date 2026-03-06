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
            style={{ cursor: 'pointer', gap: '12px', padding: '20px', background: 'rgba(255,255,255,0.03)' }}
            onClick={() => navigate(`/trips/${trip._id}`)}
        >
            <img
                src={trip.image || defaultImg}
                alt={trip.fromLocation}
                style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '8px' }}
            />
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>
                {trip.fromLocation} → {trip.toLocation}
            </h4>
            <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} /> {new Date(trip.date).toLocaleDateString()}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} /> {trip.transportMode}
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
        const loadProfile = async () => {
            setLoading(true);
            try {
                const user = await getPublicProfile(username);
                setProfile(user);
                try {
                    const t = await getTripsByUser(user._id);
                    setTrips(t || []);
                } catch (e) { // eslint-disable-line no-unused-vars
                    setTrips([]);
                }
            } catch (err) { // eslint-disable-line no-unused-vars
                setError('User not found.');
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
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
                background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.3), transparent), rgba(30, 41, 59, 0.4)',
                borderRadius: 'var(--radius-lg)',
                padding: '50px 40px',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '32px',
                marginBottom: '40px',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid var(--border)',
                backdropFilter: 'blur(20px)'
            }}>
                {/* Avatar */}
                <div style={{
                    width: '120px', height: '120px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: '3rem', fontWeight: 800,
                    overflow: 'hidden', border: '4px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 0 30px rgba(99, 102, 241, 0.4)',
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
