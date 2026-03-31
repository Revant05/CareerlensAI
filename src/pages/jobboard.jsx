import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion as Motion } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, Send, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AnimatedPage from '../components/AnimatedPage';
import GlitchText from '../components/GlitchText';
import './dashboard.css'; // Reuse glass-panel styles

export default function JobBoard() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/roadmap', {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                // Note: In real app, we'd have a specific GET api/jobs, reusing for demo
                setJobs([
                    { _id: '1', title: 'Senior Frontend Developer', companyName: 'Nexus Tech', description: 'Expert in React & Framer Motion required.', requirements: ['React', 'CSS'], location: 'Remote', salaryRange: '$120k - $150k' },
                    { _id: '2', title: 'Fullstack Engineer', companyName: 'CyberFlow', description: 'MERN stack specialist with AI background.', requirements: ['Node.js', 'React'], location: 'Mumbai, IN', salaryRange: '₹12L - ₹20L' }
                ]);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const handleApply = (id) => {
        alert("Application sent successfully! Recruiter will be notified.");
    };

    return (
        <AnimatedPage className="dashboard-container">
            <div className="dashboard-wrapper container">
                <section className="section-header" style={{ marginBottom: '40px' }}>
                    <GlitchText text="Exciting Vacancies" as="h1" className="section-title" />
                    <p className="section-subtitle">Based on your skills and badges, these roles are a perfect match.</p>
                </section>

                <div className="features-grid">
                    {jobs.map((job) => (
                        <Motion.div
                            key={job._id}
                            className="feature-card glass-panel"
                            whileHover={{ scale: 1.02 }}
                            style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ margin: 0, color: 'var(--primary)' }}>{job.title}</h3>
                                    <p style={{ margin: '5px 0', opacity: 0.7 }}>{job.companyName}</p>
                                </div>
                                <div className="feature-icon"><Briefcase size={20} /></div>
                            </div>

                            <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>{job.description}</p>

                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                {job.requirements.map(req => (
                                    <span key={req} style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
                                        {req}
                                    </span>
                                ))}
                            </div>

                            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
                                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                                    <MapPin size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> {job.location}
                                </div>
                                <button onClick={() => handleApply(job._id)} className="neon-btn" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                                    Apply Now <Send size={14} style={{ marginLeft: '5px' }} />
                                </button>
                            </div>
                        </Motion.div>
                    ))}
                </div>
            </div>
        </AnimatedPage>
    );
}
