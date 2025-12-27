import React from 'react';
import ScrollReveal from '../components/ScrollReveal';
import Portfolio from '../components/Portfolio';
import Sessions from '../components/Sessions';
import DoubtBoardWidget from '../components/DoubtBoardWidget';

const Dashboard = () => {
    return (
        <>
            <header className="py-5">
                <div className="container-fluid px-5">
                    <ScrollReveal width="100%">
                        <div className="mb-4">
                            <h1 className="display-5 fw-bold" style={{ color: 'var(--text-main)', letterSpacing: '-0.03em' }}>
                                Welcome Back
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
                            <Portfolio />
                        </ScrollReveal>
                    </div>
                    <div className="col-xl-4 col-lg-6 col-md-12">
                        <ScrollReveal width="100%">
                            <Sessions />
                        </ScrollReveal>
                    </div>
                    <div className="col-xl-4 col-lg-12 col-md-12">
                        <ScrollReveal width="100%">
                            <DoubtBoardWidget />
                        </ScrollReveal>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Dashboard;
