import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, MessageCircle, MapPin, Calendar } from 'lucide-react';
import './ProfileView.css';

const ProfileView = ({ user, onMessage, isOwnProfile, trips = [] }) => {
    const navigate = useNavigate();

    const handleMessage = () => {
        onMessage();
        navigate('/chat/' + user.id);
    };

    // Filter trips created by this user
    const createdTrips = trips.filter(trip => trip.hostId === user.id);

    // For joined trips, we'd need to track this in the backend
    // For now, we'll just show created trips
    const joinedTrips = []; // This would come from the backend

    return (
        <div className="profile-view">
            <button onClick={() => navigate(-1)} className="btn btn-ghost" style={{ marginBottom: '1rem', paddingLeft: 0 }}>
                <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} /> Back
            </button>

            <div className="profile-card">
                <div className="profile-avatar">
                    {user.name?.[0]?.toUpperCase()}
                </div>
                <h2 className="profile-name">{user.name}</h2>
                <p className="profile-role">Travel Enthusiast</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{user.email || ''}</p>

                {!isOwnProfile && (
                    <button onClick={handleMessage} className="btn btn-primary w-full" style={{ marginTop: '1.5rem' }}>
                        <MessageCircle size={18} /> Message
                    </button>
                )}
            </div>

            {isOwnProfile && (
                <div style={{ marginTop: '2rem' }}>
                    {/* Created Trips Section */}
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <MapPin size={20} style={{ color: 'var(--primary)' }} />
                            Trips Created ({createdTrips.length})
                        </h3>
                        {createdTrips.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
                                You haven't created any trips yet.
                            </p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {createdTrips.map(trip => (
                                    <div
                                        key={trip.id}
                                        style={{
                                            padding: '1rem',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '0.5rem',
                                            cursor: 'pointer',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                        onClick={() => navigate('/browse')}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                            <div style={{ fontWeight: '600', fontSize: '1rem' }}>
                                                {trip.origin} → {trip.destination}
                                            </div>
                                            <div style={{
                                                background: '#f1f5f9',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '0.25rem',
                                                fontSize: '0.75rem',
                                                fontWeight: '500'
                                            }}>
                                                {trip.mode}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                            <Calendar size={14} />
                                            {new Date(trip.date).toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Joined Trips Section */}
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <MessageCircle size={20} style={{ color: 'var(--secondary)' }} />
                            Trips Joined ({joinedTrips.length})
                        </h3>
                        {joinedTrips.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
                                You haven't joined any trips yet.
                            </p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {joinedTrips.map(trip => (
                                    <div
                                        key={trip.id}
                                        style={{
                                            padding: '1rem',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '0.5rem',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => navigate('/browse')}
                                    >
                                        <div style={{ fontWeight: '600' }}>
                                            {trip.origin} → {trip.destination}
                                        </div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                            Hosted by {trip.hostName}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileView;
