import React, { useEffect, useState, useRef } from 'react';
import {
    MapPin, Calendar, ArrowLeft, MessageCircle, Lock,
    Globe, Train, Car, Bus, Plane, Bike, Copy, CheckCheck,
    User, Loader2
} from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { gsap } from 'gsap';
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
    open: { bg: 'rgba(16, 185, 129, 0.2)', color: '#34d399', text: 'Open' },
    confirmed: { bg: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', text: 'Confirmed' },
    completed: { bg: 'rgba(148, 163, 184, 0.2)', color: '#94a3b8', text: 'Completed' },
    cancelled: { bg: 'rgba(239, 68, 68, 0.2)', color: '#f87171', text: 'Cancelled' },
};

export default function TripDetailView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const containerRef = useRef(null);

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

    useEffect(() => {
        if (!loading && trip) {
            const ctx = gsap.context(() => {
                gsap.from('.stagger-card', {
                    y: 30,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'power3.out',
                    clearProps: 'all'
                });
            }, containerRef);
            return () => ctx.revert();
        }
    }, [loading, trip]);

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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            style={{ maxWidth: '860px', margin: '0 auto' }}
            ref={containerRef}
        >
            {/* Back button */}
            <button
                className="btn btn-outline"
                style={{ marginBottom: '24px' }}
                onClick={() => navigate('/trips')}
            >
                <ArrowLeft size={16} /> Back to Trips
            </button>

            {/* Hero banner */}
            <div className="stagger-card" style={{
                borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.4) 0%, rgba(30, 41, 59, 0.4) 100%)',
                padding: '60px 40px',
                color: 'white',
                marginBottom: '32px',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid var(--border)',
                backdropFilter: 'blur(20px)'
            }}>
                <div style={{
                    position: 'absolute', top: '-40px', right: '-40px',
                    width: '220px', height: '220px', borderRadius: '50%',
                    background: 'rgba(99, 102, 241, 0.2)', filter: 'blur(40px)'
                }} />
                <div style={{
                    position: 'absolute', bottom: '-60px', left: '20%',
                    width: '160px', height: '160px', borderRadius: '50%',
                    background: 'rgba(245, 158, 11, 0.1)', filter: 'blur(40px)'
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
                        letterSpacing: '0.05em',
                        border: `1px solid ${status.color}33`
                    }}>
                        {status.text}
                    </span>

                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '12px', lineHeight: 1.2 }}>
                        {trip.fromLocation}
                        <span style={{ margin: '0 16px', color: 'var(--primary)', opacity: 0.8 }}>→</span>
                        {trip.toLocation}
                    </h1>

                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', opacity: 0.9, fontSize: '0.95rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Calendar size={18} className="text-primary" />
                            {new Date(trip.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="text-primary">{transportIcon}</span>
                            {trip.transportMode?.charAt(0).toUpperCase() + trip.transportMode?.slice(1)}
                        </span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                {/* Locations */}
                <div className="glass-card stagger-card" style={{ padding: '32px' }}>
                    <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <MapPin size={22} className="text-primary" /> Journey Details
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ textAlign: 'center', flex: '0 0 100px' }}>
                            <div style={{
                                width: '64px', height: '64px', borderRadius: '50%',
                                background: 'rgba(99, 102, 241, 0.1)', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', color: 'var(--primary)',
                                margin: '0 auto 12px', fontWeight: 800, fontSize: '0.8rem', border: '1px solid rgba(99, 102, 241, 0.3)'
                            }}>START</div>
                            <p style={{ fontWeight: 800, fontSize: '1.1rem' }}>{trip.fromLocation}</p>
                        </div>
                        <div style={{ flex: 1, borderTop: '2px dashed var(--border)', position: 'relative' }}>
                            <div style={{
                                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                background: '#1e293b', padding: '8px 16px', borderRadius: '30px',
                                border: '1px solid var(--border)', fontSize: '1rem', color: 'var(--primary)',
                                display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                            }}>
                                {transportIcon}
                            </div>
                        </div>
                        <div style={{ textAlign: 'center', flex: '0 0 100px' }}>
                            <div style={{
                                width: '64px', height: '64px', borderRadius: '50%',
                                background: 'rgba(245, 158, 11, 0.1)', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', color: 'var(--accent)',
                                margin: '0 auto 12px', fontWeight: 800, fontSize: '0.8rem', border: '1px solid rgba(245, 158, 11, 0.3)'
                            }}>END</div>
                            <p style={{ fontWeight: 800, fontSize: '1.1rem' }}>{trip.toLocation}</p>
                        </div>
                    </div>
                </div>

                {/* Description */}
                {trip.description && (
                    <div className="glass-card stagger-card" style={{ padding: '32px' }}>
                        <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Globe size={20} className="text-primary" /> About this Trip
                        </h3>
                        <p style={{ lineHeight: 1.8, color: 'var(--text-main)', fontSize: '1.05rem', whiteSpace: 'pre-wrap', opacity: 0.9 }}>
                            {trip.description}
                        </p>
                    </div>
                )}

                {/* Tags */}
                {trip.tags?.length > 0 && (
                    <div className="stagger-card" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {trip.tags.map(tag => (
                            <span key={tag} style={{
                                background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)',
                                borderRadius: '30px', padding: '6px 16px', fontSize: '0.85rem', fontWeight: 600,
                                border: '1px solid rgba(99, 102, 241, 0.2)'
                            }}>#{tag}</span>
                        ))}
                    </div>
                )}

                {/* Chat section */}
                <div className="glass-card stagger-card" style={{ padding: '32px' }}>
                    <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <MessageCircle size={22} className="text-primary" /> Communications
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: isCreator ? '1fr' : '1fr 1fr', gap: '20px' }}>
                        {/* Group Chat */}
                        <div className="glass-card" style={{
                            padding: '24px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid var(--border)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                <div style={{
                                    width: '44px', height: '44px', borderRadius: '12px',
                                    background: 'rgba(245, 158, 11, 0.1)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', color: 'var(--accent)'
                                }}>
                                    <Globe size={22} />
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Group Hub</h4>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Public discussion for all</p>
                                </div>
                            </div>

                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)',
                                borderRadius: '12px', padding: '10px 14px', marginBottom: '16px',
                            }}>
                                <span style={{ flex: 1, fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {groupChatUrl}
                                </span>
                                <button
                                    className="icon-btn"
                                    style={{ padding: '4px', flexShrink: 0 }}
                                    onClick={handleCopyLink}
                                    title="Copy link"
                                    aria-label="Copy group chat link"
                                >
                                    {copied ? <CheckCheck size={18} color="#10b981" /> : <Copy size={18} />}
                                </button>
                            </div>

                            <button
                                className="btn btn-primary"
                                style={{ width: '100%', justifyContent: 'center', height: '48px', borderRadius: '12px' }}
                                onClick={handleGroupChat}
                                disabled={chatLoading === 'group'}
                            >
                                {chatLoading === 'group'
                                    ? <><Loader2 size={18} className="animate-spin" /> Joining...</>
                                    : <><Globe size={18} /> Enter Hub</>
                                }
                            </button>
                        </div>

                        {/* Private Chat — hidden for creator */}
                        {!isCreator && (
                            <div className="glass-card" style={{
                                padding: '24px',
                                background: 'rgba(255, 255, 255, 0.02)',
                                border: '1px solid var(--border)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                    <div style={{
                                        width: '44px', height: '44px', borderRadius: '12px',
                                        background: 'rgba(99, 102, 241, 0.1)', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center', color: 'var(--primary)'
                                    }}>
                                        <Lock size={22} />
                                    </div>
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Direct Contact</h4>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            Message {creator.name || 'host'}
                                        </p>
                                    </div>
                                </div>
                                <div style={{ height: '58px' }} /> {/* Spacer for alignment */}
                                <button
                                    className="btn btn-outline"
                                    style={{ width: '100%', justifyContent: 'center', height: '48px', borderRadius: '12px' }}
                                    onClick={handlePrivateChat}
                                    disabled={chatLoading === 'private'}
                                >
                                    {chatLoading === 'private'
                                        ? <><Loader2 size={18} className="animate-spin" /> Opening...</>
                                        : <><MessageCircle size={18} /> Private Chat</>
                                    }
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Creator card */}
                <div className="glass-card stagger-card" style={{ padding: '32px', display: 'flex', gap: '24px', alignItems: 'center' }}>
                    <div style={{
                        width: '90px', height: '90px', borderRadius: '24px',
                        background: 'linear-gradient(45deg, var(--primary), var(--accent))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: '2rem', fontWeight: 800,
                        overflow: 'hidden', border: '4px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.3)', flexShrink: 0
                    }}>
                        {creatorAvatar
                            ? <img src={creatorAvatar} alt={creator.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : creatorInitial
                        }
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.4rem', fontWeight: 800 }}>{creator.name}</h3>
                                {creator.username && (
                                    <Link
                                        to={`/user/${creator.username}`}
                                        style={{
                                            fontSize: '0.95rem',
                                            color: 'var(--primary)',
                                            textDecoration: 'none',
                                            fontWeight: 600,
                                        }}
                                    >
                                        @{creator.username}
                                    </Link>
                                )}
                            </div>
                            {creator.rating?.average > 0 && (
                                <div style={{ background: 'rgba(234, 179, 8, 0.1)', padding: '6px 12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: '#eab308' }}>
                                    <span style={{ fontSize: '1.1rem' }}>★</span>
                                    <span style={{ fontWeight: 800, fontSize: '1rem' }}>{creator.rating.average.toFixed(1)}</span>
                                </div>
                            )}
                        </div>
                        {creator.bio && (
                            <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', margin: '12px 0 0 0', lineHeight: 1.6, opacity: 0.8 }}>
                                {creator.bio}
                            </p>
                        )}
                    </div>
                    <div style={{ flexShrink: 0 }}>
                        {creator.username && (
                            <Link to={`/user/${creator.username}`} className="btn btn-outline" style={{ borderRadius: '12px', padding: '10px 20px' }}>
                                <User size={18} /> Profile
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
