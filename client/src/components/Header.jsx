import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navigation, LogOut, User, MessageSquare } from 'lucide-react';
import './Header.css';

const Header = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <header className="app-header">
            <div className="container header-container">
                <div
                    onClick={() => navigate('/')}
                    className="brand-section"
                >
                    <Navigation style={{ color: 'var(--primary)' }} />
                    TravelMates
                </div>

                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                    <button
                        onClick={() => navigate('/browse')}
                        className="btn btn-ghost"
                        style={{
                            fontWeight: 600,
                            color: location.pathname === '/browse' ? 'var(--primary)' : 'var(--text-main)',
                            borderBottom: location.pathname === '/browse' ? '2px solid var(--primary)' : 'none'
                        }}
                    >
                        Browse All Trips
                    </button>
                    <button
                        onClick={() => navigate('/post')}
                        className="btn btn-ghost"
                        style={{
                            fontWeight: 600,
                            color: location.pathname === '/post' ? 'var(--primary)' : 'var(--text-main)',
                            borderBottom: location.pathname === '/post' ? '2px solid var(--primary)' : 'none'
                        }}
                    >
                        Post Trip
                    </button>
                    <button
                        onClick={() => navigate('/chats')}
                        className="btn btn-ghost"
                        style={{
                            fontWeight: 600,
                            color: location.pathname === '/chats' || location.pathname.startsWith('/chat/') ? 'var(--primary)' : 'var(--text-main)',
                            borderBottom: location.pathname === '/chats' || location.pathname.startsWith('/chat/') ? '2px solid var(--primary)' : 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <MessageSquare size={18} />
                        Chats
                    </button>
                </div>

                <div className="user-section">
                    <button
                        onClick={() => navigate('/profile')}
                        className="profile-avatar-btn"
                        title={user.name}
                        style={{
                            width: '2.5rem',
                            height: '2.5rem',
                            borderRadius: '50%',
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            transition: 'transform 0.2s, box-shadow 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1)';
                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(37, 99, 235, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        {user.name?.[0]?.toUpperCase()}
                    </button>
                    <button onClick={onLogout} className="btn btn-ghost" style={{ padding: '0.5rem' }}>
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
