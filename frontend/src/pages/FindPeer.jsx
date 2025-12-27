import React from 'react';

const FindPeer = () => {
    return (
        <div className="container-fluid px-5 py-5">
            <h2 className="section-title mb-4">Find a Peer</h2>
            <div className="glass-card p-5 text-center">
                <h3 style={{ color: 'var(--text-main)' }}>Skill & Matching Module</h3>
                <p className="text-muted">Search for peers by skill, availability, and rating.</p>
                <div className="mt-4">
                    <input type="text" className="form-control w-50 mx-auto" placeholder="Search for a skill (e.g., React, Python)..." />
                </div>
            </div>
        </div>
    );
};

export default FindPeer;
