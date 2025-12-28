import React, { useState } from 'react';
import GlassCard from './GlassCard';
import { API_BASE_URL } from '../config';

const CreateDoubtModal = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        topic: '',
        bounty: 50
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${API_BASE_URL}/sessions/doubts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                onSuccess();
                onClose();
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to post doubt');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
            style={{ zIndex: 1050, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)' }}>
            <GlassCard className="p-4" style={{ width: '90%', maxWidth: '500px' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="h4 fw-bold mb-0">Post a Doubt</h3>
                    <button onClick={onClose} className="btn-close btn-close-white"></button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label text-muted small">Title</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                            required
                            placeholder="e.g., React useEffect Loop"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-muted small">Topic</label>
                        <select 
                            className="form-select"
                            value={formData.topic}
                            onChange={e => setFormData({...formData, topic: e.target.value})}
                            required
                        >
                            <option value="">Select Topic</option>
                            <option value="React">React</option>
                            <option value="Node.js">Node.js</option>
                            <option value="Python">Python</option>
                            <option value="C#">C#</option>
                            <option value="Java">Java</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-muted small">Description</label>
                        <textarea 
                            className="form-control" 
                            rows="3"
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            required
                            placeholder="Describe your issue..."
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="form-label text-muted small">Bounty (Grid Points)</label>
                        <input 
                            type="number" 
                            className="form-control" 
                            value={formData.bounty}
                            onChange={e => setFormData({...formData, bounty: parseInt(e.target.value)})}
                            min="10"
                            required
                        />
                    </div>
                    <div className="d-flex gap-2 justify-content-end">
                        <button type="button" onClick={onClose} className="btn btn-outline-light border-0">Cancel</button>
                        <button type="submit" className="btn btn-primary px-4" disabled={loading}>
                            {loading ? 'Posting...' : 'Post Doubt'}
                        </button>
                    </div>
                </form>
            </GlassCard>
        </div>
    );
};

export default CreateDoubtModal;
