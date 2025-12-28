import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
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
            // Fallback for demo if backend is not running
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
        <div className="auth-container d-flex align-items-center justify-content-center vh-100">
            <div 
                className="glass-card p-5 animate-fade-in-up"
                style={{ maxWidth: '400px', width: '100%' }}
            >
                <h2 className="text-center mb-4 section-title" style={{ display: 'block' }}>Welcome Back</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label text-muted small text-uppercase fw-bold">Email</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label text-muted small text-uppercase fw-bold">Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                        <div className="text-end mt-2">
                            <a href="#" className="text-muted small text-decoration-none">Forgot Password?</a>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-100 py-2 fw-bold text-uppercase" style={{ background: 'var(--text-main)', color: 'var(--bg-primary)', border: 'none' }}>
                        Login
                    </button>
                </form>
                <div className="text-center mt-4">
                    <span className="text-muted small">Don't have an account? </span>
                    <Link to="/register" className="text-decoration-none fw-bold" style={{ color: 'var(--text-main)' }}>Register</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
