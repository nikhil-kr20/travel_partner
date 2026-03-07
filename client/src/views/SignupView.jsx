import React, { useState } from 'react';
import { Compass, Eye, EyeOff, Mail, Lock, User, ArrowRight, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import AuthHero from '@/components/ui/AuthHero.jsx';

export default function SignupView() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(location.state?.openForm || false);

    const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(form);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'relative', width: '100vw', minHeight: '100vh', overflowX: 'hidden', overflowY: 'auto', background: '#0A0F1E' }}>
            {/* ── Full Screen Hero ─────────────────────────── */}
            <div style={{ position: 'relative', width: '100vw', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <AuthHero
                    onLoginClick={() => navigate('/login', { state: { openForm: true } })}
                    onSignupClick={() => setShowForm(true)}
                />
            </div>

            {/* ── Modal Form Overlay ───────────────────── */}
            {showForm && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(10, 15, 30, 0.85)',
                    backdropFilter: 'blur(8px)',
                    zIndex: 50,
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'auto',
                    padding: '40px 20px',
                    animation: 'fadeSlideIn 0.3s ease-out',
                }}>
                    <div className="auth-card" style={{ position: 'relative', width: '100%', maxWidth: '440px', padding: '40px 32px', margin: 'auto' }}>
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            style={{
                                position: 'absolute', top: '20px', right: '20px',
                                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                color: '#94a3b8', cursor: 'pointer', padding: '8px', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#94a3b8'; }}
                        >
                            <X size={18} />
                        </button>

                        <div style={{ marginBottom: 32 }}>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>
                                Create account
                            </h2>
                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                                Start your adventure today — it's free
                            </p>
                        </div>

                        {/* Role Selector */}
                        <div style={{ marginBottom: 24 }}>
                            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                I am a
                            </p>
                            <div className="role-selector">
                                <button type="button" className={`role-btn ${form.role === 'user' ? 'active' : ''}`} onClick={() => setForm(f => ({ ...f, role: 'user' }))}>
                                    🧳 Traveler
                                </button>
                                <button type="button" className={`role-btn ${form.role === 'rider' ? 'active' : ''}`} onClick={() => setForm(f => ({ ...f, role: 'rider' }))}>
                                    🚗 Driver
                                </button>
                            </div>
                        </div>

                        {error && <div className="error-banner">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="signup-name">Full name</label>
                                <div className="form-control-icon">
                                    <User size={16} className="form-icon" />
                                    <input
                                        id="signup-name"
                                        type="text"
                                        className="form-control"
                                        required
                                        placeholder="Alex Johnson"
                                        value={form.name}
                                        onChange={update('name')}
                                        autoComplete="name"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="signup-email">Email address</label>
                                <div className="form-control-icon">
                                    <Mail size={16} className="form-icon" />
                                    <input
                                        id="signup-email"
                                        type="email"
                                        className="form-control"
                                        required
                                        placeholder="you@example.com"
                                        value={form.email}
                                        onChange={update('email')}
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="signup-password">Password</label>
                                <div className="form-control-icon" style={{ position: 'relative' }}>
                                    <Lock size={16} className="form-icon" />
                                    <input
                                        id="signup-password"
                                        type={showPassword ? 'text' : 'password'}
                                        className="form-control"
                                        required
                                        placeholder="Min. 8 characters"
                                        value={form.password}
                                        onChange={update('password')}
                                        style={{ paddingRight: '44px' }}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        style={{
                                            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                                            background: 'none', border: 'none', color: '#475569', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', padding: 4,
                                        }}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                id="signup-submit"
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '13px', fontSize: '0.95rem', marginTop: 8, borderRadius: 14, justifyContent: 'center' }}
                                disabled={loading}
                            >
                                {loading ? (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                                        Creating account...
                                    </span>
                                ) : (
                                    <>Create Account <ArrowRight size={16} /></>
                                )}
                            </button>
                        </form>

                        <p style={{ textAlign: 'center', marginTop: 24, color: '#64748b', fontSize: '0.875rem' }}>
                            By creating an account, you agree to our{' '}
                            <a href="#" style={{ color: '#06b6d4', textDecoration: 'none', fontWeight: 500 }}>Terms</a> and{' '}
                            <a href="#" style={{ color: '#06b6d4', textDecoration: 'none', fontWeight: 500 }}>Privacy Policy</a>.
                        </p>

                        <p style={{ textAlign: 'center', marginTop: 20, color: '#64748b', fontSize: '0.875rem' }}>
                            Already have an account?{' '}
                            <Link to="/login" state={{ openForm: true }} style={{ color: '#06b6d4', fontWeight: 600, textDecoration: 'none' }}>
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
