import React, { useState } from 'react';
import { Compass, Eye, EyeOff, Mail, Lock, ArrowRight, MapPin, Users, Zap, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import AuthHero from '@/components/ui/AuthHero.jsx';

const FEATURES = [
    { icon: <MapPin size={18} />, title: 'Discover Trips', desc: 'Find companions for your next adventure' },
    { icon: <Users size={18} />, title: 'Verified Community', desc: 'Travel safely with trusted companions' },
    { icon: <Zap size={18} />, title: 'Instant Matching', desc: 'Connect with travelers in real-time' },
];

export default function LoginView() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [role, setRole] = useState('user');
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(location.state?.openForm || false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login({ email, password, role });
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'relative', width: '100vw', minHeight: '100vh', overflowX: 'hidden', overflowY: 'auto', background: '#0A0F1E' }}>
            {/* ── Full Screen Hero ─────────────────────────── */}
            <div style={{ position: 'relative', width: '100vw', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <AuthHero
                    onLoginClick={() => setShowForm(true)}
                    onSignupClick={() => navigate('/register', { state: { openForm: true } })}
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

                        {/* Header */}
                        <div style={{ marginBottom: 32 }}>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f1f5f9', marginBottom: 8 }}>
                                Welcome back
                            </h2>
                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                                Sign in to continue your journey
                            </p>
                        </div>

                        {/* Role Selector */}
                        <div style={{ marginBottom: 24 }}>
                            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Sign in as
                            </p>
                            <div className="role-selector">
                                <button
                                    type="button"
                                    className={`role-btn ${role === 'user' ? 'active' : ''}`}
                                    onClick={() => setRole('user')}
                                    id="role-traveler"
                                >
                                    🧳 Traveler
                                </button>
                                <button
                                    type="button"
                                    className={`role-btn ${role === 'rider' ? 'active' : ''}`}
                                    onClick={() => setRole('rider')}
                                    id="role-driver"
                                >
                                    🚗 Driver
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && <div className="error-banner">{error}</div>}

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="login-email">Email address</label>
                                <div className="form-control-icon">
                                    <Mail size={16} className="form-icon" />
                                    <input
                                        id="login-email"
                                        type="email"
                                        className="form-control"
                                        required
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                                    <label htmlFor="login-password" style={{ marginBottom: 0 }}>Password</label>
                                    <a href="#" style={{ color: '#06b6d4', fontSize: '0.8rem', fontWeight: 500, textDecoration: 'none' }}>
                                        Forgot password?
                                    </a>
                                </div>
                                <div className="form-control-icon" style={{ position: 'relative' }}>
                                    <Lock size={16} className="form-icon" />
                                    <input
                                        id="login-password"
                                        type={showPassword ? 'text' : 'password'}
                                        className="form-control"
                                        required
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        style={{ paddingRight: '44px' }}
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        style={{
                                            position: 'absolute',
                                            right: 12,
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            color: '#475569',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: 4,
                                        }}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                id="login-submit"
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '13px', fontSize: '0.95rem', marginTop: 8, borderRadius: 14, justifyContent: 'center' }}
                                disabled={loading}
                            >
                                {loading ? (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                                        Signing in...
                                    </span>
                                ) : (
                                    <>Sign In <ArrowRight size={16} /></>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
                            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
                            <span style={{ color: '#475569', fontSize: '0.8rem' }}>or</span>
                            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
                        </div>

                        {/* Social */}
                        <button
                            type="button"
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: 14,
                                color: '#f1f5f9',
                                fontFamily: 'inherit',
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 10,
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </button>

                        {/* Sign up link */}
                        <p style={{ textAlign: 'center', marginTop: 28, color: '#64748b', fontSize: '0.875rem' }}>
                            Don't have an account?{' '}
                            <Link to="/register" state={{ openForm: true }} style={{ color: '#06b6d4', fontWeight: 600, textDecoration: 'none' }}>
                                Create one
                            </Link>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
