import React, { useState, useEffect, useCallback } from 'react';
import DoubtBoardWidget from '../components/DoubtBoardWidget';
import ScrollReveal from '../components/ScrollReveal';
import CreateDoubtModal from '../components/CreateDoubtModal';
import { API_BASE_URL } from '../config';

const DoubtBoard = () => {
    const [doubts, setDoubts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const fetchDoubts = useCallback(async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/sessions/doubts`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setDoubts(data);
            }
        } catch (error) {
            console.error("Failed to fetch doubts", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDoubts();
    }, [fetchDoubts]);

    return (
        <div className="container-fluid px-4 px-md-5 py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="display-5 fw-bold mb-0" style={{ color: 'var(--text-main)', letterSpacing: '-0.03em' }}>Doubt Board</h2>
                <button 
                    className="btn btn-primary px-4 py-2 rounded-pill fw-bold" 
                    style={{ background: 'var(--text-main)', color: 'var(--bg-primary)', border: 'none' }}
                    onClick={() => setShowModal(true)}
                >
                    Post a Doubt
                </button>
            </div>
            
            <div className="row g-4">
                <div className="col-lg-8">
                    <ScrollReveal width="100%">
                        {loading ? (
                            <div className="text-center text-muted">Loading doubts...</div>
                        ) : (
                            <DoubtBoardWidget doubts={doubts} onRefresh={fetchDoubts} />
                        )}
                    </ScrollReveal>
                </div>
                <div className="col-lg-4">
                    <div className="glass-card p-4">
                        <h4 className="mb-3" style={{ color: 'var(--text-main)' }}>Top Solvers</h4>
                        <div className="d-flex align-items-center gap-3 mb-3">
                            <div className="rounded-circle d-flex align-items-center justify-content-center bg-warning bg-opacity-25" style={{ width: '40px', height: '40px', fontSize: '1.2rem' }}>🏆</div>
                            <div>
                                <div style={{ color: 'var(--text-main)', fontWeight: '600' }}>Alex Chen</div>
                                <div className="small text-muted">1500 GP Earned</div>
                            </div>
                        </div>
                        <div className="d-flex align-items-center gap-3 mb-3">
                            <div className="rounded-circle d-flex align-items-center justify-content-center bg-secondary bg-opacity-25" style={{ width: '40px', height: '40px', fontSize: '1.2rem' }}>🥈</div>
                            <div>
                                <div style={{ color: 'var(--text-main)', fontWeight: '600' }}>Sarah Jones</div>
                                <div className="small text-muted">1200 GP Earned</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <CreateDoubtModal 
                    onClose={() => setShowModal(false)} 
                    onSuccess={fetchDoubts} 
                />
            )}
        </div>
    );
};

export default DoubtBoard;
