import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import DoubtBoard from './pages/DoubtBoard';
import Profile from './pages/Profile';
import FindPeer from './pages/FindPeer';
import AnimatedBackground from './components/AnimatedBackground';
import Feedback from './pages/Feedback';
import './App.css';

function App() {
  const [theme, setTheme] = useState('light');
  const [userRole, setUserRole] = useState('guest');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const lenis = new Lenis();

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);

  const toggleTheme = async (e) => {
    if (!document.startViewTransition) {
      setTheme(prev => prev === 'dark' ? 'light' : 'dark');
      return;
    }

    const x = e?.clientX ?? window.innerWidth / 2;
    const y = e?.clientY ?? window.innerHeight / 2;

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    });

    await transition.ready;

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 500,
        easing: 'ease-in',
        pseudoElement: '::view-transition-new(root)',
      }
    );
  };

  const handleLogin = (role) => {
    setUserRole(role);
  };

  const handleLogout = () => {
    setUserRole('guest');
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        <AnimatedBackground theme={theme} />
        
        <Routes>
          <Route path="/landing" element={<Home theme={theme} toggleTheme={toggleTheme} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={userRole === 'guest' ? <Home theme={theme} toggleTheme={toggleTheme} /> : <Navigate to={userRole === 'admin' ? "/admin-dashboard" : "/dashboard"} replace />} />
          
          <Route element={<Layout theme={theme} toggleTheme={toggleTheme} userRole={userRole} onLogout={handleLogout} />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="admin-dashboard" element={<AdminDashboard />} />
            <Route path="find-peer" element={<FindPeer />} />
            <Route path="doubt-board" element={<DoubtBoard />} />
            <Route path="find-peer" element={<FindPeer />} />
            <Route path="doubt-board" element={<DoubtBoard />} />

            <Route path="user-profile" element={<Profile />} />
            <Route path="feedback" element={<Feedback />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
