import React, { useState, useEffect } from 'react';
import ScrollReveal from '../ScrollReveal';
import { adminService } from '../../services/adminService';

const SessionManagement = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterCategory, setFilterCategory] = useState('All');

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const data = await adminService.getSessions();
            const formattedSessions = data.map(s => ({
                id: s.id,
                topic: s.title,
                host: s.tutor ? s.tutor.name : 'Pending',
                student: s.learner ? s.learner.name : 'Unknown',
                status: s.status,
                date: new Date(s.startTime).toLocaleDateString(),
                time: new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                cost: s.cost,
                category: s.topic, // Using topic as category for now since we don't have category field
                rating: 0 // Placeholder
            }));
            setSessions(formattedSessions);
        } catch (error) {
            console.error("Error fetching sessions", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelSession = (id) => {
        if (window.confirm('Are you sure you want to cancel this session? GP will be refunded.')) {
            // In a real app, call API
            setSessions(sessions.map(s => s.id === id ? { ...s, status: 'Cancelled' } : s));
        }
    };

    const handleMarkCompleted = (id) => {
         // In a real app, call API
         setSessions(sessions.map(s => s.id === id ? { ...s, status: 'Completed' } : s));
    };

    const filteredSessions = sessions.filter(session => 
        (filterStatus === 'All' || session.status === filterStatus) &&
        (filterCategory === 'All' || session.category === filterCategory)
    );

    if (loading) return <div className="p-5 text-center">Loading sessions...</div>;

    return (
        <div className="container-fluid p-0">


            <ScrollReveal>
                <div className="glass-card p-4">
                    <div className="row g-3 mb-4">
                        <div className="col-md-3">
                            <select className="form-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                <option value="All">All Statuses</option>
                                <option value="Upcoming">Upcoming</option>
                                <option value="Ongoing">Ongoing</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <select className="form-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                                <option value="All">All Categories</option>
                                {/* Categories are dynamic now, so we might want to list unique topics or remove this filter if too diverse */}
                                <option value="Frontend">Frontend</option>
                                <option value="Backend">Backend</option>
                            </select>
                        </div>
                    </div>

                    {filteredSessions.length === 0 ? (
                        <p className="text-muted">No sessions found.</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table custom-table align-middle">
                                <thead>
                                    <tr className="text-muted small text-uppercase">
                                        <th>Topic</th>
                                        <th>Host & Student</th>
                                        <th>Date & Time</th>
                                        <th>Status</th>
                                        <th>Cost</th>
                                        <th className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSessions.map(session => (
                                        <tr key={session.id}>
                                            <td>
                                                <div className="fw-bold">{session.topic}</div>
                                                <div className="small text-muted">{session.category}</div>
                                            </td>
                                            <td>
                                                <div className="d-flex flex-column small">
                                                    <span><i className="bi bi-person-video3 me-1 text-primary"></i> {session.host}</span>
                                                    <span><i className="bi bi-person-video2 me-1 text-success"></i> {session.student}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="small">
                                                    <div>{session.date}</div>
                                                    <div className="text-muted">{session.time}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge ${
                                                    session.status === 'Upcoming' ? 'bg-info-subtle text-info' :
                                                    session.status === 'Ongoing' ? 'bg-success-subtle text-success' :
                                                    session.status === 'Completed' ? 'bg-secondary-subtle text-secondary' :
                                                    'bg-danger-subtle text-danger'
                                                }`}>
                                                    {session.status}
                                                </span>
                                            </td>
                                            <td className="fw-bold">{session.cost} GP</td>
                                            <td className="text-end">
                                                {session.status === 'Upcoming' && (
                                                    <button className="btn btn-sm btn-outline-danger me-2" onClick={() => handleCancelSession(session.id)} title="Cancel Session">
                                                        <i className="bi bi-x-lg"></i>
                                                    </button>
                                                )}
                                                {session.status === 'Ongoing' && (
                                                    <button className="btn btn-sm btn-outline-success me-2" onClick={() => handleMarkCompleted(session.id)} title="Mark Completed">
                                                        <i className="bi bi-check-lg"></i>
                                                    </button>
                                                )}
                                                {session.status === 'Completed' && session.rating > 0 && (
                                                    <span className="badge bg-warning text-dark"><i className="bi bi-star-fill me-1"></i>{session.rating}</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </ScrollReveal>
        </div>
    );
};

export default SessionManagement;
