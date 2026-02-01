import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import ScrollReveal from '../ScrollReveal';

import toast from 'react-hot-toast';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    
    // Modals State
    const [selectedUser, setSelectedUser] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showGPModal, setShowGPModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [gpAdjustment, setGpAdjustment] = useState({ userId: null, amount: 0, reason: '' });
    const [userToDelete, setUserToDelete] = useState(null);

    // Form State for Add User
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        role: 'User',
        gp: 0
    });

    const getInitials = (name) => {
        if (!name) return '';
        const parts = name.trim().split(' ');
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await adminService.getUsers();
            // Transform data to match table structure if needed
            const formattedUsers = data.map(u => ({
                id: u.id,
                name: u.name,
                email: u.email,
                role: u.role || 'User',
                status: u.banned ? 'Banned' : (u.available ? 'Active' : 'Busy'), 
                gp: u.gridPoints || 0,
                joinDate: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '2023-01-01',
                lastActive: 'Recently'
            }));
            setUsers(formattedUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    // Handlers
    const handleSearch = (e) => setSearchTerm(e.target.value);
    const handleFilter = (e) => setFilterStatus(e.target.value);
    
    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const createdUser = await adminService.createUser(newUser);
            
            const formattedUser = {
                id: createdUser.id,
                name: createdUser.name,
                email: createdUser.email,
                role: createdUser.role || 'User',
                status: 'Active',
                gp: createdUser.gridPoints || 0,
                joinDate: new Date().toLocaleDateString(),
                lastActive: 'Just now'
            };

            setUsers([formattedUser, ...users]);
            setShowAddModal(false);
            setNewUser({ name: '', email: '', password: '', role: 'User', gp: 0 });
            toast.success('User created successfully!');
        } catch (error) {
            console.error('Error creating user:', error);
            toast.error('Failed to create user: ' + (error.message || 'Unknown error'));
        }
    };

    const handleDelete = (id) => {
        setUserToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;
        try {
            await adminService.deleteUser(userToDelete);
            setUsers(users.filter(u => u.id !== userToDelete));
            setShowDeleteModal(false);
            setUserToDelete(null);
            toast.success('User deleted successfully');
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Failed to delete user');
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await adminService.updateUserStatus(id, newStatus);
            setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
            toast.success(`User status updated to ${newStatus}`);
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    const openGPModal = (userId) => {
        setGpAdjustment({ userId, amount: 0, reason: '' });
        setShowGPModal(true);
    };

    const handleSubmitGP = async (e) => {
        e.preventDefault();
        try {
            await adminService.updateUserGP(gpAdjustment.userId, parseInt(gpAdjustment.amount));
            setUsers(users.map(u => u.id === gpAdjustment.userId ? { ...u, gp: u.gp + parseInt(gpAdjustment.amount) } : u));
            setShowGPModal(false);
            toast.success('Grid Points adjusted successfully');
        } catch (error) {
            console.error('Error adjusting GP:', error);
            toast.error('Failed to adjust GP');
        }
    };

    // Filtering and Sorting Logic
    let filteredUsers = users.filter(user => 
        (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
         user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterStatus === 'All' || user.status === filterStatus)
    );

    if (sortConfig.key) {
        filteredUsers.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    }

    return (
        <div className="container-fluid p-0">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="h4 fw-bold mb-1" style={{ color: 'var(--text-main)' }}>User Management</h2>
                    <p className="text-muted small mb-0">Manage system users, roles, and permissions</p>
                </div>
                <button 
                    className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm" 
                    onClick={() => setShowAddModal(true)}
                    style={{ background: 'var(--accent-primary)', border: 'none' }}
                >
                    <i className="bi bi-plus-lg"></i> 
                    <span>Add New User</span>
                </button>
            </div>


            <ScrollReveal>
                <div className="glass-card p-0 mb-4">
                    {/* Toolbar */}
                    <div className="p-4 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                        <div className="row g-3 align-items-center">
                            <div className="col-md-4">
                                <div className="position-relative" style={{ height: '45px' }}>
                                    <i className="bi bi-search position-absolute top-50 translate-middle-y text-muted" style={{ left: '15px', zIndex: 10 }}></i>
                                    <input 
                                        type="text" 
                                        className="form-control ps-5 bg-transparent h-100" 
                                        placeholder="Search users..." 
                                        value={searchTerm}
                                        onChange={handleSearch}
                                        style={{ borderColor: 'var(--border-color)', boxShadow: 'none', color: 'var(--text-main)' }}
                                    />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <select 
                                    className="form-select bg-transparent" 
                                    value={filterStatus} 
                                    onChange={handleFilter}
                                    style={{ borderColor: 'var(--border-color)', height: '45px', boxShadow: 'none', color: 'var(--text-main)' }}
                                >
                                    <option value="All" className="text-dark">All Statuses</option>
                                    <option value="Active" className="text-dark">Active</option>
                                    <option value="Busy" className="text-dark">Busy</option>
                                    <option value="Banned" className="text-dark">Banned</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="table-responsive">
                        <table className="table custom-table align-middle mb-0">
                            <thead style={{ background: 'rgba(0,0,0,0.2)' }}>
                                <tr className="text-muted small text-uppercase" style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <th className="ps-4 py-3" onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>User <i className="bi bi-arrow-down-up ms-1"></i></th>
                                    <th className="py-3">Role</th>
                                    <th className="py-3">Status</th>
                                    <th className="py-3" onClick={() => handleSort('gp')} style={{ cursor: 'pointer' }}>GP Balance <i className="bi bi-arrow-down-up ms-1"></i></th>
                                    <th className="py-3" onClick={() => handleSort('joinDate')} style={{ cursor: 'pointer' }}>Joined <i className="bi bi-arrow-down-up ms-1"></i></th>
                                    <th className="pe-4 py-3 text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user, index) => (
                                    <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td className="ps-4 py-3">
                                            <div className="d-flex align-items-center gap-3">
                                                <div 
                                                    className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold shadow-sm" 
                                                    style={{ 
                                                        width: '40px', 
                                                        height: '40px', 
                                                        background: `linear-gradient(135deg, ${['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'][user.id % 5]}, ${['#EE5253', '#26A69A', '#2980B9', '#27AE60', '#F1C40F'][user.id % 5]})`
                                                    }}
                                                >
                                                    {getInitials(user.name)}
                                                </div>
                                                <div>
                                                    <div className="fw-bold">{user.name}</div>
                                                    <div className="small text-muted">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 px-3 py-2 rounded-pill">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge px-3 py-2 rounded-pill ${
                                                user.status === 'Active' ? 'bg-success bg-opacity-10 text-success border border-success border-opacity-25' : 
                                                user.status === 'Busy' ? 'bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25' : 
                                                'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25'
                                            }`}>
                                                <i className={`bi ${
                                                    user.status === 'Active' ? 'bi-check-circle-fill' : 
                                                    user.status === 'Busy' ? 'bi-clock-fill' : 
                                                    'bi-x-circle-fill'
                                                } me-1`}></i>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="fw-bold" style={{ color: 'var(--accent-primary)' }}>{user.gp} GP</td>
                                        <td className="text-muted small">{user.joinDate}</td>
                                        <td className="pe-4 text-end">
                                            <div className={index >= filteredUsers.length - 2 ? "dropup" : "dropdown"}>
                                                <button className="btn btn-icon btn-sm btn-light bg-transparent border-0 text-muted" type="button" data-bs-toggle="dropdown">
                                                    <i className="bi bi-three-dots-vertical fs-5"></i>
                                                </button>
                                                <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 p-2" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', minWidth: '200px' }}>
                                                    <li><button className="dropdown-item custom-dropdown-item rounded py-2 mb-1" onClick={() => setSelectedUser(user)} style={{ color: 'var(--text-main)' }}><i className="bi bi-eye me-2 text-primary"></i> View Details</button></li>
                                                    <li><button className="dropdown-item custom-dropdown-item rounded py-2 mb-1" onClick={() => openGPModal(user.id)} style={{ color: 'var(--text-main)' }}><i className="bi bi-coin me-2 text-warning"></i> Adjust GP</button></li>
                                                    <li><hr className="dropdown-divider my-1" style={{ borderColor: 'var(--border-color)' }} /></li>
                                                    {user.status !== 'Banned' ? (
                                                        <li><button className="dropdown-item custom-dropdown-item rounded py-2 text-danger" onClick={() => handleStatusChange(user.id, 'Banned')}><i className="bi bi-slash-circle me-2"></i> Ban User</button></li>
                                                    ) : (
                                                        <li><button className="dropdown-item custom-dropdown-item rounded py-2 text-success" onClick={() => handleStatusChange(user.id, 'Active')}><i className="bi bi-check-circle me-2"></i> Unban User</button></li>
                                                    )}
                                                    <li><button className="dropdown-item custom-dropdown-item rounded py-2 text-danger" onClick={() => handleDelete(user.id)}><i className="bi bi-trash me-2"></i> Delete</button></li>
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5 text-muted">
                                            <i className="bi bi-search fs-1 d-block mb-3 opacity-50"></i>
                                            No users found matching your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </ScrollReveal>

            {/* Add User Modal */}
            {showAddModal && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.6)', zIndex: 1060, backdropFilter: 'blur(4px)' }}>
                    <div className="glass-card p-4" style={{ width: '500px', maxWidth: '90%', animation: 'slideUp 0.3s ease' }}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3 className="h5 fw-bold mb-0" style={{ color: 'var(--text-main)' }}>Add New User</h3>
                            <button className="btn-close" onClick={() => setShowAddModal(false)} style={{ filter: 'invert(1)' }}></button>
                        </div>
                        <form onSubmit={handleAddUser}>
                            <div className="mb-3">
                                <label className="form-label small text-muted text-uppercase fw-bold">Full Name</label>
                                <input 
                                    type="text" 
                                    className="form-control bg-transparent text-white" 
                                    required 
                                    value={newUser.name}
                                    onChange={e => setNewUser({...newUser, name: e.target.value})}
                                    style={{ borderColor: 'var(--border-color)' }}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small text-muted text-uppercase fw-bold">Email Address</label>
                                <input 
                                    type="email" 
                                    className="form-control bg-transparent text-white" 
                                    required 
                                    value={newUser.email}
                                    onChange={e => setNewUser({...newUser, email: e.target.value})}
                                    style={{ borderColor: 'var(--border-color)' }}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small text-muted text-uppercase fw-bold">Password</label>
                                <input 
                                    type="password" 
                                    className="form-control bg-transparent text-white" 
                                    required 
                                    value={newUser.password}
                                    onChange={e => setNewUser({...newUser, password: e.target.value})}
                                    style={{ borderColor: 'var(--border-color)' }}
                                />
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label small text-muted text-uppercase fw-bold">Role</label>
                                    <select 
                                        className="form-select bg-transparent text-white"
                                        value={newUser.role}
                                        onChange={e => setNewUser({...newUser, role: e.target.value})}
                                        style={{ borderColor: 'var(--border-color)' }}
                                    >
                                        <option value="User" className="text-dark">User</option>
                                        <option value="Admin" className="text-dark">Admin</option>
                                        <option value="Moderator" className="text-dark">Moderator</option>
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label small text-muted text-uppercase fw-bold">Initial GP</label>
                                    <input 
                                        type="number" 
                                        className="form-control bg-transparent text-white" 
                                        value={newUser.gp}
                                        onChange={e => setNewUser({...newUser, gp: parseInt(e.target.value)})}
                                        style={{ borderColor: 'var(--border-color)' }}
                                    />
                                </div>
                            </div>
                            <div className="d-flex justify-content-end gap-2 mt-4">
                                <button type="button" className="btn btn-link text-muted text-decoration-none" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary px-4">Create User</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Adjust GP Modal */}
            {showGPModal && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.6)', zIndex: 1060, backdropFilter: 'blur(4px)' }}>
                    <div className="glass-card p-4" style={{ width: '400px', maxWidth: '90%' }}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3 className="h5 fw-bold mb-0" style={{ color: 'var(--text-main)' }}>Adjust Grid Points</h3>
                            <button className="btn-close" onClick={() => setShowGPModal(false)} style={{ filter: 'invert(1)' }}></button>
                        </div>
                        <form onSubmit={handleSubmitGP}>
                            <div className="mb-3">
                                <label className="form-label small text-muted text-uppercase fw-bold">Amount (Positive or Negative)</label>
                                <input 
                                    type="number" 
                                    className="form-control bg-transparent text-white" 
                                    required 
                                    value={gpAdjustment.amount}
                                    onChange={e => setGpAdjustment({...gpAdjustment, amount: e.target.value})}
                                    style={{ borderColor: 'var(--border-color)' }}
                                    placeholder="e.g. 100 or -50"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small text-muted text-uppercase fw-bold">Reason</label>
                                <textarea 
                                    className="form-control bg-transparent text-white" 
                                    rows="3"
                                    value={gpAdjustment.reason}
                                    onChange={e => setGpAdjustment({...gpAdjustment, reason: e.target.value})}
                                    style={{ borderColor: 'var(--border-color)' }}
                                    placeholder="Why are you adjusting points?"
                                ></textarea>
                            </div>
                            <div className="d-flex justify-content-end gap-2 mt-4">
                                <button type="button" className="btn btn-link text-muted text-decoration-none" onClick={() => setShowGPModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary px-4">Confirm Adjustment</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* User Details Modal */}
            {selectedUser && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.6)', zIndex: 1060, backdropFilter: 'blur(4px)' }}>
                    <div className="glass-card p-0 overflow-hidden" style={{ width: '600px', maxWidth: '90%' }}>
                        <div className="p-4 bg-primary bg-opacity-10 text-center border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                            <div className="rounded-circle bg-white text-primary d-inline-flex align-items-center justify-content-center fw-bold mb-3 shadow" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                                {getInitials(selectedUser.name)}
                            </div>
                            <h4 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>{selectedUser.name}</h4>
                            <p className="text-muted mb-2">{selectedUser.email}</p>
                            <span className={`badge ${selectedUser.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>{selectedUser.status}</span>
                        </div>
                        <div className="p-4">
                            <div className="row g-3 mb-4">
                                <div className="col-6">
                                    <div className="p-3 rounded border bg-secondary bg-opacity-5 text-center" style={{ borderColor: 'var(--border-color)' }}>
                                        <div className="small text-muted text-uppercase fw-bold mb-1">Grid Points</div>
                                        <div className="h3 fw-bold mb-0" style={{ color: 'var(--accent-primary)' }}>{selectedUser.gp}</div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="p-3 rounded border bg-secondary bg-opacity-5 text-center" style={{ borderColor: 'var(--border-color)' }}>
                                        <div className="small text-muted text-uppercase fw-bold mb-1">Joined Date</div>
                                        <div className="h3 fw-bold mb-0 text-white">{selectedUser.joinDate}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <h5 className="small text-muted text-uppercase fw-bold mb-3">Recent Activity</h5>
                            <div className="list-group list-group-flush rounded border" style={{ borderColor: 'var(--border-color)' }}>
                                <div className="list-group-item bg-transparent text-white border-bottom border-secondary border-opacity-25 py-3">
                                    <div className="d-flex justify-content-between">
                                        <span>Logged in</span>
                                        <span className="text-muted small">2 hours ago</span>
                                    </div>
                                </div>
                                <div className="list-group-item bg-transparent text-white border-bottom border-secondary border-opacity-25 py-3">
                                    <div className="d-flex justify-content-between">
                                        <span>Completed a bounty</span>
                                        <span className="text-muted small">Yesterday</span>
                                    </div>
                                </div>
                                <div className="list-group-item bg-transparent text-white py-3">
                                    <div className="d-flex justify-content-between">
                                        <span>Updated profile</span>
                                        <span className="text-muted small">3 days ago</span>
                                    </div>
                                </div>
                            </div>

                            <div className="d-grid mt-4">
                                <button className="btn btn-secondary" onClick={() => setSelectedUser(null)}>Close Details</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.6)', zIndex: 1070, backdropFilter: 'blur(4px)' }}>
                    <div className="glass-card p-4 text-center" style={{ width: '400px', maxWidth: '90%', animation: 'zoomIn 0.2s ease' }}>
                        <div className="mb-4">
                            <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px' }}>
                                <i className="bi bi-exclamation-triangle-fill fs-3"></i>
                            </div>
                            <h4 className="fw-bold mb-2" style={{ color: 'var(--text-main)' }}>Delete User?</h4>
                            <p className="text-muted mb-0">Are you sure you want to delete this user? This action cannot be undone.</p>
                        </div>
                        <div className="d-flex justify-content-center gap-3">
                            <button className="btn btn-light px-4" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <button className="btn btn-danger px-4" onClick={confirmDelete}>Delete User</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
