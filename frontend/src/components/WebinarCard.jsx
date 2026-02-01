import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';

const WebinarCard = ({ webinar, onRegister, isRegistered, isRegistering, isHost }) => {
    const { title, description, host, scheduledTime, durationMinutes, cost } = webinar;
    
    const dateObj = new Date(scheduledTime);
    // e.g. "FEB 02"
    const month = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const day = dateObj.toLocaleDateString('en-US', { day: '2-digit' });
    // e.g. "1:41 AM"
    const time = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    // Generate gradient hue based on title
    const gradientHue = (title.length * 20) % 360;

    const canJoin = isRegistered || isHost;

    return (
        <GlassCard 
            className="h-100 d-flex flex-column position-relative overflow-hidden group border-0"
            style={{ 
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                padding: '1.5rem'
            }}
        >
            {/* Ambient Background Gradient for flair */}
            <div 
                className="position-absolute top-0 end-0 p-5 rounded-circle"
                style={{
                    background: `radial-gradient(circle, hsl(${gradientHue}, 70%, 50%, 0.12) 0%, transparent 60%)`,
                    transform: 'translate(20%, -20%)',
                    width: '350px',
                    height: '350px',
                    pointerEvents: 'none'
                }}
            />

            <div className="position-relative z-1 d-flex flex-column h-100">
                
                {/* Header: Date/Time Badge & Duration */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center gap-2">
                        <span className="fw-bold" style={{ color: 'var(--accent-primary)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
                            {month} {day}
                        </span>
                        <span className="text-muted" style={{ fontSize: '0.8rem' }}>•</span>
                        <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                            {time}
                        </span>
                    </div>
                    <div className="badge rounded-pill fw-normal text-muted" 
                         style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        {durationMinutes} min
                    </div>
                </div>

                {/* Title */}
                <h3 className="fw-bold mb-2" style={{ color: 'var(--text-main)', fontSize: '1.35rem', lineHeight: 1.3 }}>
                    {title}
                </h3>

                {/* Host Info */}
                <div className="d-flex align-items-center mb-3">
                    <div 
                        className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white small me-2"
                        style={{ 
                            width: '24px', 
                            height: '24px', 
                            fontSize: '0.7rem',
                            background: `linear-gradient(135deg, hsl(${gradientHue}, 60%, 50%), hsl(${gradientHue + 40}, 60%, 50%))` 
                        }}
                    >
                        {host?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                        by <span style={{ color: 'var(--text-main)' }}>{host?.name || 'Unknown'}</span>
                    </span>
                    {isHost && (
                        <span className="badge bg-primary bg-opacity-10 text-primary ms-2" style={{ fontSize: '0.65rem' }}>YOU</span>
                    )}
                </div>

                {/* Description */}
                <p className="text-muted mb-4 flex-grow-1" style={{ 
                    fontSize: '0.9rem', 
                    lineHeight: 1.6,
                    display: '-webkit-box', 
                    WebkitLineClamp: 3, 
                    WebkitBoxOrient: 'vertical', 
                    overflow: 'hidden' 
                }}>
                    {description}
                </p>

                {/* Footer: Price & Action */}
                <div className="d-flex align-items-end justify-content-between pt-3 mt-auto" 
                     style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    
                    <div>
                        <div className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.65rem', letterSpacing: '0.05em', marginBottom: '2px' }}>
                            Entry Fee
                        </div>
                        <div className="fw-bold fs-5" style={{ color: cost > 0 ? 'var(--text-main)' : '#10b981' }}>
                            {cost > 0 ? (
                                <span>{cost} <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>GP</span></span>
                            ) : 'Free'}
                        </div>
                    </div>

                    <motion.button 
                        whileHover={!isRegistering ? { scale: 1.05 } : {}}
                        whileTap={!isRegistering ? { scale: 0.95 } : {}}
                        className={`btn rounded-pill px-4 fw-semibold ${canJoin ? 'btn-success' : 'btn-primary'}`}
                        style={{ 
                            background: canJoin 
                                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                                : 'var(--accent-primary)',
                            border: 'none',
                            fontSize: '0.9rem',
                            paddingTop: '0.6rem',
                            paddingBottom: '0.6rem',
                            opacity: isRegistering ? 0.8 : 1
                        }}
                        disabled={isRegistering}
                        onClick={() => !isRegistering && onRegister(webinar.id, canJoin)}
                    >
                        {isRegistering ? (
                            <div className="d-flex align-items-center">
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" style={{ width: '0.8rem', height: '0.8rem', borderWidth: '0.15em' }}></span>
                                <span>Processing...</span>
                            </div>
                        ) : canJoin ? (isHost ? 'Start/Join' : 'Join') : 'Register'}
                    </motion.button>
                </div>
            </div>
        </GlassCard>
    );
};

export default WebinarCard;
