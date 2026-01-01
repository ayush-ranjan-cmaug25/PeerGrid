import React, { useState, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import PaymentButton from '../components/PaymentButton';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import UserProfile from '../components/Profile';
import { API_BASE_URL } from '../config';
import GlassCard from '../components/GlassCard';


const AVAILABLE_SKILLS = [
    "Python", "Java", "C#", "JavaScript", "TypeScript", "React", "Angular", "Vue", 
    "Node.js", "SQL", "NoSQL", "Docker", "Kubernetes", "AWS", "Azure", "GCP", 
    "Machine Learning", "Data Science", "Cybersecurity", "Blockchain", "Mobile Dev", 
    "Flutter", "React Native", "Swift", "Kotlin", "HTML", "CSS", "Git", "Linux"
];



const Modal = ({ title, children, onClose, onSubmit, actionLabel = "Save" }) => (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1050, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)' }}>
        <GlassCard className="p-4 w-100" style={{ maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0 fw-bold" style={{ color: 'var(--text-main)' }}>{title}</h4>
                <button className="btn btn-link text-muted p-0" onClick={onClose}><i className="bi bi-x-lg"></i></button>
            </div>
            <div className="mb-4">
                {children}
            </div>
            <div className="d-flex justify-content-end gap-2">
                <button className="btn btn-outline-secondary rounded-pill px-4" onClick={onClose}>Cancel</button>
                <button className="btn btn-primary rounded-pill px-4" onClick={onSubmit} style={{ background: 'var(--accent-primary)', border: 'none' }}>{actionLabel}</button>
            </div>
        </GlassCard>
    </div>
);

const SkillsEditModal = ({ title, currentSkills, onClose, onSave }) => {
    const [skills, setSkills] = useState([...currentSkills]);
    const [selectedSkill, setSelectedSkill] = useState('');

    const handleAdd = () => {
        if (selectedSkill && !skills.includes(selectedSkill)) {
            setSkills([...skills, selectedSkill]);
            setSelectedSkill('');
        }
    };

    const handleRemove = (skillToRemove) => {
        setSkills(skills.filter(s => s !== skillToRemove));
    };

    return (
        <Modal title={title} onClose={onClose} onSubmit={() => onSave(skills)}>
            <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Current Skills</label>
                <div className="d-flex flex-wrap gap-2 mb-3">
                    {skills.map(skill => (
                        <span key={skill} className="badge rounded-pill bg-light text-dark border d-flex align-items-center gap-2 px-3 py-2">
                            {skill}
                            <i className="bi bi-x-circle-fill text-muted" style={{ cursor: 'pointer' }} onClick={() => handleRemove(skill)}></i>
                        </span>
                    ))}
                    {skills.length === 0 && <span className="text-muted small">No skills added yet.</span>}
                </div>
            </div>
            <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Add New Skill</label>
                <div className="d-flex gap-2">
                    <select className="form-select" value={selectedSkill} onChange={e => setSelectedSkill(e.target.value)}>
                        <option value="">Select a skill...</option>
                        {AVAILABLE_SKILLS.filter(s => !skills.includes(s)).map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                    <button className="btn btn-outline-primary" onClick={handleAdd} disabled={!selectedSkill}>Add</button>
                </div>
            </div>
        </Modal>
    );
};

const BookSessionModal = ({ user, onClose, onBook }) => {
    const [formData, setFormData] = useState({
        topic: '',
        date: '',
        time: '',
        cost: 50 // Default cost
    });

    const handleSubmit = () => {

        if (!formData.topic) {
            toast.error("Please select a topic.");
            return;
        }
        if (!formData.date || !formData.time) {
            toast.error("Please select both date and time.");
            return;
        }
        if (formData.cost <= 0) {
            toast.error("Cost must be greater than 0.");
            return;
        }

        let startTime = new Date();
        if (formData.date && formData.time) {
            startTime = new Date(`${formData.date}T${formData.time}`);
            if (startTime < new Date()) {
                toast.error("Please select a future date and time.");
                return;
            }
        }
        
        onBook({
            ...formData,
            startTime: startTime.toISOString()
        });
    };

    return (
        <Modal title={`Book Session with ${user.name}`} onClose={onClose} onSubmit={handleSubmit} actionLabel="Book Now">
            <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Topic</label>
                <select className="form-select" value={formData.topic} onChange={e => setFormData({...formData, topic: e.target.value})}>
                    <option value="">Select a topic...</option>
                    {user.skillsOffered?.map(skill => (
                        <option key={skill} value={skill}>{skill}</option>
                    ))}
                </select>
            </div>
            <div className="row g-2 mb-3">
                <div className="col-6">
                    <label className="form-label small fw-bold text-muted">Date</label>
                    <input type="date" className="form-control" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div className="col-6">
                    <label className="form-label small fw-bold text-muted">Time</label>
                    <input type="time" className="form-control" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                </div>
            </div>
            <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Proposed Cost (GP)</label>
                <input type="number" className="form-control" value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} />
            </div>
        </Modal>
    );
};

const RateSessionModal = ({ session, onClose, onRate }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const handleSubmit = () => {
        if (comment && comment.length < 5) {
            toast.error("Comment must be at least 5 characters long.");
            return;
        }
        onRate(rating, comment);
    };

    return (
        <Modal title="Rate Session" onClose={onClose} onSubmit={handleSubmit} actionLabel="Submit Review">
            <p className="text-muted mb-4">How was your session on <strong>{session.topic}</strong>?</p>
            <div className="d-flex justify-content-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} className="btn p-0 border-0" onClick={() => setRating(star)} style={{ fontSize: '2rem', color: star <= rating ? '#fbbf24' : '#e5e7eb' }}>
                        <i className={`bi ${star <= rating ? 'bi-star-fill' : 'bi-star'}`}></i>
                    </button>
                ))}
            </div>
            <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Comment (Optional)</label>
                <textarea className="form-control" rows="3" value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your experience..."></textarea>
            </div>
        </Modal>
    );
};



