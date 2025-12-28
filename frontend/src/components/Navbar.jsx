import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logoLight from '../assets/logo-light.jpg';
import logoDark from '../assets/logo-dark.jpg';

const Navbar = ({ theme, toggleTheme, userRole, onLogout }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const activeTab = location.pathname.split('/')[1] || 'dashboard';
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);

    const handleLogoutClick = () => {
        if (onLogout) {
            onLogout();
            navigate('/login');
        }
    };

    const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);
    const closeNav = () => setIsNavCollapsed(true);

    return (
        <nav className="navbar navbar-expand-lg fixed-top mx-auto px-4 py-3" 
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
                zIndex: 1030
            }}
        >
            <div className="container-fluid px-0 position-relative">
                <Link to="/" className="d-flex align-items-center text-decoration-none fw-bold fs-4" style={{ color: 'var(--text-main)', letterSpacing: '-0.03em' }} onClick={closeNav}>
                    <img src={theme === 'dark' ? logoDark : logoLight} alt="PeerGrid Logo" className="me-2" style={{ height: '32px', borderRadius: '6px' }} />
                    PeerGrid
                </Link>
                
                <button className="navbar-toggler border-0" type="button" onClick={handleNavCollapse} aria-controls="navbarNav" aria-expanded={!isNavCollapsed} aria-label="Toggle navigation">
                    <i className="bi bi-list fs-2" style={{ color: 'var(--text-main)' }}></i>
                </button>

                <div className={`collapse navbar-collapse ${!isNavCollapsed ? 'show' : ''} mt-3 mt-lg-0`} id="navbarNav">
                    {/* Center Links */}
                    <div className="navbar-nav navbar-center-links d-flex align-items-center gap-3 gap-lg-4 my-4 my-lg-0 justify-content-center">
                        {userRole === 'guest' ? (
                            <>
                                <Link to="/" onClick={closeNav} className="text-decoration-none fw-medium py-2" style={{ color: 'var(--text-main)', fontSize: '1rem', opacity: 0.8 }}>
                                    Home
                                </Link>
                                <Link to="/login" onClick={closeNav} className="text-decoration-none fw-medium py-2" style={{ color: activeTab === 'login' ? 'var(--accent-primary)' : 'var(--text-main)', fontSize: '1rem', opacity: activeTab === 'login' ? 1 : 0.8 }}>
                                    Login
                                </Link>
                                <Link to="/register" onClick={closeNav} className="text-decoration-none fw-medium py-2" style={{ color: activeTab === 'register' ? 'var(--accent-primary)' : 'var(--text-main)', fontSize: '1rem', opacity: activeTab === 'register' ? 1 : 0.8 }}>
                                    Register
                                </Link>
                            </>
                        ) : userRole === 'admin' ? (
                            <>
                                <Link to="/admin-dashboard" onClick={closeNav} className="text-decoration-none fw-medium py-2" style={{ color: activeTab === 'admin-dashboard' ? 'var(--accent-primary)' : 'var(--text-main)', fontSize: '1rem', opacity: activeTab === 'admin-dashboard' ? 1 : 0.8 }}>
                                    Admin
                                </Link>
                                <Link to="/user-profile" onClick={closeNav} className="text-decoration-none fw-medium py-2" style={{ color: activeTab === 'user-profile' ? 'var(--accent-primary)' : 'var(--text-main)', fontSize: '1rem', opacity: activeTab === 'user-profile' ? 1 : 0.8 }}>
                                    Profile
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/dashboard" onClick={closeNav} className="text-decoration-none fw-medium py-2" style={{ color: activeTab === 'dashboard' ? 'var(--accent-primary)' : 'var(--text-main)', fontSize: '1rem', opacity: activeTab === 'dashboard' ? 1 : 0.8 }}>
                                    Dashboard
                                </Link>
                                <Link to="/find-peer" onClick={closeNav} className="text-decoration-none fw-medium py-2" style={{ color: activeTab === 'find-peer' ? 'var(--accent-primary)' : 'var(--text-main)', fontSize: '1rem', opacity: activeTab === 'find-peer' ? 1 : 0.8 }}>
                                    Find Peer
                                </Link>
                                <Link to="/doubt-board" onClick={closeNav} className="text-decoration-none fw-medium py-2" style={{ color: activeTab === 'doubt-board' ? 'var(--accent-primary)' : 'var(--text-main)', fontSize: '1rem', opacity: activeTab === 'doubt-board' ? 1 : 0.8 }}>
                                    Doubts
                                </Link>
                                <Link to="/feedback" onClick={closeNav} className="text-decoration-none fw-medium py-2" style={{ color: activeTab === 'feedback' ? 'var(--accent-primary)' : 'var(--text-main)', fontSize: '1rem', opacity: activeTab === 'feedback' ? 1 : 0.8 }}>
                                    Feedback
                                </Link>
                                <Link to="/user-profile" onClick={closeNav} className="text-decoration-none fw-medium py-2" style={{ color: activeTab === 'user-profile' ? 'var(--accent-primary)' : 'var(--text-main)', fontSize: '1rem', opacity: activeTab === 'user-profile' ? 1 : 0.8 }}>
                                    Profile
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Right Actions */}
                    <div className="navbar-right-actions d-flex flex-column flex-lg-row align-items-center gap-4 gap-lg-3 justify-content-center justify-content-lg-end mt-5 mt-lg-0 w-100 w-lg-auto ms-lg-auto">
                        <button 
                            className="d-flex align-items-center justify-content-center order-2 order-lg-0" 
                            onClick={toggleTheme} 
                            style={{ 
                                width: '40px', 
                                    height: '40px', 
                                    borderRadius: '50%', 
                                    border: '1px solid var(--border-color)', 
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    color: 'var(--text-main)',
                                    transition: 'all 0.2s',
                                    cursor: 'pointer'
                            }}
                        >
                            <i className={`bi ${theme === 'dark' ? 'bi-sun-fill' : 'bi-moon-fill'}`} style={{ fontSize: '1.1rem' }} />
                        </button>

                        {userRole !== 'guest' ? (
                            <button onClick={handleLogoutClick} className="btn btn-sm fw-medium px-4 py-2 rounded-pill border-0 order-1 order-lg-1" style={{ background: 'rgba(255, 82, 82, 0.1)', color: '#ff5252', height: '40px' }}>
                                Sign Out
                            </button>
                        ) : (
                            <Link to="/login" className="btn btn-sm fw-medium px-4 py-2 rounded-pill border-0 order-1 order-lg-1" style={{ background: 'var(--accent-primary)', color: '#fff', height: '40px', display: 'flex', alignItems: 'center' }} onClick={closeNav}>
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
