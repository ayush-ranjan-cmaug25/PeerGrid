import React from 'react';
import './Sessions.css';

const Sessions = ({ sessions }) => {
    const sessionList = sessions || [];

    return (
        <div className="glass-card session-dashboard-container">
            <h2 className="section-title">Upcoming Sessions</h2>
            <div className="session-list">
                {sessionList.map(session => (
                    <div key={session.id} className="session-card">
                        <div className="session-info">
                            <div className="session-topic">{session.topic}</div>
                            <div className="session-tutor">with <span className="tutor-name">{session.otherParty}</span></div>
                            <div className="session-time">{new Date(session.time).toLocaleString()}</div>
                        </div>
                        <button onClick={() => alert('Entering Video Room...')} className="join-btn">
                            Join Room
                        </button>
                    </div>
                ))}
                {sessionList.length === 0 && <p className="no-sessions">No upcoming sessions.</p>}
            </div>
        </div>
    );
};

export default Sessions;
