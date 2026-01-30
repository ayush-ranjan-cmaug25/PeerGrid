import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { Toaster } from 'react-hot-toast';
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
import Webinars from './pages/Webinars';
import WebinarRoom from './pages/WebinarRoom';
import PageTitleUpdater from './components/PageTitleUpdater';
import { ChatProvider } from './context/ChatContext';
import './App.css';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || 'guest');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
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
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    
    if (!document.startViewTransition) {
      setTheme(newTheme);
      return;
    }

    const x = e?.clientX ?? window.innerWidth / 2;
    const y = e?.clientY ?? window.innerHeight / 2;

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      setTheme(newTheme);
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
    localStorage.setItem('userRole', role);
  };

  const handleLogout = () => {
    setUserRole('guest');
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
  };

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        if (userRole !== 'guest') {
           handleLogout();
        }
        return;
      }

      const decoded = parseJwt(token);
      if (!decoded || decoded.exp * 1000 < Date.now()) {
        handleLogout();
      }
    };

    checkAuth();
    const interval = setInterval(checkAuth, 60000);
    return () => clearInterval(interval);
  }, [userRole]);

  return (
    <ChatProvider onLogout={handleLogout}>
      <BrowserRouter>
        <PageTitleUpdater />
        <Toaster 
          position="top-right" 
          reverseOrder={false}
          toastOptions={{
            style: {
              background: theme === 'dark' ? 'rgba(30, 41, 59, 0.9)' : '#fff',
              color: theme === 'dark' ? '#fff' : '#333',
              backdropFilter: 'blur(10px)',
              border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
            },
            success: {
              iconTheme: {
                primary: theme === 'dark' ? '#818cf8' : '#4f46e5',
                secondary: theme === 'dark' ? '#fff' : '#fff',
              },
            },
          }} 
        />
        <div className="app-container">
          <AnimatedBackground theme={theme} />
          
          <Routes>
            <Route path="/landing" element={<Home theme={theme} toggleTheme={toggleTheme} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} theme={theme} toggleTheme={toggleTheme} userRole={userRole} />} />
            <Route path="/register" element={<Register theme={theme} toggleTheme={toggleTheme} userRole={userRole} />} />
            
            <Route path="/" element={<Home theme={theme} toggleTheme={toggleTheme} userRole={userRole} onLogout={handleLogout} />} />
            
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['admin']} onLogout={handleLogout}>
                  <AdminDashboard theme={theme} toggleTheme={toggleTheme} onLogout={handleLogout} />
                </ProtectedRoute>
              } 
            />
            
            <Route element={<Layout theme={theme} toggleTheme={toggleTheme} userRole={userRole} onLogout={handleLogout} />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="find-peer" element={<FindPeer />} />
              <Route path="doubt-board" element={<DoubtBoard />} />

              <Route path="profile/:id?" element={<Profile />} />
              <Route path="feedback" element={<Feedback />} />
              <Route path="webinars" element={<Webinars theme={theme} toggleTheme={toggleTheme} />} />
            </Route>
            
            <Route path="/webinar/:id" element={<WebinarRoom />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ChatProvider>
  );
}

export default App;
