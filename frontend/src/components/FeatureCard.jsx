import React from 'react';
import ScrollReveal from './ScrollReveal';

const FeatureCard = ({ icon, title, desc }) => (
    <ScrollReveal>
        <div className="p-5 h-100 rounded-4 d-flex flex-column align-items-center text-center transition-all" 
            style={{ 
                background: 'var(--bg-card)', 
                border: '1px solid var(--border-color)',
                transition: 'transform 0.3s ease'
            }}
        >
            <div className="mb-4 d-flex align-items-center justify-content-center rounded-circle" 
                style={{ 
                    width: '80px', 
                    height: '80px', 
                    background: 'rgba(99, 102, 241, 0.1)',
                    color: 'var(--accent-primary)',
                    fontSize: '2rem'
                }}
            >
                <i className={`bi ${icon}`}></i>
            </div>
            <h3 className="h4 fw-bold mb-3">{title}</h3>
            <p className="text-muted mb-0" style={{ lineHeight: 1.6 }}>{desc}</p>
        </div>
    </ScrollReveal>
);

export default FeatureCard;
