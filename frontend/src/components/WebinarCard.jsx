import React from 'react';
import GlassCard from './GlassCard';

import toast from 'react-hot-toast';

const WebinarCard = ({ webinar, onRegister, isRegistered }) => {
    const { title, description, host, scheduledTime, durationMinutes, cost } = webinar;
    const date = new Date(scheduledTime).toLocaleString();

    return (
        <GlassCard className="h-100 d-flex flex-column">
            <div className="d-flex justify-content-between align-items-start mb-3">
                <h5 className="card-title fw-bold mb-0">{title}</h5>
                <span className="badge bg-primary rounded-pill">{cost > 0 ? `${cost} GP` : 'Free'}</span>
            </div>
            <p className="text-muted small mb-2">Hosted by <span className="fw-semibold">{host?.name || 'Unknown'}</span></p>
            <p className="card-text flex-grow-1" style={{ fontSize: '0.95rem' }}>{description}</p>
            
            <div className="mt-3 pt-3 border-top border-secondary border-opacity-10">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <small className="text-muted"><i className="bi bi-calendar-event me-1"></i> {date}</small>
                    <small className="text-muted"><i className="bi bi-clock me-1"></i> {durationMinutes} mins</small>
                </div>
                
                <button 
                    className={`btn w-100 ${isRegistered ? 'btn-success' : 'btn-outline-primary'}`} 
                    onClick={() => onRegister(webinar.id, isRegistered)}
                >
                    {isRegistered ? 'Join Webinar' : 'Register Now'}
                </button>
            </div>
        </GlassCard>
    );
};

export default WebinarCard;
