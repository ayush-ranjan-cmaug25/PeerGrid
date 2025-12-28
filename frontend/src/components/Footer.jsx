import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer mt-auto py-4" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-color)' }}>
            <div className="container text-center">
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <h5 className="text-uppercase fw-bold mb-3" style={{ color: 'var(--text-main)' }}>PeerGrid</h5>
                        <p className="text-muted small">The decentralized knowledge exchange platform.</p>
                    </div>
                    <div className="col-md-4 mb-3">
                        <h5 className="text-uppercase fw-bold mb-3" style={{ color: 'var(--text-main)' }}>Links</h5>
                        <ul className="list-unstyled">
                            <li><Link to="/dashboard" className="text-muted text-decoration-none">Dashboard</Link></li>
                            <li><Link to="/find-peer" className="text-muted text-decoration-none">Find a Peer</Link></li>

                            <li><Link to="/feedback" className="text-muted text-decoration-none">Feedback</Link></li>
                        </ul>
                    </div>
                    <div className="col-md-4 mb-3">
                        <h5 className="text-uppercase fw-bold mb-3" style={{ color: 'var(--text-main)' }}>Legal</h5>
                        <ul className="list-unstyled">
                            <li><a href="#" className="text-muted text-decoration-none">Privacy Policy</a></li>
                            <li><a href="#" className="text-muted text-decoration-none">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
                <div className="text-muted small mt-3">
                    &copy; {new Date().getFullYear()} PeerGrid. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
