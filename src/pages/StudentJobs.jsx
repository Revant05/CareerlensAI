import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, Clock, ArrowLeft, Search, Building2, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AnimatedPage from '../components/AnimatedPage';
import api from '../api/api';
import './StudentJobs.css';

export default function StudentJobs() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await api.get('/roadmap/jobs');
            setJobs(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching jobs:', err);
            setLoading(false);
        }
    };

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AnimatedPage className="student-jobs-page">
            <nav className="dashboard-nav glass-panel">
                <button onClick={() => navigate('/dashboard')} className="back-btn">
                    <ArrowLeft size={20} />
                    <span>Back to Dashboard</span>
                </button>
                <div className="nav-profile">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search jobs, companies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="job-search-input"
                    />
                </div>
            </nav>

            <div className="jobs-content container">
                <header className="jobs-header">
                    <h1 className="hero-title">Job <span className="highlight">Marketplace</span></h1>
                    <p className="hero-subtitle">Opportunities tailored for your skill level and roadmap progress.</p>
                </header>

                {loading ? (
                    <div className="jobs-loading">
                        <div className="spinner"></div>
                        <p>Loading opportunities...</p>
                    </div>
                ) : filteredJobs.length > 0 ? (
                    <div className="jobs-grid">
                        {filteredJobs.map((job) => (
                            <Motion.div
                                key={job._id}
                                className="job-card glass-panel"
                                whileHover={{ y: -5, borderColor: 'var(--primary)' }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="job-card-header">
                                    <div className="company-logo">
                                        <Building2 size={24} />
                                    </div>
                                    <div className="job-title-area">
                                        <h3>{job.title}</h3>
                                        <p className="company-name">{job.companyName}</p>
                                    </div>
                                </div>

                                <div className="job-details">
                                    <div className="job-detail">
                                        <MapPin size={16} />
                                        <span>{job.location}</span>
                                    </div>
                                    <div className="job-detail">
                                        <DollarSign size={16} />
                                        <span>{job.salaryRange}</span>
                                    </div>
                                    <div className="job-detail">
                                        <Clock size={16} />
                                        <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="job-requirements">
                                    {job.requirements?.slice(0, 3).map((req, i) => (
                                        <span key={i} className="req-tag">{req}</span>
                                    ))}
                                    {job.requirements?.length > 3 && <span>+{job.requirements.length - 3} more</span>}
                                </div>

                                <div className="job-actions">
                                    <button className="apply-btn neon-btn">Apply Now</button>
                                    <button className="msg-btn outline-btn" onClick={() => navigate('/messages', { state: { recipient: { id: job.recruiterId, name: job.companyName, role: 'recruiter' } } })}>
                                        Ask Recruiter
                                    </button>
                                </div>
                            </Motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="no-jobs glass-panel">
                        <Briefcase size={48} opacity={0.2} />
                        <h3>No jobs found matching your search.</h3>
                        <p>Check back later or explore new roadmaps to unlock more opportunities!</p>
                    </div>
                )}
            </div>
        </AnimatedPage>
    );
}
