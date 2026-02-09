import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Plus } from 'lucide-react';
import TripCard from '../components/TripCard';
import './BrowseTripsView.css';

const BrowseTripsView = ({ trips, loading, initialFilters, onPostClick, onConnect, onViewProfile, user }) => {
    const [searchFrom, setSearchFrom] = useState(initialFilters?.from || '');
    const [searchTo, setSearchTo] = useState(initialFilters?.to || '');
    const [filteredTrips, setFilteredTrips] = useState(trips);

    useEffect(() => {
        filterTrips(); // When trips prop changes
    }, [trips]);

    useEffect(() => {
        if (initialFilters) {
            setSearchFrom(initialFilters.from);
            setSearchTo(initialFilters.to);
        }
    }, [initialFilters]);

    useEffect(() => {
        filterTrips();
    }, [searchFrom, searchTo]);

    const filterTrips = () => {
        if (!trips) return;
        const filtered = trips.filter(trip =>
            (searchFrom === '' || trip.origin.toLowerCase().includes(searchFrom.toLowerCase())) &&
            (searchTo === '' || trip.destination.toLowerCase().includes(searchTo.toLowerCase()))
        );
        setFilteredTrips(filtered);
    };

    return (
        <div className="browse-trips-view">
            <div className="browse-filter-bar">
                <div className="container" style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <MapPin size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <input
                            placeholder="Filter by Origin..."
                            className="form-input"
                            style={{ paddingLeft: '2.5rem' }}
                            value={searchFrom}
                            onChange={(e) => setSearchFrom(e.target.value)}
                        />
                    </div>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Navigation size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <input
                            placeholder="Filter by Destination..."
                            className="form-input"
                            style={{ paddingLeft: '2.5rem' }}
                            value={searchTo}
                            onChange={(e) => setSearchTo(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="container browse-container">
                <div className="browse-header">
                    <h2 className="browse-title">Upcoming Trips</h2>
                    <button onClick={onPostClick} className="btn btn-primary hidden md:inline-flex">
                        <Plus size={18} /> Post Trip
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading trips...</div>
                ) : filteredTrips.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '1rem', border: '1px dashed #e5e7eb' }}>
                        <MapPin size={48} style={{ color: '#e5e7eb', marginBottom: '1rem' }} />
                        <h3>No trips found</h3>
                        <p style={{ color: '#6b7280', margin: '0.5rem 0 1.5rem' }}>Try adjusting your search filters.</p>
                        <button onClick={() => { setSearchFrom(''); setSearchTo(''); }} className="btn btn-ghost">Clear Filters</button>
                        <div style={{ marginTop: '1rem' }}>
                            <button onClick={onPostClick} className="btn btn-primary">Create Trip</button>
                        </div>
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

            <button className="fab md:hidden" onClick={onPostClick}>
                <Plus size={24} />
            </button>
        </div>
    );
};

export default BrowseTripsView;
