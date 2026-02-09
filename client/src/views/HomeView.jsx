import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, ChevronRight } from 'lucide-react';
import TripCard from '../components/TripCard';
import './HomeView.css';

const HomeView = ({ trips, loading, onConnect, onViewProfile, user }) => {
    const navigate = useNavigate();
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [filteredTrips, setFilteredTrips] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = () => {
        if (!from && !to) return;
        setHasSearched(true);
        const filtered = trips.filter(trip =>
            (from === '' || trip.origin.toLowerCase().includes(from.toLowerCase())) &&
            (to === '' || trip.destination.toLowerCase().includes(to.toLowerCase()))
        );
        setFilteredTrips(filtered);
    };

    const clearSearch = () => {
        setFrom('');
        setTo('');
        setHasSearched(false);
    };

    return (
        <>
            <div className="hero-section" style={{ minHeight: hasSearched ? 'auto' : '80vh', padding: '4rem 0' }}>
                <div className="container text-center" style={{ color: 'white' }}>
                    <h1 className="hero-title">Find Your Travel Partner</h1>
                    <p className="hero-subtitle">
                        Stop traveling alone. Connect with verified travelers going your way.
                    </p>

                    <div className="search-bar-container" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                            <div className="search-input-wrapper">
                                <MapPin size={20} className="search-icon" />
                                <input
                                    placeholder="From (e.g. London)"
                                    className="search-input"
                                    value={from}
                                    onChange={(e) => setFrom(e.target.value)}
                                />
                            </div>
                            <div className="separator hidden md:block"></div>
                            <div className="search-input-wrapper">
                                <Navigation size={20} className="search-icon" />
                                <input
                                    placeholder="To (e.g. Paris)"
                                    className="search-input"
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                />
                            </div>
                            <button className="btn btn-primary search-btn" onClick={handleSearch}>
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {hasSearched && (
                <div className="container results-section" style={{ marginTop: '3rem' }}>
                    <div className="results-header">
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Search Results</h2>
                        <button className="btn btn-ghost" onClick={() => navigate('/browse')}>
                            View All Trips <ChevronRight size={16} />
                        </button>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading trips...</div>
                    ) : filteredTrips.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '1rem', border: '1px dashed #e5e7eb' }}>
                            <MapPin size={48} style={{ color: '#e5e7eb', marginBottom: '1rem' }} />
                            <h3>No trips found</h3>
                            <p style={{ color: '#6b7280', margin: '0.5rem 0 1.5rem' }}>No trips matched your search.</p>
                            <button onClick={clearSearch} className="btn btn-ghost">Clear Search</button>
                        </div>
                    ) : (
                        <div className="cards-grid">
                            {filteredTrips.map(trip => (
                                <TripCard
                                    key={trip.id}
                                    trip={trip}
                                    onConnect={onConnect}
                                    onViewProfile={onViewProfile}
                                    isOwner={trip.hostId === user.id}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default HomeView;
