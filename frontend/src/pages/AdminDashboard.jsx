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
                        
                        <span className="d-flex align-items-center text-decoration-none fw-bold fs-4" style={{ color: 'var(--text-main)', letterSpacing: '-0.03em', cursor: 'default' }}>
                            <img src={theme === 'dark' ? logoDark : logoLight} alt="PeerGrid Logo" className="me-2" style={{ height: '32px', borderRadius: '6px' }} />
                            PeerGrid <span className="ms-2 badge bg-primary bg-opacity-10 text-primary fs-6 align-middle" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8' }}>Admin</span>
                        </span>
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
                className={`position-fixed top-0 start-0 w-100 h-100 bg-black ${isSidebarOpen ? 'd-block' : 'd-none'}`}
                style={{ 
                    zIndex: 1045, 
                    opacity: isSidebarOpen ? 0.6 : 0,
                    transition: 'opacity 0.3s',
                    backdropFilter: 'blur(4px)'
                }}
                onClick={() => setIsSidebarOpen(false)}
            ></div>

            {/* Premium Floating Sidebar */}
            <div 
                className="position-fixed d-flex flex-column glass-sidebar"
                style={{ 
                    top: '24px',
                    left: '24px',
                    bottom: '24px',
                    width: '300px', 
                    zIndex: 1050, 
                    transform: isSidebarOpen ? 'translateX(0)' : 'translateX(calc(-100% - 40px))',
                    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    background: 'var(--sidebar-bg)', // Adaptive glass background
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '24px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                    padding: '32px 24px'
                }}
            >
                <div className="d-flex align-items-center justify-content-between mb-5 px-2">
                    <div className="d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle" style={{ width: '40px', height: '40px' }}>
                             <i className="bi bi-grid-fill fs-5"></i>
                        </div>
                        <span className="fs-5 fw-bold" style={{ color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Admin Dashboard</span>
                    </div>
                </div>
                
                <div className="d-flex flex-column gap-2 flex-grow-1 overflow-auto no-scrollbar">
                    {menuItems.map(item => {
                        const isActive = activeTab === item.id;
                        return (
                            <button 
                                key={item.id}
                                onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                                className="btn border-0 text-start position-relative d-flex align-items-center gap-3 px-3 py-3"
                                style={{ 
                                    color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                                    background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                    borderRadius: '16px',
                                    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                                    fontWeight: isActive ? '600' : '500',
                                    overflow: 'hidden',
                                    boxShadow: 'none', // Override global button shadow
                                    transform: 'none'  // Override global button transform
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.color = 'var(--text-main)';
                                        e.currentTarget.style.background = 'rgba(127, 127, 127, 0.05)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.color = 'var(--text-muted)';
                                        e.currentTarget.style.background = 'transparent';
                                    }
                                }}
                            >
                                {/* Active Indicator Line */}
                                {isActive && (
                                    <div style={{
                                        position: 'absolute',
                                        left: '0',
                                        top: '0',
                                        bottom: '0',
                                        width: '4px',
                                        background: 'var(--accent-primary)',
                                        borderRadius: '0 4px 4px 0',
                                        boxShadow: '2px 0 12px var(--accent-primary)'
                                    }}></div>
                                )}
                                
                                <i className={`bi ${item.icon} fs-5`} style={{ marginLeft: isActive ? '8px' : '0', transition: 'margin 0.3s', color: isActive ? 'var(--accent-primary)' : 'inherit' }}></i>
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </div>
                
                <div className="mt-auto pt-4 border-top" style={{ borderColor: 'var(--border-color)' }}>
                    <button 
                        onClick={() => setIsSidebarOpen(false)}
                        className="btn w-100 d-flex align-items-center justify-content-center gap-2 py-3 mt-2 rounded-4"
                        style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}
                    >
                         <i className="bi bi-arrow-left-short fs-4"></i>
                         <span className="small fw-medium text-uppercase ls-1">Close Menu</span>
                    </button>
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
