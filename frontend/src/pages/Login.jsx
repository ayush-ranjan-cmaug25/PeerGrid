import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Logging in with", email, password);
        
        if (email === 'admin@peergrid.com' && password === 'admin123') {
            onLogin('admin');
            navigate('/admin-dashboard');
        } else {
            onLogin('user');
            navigate('/dashboard');
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
