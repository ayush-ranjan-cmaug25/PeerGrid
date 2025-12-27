import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Registering", formData);
        navigate('/dashboard');
    };

    return (
        <div className="auth-container d-flex align-items-center justify-content-center vh-100">
            <div 
                className="glass-card p-5 animate-fade-in-up"
                style={{ maxWidth: '450px', width: '100%' }}
            >
                <h2 className="text-center mb-4 section-title" style={{ display: 'block' }}>Join PeerGrid</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label text-muted small text-uppercase fw-bold">Full Name</label>
                        <input 
                            type="text" 
                            name="name"
                            className="form-control" 
                            value={formData.name}
                            onChange={handleChange}
                            required 
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-muted small text-uppercase fw-bold">Email</label>
                        <input 
                            type="email" 
                            name="email"
                            className="form-control" 
                            value={formData.email}
                            onChange={handleChange}
                            required 
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label text-muted small text-uppercase fw-bold">Password</label>
                        <input 
                            type="password" 
                            name="password"
                            className="form-control" 
                            value={formData.password}
                            onChange={handleChange}
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 py-2 fw-bold text-uppercase" style={{ background: 'var(--text-main)', color: 'var(--bg-primary)', border: 'none' }}>
                        Create Account
                    </button>
                </form>
                <div className="text-center mt-4">
                    <span className="text-muted small">Already have an account? </span>
                    <Link to="/login" className="text-decoration-none fw-bold" style={{ color: 'var(--text-main)' }}>Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
