import React from 'react';
import DoubtBoardWidget from '../components/DoubtBoardWidget';
import ScrollReveal from '../components/ScrollReveal';

const DoubtBoard = () => {
    return (
        <div className="container-fluid px-5 py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="section-title mb-0">Doubt Board</h2>
                <button className="btn btn-primary" style={{ background: 'var(--text-main)', color: 'var(--bg-primary)', border: 'none' }}>
                    Post a Doubt
                </button>
            </div>
            
            <div className="row g-4">
                <div className="col-lg-8">
                    <ScrollReveal width="100%">
                        <DoubtBoardWidget />
                    </ScrollReveal>
                </div>
                <div className="col-lg-4">
                    <div className="glass-card p-4">
                        <h4 className="mb-3" style={{ color: 'var(--text-main)' }}>Top Solvers</h4>
                        <div className="d-flex align-items-center gap-3 mb-3">
                            <div className="user-avatar" style={{ width: '40px', height: '40px', fontSize: '1.2rem' }}>🏆</div>
                            <div>
                                <div style={{ color: 'var(--text-main)', fontWeight: '600' }}>Alex Chen</div>
                                <div className="small text-muted">1500 GP Earned</div>
                            </div>
                        </div>
                        <div className="d-flex align-items-center gap-3 mb-3">
                            <div className="user-avatar" style={{ width: '40px', height: '40px', fontSize: '1.2rem' }}>🥈</div>
                            <div>
                                <div style={{ color: 'var(--text-main)', fontWeight: '600' }}>Sarah Jones</div>
                                <div className="small text-muted">1200 GP Earned</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoubtBoard;
