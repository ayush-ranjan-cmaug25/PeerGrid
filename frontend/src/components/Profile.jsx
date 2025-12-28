import React, { useState } from 'react';
import './Profile.css';

const Profile = ({ user }) => {
    const [newOffered, setNewOffered] = useState('');
    const [newNeeded, setNewNeeded] = useState('');

    if (!user) return <div>Loading...</div>;

    const skillsOffered = user.skillsOffered || [];
    const skillsNeeded = user.skillsNeeded || [];

    const addOffered = () => {
        // TODO: Implement API call to update skills
        console.log("Add offered:", newOffered);
        setNewOffered('');
    };

    const addNeeded = () => {
        // TODO: Implement API call to update skills
        console.log("Add needed:", newNeeded);
        setNewNeeded('');
    };

    return (
        <div className="glass-card profile-container">
            <div className="profile-header">
                <div className="profile-avatar">
                    {user.name ? user.name.substring(0, 2).toUpperCase() : 'PG'}
                </div>
                <div className="profile-info">
                    <h2>{user.name}</h2>
                    <p>Grid Points: <span className="highlight-points">{user.gridPoints}</span></p>
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
                {/* Inputs hidden for now until connected */}
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
            </div>
        </div>
    );
};

export default Profile;
