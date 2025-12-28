import React, { useState, useEffect } from 'react';
import UserProfile from '../components/Profile';
import { API_BASE_URL } from '../config';

const SessionsTab = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSessions = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`${API_BASE_URL}/sessions/my`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setSessions(data);
                }
            } catch (error) {
                console.error("Failed to fetch sessions", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, []);

    return (
        <div className="glass-card p-4">
            <h3 className="h5 mb-4" style={{ color: 'var(--text-main)' }}>My Sessions</h3>
            {loading ? (
                <div className="text-center text-muted">Loading sessions...</div>
            ) : (
                <>
                    {sessions.length === 0 ? (
                        <p className="text-center text-muted">No sessions found.</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-borderless" style={{ color: 'var(--text-main)' }}>
                                <thead>
                                    <tr className="border-bottom border-secondary-subtle">
                                        <th>Topic</th>
                                        <th>With</th>
                                        <th>Time</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sessions.map(session => (
                                        <tr key={session.id} className="align-middle">
                                            <td className="py-3">
                                                <div className="fw-bold">{session.title || session.topic}</div>
                                                <div className="small text-muted">{session.description}</div>
                                            </td>
                                            <td>{session.otherParty}</td>
                                            <td>{new Date(session.time).toLocaleString()}</td>
                                            <td>
                                                <span className={`badge rounded-pill ${
                                                    session.status === 'Confirmed' ? 'bg-success' : 
                                                    session.status === 'Completed' ? 'bg-secondary' : 
                                                    session.status === 'Open' ? 'bg-info' : 'bg-warning'
                                                }`}>
                                                    {session.status}
                                                </span>
                                            </td>
                                            <td>
                                                {session.status === 'Confirmed' && (
                                                    <button className="btn btn-sm btn-primary rounded-pill px-3" onClick={() => alert('Joining room...')}>
                                                        Join
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

const WalletTab = ({ user }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`${API_BASE_URL}/transactions/my`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setTransactions(data);
                }
            } catch (error) {
                console.error("Failed to fetch transactions", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    return (
        <div>
            <div className="row g-4 mb-4">
                <div className="col-md-4">
                    <div className="glass-card p-4 text-center h-100 d-flex flex-column justify-content-center">
                        <div className="text-muted text-uppercase small fw-bold mb-2">Total Balance</div>
                        <div className="display-6 fw-bold mb-0" style={{ color: 'var(--text-main)' }}>{user?.gridPoints || 0} <span className="fs-6 text-muted">GP</span></div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="glass-card p-4 text-center h-100 d-flex flex-column justify-content-center">
                        <div className="text-muted text-uppercase small fw-bold mb-2">Escrow (Locked)</div>
                        <div className="display-6 fw-bold mb-0 text-warning">{user?.lockedPoints || 0} <span className="fs-6 text-muted">GP</span></div>
                        <div className="small text-muted mt-2">Pending session completion</div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="glass-card p-4 text-center h-100 d-flex flex-column justify-content-center">
                        <div className="text-muted text-uppercase small fw-bold mb-2">Lifetime Earned</div>
                        <div className="display-6 fw-bold mb-0 text-success">-- <span className="fs-6 text-muted">GP</span></div>
                    </div>
                </div>
            </div>

            <div className="glass-card p-4">
                <h3 className="h5 mb-3" style={{ color: 'var(--text-main)' }}>Transaction History</h3>
                {loading ? (
                    <div className="text-center text-muted">Loading transactions...</div>
                ) : (
                    <div className="table-responsive">
                        {transactions.length === 0 ? (
                            <p className="text-center text-muted">No transactions found.</p>
                        ) : (
                            <table className="table mb-0" style={{ color: 'var(--text-main)' }}>
                                <thead style={{ background: 'var(--bg-card-hover)' }}>
                                    <tr>
                                        <th className="p-3" style={{ borderColor: 'var(--border-color)' }}>Date</th>
                                        <th className="p-3" style={{ borderColor: 'var(--border-color)' }}>Description</th>
                                        <th className="p-3" style={{ borderColor: 'var(--border-color)' }}>Type</th>
                                        <th className="p-3 text-end" style={{ borderColor: 'var(--border-color)' }}>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map(tx => (
                                        <tr key={tx.id}>
                                            <td className="p-3" style={{ borderColor: 'var(--border-color)' }}>{new Date(tx.timestamp).toLocaleDateString()}</td>
                                            <td className="p-3" style={{ borderColor: 'var(--border-color)' }}>
                                                {tx.type === 'Earned' ? `Taught ${tx.otherPartyName || 'Peer'}` : `Paid ${tx.otherPartyName || 'Peer'}`} - {tx.skill}
                                            </td>
                                            <td className="p-3" style={{ borderColor: 'var(--border-color)' }}>
                                                <span className={`badge ${tx.type === 'Earned' ? 'bg-success' : 'bg-danger'}`}>
                                                    {tx.type}
                                                </span>
                                            </td>
                                            <td className={`p-3 text-end fw-bold ${tx.type === 'Earned' ? 'text-success' : 'text-danger'}`} style={{ borderColor: 'var(--border-color)' }}>
                                                {tx.type === 'Earned' ? '+' : '-'}{tx.points} GP
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const Profile = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError("Please log in to view your profile.");
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/users/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                } else {
                    let errorMessage = response.statusText;
                    try {
                        const errorText = await response.text();
                        if (errorText) errorMessage = errorText;
                    } catch (e) { /* ignore */ }
                    
                    setError(`Failed to load profile: ${errorMessage}`);
                    
                    if (response.status === 401) {
                        localStorage.removeItem('token');
                    }
                }
            } catch (error) {
                console.error("Failed to fetch user", error);
                setError("Network error. Please try again later.");
            }
        };

        fetchUser();
    }, []);

    if (error) return (
        <div className="text-center py-5">
            <div className="alert alert-danger d-inline-block">{error}</div>
        </div>
    );

    if (!user) return <div className="text-center py-5">Loading profile...</div>;

    return (
        <div className="container-fluid px-5 py-5">
            <div className="row g-4">
                <div className="col-lg-4">
                    <UserProfile user={user} />
                </div>
                <div className="col-lg-8">
                    {/* Tabs Navigation */}
                    <div className="d-flex gap-3 mb-4">
                        <button 
                            className={`btn rounded-pill px-4 ${activeTab === 'overview' ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => setActiveTab('overview')}
                            style={activeTab === 'overview' ? { background: 'var(--accent-primary)', border: 'none' } : { color: 'var(--text-muted)', borderColor: 'var(--border-color)' }}
                        >
                            Overview
                        </button>
                        <button 
                            className={`btn rounded-pill px-4 ${activeTab === 'sessions' ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => setActiveTab('sessions')}
                            style={activeTab === 'sessions' ? { background: 'var(--accent-primary)', border: 'none' } : { color: 'var(--text-muted)', borderColor: 'var(--border-color)' }}
                        >
                            Sessions
                        </button>
                        <button 
                            className={`btn rounded-pill px-4 ${activeTab === 'wallet' ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => setActiveTab('wallet')}
                            style={activeTab === 'wallet' ? { background: 'var(--accent-primary)', border: 'none' } : { color: 'var(--text-muted)', borderColor: 'var(--border-color)' }}
                        >
                            Wallet
                        </button>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'overview' && (
                        <div className="glass-card p-4 h-100">
                            <h2 className="section-title">My Activity</h2>
                            <div className="row g-4 mb-4">
                                <div className="col-md-4">
                                    <div className="p-3 rounded border" style={{ background: 'var(--bg-card-hover)', borderColor: 'var(--border-color)' }}>
                                        <div className="text-muted small text-uppercase">Hours Taught</div>
                                        <div className="h2 mb-0" style={{ color: 'var(--text-main)' }}>{user.hoursTaught || 0}</div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="p-3 rounded border" style={{ background: 'var(--bg-card-hover)', borderColor: 'var(--border-color)' }}>
                                        <div className="text-muted small text-uppercase">Sessions</div>
                                        <div className="h2 mb-0" style={{ color: 'var(--text-main)' }}>{user.totalSessions || 0}</div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="p-3 rounded border" style={{ background: 'var(--bg-card-hover)', borderColor: 'var(--border-color)' }}>
                                        <div className="text-muted small text-uppercase">Rating</div>
                                        <div className="h2 mb-0" style={{ color: 'var(--text-main)' }}>{user.averageRating || 'N/A'}</div>
                                    </div>
                                </div>
                            </div>

                            <h3 className="h5 mb-3" style={{ color: 'var(--text-main)' }}>Verified Endorsements</h3>
                            <div className="d-flex gap-3 mb-4 flex-wrap">
                                {user.badges && user.badges.length > 0 ? (
                                    user.badges.map((badge, index) => (
                                        <div key={index} className="badge-card px-3 py-2 rounded-pill d-flex align-items-center gap-2" style={{ 
                                            border: badge === 'Verified Peer' ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)', 
                                            background: badge === 'Verified Peer' ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-card-hover)', 
                                            color: badge === 'Verified Peer' ? 'var(--accent-primary)' : 'var(--text-muted)' 
                                        }}>
                                            <i className={`bi ${badge === 'Verified Peer' ? 'bi-patch-check-fill' : 'bi-patch-check'}`}></i>
                                            <span className="fw-medium">{badge}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-muted small">No endorsements yet. Complete 5 sessions with high ratings to get verified!</div>
                                )}
                            </div>
                            
                            <h3 className="h5 mb-3" style={{ color: 'var(--text-main)' }}>Recent Sessions</h3>
                            <div className="list-group">
                                {user.recentSessions && user.recentSessions.length > 0 ? (
                                    user.recentSessions.map(session => (
                                        <div key={session.id} className="list-group-item d-flex justify-content-between align-items-center" style={{ background: 'transparent', borderColor: 'var(--border-color)' }}>
                                            <div>
                                                <div className="fw-bold" style={{ color: 'var(--text-main)' }}>{session.topic}</div>
                                                <div className="small text-muted">with {session.otherParty} • {new Date(session.time).toLocaleDateString()}</div>
                                            </div>
                                            <span className={`badge ${session.status === 'Completed' ? 'bg-success' : 'bg-secondary'}`}>{session.status}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-muted small">No recent sessions found.</div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'sessions' && <SessionsTab />}
                    
                    {activeTab === 'wallet' && <WalletTab user={user} />}
                </div>
            </div>
        </div>
    );
};

export default Profile;
