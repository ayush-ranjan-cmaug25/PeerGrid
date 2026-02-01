import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="position-relative pt-5 pb-4 overflow-hidden" style={{ 
            background: 'var(--bg-card)', 
            borderTop: '1px solid var(--border-color)',
            marginTop: 'auto',
            zIndex: 0
        }}>
            {/* Background Glow */}
            <div style={{
                position: 'absolute',
                top: '0',
                left: '20%',
                width: '60%',
                height: '100%',
                background: 'radial-gradient(ellipse at top, var(--accent-primary) 0%, transparent 70%)',
                opacity: 0.05,
                pointerEvents: 'none',
                zIndex: -1
            }}></div>

            <div className="container position-relative">
                <div className="row g-4 mb-5 justify-content-between">
                    {/* Brand Section */}
                    <div className="col-md-4">
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <div className="fw-bold fs-4" style={{ color: 'var(--text-main)', letterSpacing: '-0.03em' }}>
                                PeerGrid
                            </div>
                        </div>
                        <p className="text-muted mb-4" style={{ maxWidth: '300px', lineHeight: '1.6' }}>
                            Empowering developers to share knowledge, trade skills, and grow together in a decentralized community.
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <div className="col-md-3">
                        <h6 className="fw-bold mb-3 text-uppercase small" style={{ color: 'var(--text-main)', letterSpacing: '0.05em' }}>Navigation</h6>
                        <ul className="list-unstyled d-flex flex-column gap-2">
                            <li><Link to="/dashboard" className="text-decoration-none text-muted hover-link">Dashboard</Link></li>
                            <li><Link to="/find-peer" className="text-decoration-none text-muted hover-link">Find Peers</Link></li>
                            <li><Link to="/doubt-board" className="text-decoration-none text-muted hover-link">Doubt Board</Link></li>
                            <li><Link to="/profile" className="text-decoration-none text-muted hover-link">My Profile</Link></li>
                        </ul>
                    </div>

                    {/* Community/Support Links */}
                    <div className="col-md-3">
                        <h6 className="fw-bold mb-3 text-uppercase small" style={{ color: 'var(--text-main)', letterSpacing: '0.05em' }}>Community</h6>
                        <ul className="list-unstyled d-flex flex-column gap-2">
                            <li><Link to="/feedback" className="text-decoration-none text-muted hover-link">Feedback</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-top pt-4 text-center" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="text-muted small">
                        &copy; {new Date().getFullYear()} PeerGrid. All rights reserved.
                    </div>
                </div>
            </div>

            <style>
                {`
                    .hover-link {
                        transition: color 0.2s ease;
                    }
                    .hover-link:hover {
                        color: var(--accent-primary) !important;
                    }
                `}
            </style>
        </footer>
    );
};

export default Footer;
