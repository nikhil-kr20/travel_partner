import React, { useState } from 'react';
import { User, Mail, Lock, Navigation } from 'lucide-react';
import './AuthScreen.css';

const AuthScreen = ({ onAuth }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        onAuth(isLogin, formData);
    };

    return (
        <div className="auth-layout">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-icon">
                        <Navigation size={24} />
                    </div>
                    <h1 className="auth-title">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p className="auth-subtitle">
                        {isLogin ? 'Login to access your travel plans' : 'Join the community of travelers details'}
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="input-group">
                            <label className="input-label">Full Name</label>
                            <div className="input-wrapper">
                                <User className="input-icon" />
                                <input
                                    className="form-input has-icon"
                                    placeholder="e.g. Alex"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div className="input-group">
                        <label className="input-label">Email Address</label>
                        <div className="input-wrapper">
                            <Mail className="input-icon" />
                            <input
                                type="email"
                                className="form-input has-icon"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" />
                            <input
                                type="password"
                                className="form-input has-icon"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <button className="btn btn-primary w-full" style={{ padding: '0.75rem' }}>
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>

                <div className="auth-footer">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="auth-toggle-btn"
                    >
                        {isLogin ? 'Sign up' : 'Login'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthScreen;
