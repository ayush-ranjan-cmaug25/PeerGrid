import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import logoLight from '../assets/logo-light.jpg';
import logoDark from '../assets/logo-dark.jpg';

const Home = ({ theme, toggleTheme }) => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div className="min-vh-100 d-flex flex-column position-relative" style={{ color: 'var(--text-main)', overflowX: 'hidden' }}>
            <motion.div
                style={{
                    scaleX,
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'var(--accent-primary)',
                    transformOrigin: '0%',
                    zIndex: 1000
                }}
            />

            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'linear-gradient(var(--border-color) 1px, transparent 1px), linear-gradient(90deg, var(--border-color) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                opacity: 0.03,
                pointerEvents: 'none',
                zIndex: 0
            }}></div>

            <nav className="d-flex align-items-center px-4 py-3 fixed-top z-3 mx-auto" 
                style={{ 
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '95%',
                    maxWidth: '1200px',
                    borderRadius: '24px',
                    background: 'rgba(255, 255, 255, 0.05)', 
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                    color: 'var(--text-main)'
                }}
            >
                <div className="d-flex align-items-center fw-bold fs-4 flex-grow-1" style={{ letterSpacing: '-0.03em', flexBasis: 0 }}>
                    <img src={theme === 'dark' ? logoDark : logoLight} alt="PeerGrid Logo" className="me-2" style={{ height: '32px', borderRadius: '6px' }} />
                    PeerGrid
                </div>

                <div className="d-none d-md-flex align-items-center justify-content-center gap-4 flex-grow-1" style={{ flexBasis: 0 }}>
                    <Link to="/about" className="text-decoration-none fw-medium" style={{ color: 'var(--text-main)', fontSize: '0.95rem', opacity: 0.8 }}>About</Link>
                    <Link to="/how-it-works" className="text-decoration-none fw-medium" style={{ color: 'var(--text-main)', fontSize: '0.95rem', opacity: 0.8 }}>How it Works</Link>
                    <Link to="/community" className="text-decoration-none fw-medium" style={{ color: 'var(--text-main)', fontSize: '0.95rem', opacity: 0.8 }}>Community</Link>
                </div>

                <div className="d-flex gap-3 align-items-center justify-content-end flex-grow-1" style={{ flexBasis: 0 }}>
                    <button 
                        className="d-flex align-items-center justify-content-center" 
                        onClick={toggleTheme} 
                        style={{ 
                            width: '40px', 
                            height: '40px', 
                            borderRadius: '50%', 
                            border: '1px solid var(--border-color)', 
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'var(--text-main)',
                            transition: 'all 0.2s',
                            cursor: 'pointer'
                        }}
                    >
                        <i className={`bi ${theme === 'dark' ? 'bi-sun-fill' : 'bi-moon-fill'}`} style={{ fontSize: '1.1rem' }} />
                    </button>
                    <Link to="/login" className="px-4 py-2 rounded-pill text-decoration-none fw-medium shadow-sm" 
                        style={{ 
                            background: 'var(--accent-primary)',
                            color: '#fff',
                            border: 'none',
                            fontSize: '0.9rem',
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                        }}
                    >
                        Sign In
                    </Link>
                </div>
            </nav>

            <HeroSection />

            <ProblemSolutionSection />

            <HowItWorksSection />

            <FeaturesSection />

            <TestimonialsSection />

            <ContactSection />

            <CTASection />

            <footer className="py-4 text-center position-relative z-2" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', borderTop: '1px solid var(--border-color)' }}>
                © {new Date().getFullYear()} PeerGrid. All rights reserved.
            </footer>
        </div>
    );
};

const HeroBackground = () => (
    <div className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden" style={{ zIndex: 0, pointerEvents: 'none' }}>
        <div style={{
            position: 'absolute',
            top: '-10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100vw',
            height: '80vh',
            background: 'radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.3) 0%, rgba(165, 180, 252, 0.1) 40%, transparent 70%)',
            filter: 'blur(80px)',
            opacity: 0.8
        }}></div>

        <svg width="100%" height="100%" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMin slice" style={{ opacity: 0.5 }}>
            <defs>
                <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--text-muted)" stopOpacity="0.1" />
                    <stop offset="50%" stopColor="var(--accent-primary)" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="var(--text-muted)" stopOpacity="0.1" />
                </linearGradient>
            </defs>
            
            <g fill="none" stroke="url(#arcGradient)" strokeWidth="1.5">
                <path d="M-100,100 Q720,900 1540,100" />
                <path d="M0,0 Q720,700 1440,0" />
                <path d="M200,-100 Q720,500 1240,-100" />
            </g>

            <g fill="var(--accent-primary)" opacity="0.6">
                <circle cx="720" cy="200" r="4" />
                <circle cx="720" cy="350" r="4" />
                <circle cx="720" cy="500" r="4" />
                
                <circle cx="460" cy="125" r="3" />
                <circle cx="980" cy="125" r="3" />

                <circle cx="360" cy="262.5" r="3" />
                <circle cx="1080" cy="262.5" r="3" />
                
                <circle cx="310" cy="400" r="3" />
                <circle cx="1130" cy="400" r="3" />
            </g>
        </svg>
    </div>
);

