import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import WebinarCard from '../components/WebinarCard';
import { API_BASE_URL } from '../config';
import toast from 'react-hot-toast';

const Webinars = ({ theme, toggleTheme }) => {
    const [webinars, setWebinars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
    
    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        scheduledTime: '',
        durationMinutes: 60,
        cost: 0,
        meetingLink: ''
    });

    useEffect(() => {
        fetchWebinars();
        // Refresh user data to get updated balance
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) setUser(storedUser);
    }, []);

    const fetchWebinars = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/webinars`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setWebinars(data);
            }
        } catch (err) {
            console.error("Failed to fetch webinars", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (webinarId, isRegistered) => {
        if (isRegistered) {
            window.location.href = `/webinar/${webinarId}`; // Using href to ensure clean slate for Video
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            toast.error("Please login to register.");
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/webinars/${webinarId}/register`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                toast.success("Registered successfully! Check your email.");
                
                // Update local user balance if returned
                if (data.newBalance !== undefined) {
                    const updatedUser = { ...user, gridPoints: data.newBalance };
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    setUser(updatedUser);
                }
                
                fetchWebinars(); // Refresh to update registered status if we track it in the list (or just to be safe)
            } else {
                const errorText = await res.text();
                toast.error(errorText || "Registration failed.");
            }
        } catch (err) {
            toast.error("Something went wrong.");
        }
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
        try {
            const res = await fetch(`${API_BASE_URL}/webinars`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success("Webinar created successfully!");
                setShowCreateModal(false);
                fetchWebinars();
                setFormData({ title: '', description: '', scheduledTime: '', durationMinutes: 60, cost: 0, meetingLink: '' });
            } else {
                toast.error("Failed to create webinar.");
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>Upcoming Webinars</h2>
                        <p className="text-muted">Join interactive sessions and learn from peers.</p>
                    </div>
                    <button 
                        className="btn btn-primary rounded-pill px-4"
                        onClick={() => setShowCreateModal(true)}
                        style={{ background: 'var(--accent-primary)', border: 'none' }}
                    >
                        <i className="bi bi-plus-lg me-2"></i> Host Webinar
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                         <div className="spinner-border text-primary" role="status"></div>
                    </div>
                ) : webinars.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                        <i className="bi bi-calendar-x fs-1 mb-3 d-block"></i>
                        No upcoming webinars found. Be the first to host one!
                    </div>
                ) : (
                    <div className="row g-4">
                        {webinars.map(webinar => (
                            <div key={webinar.id} className="col-md-6 col-lg-4">
                                <WebinarCard 
                                    webinar={webinar} 
                                    onRegister={handleRegister} 
                                    isRegistered={webinar.registeredUserIds?.includes(user.id)}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Webinar Modal */}
            {showCreateModal && createPortal(
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 10050 }}>
                  <div className="modal-dialog modal-dialog-centered">
                        <GlassCard className="modal-content border-0" style={{ background: theme === 'dark' ? 'rgba(20, 20, 20, 0.95)' : 'rgba(255, 255, 255, 0.95)', color: 'var(--text-main)' }}>
                            <div className="modal-header border-0">
                                <h5 className="modal-title fw-bold">Host a Webinar</h5>
                                <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleCreateSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Title</label>
                                        <input type="text" className="form-control" required 
                                            value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Description</label>
                                        <textarea className="form-control" rows="3" required
                                            value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Date & Time</label>
                                            <input type="datetime-local" className="form-control" required
                                                value={formData.scheduledTime} onChange={e => setFormData({...formData, scheduledTime: e.target.value})} />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Duration (mins)</label>
                                            <input type="number" className="form-control" required min="15"
                                                value={formData.durationMinutes} onChange={e => setFormData({...formData, durationMinutes: e.target.value})} />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Cost (Grid Points)</label>
                                        <input type="number" className="form-control" required min="0"
                                            value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Meeting Link</label>
                                        <input type="url" className="form-control" placeholder="Zoom/Google Meet URL" required
                                            value={formData.meetingLink} onChange={e => setFormData({...formData, meetingLink: e.target.value})} />
                                    </div>
                                    <div className="d-flex justify-content-end gap-2">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
                                        <button type="submit" className="btn btn-primary">Create Webinar</button>
                                    </div>
                                </form>
                            </div>
                        </GlassCard>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default Webinars;
