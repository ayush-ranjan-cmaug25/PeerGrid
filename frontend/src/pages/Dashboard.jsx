import React, { useState, useEffect } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import Profile from '../components/Profile';
import Sessions from '../components/Sessions';
import DoubtBoardWidget from '../components/DoubtBoardWidget';
import { API_BASE_URL } from '../config';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`${API_BASE_URL}/users/dashboard`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setDashboardData(data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return <div className="d-flex justify-content-center align-items-center vh-100 text-white">Loading...</div>;
    }

    return (
        <>
            <header className="py-5">
                <div className="container-fluid px-5">
                    <ScrollReveal width="100%">
                        <div className="mb-4">
                            <h1 className="display-5 fw-bold" style={{ color: 'var(--text-main)', letterSpacing: '-0.03em' }}>
                                Welcome Back, {dashboardData?.user?.name}
                            </h1>
                            <p className="fs-5" style={{ color: 'var(--text-muted)' }}>
                                Your learning network is active.
                            </p>
                        </div>
                    </ScrollReveal>
                </div>
            </header>

            <main className="container-fluid px-4 px-md-5 py-5">
                <div className="row g-4">
                    <div className="col-xl-4 col-lg-6 col-md-12">
                        <ScrollReveal width="100%">
                            <Profile user={dashboardData?.user} />
                        </ScrollReveal>
                    </div>
                    <div className="col-xl-4 col-lg-6 col-md-12">
                        <ScrollReveal width="100%">
                            <Sessions sessions={dashboardData?.upcomingSessions} />
                        </ScrollReveal>
                    </div>
                    <div className="col-xl-4 col-lg-12 col-md-12">
                        <ScrollReveal width="100%">
                            <DoubtBoardWidget doubts={dashboardData?.activeDoubts} />
                        </ScrollReveal>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Dashboard;
