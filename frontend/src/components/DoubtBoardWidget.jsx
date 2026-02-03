import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import GlassCard from './GlassCard';
import { API_BASE_URL } from '../config';
import './DoubtBoardWidget.css';

const DoubtBoardWidget = ({ doubts, onRefresh, user }) => {
    const [selectedBounty, setSelectedBounty] = useState(null);
    const [loading, setLoading] = useState(false);
    const bountyList = doubts || [];

    const handleAccept = async () => {
        // Modal serves as confirmation

        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${API_BASE_URL}/sessions/accept/${selectedBounty.id}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                toast.success('Challenge accepted! You can now start the session from your dashboard.');
                setSelectedBounty(null);
                if (onRefresh) onRefresh();
            } else {
                const data = await response.json();
                toast.error(data.message || 'Failed to accept challenge');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <GlassCard className="doubt-board-container p-4">
            <h2 className="section-title">Doubt Board</h2>
            <div className="bounty-grid">
                {bountyList.map(bounty => (
                    <div key={bounty.id} className="bounty-card" onClick={() => setSelectedBounty(bounty)}>
                        <div className="bounty-header">
                            <h3 className="bounty-title">{bounty.title}</h3>
                            <span className="bounty-points">+{bounty.points} GP</span>
                        </div>
                        <p className="bounty-desc">{bounty.description}</p>
                        <div className="bounty-tags">
                            {bounty.tags && bounty.tags.map(tag => <span key={tag} className="bounty-tag">{tag}</span>)}
                        </div>
                    </div>
                ))}
                {bountyList.length === 0 && <p className="text-muted text-center w-100">No active doubts.</p>}
            </div>

            {selectedBounty && createPortal(
                <div className="modal-overlay" onClick={() => setSelectedBounty(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header-hero">
                            <span className="modal-points-hero">{selectedBounty.points}</span>
                            <span className="modal-points-label">Grid Points Reward</span>
                        </div>
                        
                        <div className="modal-body">
                            <h3 className="modal-title">{selectedBounty.title}</h3>
                            <div className="modal-tags">
                                {selectedBounty.tags && selectedBounty.tags.map(tag => (
                                    <span key={tag} className="bounty-tag">{tag}</span>
                                ))}
                            </div>
                            <p className="modal-desc">{selectedBounty.description}</p>
                            
                            <div className="learner-info">
                                <span className="text-muted small">Posted by </span>
                                <span className="learner-name">{selectedBounty.learner || 'Anonymous'}</span>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button 
                                onClick={handleAccept} 
                                className={`btn-accept ${loading ? 'loading' : ''}`} 
                                disabled={loading || (user && user.id === selectedBounty.learnerId)}
                                style={{ 
                                    opacity: (user && user.id === selectedBounty.learnerId) ? 0.5 : 1,
                                    cursor: (user && user.id === selectedBounty.learnerId) ? 'not-allowed' : 'pointer'
                                }}
                                title={(user && user.id === selectedBounty.learnerId) ? "You cannot accept your own challenge" : ""}
                            >
                                {loading ? (
                                    <span className="d-flex align-items-center justify-content-center gap-2">
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        Accepting...
                                    </span>
                                ) : (user && user.id === selectedBounty.learnerId) ? 'Your Challenge' : 'Accept Challenge'}
                            </button>
                            <button onClick={() => setSelectedBounty(null)} className="btn-close" disabled={loading}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </GlassCard>
    );
};

export default DoubtBoardWidget;