const HeroSection = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section ref={ref} className="min-vh-100 d-flex align-items-center justify-content-center text-center px-4 position-relative overflow-hidden" style={{ paddingTop: '120px' }}>
            <HeroBackground />
            <motion.div style={{ y, opacity, maxWidth: '1200px' }} className="position-relative z-1 container-fluid">
                <motion.h1 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="display-1 fw-bold mb-4" 
                    style={{ letterSpacing: '-0.04em', color: 'var(--text-main)', fontSize: 'clamp(3rem, 8vw, 6rem)' }}
                >
                    The Time-Banking Platform <br className="d-none d-lg-block" /> for Peer Learning.
                </motion.h1>
                
                <motion.p 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="fs-4 mb-5 mx-auto" 
                    style={{ color: 'var(--text-muted)', maxWidth: '700px', fontWeight: 300, lineHeight: 1.6 }}
                >
                    Exchange knowledge, not money. Earn <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Grid Points</span> by teaching, spend them to learn. A closed-loop economy for learners.
                </motion.p>
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Link to="/register" className="px-5 py-3 rounded-pill text-decoration-none fw-semibold shadow-lg d-inline-block"
                        style={{ 
                            background: 'var(--accent-primary)', 
                            color: '#fff',
                            border: 'none',
                            fontSize: '1.2rem',
                            minWidth: '220px'
                        }}
                    >
                        Start Banking Time
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    );
};

const ProblemSolutionSection = () => {
    return (
        <section className="py-5 position-relative z-1">
            <div className="container py-5">
                <div className="row align-items-center g-5">
                    <div className="col-lg-6">
                        <ScrollReveal>
                            <h2 className="display-4 fw-bold mb-4" style={{ letterSpacing: '-0.03em' }}>The Problem with <br/> Traditional Learning.</h2>
                            <p className="fs-5 text-muted mb-4" style={{ lineHeight: 1.8 }}>
                                Learners often struggle with specific, micro-topics. Professional courses are expensive, and generic videos don't answer specific doubts. Finding a peer who is available exactly when you are is nearly impossible.
                            </p>
                        </ScrollReveal>
                    </div>
                    <div className="col-lg-6">
                        <ScrollReveal delay={0.2}>
                            <div className="p-5 rounded-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                                <h3 className="h2 fw-bold mb-3" style={{ color: 'var(--accent-primary)' }}>The Solution: Time-Banking</h3>
                                <p className="fs-5 mb-0" style={{ color: 'var(--text-main)', lineHeight: 1.6 }}>
                                    PeerGrid removes money from the equation. It creates a closed-loop economy of knowledge. If you spend 30 minutes teaching someone <strong>React</strong>, you earn 30 "Grid Points," which you can spend to get 30 minutes of help in <strong>Calculus</strong>.
                                </p>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </div>
        </section>
    );
};

