import React, { useState, useEffect } from 'react';
import ScrollReveal from '../ScrollReveal';
import { adminService } from '../../services/adminService';

const LogsView = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('All');

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const data = await adminService.getLogs();
            const formattedLogs = data.map(log => ({
                id: log.id,
                type: log.type || 'System',
                action: log.action,
                user: log.user || 'System',
                details: log.details,
                date: log.timestamp ? new Date(log.timestamp).toLocaleString() : new Date().toLocaleString()
            }));
            setLogs(formattedLogs);
        } catch (error) {
            console.error("Error fetching logs", error);
            // Fallback to empty or keep loading false
        } finally {
            setLoading(false);
        }
    };

    const filteredLogs = logs.filter(log => filterType === 'All' || log.type === filterType);

    if (loading) return <div className="p-5 text-center">Loading logs...</div>;

    return (
        <div className="container-fluid p-0">


            <ScrollReveal>
                <div className="glass-card p-4">
                    <div className="row g-3 mb-4">
                        <div className="col-md-3">
                            <select className="form-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                                <option value="All">All Log Types</option>
                                <option value="Security">Security</option>
                                <option value="User Action">User Actions</option>
                                <option value="System">System</option>
                                <option value="Error">Errors</option>
                                <option value="Admin">Admin Actions</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <input type="date" className="form-control" />
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table custom-table align-middle table-sm" style={{ fontSize: '0.9rem' }}>
                            <thead>
                                <tr className="text-muted small text-uppercase">
                                    <th>Timestamp</th>
                                    <th>Type</th>
                                    <th>Action</th>
                                    <th>User/Source</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLogs.map(log => (
                                    <tr key={log.id}>
                                        <td className="text-muted" style={{ whiteSpace: 'nowrap' }}>{log.date}</td>
                                        <td>
                                            <span className={`badge ${
                                                log.type === 'Security' ? 'bg-danger-subtle text-danger' :
                                                log.type === 'Error' ? 'bg-danger text-white' :
                                                log.type === 'System' ? 'bg-secondary-subtle text-secondary' :
                                                log.type === 'Admin' ? 'bg-primary-subtle text-primary' :
                                                'bg-info-subtle text-info'
                                            }`}>
                                                {log.type}
                                            </span>
                                        </td>
                                        <td className="fw-bold">{log.action}</td>
                                        <td>{log.user}</td>
                                        <td className="text-muted text-truncate" style={{ maxWidth: '300px' }} title={log.details}>{log.details}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </ScrollReveal>
        </div>
    );
};

export default LogsView;
