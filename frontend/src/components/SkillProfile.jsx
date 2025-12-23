import React, { useState } from 'react';
import './SkillProfile.css';

const SkillProfile = () => {
    const [skillsOffered, setSkillsOffered] = useState(['React', 'JavaScript']);
    const [skillsNeeded, setSkillsNeeded] = useState(['Calculus', 'Python']);
    const [newOffered, setNewOffered] = useState('');
    const [newNeeded, setNewNeeded] = useState('');

    const addOffered = () => {
        if (newOffered) {
            setSkillsOffered([...skillsOffered, newOffered]);
            setNewOffered('');
        }
    };

    const addNeeded = () => {
        if (newNeeded) {
            setSkillsNeeded([...skillsNeeded, newNeeded]);
            setNewNeeded('');
        }
    };

    return (
        <div className="glass-card profile-container">
            <div className="profile-header">
                <div className="profile-avatar">
                    PG
                </div>
                <div className="profile-info">
                    <h2>Student Profile</h2>
                    <p>Grid Points: <span className="highlight-points">120</span></p>
                </div>
            </div>
            
            <div className="skills-section">
                <h3 className="skills-title">Skills Offered</h3>
                <div className="skill-tags">
                    {skillsOffered.map((skill, index) => (
                        <span key={index} className="skill-tag offered">
                            {skill}
                        </span>
                    ))}
                </div>
                <div className="add-skill-row">
                    <input 
                        value={newOffered} 
                        onChange={(e) => setNewOffered(e.target.value)} 
                        placeholder="Add skill..." 
                        className="add-skill-input"
                    />
                    <button onClick={addOffered} className="add-btn">+</button>
                </div>
            </div>

            <div className="skills-section">
                <h3 className="skills-title">Skills Needed</h3>
                <div className="skill-tags">
                    {skillsNeeded.map((skill, index) => (
                        <span key={index} className="skill-tag needed">
                            {skill}
                        </span>
                    ))}
                </div>
                <div className="add-skill-row">
                    <input 
                        value={newNeeded} 
                        onChange={(e) => setNewNeeded(e.target.value)} 
                        placeholder="Add skill..." 
                        className="add-skill-input"
                    />
                    <button onClick={addNeeded} className="add-btn">+</button>
                </div>
            </div>
        </div>
    );
};

export default SkillProfile;
