import React, { useState, useEffect } from 'react';
import ScrollReveal from '../ScrollReveal';
import { adminService } from '../../services/adminService';

import toast from 'react-hot-toast';

const SkillsManagement = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newSkill, setNewSkill] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [skillToDelete, setSkillToDelete] = useState(null);

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const data = await adminService.getSkills();
            // Data is [{ label: 'React', value: 10 }, ...]
            const formattedSkills = data.map((s, index) => ({
                id: index,
                name: s.label,
                count: s.value,
                activeSessions: 0 // Placeholder
            }));
            setSkills(formattedSkills);
        } catch (error) {
            console.error("Error fetching skills", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSkill = (e) => {
        e.preventDefault();
        if (newSkill.trim()) {
            // In a real app, call API to add skill
            setSkills([...skills, { id: Date.now(), name: newSkill, count: 0, activeSessions: 0 }]);
            setNewSkill('');
            toast.success('Skill added successfully');
        }
    };

    const handleDelete = (id) => {
        setSkillToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (skillToDelete !== null) {
             setSkills(skills.filter(s => s.id !== skillToDelete));
             toast.success('Skill deleted successfully');
        }
        setShowDeleteModal(false);
        setSkillToDelete(null);
    };

    if (loading) return <div className="p-5 text-center">Loading skills...</div>;

    return (
        <div className="container-fluid p-0">


            <div className="row g-4">
                <div className="col-lg-8">
                    <ScrollReveal>
                        <div className="glass-card p-4 mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h3 className="h5 fw-bold mb-0">Skills</h3>
                                <form onSubmit={handleAddSkill} className="d-flex align-items-center gap-2">
                                    <input 
                                        type="text" 
                                        className="form-control m-0" 
                                        placeholder="New Skill Name" 
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        style={{ width: '220px', height: '38px' }}
                                    />
                                    <button type="submit" className="btn btn-primary px-4 m-0 d-flex align-items-center justify-content-center" style={{ height: '38px' }}>Add</button>
                                </form>
                            </div>
                            
                            <div className="table-responsive">
                                <table className="table custom-table align-middle">
                                    <thead>
                                        <tr className="text-muted small text-uppercase">
                                            <th>Skill Name</th>
                                            <th>Users Offering</th>
                                            <th className="text-end">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {skills.map(skill => (
                                            <tr key={skill.id}>
                                                <td className="fw-bold">{skill.name}</td>
                                                <td>{skill.count}</td>
                                                <td className="text-end">
                                                    <button className="btn btn-sm btn-link text-danger" onClick={() => handleDelete(skill.id)}><i className="bi bi-trash"></i></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>

                <div className="col-lg-4">
                    <ScrollReveal delay={0.2}>
                        <div className="glass-card p-4 mb-4">
                            <h3 className="h5 fw-bold mb-4">Trending Skills</h3>
                            <div className="d-flex flex-wrap gap-2">
                                {skills.slice(0, 8).map((skill, i) => (
                                    <span key={i} className="badge bg-light text-dark border p-2">
                                        {skill.name} <i className="bi bi-arrow-up-right ms-1 text-success" style={{ fontSize: '0.7em' }}></i>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.6)', zIndex: 1070, backdropFilter: 'blur(4px)' }}>
                    <div className="glass-card p-4 text-center" style={{ width: '400px', maxWidth: '90%', animation: 'zoomIn 0.2s ease' }}>
                        <div className="mb-4">
                            <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px' }}>
                                <i className="bi bi-exclamation-triangle-fill fs-3"></i>
                            </div>
                            <h4 className="fw-bold mb-2" style={{ color: 'var(--text-main)' }}>Delete Skill?</h4>
                            <p className="text-muted mb-0">Are you sure you want to delete this skill? This action cannot be undone.</p>
                        </div>
                        <div className="d-flex justify-content-center gap-3">
                            <button className="btn btn-light px-4" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <button className="btn btn-danger px-4" onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SkillsManagement;
