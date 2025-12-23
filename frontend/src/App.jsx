import ApiDocs from './components/ApiDocs';
import DoubtBoard from './components/DoubtBoard';
import SessionDashboard from './components/SessionDashboard';
import SkillProfile from './components/SkillProfile';
import './App.css';
import { useState } from 'react';

import logo from './assets/logo.svg';

function App() {
  const [showDocs, setShowDocs] = useState(false);

  return (
    <div className="app-container">
      <nav className="glass-nav">
        <div className="logo">
            <img src={logo} alt="PeerGrid Logo" className="logo-img" /> PeerGrid
        </div>
        <div className="nav-links">
            <button className="nav-btn active">Dashboard</button>
            <button className="nav-btn">Community</button>
            <button className="nav-btn" onClick={() => setShowDocs(!showDocs)}>
                {showDocs ? 'Back to App' : 'API Docs'}
            </button>
        </div>
      </nav>
      
      {showDocs ? (
        <div className="pt-24 px-6 h-screen">
            <ApiDocs />
        </div>
      ) : (
        <>
            <header className="hero-section">
                <div className="hero-content">
                    <div className="hero-text">
                        <h1 className="hero-title">The Knowledge <span className="text-gradient">Exchange</span></h1>
                        <p className="hero-subtitle">Connect, Teach, and Earn. The decentralized grid for peer-to-peer learning.</p>
                    </div>
                    
                    <div className="hero-visuals">
                        <div className="exchange-card teaching">
                            <div className="card-glow"></div>
                            <div className="card-content">
                                <div className="user-avatar">👨‍💻</div>
                                <div className="action-details">
                                    <span className="action-label">TEACHING</span>
                                    <span className="action-subject">React Hooks</span>
                                    <span className="grid-points positive">+30 GP</span>
                                </div>
                            </div>
                        </div>

                        <div className="connection-line">
                            <div className="moving-particle"></div>
                            <div className="center-logo-glow">
                                <img src={logo} alt="PG" className="center-logo" />
                            </div>
                        </div>

                        <div className="exchange-card learning">
                            <div className="card-glow"></div>
                            <div className="card-content">
                                <div className="user-avatar">👩‍🎓</div>
                                <div className="action-details">
                                    <span className="action-label">LEARNING</span>
                                    <span className="action-subject">Calculus II</span>
                                    <span className="grid-points negative">-30 GP</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="main-grid">
                <div className="grid-col">
                    <SkillProfile />
                </div>
                <div className="grid-col">
                    <SessionDashboard />
                </div>
                <div className="grid-col">
                    <DoubtBoard />
                </div>
            </main>
        </>
      )}
    </div>
  );
}

export default App;
