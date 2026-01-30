import React from 'react';

const GlassCard = ({ children, className = "", style = {} }) => {
    return (
        <div 
            className={`rounded-4 ${className}`}
            style={{ 
                background: 'var(--bg-card)', 
                border: '1px solid var(--border-color)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                ...style 
            }}
        >
            {children}
        </div>
    );
};

export default GlassCard;
