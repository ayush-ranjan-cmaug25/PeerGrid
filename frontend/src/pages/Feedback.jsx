import React, { useState } from 'react';
import '../App.css';

const Feedback = () => {
    const [formData, setFormData] = useState({
        sessionId: '',
        rating: 5,
        comment: ''
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Feedback Submitted", formData);
        setSubmitted(true);
        // Backend API call here
    };

    return (
        <div className="container-fluid px-5 py-5">
            <h2 className="section-title mb-4">Session Feedback</h2>
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="glass-card p-5">
                        {submitted ? (
                            <div className="text-center">
                                <h3 className="text-success mb-3">Thank You!</h3>
                                <p className="text-muted">Your feedback helps us improve the PeerGrid experience.</p>
                                <button className="btn btn-primary mt-3" onClick={() => setSubmitted(false)}>Submit Another</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label text-muted small text-uppercase fw-bold">Session ID</label>
                                    <input 
                                        type="text" 
                                        name="sessionId"
                                        className="form-control"
                                        value={formData.sessionId}
                                        onChange={handleChange}
                                        placeholder="Enter Session ID"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-muted small text-uppercase fw-bold">Rating</label>
                                    <select 
                                        name="rating"
                                        className="form-select"
                                        value={formData.rating}
                                        onChange={handleChange}
                                        style={{ 
                                            color: 'var(--text-main)', 
                                            background: 'var(--bg-card-hover)', 
                                            borderColor: 'var(--border-color)',
                                            padding: '12px 16px',
                                            borderRadius: '8px'
                                        }}
                                    >
                                        <option value="5" style={{ color: '#000' }}>5 - Excellent</option>
                                        <option value="4" style={{ color: '#000' }}>4 - Good</option>
                                        <option value="3" style={{ color: '#000' }}>3 - Average</option>
                                        <option value="2" style={{ color: '#000' }}>2 - Poor</option>
                                        <option value="1" style={{ color: '#000' }}>1 - Terrible</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label text-muted small text-uppercase fw-bold">Comments</label>
                                    <textarea 
                                        name="comment"
                                        rows="4"
                                        className="form-control"
                                        value={formData.comment}
                                        onChange={handleChange}
                                        placeholder="Share your experience..."
                                        style={{ color: 'var(--text-main)' }}
                                        required
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary w-100 py-2 fw-bold text-uppercase" style={{ background: 'var(--text-main)', color: 'var(--bg-primary)', border: 'none' }}>
                                    Submit Feedback
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Feedback;
