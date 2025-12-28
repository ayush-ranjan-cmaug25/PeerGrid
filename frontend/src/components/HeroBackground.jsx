import React from 'react';

const HeroBackground = () => (
    <div className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden" style={{ zIndex: 0, pointerEvents: 'none' }}>
        <div style={{
            position: 'absolute',
            top: '-10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100vw',
            height: '80vh',
            background: 'radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.3) 0%, rgba(165, 180, 252, 0.1) 40%, transparent 70%)',
            filter: 'blur(80px)',
            opacity: 0.8
        }}></div>

        <svg width="100%" height="100%" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMin slice" style={{ opacity: 0.5 }}>
            <defs>
                <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--text-muted)" stopOpacity="0.1" />
                    <stop offset="50%" stopColor="var(--accent-primary)" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="var(--text-muted)" stopOpacity="0.1" />
                </linearGradient>
            </defs>
            
            <g fill="none" stroke="url(#arcGradient)" strokeWidth="1.5">
                <path d="M-100,100 Q720,900 1540,100" />
                <path d="M0,0 Q720,700 1440,0" />
                <path d="M200,-100 Q720,500 1240,-100" />
            </g>

            <g fill="var(--accent-primary)" opacity="0.6">
                <circle cx="720" cy="200" r="4" />
                <circle cx="720" cy="350" r="4" />
                <circle cx="720" cy="500" r="4" />
                
                <circle cx="460" cy="125" r="3" />
                <circle cx="980" cy="125" r="3" />

                <circle cx="360" cy="262.5" r="3" />
                <circle cx="1080" cy="262.5" r="3" />
                
                <circle cx="310" cy="400" r="3" />
                <circle cx="1130" cy="400" r="3" />
            </g>
        </svg>
    </div>
);

export default HeroBackground;
