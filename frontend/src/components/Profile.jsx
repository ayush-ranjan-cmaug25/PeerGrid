import React, { useRef } from 'react';
import GlassCard from './GlassCard';
import './Profile.css';

const SKILL_ICONS = {
    'Python': 'bi-filetype-py',
    'Java': 'bi-filetype-java',
    'JavaScript': 'bi-filetype-js',
    'TypeScript': 'bi-filetype-tsx',
    'HTML': 'bi-filetype-html',
    'CSS': 'bi-filetype-css',
    'React': 'bi-filetype-jsx',
    'C#': 'bi-filetype-cs',
    'SQL': 'bi-database',
    'Docker': 'bi-box-seam',
    'Git': 'bi-git',
    'Linux': 'bi-terminal',
    'Android': 'bi-android2',
    'Apple': 'bi-apple',
    'Windows': 'bi-windows',
    'default': 'bi-code-square'
};

const SkillBadge = ({ skill, type }) => {
    const iconClass = SKILL_ICONS[skill] || SKILL_ICONS['default'];
    const colorStyle = type === 'offered' 
        ? { background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', border: '1px solid rgba(99, 102, 241, 0.2)' }
        : { background: 'rgba(236, 72, 153, 0.1)', color: 'var(--accent-secondary)', border: '1px solid rgba(236, 72, 153, 0.2)' };

    return (
        <span className="badge rounded-pill fw-normal px-3 py-2 d-flex align-items-center gap-2" style={colorStyle}>
            <i className={`bi ${iconClass}`}></i>
            {skill}
        </span>
    );
};

const Profile = ({ user, isOwnProfile, onEditPhoto, onEditSkillsOffered, onEditSkillsNeeded, onBook, onMessage }) => {
    const fileInputRef = useRef(null);

    if (!user) return <div>Loading...</div>;

    const skillsOffered = user.skillsOffered || [];
    const skillsNeeded = user.skillsNeeded || [];

    const handlePhotoClick = () => {
        if (isOwnProfile && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && onEditPhoto) {
            onEditPhoto(file);
        }
    };

    return (
        <GlassCard className="profile-container p-4">
            <div className="text-center mb-4 position-relative">
                <div className="position-relative mx-auto mb-3" style={{ width: '100px', height: '100px' }}>
                    <div className="profile-avatar w-100 h-100" 
                        style={{ 
                            fontSize: '2.5rem', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            background: user.profilePictureUrl ? `url(${user.profilePictureUrl}) center/cover` : 'var(--accent-primary)', 
                            color: 'white', 
                            borderRadius: '50%',
                            overflow: 'hidden'
                        }}>
                        {!user.profilePictureUrl && (user.name ? user.name.substring(0, 2).toUpperCase() : 'PG')}
                    </div>
                    
                    {isOwnProfile && (
                        <>
                            <button 
                                className="btn btn-sm btn-light position-absolute bottom-0 end-0 rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                                style={{ width: '32px', height: '32px', border: '1px solid var(--border-color)' }}
                                onClick={handlePhotoClick}
                            >
                                <i className="bi bi-pencil-fill small text-dark"></i>
                            </button>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                style={{ display: 'none' }} 
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </>
                    )}
                </div>

                <h2 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>{user.name}</h2>
                <p className="text-muted mb-2">{user.role}</p>
                <div className="badge bg-warning text-dark mb-3">
                    <i className="bi bi-lightning-fill me-1"></i>
                    {user.gridPoints} GP
                </div>
                
                {user.bio && (
                    <p className="text-muted small px-3 mb-4 fst-italic">
                        "{user.bio}"
                    </p>
                )}

                {!isOwnProfile && (
                    <div className="d-flex gap-2 justify-content-center">
                        <button className="btn btn-outline-primary rounded-pill px-4" onClick={() => onMessage(user)} style={{ borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)' }}>
                            <i className="bi bi-chat-dots me-2"></i>Message
                        </button>
                        {onBook && (
                            <button className="btn btn-primary rounded-pill px-4" onClick={onBook} style={{ background: 'var(--accent-primary)', border: 'none' }}>
                                <i className="bi bi-calendar-check me-2"></i>Book Session
                            </button>
                        )}
                    </div>
                )}
            </div>
            
            <div className="skills-section mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="skills-title h6 text-uppercase text-muted fw-bold mb-0">Skills Offered</h3>
                    {isOwnProfile && (
                        <button className="btn btn-link p-0 text-muted" onClick={onEditSkillsOffered}>
                            <i className="bi bi-pencil-square"></i>
                        </button>
                    )}
                </div>
                <div className="d-flex flex-wrap gap-2">
                    {skillsOffered.length > 0 ? skillsOffered.map((skill, index) => (
                        <SkillBadge key={index} skill={skill} type="offered" />
                    )) : <span className="text-muted small">No skills listed</span>}
                </div>
            </div>

            <div className="skills-section">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="skills-title h6 text-uppercase text-muted fw-bold mb-0">Skills Needed</h3>
                    {isOwnProfile && (
                        <button className="btn btn-link p-0 text-muted" onClick={onEditSkillsNeeded}>
                            <i className="bi bi-pencil-square"></i>
                        </button>
                    )}
                </div>
                <div className="d-flex flex-wrap gap-2">
                    {skillsNeeded.length > 0 ? skillsNeeded.map((skill, index) => (
                        <SkillBadge key={index} skill={skill} type="needed" />
                    )) : <span className="text-muted small">No skills listed</span>}
                </div>
            </div>
        </GlassCard>
    );
};

export default Profile;