const SessionsTab = ({ onComplete }) => {
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
                                                    <div className="d-flex gap-2">
                                                        <button className="btn btn-sm btn-primary rounded-pill px-3" onClick={() => toast.success('Joining room...')}>
                                                            Join
                                                        </button>
                                                        <button className="btn btn-sm btn-outline-success rounded-pill px-3" onClick={() => onComplete(session)}>
                                                            Complete
                                                        </button>
                                                    </div>
                                                )}
                                                {session.status === 'Completed' && (
                                                    <span className="text-muted small"><i className="bi bi-check-all me-1"></i>Done</span>
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

            <div className="glass-card p-4 mb-4">
                <h3 className="h5 mb-3" style={{ color: 'var(--text-main)' }}>Buy Grid Points</h3>
                <div className="d-flex gap-3 flex-wrap">
                    <PaymentButton amount={100} onSuccess={() => window.location.reload()} />
                    <PaymentButton amount={500} onSuccess={() => window.location.reload()} />
                    <PaymentButton amount={1000} onSuccess={() => window.location.reload()} />
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
    const { id } = useParams();
    const navigate = useNavigate();
    const { openChat } = useChat();
    const [activeTab, setActiveTab] = useState('overview');
    const [user, setUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [error, setError] = useState(null);
    

    const [showOfferedModal, setShowOfferedModal] = useState(false);
    const [showNeededModal, setShowNeededModal] = useState(false);
    const [showBookModal, setShowBookModal] = useState(false);
    const [showRateModal, setShowRateModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError("Please log in to view profiles.");
                return;
            }

            try {
                const meResponse = await fetch(`${API_BASE_URL}/users/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (meResponse.ok) {
                    const meData = await meResponse.json();
                    setCurrentUser(meData);

                    if (!id || id == meData.id) {
                        setUser(meData);
                    } else {
                        const otherResponse = await fetch(`${API_BASE_URL}/users/${id}`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        if (otherResponse.ok) {
                            setUser(await otherResponse.json());
                        } else {
                            setError("User not found");
                        }
                    }
                } else {
                    setError("Failed to authenticate");
                }
            } catch (error) {
                console.error("Failed to fetch user", error);
                setError("Network error. Please try again later.");
            }
        };

        fetchUser();
    }, [id]);

    const handleUpdateProfile = async (updatedData) => {
        const token = localStorage.getItem('token');
        try {
            const payload = {
                ...user,
                ...updatedData
            };

            const response = await fetch(`${API_BASE_URL}/users/me`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data);
                setCurrentUser(data);
                return true;
            } else {
                toast.error("Failed to update profile");
                return false;
            }
        } catch (error) {
            console.error("Update error", error);
            toast.error("Error updating profile");
            return false;
        }
    };

    const handlePhotoUpload = async (file) => {
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const base64String = reader.result;
            await handleUpdateProfile({ profilePictureUrl: base64String });
        };
        reader.onerror = (error) => {
            console.error('Error: ', error);
            toast.error("Failed to process image");
        };
    };

    const handleSkillsOfferedUpdate = async (newSkills) => {
        const success = await handleUpdateProfile({ skillsOffered: newSkills });
        if (success) setShowOfferedModal(false);
    };

    const handleSkillsNeededUpdate = async (newSkills) => {
        const success = await handleUpdateProfile({ skillsNeeded: newSkills });
        if (success) setShowNeededModal(false);
    };

    const handleBookSession = async (bookingData) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/sessions/book`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    learnerId: currentUser.id,
                    tutorId: user.id,
                    cost: bookingData.cost,
                    topic: bookingData.topic,
                    startTime: bookingData.startTime
                })
            });

            if (response.ok) {
                setShowBookModal(false);
                toast.success("Session booked successfully!");
            } else {
                const data = await response.json();
                toast.error(data.message || "Failed to book session");
            }
        } catch (error) {
            console.error("Booking error", error);
            toast.error("Error booking session");
        }
    };

    const handleCompleteSession = (session) => {
        setSelectedSession(session);
        setShowRateModal(true);
    };

    const handleRateSession = async (rating, comment) => {
        const token = localStorage.getItem('token');
        try {
            const completeResponse = await fetch(`${API_BASE_URL}/sessions/complete`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    learnerId: selectedSession.learnerId || currentUser.id, 
                    tutorId: selectedSession.tutorId || (selectedSession.otherPartyId),
                    cost: selectedSession.cost
                })
            });

            if (!completeResponse.ok) {
                const err = await completeResponse.json();
                throw new Error(err.message || "Failed to complete session");
            }

            const completeData = await completeResponse.json();
            const transactionId = completeData.transactionId;

            if (transactionId) {
                const rateResponse = await fetch(`${API_BASE_URL}/sessions/rate`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                    },
                    body: JSON.stringify({
                        transactionId: transactionId,
                        rating: rating
                    })
                });
                
                if (!rateResponse.ok) {
                     console.warn("Rating failed but completion succeeded");
                }
            }

            setShowRateModal(false);
            toast.success("Session completed and rated!");
            window.location.reload(); 

        } catch (error) {
            console.error("Rating error", error);
            toast.error(`Error: ${error.message}`);
        }
    };

    if (error) return (
        <div className="text-center py-5">
            <div className="alert alert-danger d-inline-block">{error}</div>
        </div>
    );

    if (!user) return <div className="text-center py-5">Loading profile...</div>;

    const isOwnProfile = currentUser && user && (user.id == currentUser.id);

    return (
        <div className="container-fluid px-5 py-5">
            <div className="row g-4">
                <div className="col-lg-4">
                    <UserProfile 
                        user={user} 
                        isOwnProfile={isOwnProfile} 
                        onEditPhoto={handlePhotoUpload}
                        onEditSkillsOffered={() => setShowOfferedModal(true)}
                        onEditSkillsNeeded={() => setShowNeededModal(true)}
                        onBook={() => setShowBookModal(true)} 
                        onMessage={() => openChat(user)}
                    />
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
                        {isOwnProfile && (
                            <>
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
                            </>
                        )}
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'overview' && (
                        <div className="glass-card p-4 h-100">
                            <h2 className="section-title">Activity</h2>
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
                                    <div className="text-muted small">No endorsements yet.</div>
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

                    {activeTab === 'sessions' && isOwnProfile && <SessionsTab onComplete={handleCompleteSession} />}
                    
                    {activeTab === 'wallet' && isOwnProfile && <WalletTab user={user} />}
                </div>
            </div>


            {showOfferedModal && (
                <SkillsEditModal 
                    title="Edit Skills Offered" 
                    currentSkills={user.skillsOffered || []} 
                    onClose={() => setShowOfferedModal(false)} 
                    onSave={handleSkillsOfferedUpdate} 
                />
            )}
            {showNeededModal && (
                <SkillsEditModal 
                    title="Edit Skills Needed" 
                    currentSkills={user.skillsNeeded || []} 
                    onClose={() => setShowNeededModal(false)} 
                    onSave={handleSkillsNeededUpdate} 
                />
            )}
            {showBookModal && <BookSessionModal user={user} onClose={() => setShowBookModal(false)} onBook={handleBookSession} />}
            {showRateModal && <RateSessionModal session={selectedSession} onClose={() => setShowRateModal(false)} onRate={handleRateSession} />}
        </div>
    );
};

export default Profile;
