import React from 'react';
import './Sessions.css';

const Sessions = () => {
    const sessions = [
        { id: 1, topic: 'Calculus', tutor: 'Alice', time: 'Today, 4:00 PM', status: 'Upcoming' },
        { id: 2, topic: 'React', tutor: 'Bob', time: 'Tomorrow, 10:00 AM', status: 'Confirmed' },
    ];

    return (
        <div className="glass-card session-dashboard-container">
            <h2 className="section-title">Upcoming Sessions</h2>
            <div className="session-list">
                {sessions.map(session => (
                    <div key={session.id} className="session-card">
                        <div className="session-info">
                            <div className="session-topic">{session.topic}</div>
                            <div className="session-tutor">with <span className="tutor-name">{session.tutor}</span></div>
                            <div className="session-time">{session.time}</div>
                        </div>
                        <button onClick={() => alert('Entering Video Room...')} className="join-btn">
                            Join Room
                        </button>
                    </div>
                ))}
                {sessions.length === 0 && <p className="no-sessions">No upcoming sessions.</p>}
            </div>
        </div>
    );
};

export default Sessions;
