import React from 'react';

const Wallet = () => {
    return (
        <div className="container-fluid px-5 py-5">
            <h2 className="section-title mb-4">My Wallet</h2>
            
            <div className="row g-4 mb-5">
                <div className="col-md-4">
                    <div className="glass-card p-4 text-center h-100 d-flex flex-column justify-content-center">
                        <div className="text-muted text-uppercase small fw-bold mb-2">Total Balance</div>
                        <div className="display-4 fw-bold mb-0" style={{ color: 'var(--text-main)' }}>1,250 <span className="fs-4 text-muted">GP</span></div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="glass-card p-4 text-center h-100 d-flex flex-column justify-content-center">
                        <div className="text-muted text-uppercase small fw-bold mb-2">Escrow (Locked)</div>
                        <div className="display-4 fw-bold mb-0 text-warning">300 <span className="fs-4 text-muted">GP</span></div>
                        <div className="small text-muted mt-2">Pending session completion</div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="glass-card p-4 text-center h-100 d-flex flex-column justify-content-center">
                        <div className="text-muted text-uppercase small fw-bold mb-2">Lifetime Earned</div>
                        <div className="display-4 fw-bold mb-0 text-success">5,400 <span className="fs-4 text-muted">GP</span></div>
                    </div>
                </div>
            </div>

            <h3 className="h4 mb-3" style={{ color: 'var(--text-main)' }}>Transaction History</h3>
            <div className="glass-card p-0 overflow-hidden">
                <table className="table mb-0" style={{ color: 'var(--text-main)' }}>
                    <thead style={{ background: 'var(--bg-card-hover)' }}>
                        <tr>
                            <th className="p-3" style={{ borderColor: 'var(--border-color)' }}>Date</th>
                            <th className="p-3" style={{ borderColor: 'var(--border-color)' }}>Description</th>
                            <th className="p-3" style={{ borderColor: 'var(--border-color)' }}>Type</th>
                            <th className="p-3 text-end" style={{ borderColor: 'var(--border-color)' }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="p-3" style={{ borderColor: 'var(--border-color)' }}>Oct 24, 2025</td>
                            <td className="p-3" style={{ borderColor: 'var(--border-color)' }}>Taught "React Hooks" Session</td>
                            <td className="p-3" style={{ borderColor: 'var(--border-color)' }}><span className="badge bg-success">Earned</span></td>
                            <td className="p-3 text-end text-success fw-bold" style={{ borderColor: 'var(--border-color)' }}>+50 GP</td>
                        </tr>
                        <tr>
                            <td className="p-3" style={{ borderColor: 'var(--border-color)' }}>Oct 22, 2025</td>
                            <td className="p-3" style={{ borderColor: 'var(--border-color)' }}>Bounty: "Fix CSS Grid Issue"</td>
                            <td className="p-3" style={{ borderColor: 'var(--border-color)' }}><span className="badge bg-success">Earned</span></td>
                            <td className="p-3 text-end text-success fw-bold" style={{ borderColor: 'var(--border-color)' }}>+100 GP</td>
                        </tr>
                        <tr>
                            <td className="p-3" style={{ borderColor: 'var(--border-color)' }}>Oct 20, 2025</td>
                            <td className="p-3" style={{ borderColor: 'var(--border-color)' }}>Learned "Advanced Calculus"</td>
                            <td className="p-3" style={{ borderColor: 'var(--border-color)' }}><span className="badge bg-danger">Spent</span></td>
                            <td className="p-3 text-end text-danger fw-bold" style={{ borderColor: 'var(--border-color)' }}>-40 GP</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Wallet;
