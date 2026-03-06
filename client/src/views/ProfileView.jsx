import React, { useState } from 'react';
import { User, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { updateProfile, uploadAvatar } from '../services/auth.service.js';

export default function ProfileView({ onLogout }) {
    const { user, updateUser } = useAuth();
    const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '', phone: user?.phone || '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

    const handleSave = async (e) => {
        e.preventDefault(); setLoading(true); setError(''); setSuccess('');
        try {
            const updated = await updateProfile(form);
            updateUser(updated);
            setSuccess('Profile updated successfully!');
        } catch (err) { setError(err.response?.data?.message || 'Update failed.'); }
        finally { setLoading(false); }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setLoading(true); setError('');
        try {
            const updated = await uploadAvatar(file);
            updateUser(updated);
            setSuccess('Avatar updated!');
        } catch (e) { setError('Avatar upload failed.'); } // eslint-disable-line no-unused-vars
        finally { setLoading(false); }
    };

    return (
        <div>
            <div style={{ paddingBottom: '40px' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', marginBottom: '8px', display: 'block' }}>
                    Personal
                </span>
                <h1 style={{ margin: 0 }}>My Profile</h1>
            </div>
            <div className="grid-2" style={{ maxWidth: '900px' }}>
                {/* Profile Card */}
                <div className="card" style={{ alignItems: 'center', textAlign: 'center', gap: '20px', background: 'rgba(30, 41, 59, 0.4)' }}>
                    <label style={{ cursor: 'pointer', position: 'relative' }}>
                        <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '3rem', fontWeight: 800, margin: '0 auto', overflow: 'hidden', border: '4px solid rgba(255,255,255,0.1)', boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)' }}>
                            {user?.profileImage?.url
                                ? <img src={user.profileImage.url} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                : user?.name?.charAt(0)}
                        </div>
                        <div style={{ position: 'absolute', bottom: '5px', right: '5px', background: 'var(--primary)', color: 'white', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', border: '2px solid var(--bg-main)' }}>✎</div>
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
                    </label>
                    <div>
                        <h2 style={{ marginBottom: '4px' }}>{user?.name}</h2>
                        <span className={`status-badge ${user?.role === 'rider' ? 'status-active' : 'status-upcoming'}`}>{user?.role}</span>
                    </div>
                    {user?.rating?.average > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#eab308' }}>
                            <Star size={18} fill="currentColor" />
                            <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{user.rating.average.toFixed(1)}</span>
                        </div>
                    )}
                    <p style={{ fontSize: '0.9rem' }}>{user?.bio || 'No bio added yet.'}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user?.email}</p>
                    {user?.phone && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user.phone}</p>}
                </div>

                {/* Edit Form */}
                <div className="card">
                    <h3 style={{ marginBottom: '20px' }}>Edit Profile</h3>
                    {error && <div className="error-banner">{error}</div>}
                    {success && <div style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#16a34a', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: '0.9rem' }}>{success}</div>}
                    <form onSubmit={handleSave}>
                        <div className="form-group"><label>Full Name</label><input className="form-control" value={form.name} onChange={set('name')} /></div>
                        <div className="form-group"><label>Phone</label><input className="form-control" value={form.phone} onChange={set('phone')} /></div>
                        <div className="form-group"><label>Bio</label><textarea className="form-control" rows="3" value={form.bio} onChange={set('bio')} placeholder="Tell others about yourself..." /></div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
                        </div>
                    </form>
                    <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }} onClick={onLogout}>Logout</button>
                </div>
            </div>
        </div>
    );
}
