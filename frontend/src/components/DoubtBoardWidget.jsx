import React, { useState } from 'react';
import toast from 'react-hot-toast';
import GlassCard from './GlassCard';
import { API_BASE_URL } from '../config';
import './DoubtBoardWidget.css';

const DoubtBoardWidget = ({ doubts, onRefresh }) => {
    const [selectedBounty, setSelectedBounty] = useState(null);
    const [loading, setLoading] = useState(false);
    const bountyList = doubts || [];

    const handleAccept = async () => {
        if (!selectedBounty) return;
        
        if (!window.confirm(`Are you sure you want to accept "${selectedBounty.title}" for ${selectedBounty.points} GP?`)) {
            return;
        }

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

            {selectedBounty && (
                <div className="modal-overlay" onClick={() => setSelectedBounty(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h3 className="modal-title">{selectedBounty.title}</h3>
                        <p className="modal-desc">{selectedBounty.description}</p>
                        <div className="modal-footer">
                            <span className="modal-points">{selectedBounty.points} Grid Points Reward</span>
                        </div>
                        <div className="modal-actions">
                            <button onClick={handleAccept} className="btn-accept" disabled={loading}>
                                {loading ? 'Accepting...' : 'Accept Challenge'}
                            </button>
                            <button onClick={() => setSelectedBounty(null)} className="btn-close">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </GlassCard>
    );
};

export default DoubtBoardWidget;
