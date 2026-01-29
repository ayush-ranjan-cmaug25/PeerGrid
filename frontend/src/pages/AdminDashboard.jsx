import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoLight from '../assets/logo-light.jpg';
import logoDark from '../assets/logo-dark.jpg';
import AdminOverview from '../components/admin/AdminOverview';
import UserManagement from '../components/admin/UserManagement';
import SessionManagement from '../components/admin/SessionManagement';
import BountyManagement from '../components/admin/BountyManagement';
import SkillsManagement from '../components/admin/SkillsManagement';
import SystemSettings from '../components/admin/SystemSettings';
import RatingsView from '../components/admin/RatingsView';
import LogsView from '../components/admin/LogsView';

const AdminDashboard = ({ theme, toggleTheme, onLogout }) => {
    const [activeTab, setActiveTab] = useState(() => localStorage.getItem('adminActiveTab') || 'overview');
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem('adminActiveTab', activeTab);
    }, [activeTab]);

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: 'bi-speedometer2' },
        { id: 'users', label: 'User Management', icon: 'bi-people' },
        { id: 'sessions', label: 'Sessions', icon: 'bi-camera-video' },
        { id: 'bounties', label: 'Bounties', icon: 'bi-crosshair' },
        { id: 'skills', label: 'Skills & Categories', icon: 'bi-tags' },
        { id: 'ratings', label: 'Ratings & Feedback', icon: 'bi-star' },
        { id: 'logs', label: 'Logs & Activity', icon: 'bi-journal-text' },
        { id: 'settings', label: 'System Settings', icon: 'bi-gear' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <AdminOverview />;
            case 'users': return <UserManagement />;
            case 'sessions': return <SessionManagement />;
            case 'bounties': return <BountyManagement />;
            case 'skills': return <SkillsManagement />;
            case 'ratings': return <RatingsView />;
            case 'logs': return <LogsView />;
            case 'settings': return <SystemSettings />;
            default: return <AdminOverview />;
        }
    };

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const activeTitle = menuItems.find(item => item.id === activeTab)?.label;

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="min-vh-100 position-relative" style={{ color: 'var(--text-main)' }}>
            <nav className="navbar navbar-expand-lg fixed-top mx-auto px-4 py-3" 
                style={{ 
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '95%',
                    maxWidth: '1400px',
                    borderRadius: '24px',
                    background: 'rgba(255, 255, 255, 0.05)', 
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                    zIndex: 1040
                }}
            >
                <div className="container-fluid px-0 position-relative">
                    {/* Left: Hamburger + Logo */}
                    <div className="d-flex align-items-center gap-3">
                        <button 
                            onClick={toggleSidebar}
                            className="btn border-0 p-0 d-flex align-items-center justify-content-center"
                            style={{ 
                                color: 'var(--text-main)', 
                                background: 'transparent',
                                width: '40px',
                                height: '40px',
                                transition: 'transform 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <i className="bi bi-list" style={{ fontSize: '1.75rem' }}></i>
                        </button>
                        
                        <Link to="/" className="d-flex align-items-center text-decoration-none fw-bold fs-4" style={{ color: 'var(--text-main)', letterSpacing: '-0.03em' }}>
                            <img src={theme === 'dark' ? logoDark : logoLight} alt="PeerGrid Logo" className="me-2" style={{ height: '32px', borderRadius: '6px' }} />
                            PeerGrid <span className="ms-2 badge bg-primary bg-opacity-10 text-primary fs-6 align-middle" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8' }}>Admin</span>
                        </Link>
                    </div>

                    {/* Center: Active Page Title */}
                    <div className="navbar-nav navbar-center-links position-absolute start-50 translate-middle-x d-none d-lg-flex align-items-center">
                        <span className="fw-bold fs-5" style={{ color: 'var(--text-main)' }}>
                            {activeTitle}
                        </span>
                    </div>

                    {/* Right: Actions */}
                    <div className="d-flex align-items-center gap-3 ms-auto">
                        <button 
                            onClick={toggleTheme} 
                            className="d-flex align-items-center justify-content-center"
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
                            <i className={`bi ${theme === 'dark' ? 'bi-sun-fill' : 'bi-moon-fill'}`} style={{ fontSize: '1.1rem' }}></i>
                        </button>

                        <button 
                            onClick={onLogout} 
                            className="btn btn-sm fw-medium px-4 py-2 rounded-pill border-0" 
                            style={{ 
                                background: 'rgba(255, 82, 82, 0.1)', 
                                color: '#ff5252', 
                                height: '40px',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            Sign Out
                        </button>


                    </div>
                </div>
            </nav>

            {/* Sidebar Overlay */}
            <div 
                className={`position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-50 ${isSidebarOpen ? 'd-block' : 'd-none'}`}
                style={{ zIndex: 1045, backdropFilter: 'blur(2px)', transition: 'opacity 0.3s' }}
                onClick={() => setIsSidebarOpen(false)}
            ></div>

            {/* Slide-out Sidebar */}
            <div 
                className="position-fixed top-0 start-0 h-100 glass-sidebar p-4 d-flex flex-column"
                style={{ 
                    width: '280px', 
                    zIndex: 1050, 
                    transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '4px 0 24px rgba(0,0,0,0.2)'
                }}
            >
                <div className="d-flex align-items-center justify-content-between mb-5">
                    <span className="fs-4 fw-bold" style={{ color: 'var(--text-main)' }}>Menu</span>
                    <button onClick={() => setIsSidebarOpen(false)} className="btn btn-link text-muted p-0"><i className="bi bi-x-lg fs-5"></i></button>
                </div>
                
                <ul className="nav nav-pills flex-column gap-2">
                    {menuItems.map(item => (
                        <li key={item.id} className="nav-item">
                            <button 
                                onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                                className={`nav-link w-100 text-start d-flex align-items-center gap-3 px-3 py-3 ${activeTab === item.id ? 'active' : ''}`}
                                style={{ 
                                    color: activeTab === item.id ? '#fff' : 'var(--text-muted)',
                                    background: activeTab === item.id ? 'var(--accent-primary)' : 'transparent',
                                    borderRadius: '12px',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <i className={`bi ${item.icon} fs-5`}></i>
                                <span className="fw-medium">{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
                
                <div className="mt-auto pt-4 border-top" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="small text-muted text-center">
                        &copy; 2024 PeerGrid Admin
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container-fluid" style={{ paddingTop: '120px', paddingBottom: '40px', maxWidth: '1400px' }}>
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminDashboard;
