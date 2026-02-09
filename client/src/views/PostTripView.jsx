import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import './PostTripView.css';

const PostTripView = ({ onSubmit }) => {
    const navigate = useNavigate();
    const [data, setData] = useState({ origin: '', destination: '', date: '', mode: 'Bus', description: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSubmit(data);
        navigate('/browse');
    };

    return (
        <div className="post-trip-view">
            <button onClick={() => navigate(-1)} className="btn btn-ghost" style={{ marginBottom: '1rem', paddingLeft: 0 }}>
                <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} /> Back
            </button>
            <div className="post-card">
                <h2 className="post-title">Share Your Journey</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="input-group">
                            <label className="input-label">From</label>
                            <input className="form-input" required placeholder="Origin" value={data.origin} onChange={e => setData({ ...data, origin: e.target.value })} />
                        </div>
                        <div className="input-group">
                            <label className="input-label">To</label>
                            <input className="form-input" required placeholder="Destination" value={data.destination} onChange={e => setData({ ...data, destination: e.target.value })} />
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="input-group">
                            <label className="input-label">Date</label>
                            <input type="date" className="form-input" required value={data.date} onChange={e => setData({ ...data, date: e.target.value })} />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Mode</label>
                            <select className="form-input" value={data.mode} onChange={e => setData({ ...data, mode: e.target.value })}>
                                <option>Bus</option>
                                <option>Train</option>
                                <option>Car/Cab</option>
                                <option>Flight</option>
                            </select>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Note</label>
                        <textarea className="form-input" rows="3" placeholder="Any details..." value={data.description} onChange={e => setData({ ...data, description: e.target.value })}></textarea>
                    </div>

                    <button className="btn btn-primary w-full">Post Trip</button>
                </form>
            </div>
        </div>
    );
};

export default PostTripView;
