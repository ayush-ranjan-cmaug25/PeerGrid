import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import logoLight from '../assets/logo-light.jpg';
import logoDark from '../assets/logo-dark.jpg';
import Footer from './Footer';
import ChatWidget from './ChatWidget';

const Layout = ({ theme, toggleTheme, userRole, onLogout }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const activeTab = location.pathname.split('/')[1] || 'dashboard';

    const handleLogoutClick = () => {
        onLogout();
        navigate('/login');
    };

    return (
        <div className="d-flex flex-column min-vh-100 position-relative">
            {/* Background pattern similar to Home */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'linear-gradient(var(--border-color) 1px, transparent 1px), linear-gradient(90deg, var(--border-color) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                opacity: 0.03,
                pointerEvents: 'none',
                zIndex: 0
            }}></div>

            <nav className="navbar navbar-expand-lg fixed-top mx-auto" 
                style={{ 
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '95%',
                    maxWidth: '1200px',
                    borderRadius: '24px',
                    background: 'rgba(255, 255, 255, 0.05)', 
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                    padding: '0.8rem 0',
                    zIndex: 1030
                }}
            >
                <div className="container-fluid px-4">
                    <div className="logo d-flex align-items-center fw-bold fs-5" style={{ color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                        <img src={theme === 'dark' ? logoDark : logoLight} alt="PeerGrid Logo" className="logo-img me-2" style={{ height: '32px', borderRadius: '6px' }} /> PeerGrid
                    </div>
                    
                    <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <i className="bi bi-list fs-2" style={{ color: 'var(--text-main)' }}></i>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <div className="nav-links ms-auto d-flex align-items-center gap-3">
                            {userRole === 'admin' ? (
                                <>
                                    <Link to="/admin-dashboard" className={`nav-link-custom ${activeTab === 'admin-dashboard' ? 'active' : ''}`}>
                                        Admin
                                    </Link>
                                    <Link to="/user-profile" className={`nav-link-custom ${activeTab === 'user-profile' ? 'active' : ''}`}>
                                        Profile
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/dashboard" className={`nav-link-custom ${activeTab === 'dashboard' ? 'active' : ''}`}>
                                        Dashboard
                                    </Link>
                                    <Link to="/find-peer" className={`nav-link-custom ${activeTab === 'find-peer' ? 'active' : ''}`}>
                                        Find Peer
                                    </Link>
                                    <Link to="/doubt-board" className={`nav-link-custom ${activeTab === 'doubt-board' ? 'active' : ''}`}>
                                        Doubts
                                    </Link>
                                    <Link to="/feedback" className={`nav-link-custom ${activeTab === 'feedback' ? 'active' : ''}`}>
                                        Feedback
                                    </Link>
                                    <Link to="/user-profile" className={`nav-link-custom ${activeTab === 'user-profile' ? 'active' : ''}`}>
                                        Profile
                                    </Link>
                                </>
                            )}
                            
                            <div className="vr mx-2 d-none d-lg-block" style={{ height: '20px', opacity: 0.2, background: 'var(--text-muted)' }}></div>

                            {userRole === 'guest' ? (
                                <>
                                    <Link to="/about" className="nav-link-custom d-none d-md-block">About</Link>
                                    <Link to="/how-it-works" className="nav-link-custom d-none d-md-block">How it Works</Link>
                                    <Link to="/login" className="nav-link-custom">
                                        Sign In
                                    </Link>
                                    <Link to="/register" className="btn btn-sm fw-medium px-3 py-2 rounded-pill" style={{ background: 'var(--text-main)', color: 'var(--bg-primary)', border: 'none' }}>
                                        Get Started
                                    </Link>
                                </>
                            ) : (
                                <button onClick={handleLogoutClick} className="nav-link-custom border-0 bg-transparent">
                                    Sign Out
                                </button>
                            )}

                            <button 
                                className="theme-toggle-btn ms-2 d-flex align-items-center justify-content-center" 
                                onClick={toggleTheme} 
                                style={{ 
                                    width: '36px', 
                                    height: '36px', 
                                    borderRadius: '50%', 
                                    border: '1px solid var(--border-color)', 
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    color: 'var(--text-main)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <i className={`bi ${theme === 'dark' ? 'bi-sun-fill' : 'bi-moon-fill'}`} style={{ fontSize: '1rem' }} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="flex-grow-1 w-100 position-relative z-1" style={{ paddingTop: '120px' }}>
                <Outlet />
            </div>
            <ChatWidget />
            <Footer />
        </div>
    );
};

export default Layout;
