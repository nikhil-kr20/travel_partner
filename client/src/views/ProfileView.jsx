import React, { useState } from 'react';
import { User, Star, Camera, Mail, Phone, FileText, LogOut, Edit2, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { updateProfile, uploadAvatar } from '../services/auth.service.js';

export default function ProfileView({ onLogout }) {
    const { user, updateUser } = useAuth();
    const [form, setForm] = useState({
        name: user?.name || '',
        bio: user?.bio || '',
        phone: user?.phone || '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true); setError(''); setSuccess('');
        try {
            const updated = await updateProfile(form);
            updateUser(updated);
            setSuccess('Profile updated!');
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setLoading(true); setError('');
        try {
            const updated = await uploadAvatar(file);
            updateUser(updated);
            setSuccess('Avatar updated!');
        } catch {
            setError('Avatar upload failed.');
        } finally {
            setLoading(false);
        }
    };

    const initials = user?.name?.charAt(0)?.toUpperCase() || 'U';
    const isRider = user?.role === 'rider';

    return (
        <div>
            {/* ── Header ─────────────────────────────── */}
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: '1.75rem', marginBottom: 4 }}>My Profile</h1>
                <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Manage your account and preferences</p>
            </div>

            <div className="grid-2" style={{ maxWidth: 860, gap: 20 }}>
                {/* ── Profile Card ────────────────────── */}
                <div className="card" style={{ alignItems: 'center', textAlign: 'center', gap: 0, padding: 32 }}>
                    {/* Avatar */}
                    <label style={{ cursor: 'pointer', position: 'relative', marginBottom: 20 }}>
                        <div style={{
                            width: 96, height: 96, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '2.2rem', fontWeight: 800, color: 'white',
                            margin: '0 auto', overflow: 'hidden',
                            boxShadow: '0 0 24px rgba(6,182,212,0.3)',
                            border: '3px solid rgba(6,182,212,0.3)',
                        }}>
                            {user?.profileImage?.url
                                ? <img src={user.profileImage.url} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                : initials}
                        </div>
                        <div style={{
                            position: 'absolute', bottom: 2, right: 2,
                            background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                            color: 'white', borderRadius: '50%',
                            width: 28, height: 28,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '2px solid #0A0F1E',
                        }}>
                            <Camera size={13} />
                        </div>
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
                    </label>

                    {/* Name & Role */}
                    <h2 style={{ fontSize: '1.3rem', marginBottom: 8 }}>{user?.name}</h2>
                    <span className={`status-badge ${isRider ? 'status-active' : 'status-open'}`} style={{ marginBottom: 16 }}>
                        {isRider ? '🚗 Driver' : '🧳 Traveler'}
                    </span>

                    {/* Rating */}
                    {user?.rating?.average > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                            <Star size={16} fill="#fbbf24" color="#fbbf24" />
                            <span style={{ fontWeight: 700, color: '#fbbf24', fontSize: '1rem' }}>
                                {user.rating.average.toFixed(1)}
                            </span>
                            <span style={{ color: '#64748b', fontSize: '0.8rem' }}>
                                ({user.rating.count || 0} reviews)
                            </span>
                        </div>
                    )}

                    {/* Bio */}
                    <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: 20, lineHeight: 1.6 }}>
                        {user?.bio || 'No bio added yet.'}
                    </p>

                    {/* Contact info */}
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                            background: 'rgba(255,255,255,0.04)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)',
                        }}>
                            <Mail size={15} color="#06b6d4" />
                            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{user?.email}</span>
                        </div>
                        {user?.phone && (
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                                background: 'rgba(255,255,255,0.04)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)',
                            }}>
                                <Phone size={15} color="#8b5cf6" />
                                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{user.phone}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Edit Form ───────────────────────── */}
                <div className="card" style={{ padding: 28 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                        <Edit2 size={18} color="#06b6d4" />
                        <h3 style={{ margin: 0, fontSize: '1rem' }}>Edit Profile</h3>
                    </div>

                    {error && <div className="error-banner">{error}</div>}
                    {success && <div className="success-banner">{success}</div>}

                    <form onSubmit={handleSave}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <div className="form-control-icon">
                                <User size={15} className="form-icon" />
                                <input
                                    className="form-control"
                                    value={form.name}
                                    onChange={set('name')}
                                    placeholder="Your name"
                                    id="profile-name"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <div className="form-control-icon">
                                <Phone size={15} className="form-icon" />
                                <input
                                    className="form-control"
                                    value={form.phone}
                                    onChange={set('phone')}
                                    placeholder="+91 98765 43210"
                                    id="profile-phone"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Bio</label>
                            <div style={{ position: 'relative' }}>
                                <FileText size={15} style={{ position: 'absolute', left: 13, top: 13, color: '#475569' }} />
                                <textarea
                                    className="form-control"
                                    rows={4}
                                    value={form.bio}
                                    onChange={set('bio')}
                                    placeholder="Tell others about yourself, your travel style..."
                                    style={{ paddingLeft: 40, resize: 'vertical' }}
                                    id="profile-bio"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', justifyContent: 'center', borderRadius: 12, marginBottom: 10 }}
                            disabled={loading}
                            id="save-profile-btn"
                        >
                            {loading ? 'Saving...' : <><Check size={16} /> Save Changes</>}
                        </button>
                    </form>

                    <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '16px 0' }} />

                    <button
                        className="btn"
                        style={{
                            width: '100%',
                            justifyContent: 'center',
                            background: 'rgba(248,113,113,0.08)',
                            border: '1px solid rgba(248,113,113,0.2)',
                            color: '#fca5a5',
                            borderRadius: 12,
                        }}
                        onClick={onLogout}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.14)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(248,113,113,0.08)'}
                        id="logout-btn"
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
