import React, { useEffect, useState } from 'react';
import {
    MapPin, Calendar, ArrowLeft, MessageCircle, Lock,
    Globe, Train, Car, Bus, Plane, Bike, Copy, CheckCheck,
    User, Loader2
} from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTripById } from '../services/trip.service.js';
import { joinTripGroupChat, createPersonalChat } from '../services/chat.service.js';
import { useAuth } from '../context/AuthContext.jsx';

const TRANSPORT_ICONS = {
    flight: <Plane size={18} />,
    train: <Train size={18} />,
    bus: <Bus size={18} />,
    car: <Car size={18} />,
    bike: <Bike size={18} />,
    other: <Globe size={18} />,
};

const STATUS_COLORS = {
    open: { bg: '#dcfce7', color: '#16a34a', text: 'Open' },
    confirmed: { bg: '#dbeafe', color: '#1d4ed8', text: 'Confirmed' },
    completed: { bg: '#f3f4f6', color: '#6b7280', text: 'Completed' },
    cancelled: { bg: '#fee2e2', color: '#dc2626', text: 'Cancelled' },
};

export default function TripDetailView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [chatLoading, setChatLoading] = useState(null); // 'group' | 'private' | null
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        getTripById(id)
            .then(setTrip)
            .catch(() => setError('Trip not found or failed to load.'))
            .finally(() => setLoading(false));
    }, [id]);

    const isCreator = trip?.creator?._id === user?._id || trip?.creator === user?._id;

    const groupChatUrl = `${window.location.origin}/chat`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(groupChatUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleGroupChat = async () => {
        setChatLoading('group');
        try {
            const chat = await joinTripGroupChat(id);
            navigate('/chat', { state: { activeChatId: chat._id } });
        } catch (e) {
            console.error(e);
        } finally {
            setChatLoading(null);
        }
    };

    const handlePrivateChat = async () => {
        setChatLoading('private');
        try {
            const creatorId = trip.creator?._id || trip.creator;
            const chat = await createPersonalChat(creatorId);
            navigate('/chat', { state: { activeChatId: chat._id } });
        } catch (e) {
            console.error(e);
        } finally {
            setChatLoading(null);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', height: '60vh', alignItems: 'center', justifyContent: 'center' }}>
                <div className="loader" />
            </div>
        );
    }

    if (error || !trip) {
        return (
            <div style={{ textAlign: 'center', paddingTop: '80px', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '1.2rem', marginBottom: '16px' }}>😕 {error || 'Trip not found.'}</p>
                <button className="btn btn-outline" onClick={() => navigate('/trips')}>
                    <ArrowLeft size={16} /> Back to Trips
                </button>
            </div>
        );
    }

    const status = STATUS_COLORS[trip.status] || STATUS_COLORS.open;
    const creator = trip.creator || {};
    const creatorAvatar = creator.profileImage?.url;
    const creatorInitial = creator.name?.charAt(0)?.toUpperCase() || '?';
    const transportIcon = TRANSPORT_ICONS[trip.transportMode] || <Globe size={18} />;

    return (
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
            {/* Back button */}
            <button
                className="btn btn-outline"
                style={{ marginBottom: '24px' }}
                onClick={() => navigate('/trips')}
            >
                <ArrowLeft size={16} /> Back to Trips
            </button>

            {/* Hero banner */}
            <div style={{
                borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                padding: '40px 36px',
                color: 'white',
                marginBottom: '24px',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', top: '-40px', right: '-40px',
                    width: '220px', height: '220px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)',
                }} />
                <div style={{
                    position: 'absolute', bottom: '-60px', left: '60%',
                    width: '160px', height: '160px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)',
                }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <span style={{
                        display: 'inline-block',
                        background: status.bg,
                        color: status.color,
                        borderRadius: '20px',
                        padding: '4px 14px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        marginBottom: '16px',
                        letterSpacing: '0.05em'
                    }}>
                        {status.text}
                    </span>

                    <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px', lineHeight: 1.2 }}>
                        {trip.fromLocation}
                        <span style={{ margin: '0 16px', opacity: 0.7 }}>→</span>
                        {trip.toLocation}
                    </h1>

                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', opacity: 0.9, fontSize: '0.9rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={16} />
                            {new Date(trip.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {transportIcon}
                            {trip.transportMode?.charAt(0).toUpperCase() + trip.transportMode?.slice(1)}
                        </span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Locations */}
                <div className="card" style={{ gap: '16px' }}>
                    <h3 style={{ marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin size={18} color="var(--primary)" /> Route
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '50%',
                                background: 'var(--primary-light)', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', color: 'var(--primary)',
                                margin: '0 auto 6px', fontWeight: 700, fontSize: '0.75rem'
                            }}>FROM</div>
                            <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>{trip.fromLocation}</p>
                        </div>
                        <div style={{ flex: 1, borderTop: '2px dashed var(--border)', position: 'relative' }}>
                            <div style={{
                                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                background: 'white', padding: '4px 10px', borderRadius: '20px',
                                border: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-muted)',
                                display: 'flex', alignItems: 'center', gap: '4px'
                            }}>
                                {transportIcon}
                            </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '50%',
                                background: '#fef3c7', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', color: '#d97706',
                                margin: '0 auto 6px', fontWeight: 700, fontSize: '0.75rem'
                            }}>TO</div>
                            <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>{trip.toLocation}</p>
                        </div>
                    </div>
                </div>

                {/* Description */}
                {trip.description && (
                    <div className="card">
                        <h3 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Globe size={18} color="var(--primary)" /> About this Trip
                        </h3>
                        <p style={{ lineHeight: 1.7, color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>
                            {trip.description}
                        </p>
                    </div>
                )}

                {/* Tags */}
                {trip.tags?.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {trip.tags.map(tag => (
                            <span key={tag} style={{
                                background: 'var(--primary-light)', color: 'var(--primary)',
                                borderRadius: '20px', padding: '4px 14px', fontSize: '0.8rem', fontWeight: 600
                            }}>#{tag}</span>
                        ))}
                    </div>
                )}

                {/* Chat section */}
                <div className="card">
                    <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MessageCircle size={18} color="var(--primary)" /> Chat
                    </h3>

                    {/* Group Chat */}
                    <div style={{
                        border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                        padding: '16px', marginBottom: '12px',
                        background: 'var(--bg-card, #fff)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '50%',
                                background: 'var(--accent-light, #ede9fe)', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', color: 'var(--accent, #7c3aed)'
                            }}>
                                <Globe size={18} />
                            </div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Group Chat</h4>
                                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>Anyone can join and chat</p>
                            </div>
                        </div>

                        {/* Shareable URL */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            background: 'var(--bg-main)', border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-sm)', padding: '8px 12px', marginBottom: '12px',
                        }}>
                            <span style={{ flex: 1, fontSize: '0.78rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {groupChatUrl}
                            </span>
                            <button
                                className="icon-btn"
                                style={{ padding: '2px 6px', flexShrink: 0 }}
                                onClick={handleCopyLink}
                                title="Copy link"
                                aria-label="Copy group chat link"
                            >
                                {copied ? <CheckCheck size={16} color="var(--secondary, #10b981)" /> : <Copy size={16} />}
                            </button>
                        </div>

                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', justifyContent: 'center' }}
                            onClick={handleGroupChat}
                            disabled={chatLoading === 'group'}
                        >
                            {chatLoading === 'group'
                                ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Joining...</>
                                : <><Globe size={16} /> Open Group Chat</>
                            }
                        </button>
                    </div>

                    {/* Private Chat — hidden for creator */}
                    {!isCreator && (
                        <div style={{
                            border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                            padding: '16px', background: 'var(--bg-card, #fff)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '50%',
                                    background: 'var(--primary-light)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', color: 'var(--primary)'
                                }}>
                                    <Lock size={18} />
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Private Chat</h4>
                                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                        Chat privately with {creator.name || 'the creator'}
                                    </p>
                                </div>
                            </div>
                            <button
                                className="btn btn-outline"
                                style={{ width: '100%', justifyContent: 'center' }}
                                onClick={handlePrivateChat}
                                disabled={chatLoading === 'private'}
                            >
                                {chatLoading === 'private'
                                    ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Opening...</>
                                    : <><Lock size={16} /> Private Message</>
                                }
                            </button>
                        </div>
                    )}
                </div>

                {/* Creator card */}
                <div className="card" style={{ alignItems: 'center', textAlign: 'center', gap: '12px' }}>
                    <div style={{
                        width: '72px', height: '72px', borderRadius: '50%',
                        background: 'var(--primary-light)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        color: 'var(--primary)', fontSize: '1.8rem', fontWeight: 700,
                        overflow: 'hidden', border: '3px solid var(--border)',
                    }}>
                        {creatorAvatar
                            ? <img src={creatorAvatar} alt={creator.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : creatorInitial
                        }
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.05rem' }}>{creator.name}</h3>
                        {creator.username && (
                            <Link
                                to={`/user/${creator.username}`}
                                style={{
                                    fontSize: '0.85rem',
                                    color: 'var(--primary)',
                                    textDecoration: 'none',
                                    fontWeight: 600,
                                }}
                            >
                                @{creator.username}
                            </Link>
                        )}
                    </div>
                    {creator.bio && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                            {creator.bio}
                        </p>
                    )}
                    {creator.rating?.average > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#eab308', fontSize: '0.9rem' }}>
                            <span>★</span>
                            <span style={{ fontWeight: 600 }}>{creator.rating.average.toFixed(1)}</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>({creator.rating.count})</span>
                        </div>
                    )}
                    {creator.username && (
                        <Link to={`/user/${creator.username}`} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}>
                            <User size={14} /> View Profile
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
