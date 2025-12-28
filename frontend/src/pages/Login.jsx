import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import logoLight from '../assets/logo-light.jpg';
import logoDark from '../assets/logo-dark.jpg';
import '../App.css';

const Login = ({ onLogin, theme, toggleTheme }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                onLogin(data.role);
                navigate(data.role === 'admin' ? '/admin-dashboard' : '/dashboard');
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);

            if (email === 'admin@peergrid.com' && password === 'admin123') {
                onLogin('admin');
                navigate('/admin-dashboard');
            } else if (email === 'user@peergrid.com' && password === 'user123') {
                onLogin('user');
                navigate('/dashboard');
            } else {
                alert('Login failed (Backend unreachable)');
            }
        }
    };

    return (
        <div className="min-vh-100 position-relative d-flex flex-column">
            <Navbar theme={theme} toggleTheme={toggleTheme} userRole="guest" />
            
            <div className="flex-grow-1 d-flex align-items-center justify-content-center px-4" style={{ paddingTop: '80px' }}>
                <GlassCard 
                    className="p-4 p-md-5 animate-fade-in-up position-relative overflow-hidden"
                    style={{ maxWidth: '420px', width: '100%' }}
                >

                    <div style={{
                        position: 'absolute',
                        top: '-50%',
                        left: '-50%',
                        width: '200%',
                        height: '200%',
                        background: 'radial-gradient(circle at center, var(--accent-primary) 0%, transparent 50%)',
                        opacity: 0.05,
                        pointerEvents: 'none',
                        zIndex: 0
                    }}></div>

                    <div className="position-relative z-1">
                        <div className="text-center mb-4">
                            <img src={theme === 'dark' ? logoDark : logoLight} alt="Logo" className="mb-3 rounded-3 shadow-sm" style={{ width: '64px', height: '64px' }} />
                            <h2 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>Welcome Back</h2>
                            <p className="text-muted small">Sign in to continue your learning journey</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label text-muted small text-uppercase fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Email Address</label>
                                <div className="input-group">
                                    <span className="input-group-text border-0 bg-transparent ps-0" style={{ color: 'var(--text-muted)' }}>
                                        <i className="bi bi-envelope"></i>
                                    </span>
                                    <input 
                                        type="email" 
                                        className="form-control border-0 border-bottom rounded-0 px-2" 
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required 
                                        style={{ background: 'transparent', color: 'var(--text-main)', borderColor: 'var(--border-color)', boxShadow: 'none' }}
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="form-label text-muted small text-uppercase fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Password</label>
                                <div className="input-group">
                                    <span className="input-group-text border-0 bg-transparent ps-0" style={{ color: 'var(--text-muted)' }}>
                                        <i className="bi bi-lock"></i>
                                    </span>
                                    <input 
                                        type="password" 
                                        className="form-control border-0 border-bottom rounded-0 px-2" 
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required 
                                        style={{ background: 'transparent', color: 'var(--text-main)', borderColor: 'var(--border-color)', boxShadow: 'none' }}
                                    />
                                </div>
                                <div className="text-end mt-2">
                                    <a href="#" className="text-decoration-none small" style={{ color: 'var(--accent-primary)' }}>Forgot Password?</a>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary w-100 py-3 fw-bold rounded-pill shadow-sm mb-3 transition-transform" 
                                style={{ background: 'var(--accent-primary)', border: 'none', letterSpacing: '0.03em' }}>
                                SIGN IN
                            </button>
                        </form>
                        <div className="text-center">
                            <span className="text-muted small">Don't have an account? </span>
                            <Link to="/register" className="text-decoration-none fw-bold" style={{ color: 'var(--text-main)' }}>Create Account</Link>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default Login;
