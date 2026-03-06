import React, { useState } from 'react';
import { Compass, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function SignupView() {
    const { register } = useAuth();
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'user', username: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // Don't send empty phone — backend validation rejects blank strings
            const payload = { ...form };
            if (!payload.phone?.trim()) delete payload.phone;
            await register(payload);
        } catch (err) {
            const data = err.response?.data;
            // Joi sends an `errors` array with field-level messages
            if (data?.errors?.length) {
                setError(data.errors.join(' • '));
            } else {
                setError(data?.message || 'Registration failed. Please try again.');
            }
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
                <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Create Account</h2>
                <div className="role-selector">
                    <div className={`role-btn ${form.role === 'user' ? 'active' : ''}`} onClick={() => setForm(f => ({ ...f, role: 'user' }))}>Traveler</div>
                    <div className={`role-btn ${form.role === 'rider' ? 'active' : ''}`} onClick={() => setForm(f => ({ ...f, role: 'rider' }))}>Driver</div>
                </div>
                {error && <div className="error-banner">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Set Your Unique UserName</label>
                        <input type="text" className="form-control" required placeholder="its_nikhil" value={form.username} onChange={set('username')} />
                    </div>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" className="form-control" required placeholder="John Doe" value={form.name} onChange={set('name')} />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" className="form-control" required placeholder="name@example.com" value={form.email} onChange={set('email')} />
                    </div>
                    <div className="form-group">
                        <label>Phone (optional)</label>
                        <input type="tel" className="form-control" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-control"
                                required
                                placeholder="••••••••"
                                value={form.password}
                                onChange={set('password')}
                                style={{ paddingRight: '44px' }}
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
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
