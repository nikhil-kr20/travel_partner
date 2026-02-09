import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, Train, Car, Plane, Navigation, Calendar, MessageCircle } from 'lucide-react';
import './TripCard.css';

const TripCard = ({ trip, onConnect, onViewProfile, isOwner }) => {
    const navigate = useNavigate();
    const ModeIcon = {
        'Bus': Bus, 'Train': Train, 'Car/Cab': Car, 'Flight': Plane, 'Bike': Navigation
    }[trip.mode] || Bus;

    const date = new Date(trip.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });

    const handleViewProfile = () => {
        onViewProfile(trip.hostId, trip.hostName);
        navigate(`/profile/${trip.hostId}`);
    };

    return (
        <div className="trip-card">
            <div className="trip-card-content">
                <div className="trip-header">
                    <div
                        className="host-info"
                        onClick={handleViewProfile}
                    >
                        <div className="avatar" style={{ background: trip.avatarColor || '#e2e8f0' }}>
                            {trip.hostName?.[0]}
                        </div>
                        <div>
                            <div className="host-name">{trip.hostName}</div>
                            <div className="host-label">Host</div>
                        </div>
                    </div>
                    <div className="mode-badge">
                        <ModeIcon size={12} /> {trip.mode}
                    </div>
                </div>

                <div className="route-info">
                    <div style={{ position: 'absolute', left: 0, top: '0.5rem', bottom: '0.5rem', width: '2px', background: '#e2e8f0', borderLeft: '2px dashed #cbd5e1' }}></div>
                    <div style={{ marginBottom: '1rem', position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '-1.35rem', width: '0.75rem', height: '0.75rem', borderRadius: '50%', background: '#fff', border: '2px solid var(--primary)' }}></div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>From</div>
                        <div style={{ fontWeight: '600' }}>{trip.origin}</div>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '-1.35rem', width: '0.75rem', height: '0.75rem', borderRadius: '50%', background: '#fff', border: '2px solid var(--secondary)' }}></div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>To</div>
                        <div style={{ fontWeight: '600' }}>{trip.destination}</div>
                    </div>
                </div>

                <div className="date-badge">
                    <Calendar size={16} /> {date}
                </div>
            </div>

            <div className="card-actions">
                <button
                    onClick={() => onConnect(trip)}
                    className={`btn w-full ${isOwner ? 'btn-secondary' : 'btn-primary'}`}
                >
                    <MessageCircle size={16} /> {isOwner ? 'Group Chat' : 'Join Group Chat'}
                </button>
            </div>
        </div>
    );
};

export default TripCard;
