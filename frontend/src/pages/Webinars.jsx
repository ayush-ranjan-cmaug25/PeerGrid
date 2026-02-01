import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../components/GlassCard';
import WebinarCard from '../components/WebinarCard';
import { API_BASE_URL } from '../config';
import toast from 'react-hot-toast';

const Webinars = ({ theme, toggleTheme }) => {
    const [webinars, setWebinars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [registeringId, setRegisteringId] = useState(null);
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

        setRegisteringId(webinarId);

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
        } finally {
            setRegisteringId(null);
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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <div className="container py-4">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="d-flex justify-content-between align-items-center mb-5"
            >
                <div>
                    <h2 className="display-5 fw-bold mb-2" style={{ color: 'var(--text-main)' }}>Upcoming Webinars</h2>
                    <p className="text-muted fs-5">Join interactive sessions and learn from peers.</p>
                </div>
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-primary rounded-pill px-4 py-2 shadow-lg fw-semibold"
                    onClick={() => setShowCreateModal(true)}
                    style={{ background: 'var(--accent-primary)', border: 'none' }}
                >
                    <i className="bi bi-plus-lg me-2"></i> Host Webinar
                </motion.button>
            </motion.div>

            {loading ? (
                <div className="text-center py-5">
                     <div className="spinner-border text-primary" role="status"></div>
                </div>
            ) : webinars.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="text-center py-5 text-muted"
                >
                    <i className="bi bi-calendar-x fs-1 mb-3 d-block opacity-50"></i>
                    <h4 className="fw-normal">No upcoming webinars found.</h4>
                    <p>Be the first to host one and earn Grid Points!</p>
                </motion.div>
            ) : (
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="row g-4"
                >
                    {webinars.map(webinar => (
                        <motion.div variants={itemVariants} key={webinar.id} className="col-md-6 col-lg-4">
                            <WebinarCard 
                                webinar={webinar} 
                                onRegister={handleRegister} 
                                isRegistered={webinar.registeredUserIds?.includes(user.id)}
                                isRegistering={registeringId === webinar.id}
                                isHost={webinar.host?.id === user.id}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Create Webinar Modal */}
            {showCreateModal && createPortal(
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="modal d-block" 
                    style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 10050 }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="w-100"
                        >
                            <GlassCard className="modal-content border-0 shadow-lg" style={{ background: theme === 'dark' ? 'rgba(20, 20, 20, 0.95)' : 'rgba(255, 255, 255, 0.95)', color: 'var(--text-main)' }}>
                                <div className="modal-header border-0 pb-0">
                                    <h4 className="modal-title fw-bold">Host a Webinar</h4>
                                    <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)} style={{ filter: theme === 'dark' ? 'invert(1)' : 'none' }}></button>
                                </div>
                                <div className="modal-body pt-4">
                                    <form onSubmit={handleCreateSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label text-muted small fw-bold text-uppercase">Title</label>
                                            <input type="text" className="form-control bg-transparent" required 
                                                style={{ color: 'var(--text-main)', borderColor: 'var(--border-color)' }}
                                                value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label text-muted small fw-bold text-uppercase">Description</label>
                                            <textarea className="form-control bg-transparent" rows="3" required
                                                style={{ color: 'var(--text-main)', borderColor: 'var(--border-color)' }}
                                                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label text-muted small fw-bold text-uppercase">Date & Time</label>
                                                <input type="datetime-local" className="form-control bg-transparent" required
                                                    style={{ color: 'var(--text-main)', borderColor: 'var(--border-color)' }}
                                                    value={formData.scheduledTime} onChange={e => setFormData({...formData, scheduledTime: e.target.value})} />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label text-muted small fw-bold text-uppercase">Duration (mins)</label>
                                                <input type="number" className="form-control bg-transparent" required min="15"
                                                    style={{ color: 'var(--text-main)', borderColor: 'var(--border-color)' }}
                                                    value={formData.durationMinutes} onChange={e => setFormData({...formData, durationMinutes: e.target.value})} />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label text-muted small fw-bold text-uppercase">Cost (Grid Points)</label>
                                            <input type="number" className="form-control bg-transparent" required min="0"
                                                style={{ color: 'var(--text-main)', borderColor: 'var(--border-color)' }}
                                                value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} />
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label text-muted small fw-bold text-uppercase">Meeting Link</label>
                                            <input type="url" className="form-control bg-transparent" placeholder="Zoom/Google Meet URL"
                                                style={{ color: 'var(--text-main)', borderColor: 'var(--border-color)' }}
                                                value={formData.meetingLink} onChange={e => setFormData({...formData, meetingLink: e.target.value})} />
                                        </div>
                                        <div className="d-flex justify-content-end gap-2">
                                            <button type="button" className="btn btn-outline-secondary px-4 rounded-pill" onClick={() => setShowCreateModal(false)}>Cancel</button>
                                            <button type="submit" className="btn btn-primary px-4 rounded-pill" style={{ background: 'var(--accent-primary)', border: 'none' }}>Create Webinar</button>
                                        </div>
                                    </form>
                                </div>
                            </GlassCard>
                        </motion.div>
                    </div>
                </motion.div>,
                document.body
            )}
        </div>
    );
};

export default Webinars;
