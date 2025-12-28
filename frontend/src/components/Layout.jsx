import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import logoLight from '../assets/logo-light.jpg';
import logoDark from '../assets/logo-dark.jpg';
import Footer from './Footer';
import ChatWidget from './ChatWidget';
import Navbar from './Navbar';

const Layout = ({ theme, toggleTheme, userRole, onLogout }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const activeTab = location.pathname.split('/')[1] || 'dashboard';
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);

    const handleLogoutClick = () => {
        onLogout();
        navigate('/login');
    };

    const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);
    const closeNav = () => setIsNavCollapsed(true);

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

            <Navbar theme={theme} toggleTheme={toggleTheme} userRole={userRole} onLogout={onLogout} />
            
            <div className="flex-grow-1 w-100 position-relative z-1" style={{ paddingTop: '120px' }}>
                <Outlet />
            </div>
            <ChatWidget />
            <Footer />
        </div>
    );
};

export default Layout;
