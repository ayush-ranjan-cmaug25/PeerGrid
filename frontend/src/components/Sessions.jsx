import React, { useState } from 'react';
import toast from 'react-hot-toast';
import GlassCard from './GlassCard';
import VideoCall from './VideoCall';
import './Sessions.css';

const Sessions = ({ sessions }) => {
    const sessionList = sessions || [];
    const [activeCallSession, setActiveCallSession] = useState(null);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleJoinCall = (session) => {
        if (!session.otherPartyId) {
            toast.error("Cannot join call: Other party not found");
            return;
        }
        setActiveCallSession(session);
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
                            <button onClick={() => handleJoinCall(session)} className="join-btn">
                                Join Room
                            </button>
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
        </>
    );
};

export default Sessions;