const HowItWorksSection = () => {
    const steps = [
        { num: "01", title: "Teach & Earn", desc: "Browse the Doubt Board. Find a question you can answer. Help a peer via video or chat and earn Grid Points (GP) instantly." },
        { num: "02", title: "Post Micro-Bounties", desc: "Stuck on a bug? Post a screenshot with a GP bounty. Experts will claim it to help you fix it in minutes, not hours." },
        { num: "03", title: "Build Reputation", desc: "Get rated after every session. Accumulate 5-star ratings to earn 'Verified Peer' badges and unlock premium features." }
    ];

    return (
        <section className="py-5 position-relative z-1" style={{ background: 'var(--bg-card-hover)' }}>
            <div className="container py-5">
                <ScrollReveal>
                    <h2 className="display-4 fw-bold text-center mb-5" style={{ letterSpacing: '-0.03em' }}>How It Works</h2>
                </ScrollReveal>
                <div className="row g-4 mt-4">
                    {steps.map((step, index) => (
                        <div className="col-md-4" key={index}>
                            <ScrollReveal delay={index * 0.2}>
                                <div className="h-100 p-4 position-relative">
                                    <div className="display-1 fw-bold opacity-25 mb-3" style={{ color: 'var(--accent-primary)', opacity: 0.1 }}>{step.num}</div>
                                    <h3 className="h3 fw-bold mb-3">{step.title}</h3>
                                    <p className="text-muted fs-5" style={{ lineHeight: 1.6 }}>{step.desc}</p>
                                </div>
                            </ScrollReveal>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const FeaturesSection = () => {
    return (
        <section className="py-5 position-relative z-1">
            <div className="container py-5">
                <ScrollReveal>
                    <h2 className="display-4 fw-bold text-center mb-5" style={{ letterSpacing: '-0.03em' }}>Unique Features</h2>
                </ScrollReveal>
                <div className="row g-4 justify-content-center">
                    <div className="col-md-4">
                        <FeatureCard 
                            icon="bi-lightning-charge-fill" 
                            title="Micro-Bounties" 
                            desc="Don't book a full hour. Post specific errors or questions with a 'Bounty'. Pay only for the solution." 
                        />
                    </div>
                    <div className="col-md-4">
                        <FeatureCard 
                            icon="bi-shield-check" 
                            title="Verified Trust" 
                            desc="Algorithmic trust scores. If you receive 5 ratings above 4.5 stars for 'C#', you get a Verified Badge automatically." 
                        />
                    </div>
                    <div className="col-md-4">
                        <FeatureCard 
                            icon="bi-recycle" 
                            title="Circular Economy" 
                            desc="Deadlock Breaker: Triangular matching ensures that even if A helps B, and B can't help A, the economy keeps flowing." 
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <ScrollReveal>
        <div className="p-5 h-100 rounded-4 d-flex flex-column align-items-center text-center transition-all" 
            style={{ 
                background: 'var(--bg-card)', 
                border: '1px solid var(--border-color)',
                transition: 'transform 0.3s ease'
            }}
        >
            <div className="mb-4 d-flex align-items-center justify-content-center rounded-circle" 
                style={{ 
                    width: '80px', 
                    height: '80px', 
                    background: 'rgba(99, 102, 241, 0.1)',
                    color: 'var(--accent-primary)',
                    fontSize: '2rem'
                }}
            >
                <i className={`bi ${icon}`}></i>
            </div>
            <h3 className="h4 fw-bold mb-3">{title}</h3>
            <p className="text-muted mb-0" style={{ lineHeight: 1.6 }}>{desc}</p>
        </div>
    </ScrollReveal>
);

const TestimonialsSection = () => {
    const testimonials = [
        {
            name: "Alex Chen",
            role: "Computer Science Student",
            content: "PeerGrid saved my semester! I was stuck on a React bug for days. Posted a bounty, and within 20 minutes, a senior student helped me fix it. Best part? I paid with points I earned teaching Python.",
            avatar: "AC"
        },
        {
            name: "Sarah Johnson",
            role: "Bootcamp Graduate",
            content: "The 'Verified Peer' badge actually means something here. I've learned more practical skills in 3 sessions on PeerGrid than in a month of watching tutorials. The community is incredibly supportive.",
            avatar: "SJ"
        },
        {
            name: "Michael Torres",
            role: "Self-Taught Developer",
            content: "I love the circular economy concept. It feels fair. I don't have much money, but I have time and knowledge. PeerGrid lets me trade that for the help I need. It's a game-changer.",
            avatar: "MT"
        }
    ];

    return (
        <section className="py-5 position-relative z-1" style={{ background: 'var(--bg-card-hover)' }}>
            <div className="container py-5">
                <ScrollReveal>
                    <h2 className="display-4 fw-bold text-center mb-5" style={{ letterSpacing: '-0.03em' }}>What Students Say</h2>
                </ScrollReveal>
                <div className="row g-4 justify-content-center">
                    {testimonials.map((t, index) => (
                        <div className="col-md-4" key={index}>
                            <ScrollReveal delay={index * 0.2}>
                                <div className="p-4 h-100 rounded-4 d-flex flex-column" 
                                    style={{ 
                                        background: 'var(--bg-card)', 
                                        border: '1px solid var(--border-color)',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                >
                                    <div className="mb-4 text-muted">
                                        <i className="bi bi-quote fs-1" style={{ color: 'var(--accent-primary)', opacity: 0.5 }}></i>
                                    </div>
                                    <p className="fs-5 mb-4 flex-grow-1" style={{ lineHeight: 1.6, fontStyle: 'italic' }}>"{t.content}"</p>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                                            style={{
                                                width: '48px',
                                                height: '48px',
                                                background: 'var(--accent-primary)',
                                                color: '#fff',
                                                fontSize: '1.2rem'
                                            }}
                                        >
                                            {t.avatar}
                                        </div>
                                        <div>
                                            <div className="fw-bold" style={{ color: 'var(--text-main)' }}>{t.name}</div>
                                            <div className="small text-muted">{t.role}</div>
                                        </div>
                                    </div>
                                </div>
                            </ScrollReveal>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const ContactSection = () => {
    return (
        <section className="py-5 position-relative z-1">
            {/* Ambient background glow */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                maxWidth: '800px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
                filter: 'blur(60px)',
                zIndex: -1
            }}></div>

            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <ScrollReveal>
                            <div className="p-5 rounded-5 position-relative overflow-hidden" 
                                style={{ 
                                    background: 'rgba(255, 255, 255, 0.03)', 
                                    backdropFilter: 'blur(20px)',
                                    WebkitBackdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                                }}
                            >
                                {/* Decorative shine */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '1px',
                                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)'
                                }}></div>

                                <h2 className="display-5 fw-bold text-center mb-4" 
                                    style={{ 
                                        letterSpacing: '-0.03em',
                                        background: 'linear-gradient(135deg, var(--text-main) 0%, var(--text-muted) 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent'
                                    }}
                                >
                                    Get in Touch
                                </h2>
                                <p className="text-center text-muted mb-5 fs-5">Have questions or need assistance? We're here to help.</p>
                                
                                <form>
                                    <div className="row g-4">
                                        <div className="col-md-6">
                                            <div className="form-floating">
                                                <input type="text" className="form-control rounded-4 border-0" id="name" placeholder="Your Name" 
                                                    style={{ 
                                                        background: 'rgba(var(--bg-primary-rgb), 0.5)', 
                                                        border: '1px solid var(--border-color)', 
                                                        color: 'var(--text-main)',
                                                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
                                                    }} />
                                                <label htmlFor="name" style={{ color: 'var(--text-muted)' }}>Your Name</label>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-floating">
                                                <input type="email" className="form-control rounded-4 border-0" id="email" placeholder="name@example.com"
                                                    style={{ 
                                                        background: 'rgba(var(--bg-primary-rgb), 0.5)', 
                                                        border: '1px solid var(--border-color)', 
                                                        color: 'var(--text-main)',
                                                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
                                                    }} />
                                                <label htmlFor="email" style={{ color: 'var(--text-muted)' }}>Email Address</label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-floating">
                                                <input type="text" className="form-control rounded-4 border-0" id="subject" placeholder="Subject"
                                                    style={{ 
                                                        background: 'rgba(var(--bg-primary-rgb), 0.5)', 
                                                        border: '1px solid var(--border-color)', 
                                                        color: 'var(--text-main)',
                                                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
                                                    }} />
                                                <label htmlFor="subject" style={{ color: 'var(--text-muted)' }}>Subject</label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-floating">
                                                <textarea className="form-control rounded-4 border-0" placeholder="Leave a comment here" id="message" 
                                                    style={{ 
                                                        height: '150px', 
                                                        background: 'rgba(var(--bg-primary-rgb), 0.5)', 
                                                        border: '1px solid var(--border-color)', 
                                                        color: 'var(--text-main)',
                                                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
                                                    }}
                                                ></textarea>
                                                <label htmlFor="message" style={{ color: 'var(--text-muted)' }}>Message</label>
                                            </div>
                                        </div>
                                        <div className="col-12 text-center mt-4">
                                            <button className="px-5 py-3 rounded-pill fw-bold border-0 shadow-lg position-relative overflow-hidden group" type="submit"
                                                style={{ 
                                                    background: 'var(--accent-primary)', 
                                                    color: '#fff',
                                                    fontSize: '1.1rem',
                                                    transition: 'all 0.3s ease',
                                                    boxShadow: '0 10px 20px -10px var(--accent-primary)'
                                                }}
                                            >
                                                <span className="position-relative z-1">Send Message</span>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </div>
        </section>
    );
};

const CTASection = () => {
    return (
        <section className="py-5 position-relative overflow-hidden" style={{ background: 'var(--accent-primary)', color: '#fff' }}>
            <div className="container py-5 text-center position-relative z-1">
                <ScrollReveal>
                    <h2 className="display-3 fw-bold mb-4">Ready to Join the Grid?</h2>
                    <p className="fs-4 mb-5 opacity-75 mx-auto" style={{ maxWidth: '600px' }}>
                        Start earning Grid Points today. Connect with peers, solve problems, and master your skills.
                    </p>
                    <Link to="/register" className="btn btn-light btn-lg rounded-pill px-5 py-3 fw-bold shadow-lg" style={{ color: 'var(--accent-primary)' }}>
                        Get Started Now
                    </Link>
                </ScrollReveal>
            </div>
            {/* Decorative circles */}
            <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '800px', height: '800px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
            <div style={{ position: 'absolute', bottom: '-50%', right: '-20%', width: '600px', height: '600px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
        </section>
    );
};

const ScrollReveal = ({ children, delay = 0, width = "100%" }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: delay, ease: [0.16, 1, 0.3, 1] }}
            style={{ width }}
        >
            {children}
        </motion.div>
    );
};

export default Home;
