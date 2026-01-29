import React, { useState } from 'react';
import ScrollReveal from '../ScrollReveal';

const SystemSettings = () => {
    const [config, setConfig] = useState({
        startingGP: 100,
        platformFee: 5,
        minSessionCost: 10,
        maxSessionCost: 500,
        minBounty: 20,
        maxBounty: 1000,
        jwtExpiry: 24,
        sessionTimeout: 30,
        smtpHost: 'smtp.example.com',
        smtpPort: 587,
        emailFrom: 'noreply@peergrid.com'
    });

    const handleChange = (e) => {
        setConfig({ ...config, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        alert('Settings saved successfully!');
    };

    return (
        <div className="container-fluid p-0">
            <div className="d-flex justify-content-end align-items-center mb-4">
                <button className="btn btn-primary" onClick={handleSave}>
                    <i className="bi bi-save me-2"></i> Save Changes
                </button>
            </div>

            <div className="row g-4">
                <div className="col-lg-6">
                    <ScrollReveal>
                        <div className="glass-card p-4 mb-4 h-100">
                            <h3 className="h5 fw-bold mb-4 text-primary"><i className="bi bi-sliders me-2"></i> Platform Configuration</h3>
                            
                            <div className="mb-3">
                                <label className="form-label small text-muted text-uppercase fw-bold">Default Starting GP</label>
                                <input type="number" className="form-control" name="startingGP" value={config.startingGP} onChange={handleChange} />
                            </div>
                            
                            <div className="mb-3">
                                <label className="form-label small text-muted text-uppercase fw-bold">Platform Fee (GP per session)</label>
                                <input type="number" className="form-control" name="platformFee" value={config.platformFee} onChange={handleChange} />
                            </div>

                            <div className="row g-3 mb-3">
                                <div className="col-6">
                                    <label className="form-label small text-muted text-uppercase fw-bold">Min Session Cost</label>
                                    <input type="number" className="form-control" name="minSessionCost" value={config.minSessionCost} onChange={handleChange} />
                                </div>
                                <div className="col-6">
                                    <label className="form-label small text-muted text-uppercase fw-bold">Max Session Cost</label>
                                    <input type="number" className="form-control" name="maxSessionCost" value={config.maxSessionCost} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="row g-3">
                                <div className="col-6">
                                    <label className="form-label small text-muted text-uppercase fw-bold">Min Bounty Reward</label>
                                    <input type="number" className="form-control" name="minBounty" value={config.minBounty} onChange={handleChange} />
                                </div>
                                <div className="col-6">
                                    <label className="form-label small text-muted text-uppercase fw-bold">Max Bounty Reward</label>
                                    <input type="number" className="form-control" name="maxBounty" value={config.maxBounty} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>

                <div className="col-lg-6">
                    <ScrollReveal delay={0.1}>
                        <div className="glass-card p-4 mb-4">
                            <h3 className="h5 fw-bold mb-4 text-danger"><i className="bi bi-shield-lock me-2"></i> Security Settings</h3>
                            
                            <div className="mb-3">
                                <label className="form-label small text-muted text-uppercase fw-bold">JWT Expiry Time (Hours)</label>
                                <input type="number" className="form-control" name="jwtExpiry" value={config.jwtExpiry} onChange={handleChange} />
                            </div>
                            
                            <div className="mb-3">
                                <label className="form-label small text-muted text-uppercase fw-bold">Session Timeout (Minutes)</label>
                                <input type="number" className="form-control" name="sessionTimeout" value={config.sessionTimeout} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="glass-card p-4">
                            <h3 className="h5 fw-bold mb-4 text-info"><i className="bi bi-envelope me-2"></i> Email Settings</h3>
                            
                            <div className="mb-3">
                                <label className="form-label small text-muted text-uppercase fw-bold">SMTP Host</label>
                                <input type="text" className="form-control" name="smtpHost" value={config.smtpHost} onChange={handleChange} />
                            </div>
                            
                            <div className="row g-3">
                                <div className="col-4">
                                    <label className="form-label small text-muted text-uppercase fw-bold">SMTP Port</label>
                                    <input type="number" className="form-control" name="smtpPort" value={config.smtpPort} onChange={handleChange} />
                                </div>
                                <div className="col-8">
                                    <label className="form-label small text-muted text-uppercase fw-bold">From Email</label>
                                    <input type="email" className="form-control" name="emailFrom" value={config.emailFrom} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </div>
    );
};

export default SystemSettings;
