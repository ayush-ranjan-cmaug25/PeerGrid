import React from 'react';

const MySessions = () => {
    return (
        <div className="container-fluid px-5 py-5">
            <h2 className="section-title mb-4">My Sessions</h2>
            <div className="glass-card p-5 text-center">
                <h3 style={{ color: 'var(--text-main)' }}>Session Management</h3>
                <p className="text-muted">Manage your upcoming and past sessions here.</p>
            </div>
        </div>
    );
};

export default MySessions;
