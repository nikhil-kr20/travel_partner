import React, { useState, useEffect, useRef } from 'react';
import { Compass, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import gsap from 'gsap';

export default function LoginView() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [role, setRole] = useState('user');
    const [loading, setLoading] = useState(false);
    const cardRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(cardRef.current,
            { y: 50, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 1, ease: "power4.out" }
        );
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login({ email, password, role });
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <div className="logo" style={{ justifyContent: 'center', marginBottom: '24px' }}>
                    <div className="logo-icon"><Compass size={24} /></div>
                    TravelPartner
                </div>
                <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Welcome Back</h2>

                <div className="role-selector">
                    <div className={`role-btn ${role === 'user' ? 'active' : ''}`} onClick={() => setRole('user')}>Traveler</div>
                    <div className={`role-btn ${role === 'rider' ? 'active' : ''}`} onClick={() => setRole('rider')}>Driver</div>
                </div>

                {error && <div className="error-banner">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label style={{ color: 'var(--text-muted)' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                <Mail size={18} />
                            </div>
                            <input type="email" className="form-control" required placeholder="name@example.com"
                                value={email} onChange={e => setEmail(e.target.value)} style={{ paddingLeft: '48px' }} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label style={{ color: 'var(--text-muted)' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                <Lock size={18} />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-control"
                                required
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                style={{ paddingRight: '44px', paddingLeft: '48px' }}
                            />
                            <button
                                type="button"
                                className="icon-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'transparent',
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer'
                                }}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary"
                        style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}
                        disabled={loading}>
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
