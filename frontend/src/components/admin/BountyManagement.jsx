import React, { useState, useEffect } from 'react';
import ScrollReveal from '../ScrollReveal';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';

const BountyManagement = () => {
    const [bounties, setBounties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBounty, setSelectedBounty] = useState(null);

    useEffect(() => {
        fetchBounties();
    }, []);

    const fetchBounties = async () => {
        try {
            const data = await adminService.getBounties();
            const formattedBounties = data.map(b => ({
                id: b.id,
                title: b.title,
                postedBy: b.learner ? b.learner.name : 'Unknown',
                reward: b.cost,
                status: b.status,
                solutions: 0, // Placeholder
                date: new Date(b.startTime).toLocaleDateString(),
                description: b.description
            }));
            setBounties(formattedBounties);
        } catch (error) {
            console.error("Error fetching bounties", error);
        } finally {
            setLoading(false);
        }
    };

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [bountyToDelete, setBountyToDelete] = useState(null);

    const handleDelete = (id) => {
        setBountyToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!bountyToDelete) return;

        try {
            await adminService.deleteSession(bountyToDelete);
            setBounties(bounties.filter(b => b.id !== bountyToDelete));
            if (selectedBounty?.id === bountyToDelete) setSelectedBounty(null);
            toast.success('Bounty deleted successfully');
        } catch (error) {
            console.error("Error deleting bounty", error);
            toast.error(`Failed to delete bounty: ${error.message}`);
        } finally {
            setShowDeleteModal(false);
            setBountyToDelete(null);
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Open' ? 'Cancelled' : 'Open';
        try {
            await adminService.updateSessionStatus(id, newStatus);
            const updatedBounties = bounties.map(b => b.id === id ? { ...b, status: newStatus } : b);
            setBounties(updatedBounties);
            if (selectedBounty?.id === id) {
                setSelectedBounty(updatedBounties.find(b => b.id === id));
            }
            toast.success(`Bounty ${newStatus === 'Open' ? 'opened' : 'closed'} successfully`);
        } catch (error) {
           console.error("Error updating status", error);
           toast.error("Failed to update status");
        }
    };

    const handleResolveDispute = (id) => {
        toast('Dispute resolution flow initiated for bounty ' + id);
        // Logic to transfer GP manually would go here
    };

    if (loading) return <div className="p-5 text-center">Loading bounties...</div>;

    return (
        <div className="container-fluid p-0">


            <div className="row g-4">
                <div className="col-lg-7">
                    <ScrollReveal>
                        <div className="glass-card p-4">
                            <h3 className="h5 mb-4">All Bounties</h3>
                            {bounties.length === 0 ? (
                                <p className="text-muted">No active bounties found.</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table custom-table align-middle">
                                        <thead>
                                            <tr className="text-muted small text-uppercase">
                                                <th>Title</th>
                                                <th>Posted By</th>
                                                <th>Reward</th>
                                                <th>Status</th>
                                                <th className="text-end">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bounties.map(bounty => (
                                                <tr key={bounty.id} onClick={() => setSelectedBounty(bounty)} style={{ cursor: 'pointer', background: selectedBounty?.id === bounty.id ? 'var(--bg-card-hover)' : 'transparent' }}>
                                                    <td>
                                                        <div className="fw-bold text-truncate" style={{ maxWidth: '200px' }}>{bounty.title}</div>
                                                        <div className="small text-muted">{bounty.date}</div>
                                                    </td>
                                                    <td>{bounty.postedBy}</td>
                                                    <td className="fw-bold text-warning">{bounty.reward} GP</td>
                                                    <td>
                                                        <span className={`badge ${
                                                            bounty.status === 'Open' ? 'bg-success-subtle text-success' :
                                                            bounty.status === 'Solved' ? 'bg-primary-subtle text-primary' :
                                                            bounty.status === 'Disputed' ? 'bg-danger-subtle text-danger' :
                                                            'bg-secondary-subtle text-secondary'
                                                        }`}>
                                                            {bounty.status}
                                                        </span>
                                                    </td>
                                                    <td className="text-end">
                                                        <button className="btn btn-sm btn-link text-danger" onClick={(e) => { e.stopPropagation(); handleDelete(bounty.id); }}>
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </ScrollReveal>
                </div>

                <div className="col-lg-5">
                    {selectedBounty ? (
                        <div key={selectedBounty.id} className="sticky-top" style={{ top: '120px', animation: 'fadeIn 0.3s ease-out', zIndex: 10 }}>
                            <div className="glass-card p-4">
                                <div className="d-flex justify-content-between align-items-start mb-4">
                                    <h3 className="h5 fw-bold">Bounty Details</h3>
                                    <button className="btn-close" onClick={() => setSelectedBounty(null)}></button>
                                </div>
                                
                                <div className="mb-4">
                                    <h4 className="h6 text-muted text-uppercase small fw-bold">Title</h4>
                                    <p className="fs-5 fw-bold mb-1">{selectedBounty.title}</p>
                                    <div className="d-flex gap-2">
                                        <span className="badge bg-light text-dark border">{selectedBounty.status}</span>
                                        <span className="badge bg-warning text-dark border">{selectedBounty.reward} GP</span>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h4 className="h6 text-muted text-uppercase small fw-bold">Description</h4>
                                    <p className="small">
                                        {selectedBounty.description || 'No description provided.'}
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <h4 className="h6 text-muted text-uppercase small fw-bold mb-3">Solution Attempts ({selectedBounty.solutions})</h4>
                                    <div className="d-flex flex-column gap-2">
                                        <div className="p-3 rounded border bg-light text-center text-muted small">
                                            No solutions yet.
                                        </div>
                                    </div>
                                </div>

                                <div className="d-grid gap-2">
                                    <button 
                                        className={`btn ${selectedBounty.status === 'Open' ? 'btn-outline-secondary' : 'btn-outline-success'}`}
                                        onClick={() => handleToggleStatus(selectedBounty.id, selectedBounty.status)}
                                    >
                                        {selectedBounty.status === 'Open' ? 'Force Close Bounty' : 'Force Open Bounty'}
                                    </button>
                                    
                                    {selectedBounty.status === 'Disputed' && (
                                        <button className="btn btn-danger" onClick={() => handleResolveDispute(selectedBounty.id)}>Resolve Dispute</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="glass-card p-5 text-center text-muted">
                            <i className="bi bi-arrow-left-circle fs-1 mb-3 d-block"></i>
                            Select a bounty to view details
                        </div>
                    )}
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
                            <h4 className="fw-bold mb-2" style={{ color: 'var(--text-main)' }}>Delete Bounty?</h4>
                            <p className="text-muted mb-0">Are you sure you want to delete this bounty? <strong>Funds will be refunded/adjusted automatically.</strong> This action cannot be undone.</p>
                        </div>
                        <div className="d-flex justify-content-center gap-3">
                            <button className="btn btn-light px-4" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <button className="btn btn-danger px-4" onClick={confirmDelete}>Delete Bounty</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BountyManagement;
