import React, { useState, useEffect } from 'react';
import ScrollReveal from '../ScrollReveal';
import { BarChart, LineChart, PieChart } from './AdminCharts';
import { adminService } from '../../services/adminService';

const AdminOverview = () => {
    const [stats, setStats] = useState([
        { label: 'Total Users', value: '0', change: '0%', icon: 'bi-people', color: 'text-primary' },
        { label: 'Active Sessions', value: '0', change: '0', icon: 'bi-camera-video', color: 'text-success' },
        { label: 'Active Bounties', value: '0', change: '0', icon: 'bi-crosshair', color: 'text-warning' },
        { label: 'Pending Reports', value: '0', change: '0', icon: 'bi-flag', color: 'text-danger' },
    ]);
    const [skillsData, setSkillsData] = useState([]);
    const [transactionsData, setTransactionsData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, skills, transactions] = await Promise.all([
                    adminService.getSystemStats(),
                    adminService.getSkills(),
                    adminService.getTransactions()
                ]);

                setStats([
                    { label: 'Total Users', value: statsData.totalUsers.toString(), change: '+0%', icon: 'bi-people', color: 'text-primary' },
                    { label: 'Active Sessions', value: statsData.activeSessions.toString(), change: '+0', icon: 'bi-camera-video', color: 'text-success' },
                    { label: 'Active Bounties', value: statsData.activeBounties.toString(), change: '0', icon: 'bi-crosshair', color: 'text-warning' },
                    { label: 'Pending Reports', value: statsData.pendingReports.toString(), change: '0', icon: 'bi-flag', color: 'text-danger' },
                ]);

                // Process Skills
                const processedSkills = skills.map((s, index) => ({
                    label: s.label,
                    value: s.value,
                    color: ['#61DAFB', '#3776AB', '#007396', '#00599C', '#F24E1E'][index % 5]
                }));
                setSkillsData(processedSkills);

                // Process Transactions for Chart (Simple aggregation by index for now as we don't have full date logic)
                // In a real app, we would group by date.
                const processedTransactions = transactions.slice(0, 7).map((t, i) => ({
                    label: `Tx ${i+1}`,
                    value: t.points
                }));
                setTransactionsData(processedTransactions.length > 0 ? processedTransactions : [{ label: 'No Data', value: 0 }]);

            } catch (error) {
                console.error("Error loading dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Mock sessions data for now as we didn't implement history endpoint
    const sessionsData = [
        { label: 'Mon', value: 45 },
        { label: 'Tue', value: 52 },
        { label: 'Wed', value: 38 },
        { label: 'Thu', value: 65 },
        { label: 'Fri', value: 48 },
        { label: 'Sat', value: 29 },
        { label: 'Sun', value: 35 },
    ];

    if (loading) return <div className="p-5 text-center">Loading dashboard...</div>;

    return (
        <div className="container-fluid p-0">

            
            {/* Stats Cards */}
            <div className="row g-3 mb-3">
                {stats.map((stat, index) => (
                    <div className="col-md-3" key={index}>
                        <ScrollReveal delay={index * 0.1}>
                            <div className="glass-card p-4 d-flex align-items-center justify-content-between">
                                <div>
                                    <div className="text-muted small text-uppercase fw-bold mb-1">{stat.label}</div>
                                    <div className="h2 fw-bold mb-0">{stat.value}</div>
                                    <div className={`small ${stat.change.startsWith('+') ? 'text-success' : 'text-danger'}`}>
                                        {stat.change} <span className="text-muted">vs last week</span>
                                    </div>
                                </div>
                                <div className={`rounded-circle p-3 bg-opacity-10 ${stat.color.replace('text-', 'bg-')}`} style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className={`bi ${stat.icon} fs-3 ${stat.color}`}></i>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="row g-3 mb-3">
                <div className="col-lg-8">
                    <ScrollReveal delay={0.2} className="h-100">
                        <div className="glass-card p-4 h-100">
                            <div className="d-flex align-items-center justify-content-between mb-4">
                                <h3 className="h5 fw-bold mb-0">Sessions Overview</h3>
                                <select className="form-select form-select-sm w-auto bg-transparent text-muted border-0">
                                    <option>Last 7 Days</option>
                                    <option>Last 30 Days</option>
                                </select>
                            </div>
                            <BarChart data={sessionsData} />
                        </div>
                    </ScrollReveal>
                </div>
                <div className="col-lg-4">
                    <ScrollReveal delay={0.3} className="h-100">
                        <div className="glass-card p-4 h-100">
                            <h3 className="h5 fw-bold mb-4">Popular Skills</h3>
                            <PieChart data={skillsData} />
                        </div>
                    </ScrollReveal>
                </div>
            </div>

            <div className="row g-3">
                <div className="col-12">
                    <ScrollReveal delay={0.4}>
                        <div className="glass-card p-4">
                            <div className="d-flex align-items-center justify-content-between mb-4">
                                <h3 className="h5 fw-bold mb-0">Recent Transactions</h3>
                                <div className="text-muted small">View latest activity</div>
                            </div>
                            <LineChart data={transactionsData} height={250} />
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
