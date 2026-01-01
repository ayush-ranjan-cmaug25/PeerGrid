import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import logoLight from '../assets/logo-light.jpg';
import logoDark from '../assets/logo-dark.jpg';

const Register = ({ theme, toggleTheme, userRole }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (userRole && userRole !== 'guest') {
            navigate(userRole === 'admin' ? '/admin-dashboard' : '/dashboard');
        }
    }, [userRole, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Regex Validation
        const nameRegex = /^[a-zA-Z\s]{2,30}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

        if (!nameRegex.test(formData.name)) {
            toast.error("Name must contain only letters and spaces (2-30 characters).");
            return;
        }
        if (!emailRegex.test(formData.email)) {
            toast.error("Please enter a valid email address.");
            return;
        }
        if (!passwordRegex.test(formData.password)) {
            toast.error("Password must be at least 8 characters long and contain at least one letter and one number.");
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name: formData.name,
                    email: formData.email,
                    passwordHash: formData.password, 
                    role: 'User'
                })
            });

            if (response.ok) {
                toast.success('Registration successful! Please login.');
                navigate('/login');
            } else {
                const data = await response.json();
                toast.error(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast.error('Registration failed (Backend unreachable)');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/google-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken: credentialResponse.credential })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                toast.success('Google Login successful!');
                navigate('/dashboard'); 
                window.location.reload(); // Force reload to update auth state if context is not available
            } else {
                toast.error(data.message || 'Google Login failed');
            }
        } catch (error) {
            console.error('Google Login error:', error);
            toast.error('Google Login failed');
        }
    };

    return (
        <div className="min-vh-100 position-relative d-flex flex-column">
            <Navbar theme={theme} toggleTheme={toggleTheme} userRole="guest" />

            <div className="flex-grow-1 d-flex align-items-center justify-content-center px-4" style={{ paddingTop: '80px' }}>
                <GlassCard 
                    className="p-4 p-md-5 animate-fade-in-up position-relative overflow-hidden"
                    style={{ maxWidth: '450px', width: '100%' }}
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
                            <h2 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>Join PeerGrid</h2>
                            <p className="text-muted small">Start exchanging skills today</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label text-muted small text-uppercase fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Full Name</label>
                                <div className="input-group">
                                    <span className="input-group-text border-0 bg-transparent ps-0" style={{ color: 'var(--text-muted)' }}>
                                        <i className="bi bi-person"></i>
                                    </span>
                                    <input 
                                        type="text" 
                                        name="name"
                                        className="form-control border-0 border-bottom rounded-0 px-2" 
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required 
                                        style={{ background: 'transparent', color: 'var(--text-main)', borderColor: 'var(--border-color)', boxShadow: 'none' }}
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-muted small text-uppercase fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Email Address</label>
                                <div className="input-group">
                                    <span className="input-group-text border-0 bg-transparent ps-0" style={{ color: 'var(--text-muted)' }}>
                                        <i className="bi bi-envelope"></i>
                                    </span>
                                    <input 
                                        type="email" 
                                        name="email"
                                        className="form-control border-0 border-bottom rounded-0 px-2" 
                                        placeholder="name@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
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
                                        type={showPassword ? "text" : "password"} 
                                        name="password"
                                        className="form-control border-0 border-bottom rounded-0 px-2" 
                                        placeholder="Create a password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required 
                                        style={{ background: 'transparent', color: 'var(--text-main)', borderColor: 'var(--border-color)', boxShadow: 'none' }}
                                    />
                                    <button 
                                        type="button"
                                        className="btn border-0 bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ color: 'var(--text-muted)' }}
                                    >
                                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                    </button>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary w-100 py-3 fw-bold rounded-pill shadow-sm mb-3 transition-transform" 
                                style={{ background: 'var(--accent-primary)', border: 'none', letterSpacing: '0.03em' }}>
                                CREATE ACCOUNT
                            </button>
                        </form>

                        <div className="d-flex justify-content-center mb-3">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => {
                                    console.log('Login Failed');
                                    toast.error('Google Login Failed');
                                }}
                                theme={theme === 'dark' ? 'filled_black' : 'outline'}
                                shape="pill"
                                width="300"
                                text="signup_with"
                            />
                        </div>
                        <div className="text-center">
                            <span className="text-muted small">Already have an account? </span>
                            <Link to="/login" className="text-decoration-none fw-bold" style={{ color: 'var(--text-main)' }}>Login</Link>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default Register;
