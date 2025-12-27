import React from 'react';
import Portfolio from '../components/Portfolio';

const Profile = () => {
    return (
        <div className="container-fluid px-5 py-5">
            <div className="row g-4">
                <div className="col-lg-4">
                    <Portfolio />
                </div>
                <div className="col-lg-8">
                    <div className="glass-card p-4 h-100">
                        <h2 className="section-title">My Activity</h2>
                        <div className="row g-4 mb-4">
                            <div className="col-md-4">
                                <div className="p-3 rounded border" style={{ background: 'var(--bg-card-hover)', borderColor: 'var(--border-color)' }}>
                                    <div className="text-muted small text-uppercase">Hours Taught</div>
                                    <div className="h2 mb-0" style={{ color: 'var(--text-main)' }}>24.5</div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="p-3 rounded border" style={{ background: 'var(--bg-card-hover)', borderColor: 'var(--border-color)' }}>
                                    <div className="text-muted small text-uppercase">Sessions</div>
                                    <div className="h2 mb-0" style={{ color: 'var(--text-main)' }}>12</div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="p-3 rounded border" style={{ background: 'var(--bg-card-hover)', borderColor: 'var(--border-color)' }}>
                                    <div className="text-muted small text-uppercase">Rating</div>
                                    <div className="h2 mb-0" style={{ color: 'var(--text-main)' }}>4.9</div>
                                </div>
                            </div>
                        </div>

                        <h3 className="h5 mb-3" style={{ color: 'var(--text-main)' }}>Verified Endorsements</h3>
                        <div className="d-flex gap-3 mb-4 flex-wrap">
                            <div className="badge-card px-3 py-2 rounded-pill d-flex align-items-center gap-2" style={{ border: '1px solid var(--accent-primary)', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)' }}>
                                <i className="bi bi-patch-check-fill"></i>
                                <span className="fw-medium">Verified C# Tutor</span>
                            </div>
                            <div className="badge-card px-3 py-2 rounded-pill d-flex align-items-center gap-2" style={{ border: '1px solid var(--border-color)', background: 'var(--bg-card-hover)', color: 'var(--text-muted)' }}>
                                <i className="bi bi-patch-check"></i>
                                <span className="fw-medium">React Specialist (Pending)</span>
                            </div>
                        </div>
                        
                        <h3 className="h5 mb-3" style={{ color: 'var(--text-main)' }}>Recent Sessions</h3>
                        <div className="list-group">
                            <div className="list-group-item d-flex justify-content-between align-items-center" style={{ background: 'transparent', borderColor: 'var(--border-color)' }}>
                                <div>
                                    <div className="fw-bold" style={{ color: 'var(--text-main)' }}>React Hooks Masterclass</div>
                                    <div className="small text-muted">with John Doe • 2 hours ago</div>
                                </div>
                                <span className="badge bg-success">Completed</span>
                            </div>
                            <div className="list-group-item d-flex justify-content-between align-items-center" style={{ background: 'transparent', borderColor: 'var(--border-color)' }}>
                                <div>
                                    <div className="fw-bold" style={{ color: 'var(--text-main)' }}>Advanced CSS Grid</div>
                                    <div className="small text-muted">with Jane Smith • Yesterday</div>
                                </div>
                                <span className="badge bg-success">Completed</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
