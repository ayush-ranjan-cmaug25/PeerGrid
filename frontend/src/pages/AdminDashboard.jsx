import React from 'react';
import ScrollReveal from '../components/ScrollReveal';

const AdminDashboard = () => {
    return (
        <div className="container-fluid px-5 py-5">
            <h2 className="section-title mb-4">Admin Dashboard</h2>
            
            {/* Stats Overview */}
            <div className="row g-4 mb-5">
                <div className="col-md-3">
                    <ScrollReveal width="100%">
                        <div className="glass-card p-4 text-center">
                            <div className="text-muted text-uppercase small fw-bold mb-2">Total Users</div>
                            <div className="display-4 fw-bold mb-0" style={{ color: 'var(--text-main)' }}>1,240</div>
                        </div>
                    </ScrollReveal>
                </div>
                <div className="col-md-3">
                    <ScrollReveal width="100%">
                        <div className="glass-card p-4 text-center">
                            <div className="text-muted text-uppercase small fw-bold mb-2">Active Sessions</div>
                            <div className="display-4 fw-bold mb-0 text-success">45</div>
                        </div>
                    </ScrollReveal>
                </div>
                <div className="col-md-3">
                    <ScrollReveal width="100%">
                        <div className="glass-card p-4 text-center">
                            <div className="text-muted text-uppercase small fw-bold mb-2">Total Disputes</div>
                            <div className="display-4 fw-bold mb-0 text-warning">3</div>
                        </div>
                    </ScrollReveal>
                </div>
                <div className="col-md-3">
                    <ScrollReveal width="100%">
                        <div className="glass-card p-4 text-center">
                            <div className="text-muted text-uppercase small fw-bold mb-2">System Health</div>
                            <div className="display-4 fw-bold mb-0 text-success">98%</div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>

            {/* User Management Section */}
            <div className="row g-4">
                <div className="col-lg-8">
                    <ScrollReveal width="100%">
                        <div className="glass-card p-4">
                            <h3 className="h5 mb-4" style={{ color: 'var(--text-main)' }}>Recent User Registrations</h3>
                            <table className="table mb-0" style={{ color: 'var(--text-main)' }}>
                                <thead style={{ background: 'var(--bg-card-hover)' }}>
                                    <tr>
                                        <th className="p-3" style={{ borderColor: 'var(--border-color)' }}>User</th>
                                        <th className="p-3" style={{ borderColor: 'var(--border-color)' }}>Role</th>
                                        <th className="p-3" style={{ borderColor: 'var(--border-color)' }}>Status</th>
                                        <th className="p-3 text-end" style={{ borderColor: 'var(--border-color)' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="p-3" style={{ borderColor: 'var(--border-color)' }}>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="user-avatar" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>JD</div>
                                                John Doe
                                            </div>
                                        </td>
                                        <td className="p-3" style={{ borderColor: 'var(--border-color)' }}>Student</td>
                                        <td className="p-3" style={{ borderColor: 'var(--border-color)' }}><span className="badge bg-success">Active</span></td>
                                        <td className="p-3 text-end" style={{ borderColor: 'var(--border-color)' }}>
                                            <button className="btn btn-sm btn-outline-danger">Ban</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="p-3" style={{ borderColor: 'var(--border-color)' }}>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="user-avatar" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>AS</div>
                                                Alice Smith
                                            </div>
                                        </td>
                                        <td className="p-3" style={{ borderColor: 'var(--border-color)' }}>Teacher</td>
                                        <td className="p-3" style={{ borderColor: 'var(--border-color)' }}><span className="badge bg-warning text-dark">Pending</span></td>
                                        <td className="p-3 text-end" style={{ borderColor: 'var(--border-color)' }}>
                                            <button className="btn btn-sm btn-outline-success me-2">Approve</button>
                                            <button className="btn btn-sm btn-outline-danger">Reject</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </ScrollReveal>
                </div>
                
                {/* System Actions */}
                <div className="col-lg-4">
                    <ScrollReveal width="100%">
                        <div className="glass-card p-4">
                            <h3 className="h5 mb-4" style={{ color: 'var(--text-main)' }}>Quick Actions</h3>
                            <div className="d-grid gap-3">
                                <button className="btn btn-outline-light text-start p-3 d-flex align-items-center gap-3">
                                    <i className="bi bi-broadcast"></i> Broadcast Announcement
                                </button>
                                <button className="btn btn-outline-light text-start p-3 d-flex align-items-center gap-3">
                                    <i className="bi bi-shield-exclamation"></i> Review Reports
                                </button>
                                <button className="btn btn-outline-light text-start p-3 d-flex align-items-center gap-3">
                                    <i className="bi bi-gear"></i> Platform Settings
                                </button>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
