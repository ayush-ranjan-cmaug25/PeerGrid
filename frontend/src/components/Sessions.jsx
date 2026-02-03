import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { createPortal } from 'react-dom';
import GlassCard from './GlassCard';
import VideoCall from './VideoCall';
import { API_BASE_URL } from '../config';
import './Sessions.css';

const Sessions = ({ sessions }) => {
    const sessionList = sessions || [];
    const [activeCallSession, setActiveCallSession] = useState(null);
    const [completingSession, setCompletingSession] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleJoinCall = (session) => {
        if (!session.otherPartyId) {
            toast.error("Cannot join call: Other party not found");
            return;
        }
        setActiveCallSession(session);
    };

    const handleCompleteClick = (session) => {
        setCompletingSession(session);
        setRating(5);
        setComment('');
    };

    const submitCompletion = async () => {
        if (!completingSession) return;
        setSubmitting(true);
        const token = localStorage.getItem('token');

        try {
            // Step 1: Complete Session (Transaction)
            // Ensure payload has numbers
            const completePayload = {
                learnerId: completingSession.learnerId,
                tutorId: completingSession.tutorId,
                cost: completingSession.cost || completingSession.points || 0 // Handle both cost/points naming
            };

            const completeResponse = await fetch(`${API_BASE_URL}/sessions/complete`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(completePayload)
            });

            if (!completeResponse.ok) {
                const err = await completeResponse.json();
                throw new Error(err.message || "Failed to complete session");
            }

            const completeData = await completeResponse.json();
            const transactionId = completeData.transactionId;

            // Step 2: Rate Session & Submit Feedback
            const ratePayload = {
                transactionId: transactionId,
                sessionId: completingSession.id,
                rating: parseFloat(rating),
                comment: comment
            };

            const rateResponse = await fetch(`${API_BASE_URL}/sessions/rate`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(ratePayload)
            });

            if (!rateResponse.ok) {
                const err = await rateResponse.json();
                throw new Error(err.message || "Failed to submit feedback");
            }

            toast.success("Session completed and feedback submitted!");
            setCompletingSession(null);
            // Ideally trigger refresh, but sessions prop comes from parent. Parent should refresh logic? 
            // For now, reload window or rely on parent update if possible. Dashboard fetches on mount.
            window.location.reload(); 

        } catch (error) {
            console.error("Completion error:", error);
            toast.error(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <GlassCard className="session-dashboard-container p-4">
                <h2 className="section-title">Upcoming Sessions</h2>
                <div className="session-list">
                    {sessionList.map(session => (
                        <div key={session.id} className="session-card">
                            <div className="session-info">
                                <div className="session-topic">{session.topic}</div>
                                <div className="session-tutor">with <span className="tutor-name">{session.otherParty}</span></div>
                                <div className="session-time">{new Date(session.time).toLocaleString()}</div>
                            </div>
                            <div className="d-flex gap-2">
                                <button onClick={() => handleJoinCall(session)} className="join-btn">
                                    Join Room
                                </button>
                                <button onClick={() => handleCompleteClick(session)} className="btn btn-sm btn-outline-success">
                                    Complete
                                </button>
                            </div>
                        </div>
                    ))}
                    {sessionList.length === 0 && <p className="no-sessions">No upcoming sessions.</p>}
                </div>
            </GlassCard>

            {activeCallSession && (
                <VideoCall 
                    otherUserId={activeCallSession.otherPartyId}
                    isInitiator={user.id === activeCallSession.tutorId}
                    onClose={() => setActiveCallSession(null)}
                />
            )}

            {completingSession && createPortal(
                <div className="modal-overlay" onClick={() => !submitting && setCompletingSession(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h3 className="mb-3" style={{color: 'var(--text-main)'}}>Complete Session</h3>
                        <p className="text-muted mb-4">
                            Rating user: <strong>{completingSession.otherParty}</strong>
                        </p>
                        
                        <div className="mb-3">
                            <label className="form-label" style={{color: 'var(--text-main)'}}>Rating (1-5)</label>
                            <input 
                                type="number" 
                                className="form-control" 
                                min="1" max="5" 
                                value={rating} 
                                onChange={(e) => setRating(e.target.value)} 
                                disabled={submitting}
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label className="form-label" style={{color: 'var(--text-main)'}}>Feedback</label>
                            <textarea 
                                className="form-control" 
                                rows="3" 
                                value={comment} 
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="How was your session?"
                                disabled={submitting}
                            ></textarea>
                        </div>

                        <div className="d-flex justify-content-end gap-2">
                            <button 
                                className="btn btn-secondary" 
                                onClick={() => setCompletingSession(null)}
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button 
                                className="btn btn-primary" 
                                onClick={submitCompletion}
                                disabled={submitting}
                            >
                                {submitting ? 'Submitting...' : 'Submit & Complete'}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default Sessions;
