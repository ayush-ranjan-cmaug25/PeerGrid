import React, { useState, useEffect } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import GlassCard from '../components/GlassCard';
import { API_BASE_URL } from '../config';

const FindPeer = () => {
    const [peers, setPeers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPeers = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`${API_BASE_URL}/users`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setPeers(data);
                }
            } catch (error) {
                console.error("Failed to fetch peers", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPeers();
    }, []);

    const filteredPeers = peers.filter(peer => 
        peer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (peer.skillsOffered && peer.skillsOffered.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    return (
        <div className="container-fluid px-4 px-md-5 py-5">
            <ScrollReveal width="100%">
                <h2 className="display-5 fw-bold mb-4" style={{ color: 'var(--text-main)', letterSpacing: '-0.03em' }}>Find a Peer</h2>
                
                <GlassCard className="p-4 mb-5">
                    <div className="position-relative">
                        <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                        <input 
                            type="text" 
                            className="form-control ps-5 py-3 rounded-pill border-0" 
                            placeholder="Search for a skill (e.g., React, Python) or name..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ background: 'var(--bg-primary)', color: 'var(--text-main)' }}
                        />
                    </div>
                </GlassCard>

                {loading ? (
                    <div className="text-center text-muted">Loading peers...</div>
                ) : (
                    <div className="row g-4">
                        {filteredPeers.map(peer => (
                            <div key={peer.id} className="col-xl-3 col-lg-4 col-md-6">
                                <GlassCard className="h-100 p-4 d-flex flex-column align-items-center text-center transition-hover">
                                    <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white mb-3"
                                        style={{ width: '80px', height: '80px', background: 'var(--accent-primary)', fontSize: '1.5rem' }}>
                                        {peer.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <h4 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>{peer.name}</h4>
                                    <p className="text-muted small mb-3">Peer</p>
                                    
                                    <div className="mb-3 w-100">
                                        <div className="small text-uppercase fw-bold text-muted mb-2" style={{ fontSize: '0.7rem' }}>Skills Offered</div>
                                        <div className="d-flex flex-wrap justify-content-center gap-2">
                                            {peer.skillsOffered && peer.skillsOffered.map((skill, idx) => (
                                                <span key={idx} className="badge rounded-pill fw-normal" 
                                                    style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                                                    {skill}
                                                </span>
                                            ))}
                                            {(!peer.skillsOffered || peer.skillsOffered.length === 0) && <span className="text-muted small">-</span>}
                                        </div>
                                    </div>

                                    <div className="mt-auto w-100">
                                        <button className="btn btn-primary w-100 rounded-pill py-2" 
                                            style={{ background: 'var(--accent-primary)', border: 'none' }}>
                                            View Profile
                                        </button>
                                    </div>
                                </GlassCard>
                            </div>
                        ))}
                        {filteredPeers.length === 0 && (
                            <div className="col-12 text-center text-muted py-5">
                                No peers found matching your search.
                            </div>
                        )}
                    </div>
                )}
            </ScrollReveal>
        </div>
    );
};

export default FindPeer;
