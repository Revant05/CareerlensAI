import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Plus, Briefcase, MapPin, Users, Trash2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import RecruiterSidebar from '../components/RecruiterSidebar';
import AnimatedPage from '../components/AnimatedPage';
import './RecruiterJobs.css';

export default function RecruiterJobs() {
    const { user, logout } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [newJob, setNewJob] = useState({
        title: '',
        description: '',
        requirements: '',
        location: 'Remote',
        salaryRange: ''
    });

    const fetchJobs = async () => {
        try {
            const res = await api.get('/recruiter/jobs');
            setJobs(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const reqArray = newJob.requirements.split(',').map(s => s.trim());
            await api.post('/recruiter/jobs',
                { ...newJob, requirements: reqArray }
            );
            setShowModal(false);
            setNewJob({ title: '', description: '', requirements: '', location: 'Remote', salaryRange: '' });
            fetchJobs();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this vacancy?')) return;
        try {
            await api.delete(`/recruiter/jobs/${id}`);
            fetchJobs();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="recruiter-layout">
            <RecruiterSidebar user={user} onLogout={logout} />

            <AnimatedPage className="recruiter-content">
                <header className="content-header">
                    <div>
                        <h1 className="welcome-text">My Vacancies</h1>
                        <p className="welcome-sub">Manage active job listings and review applicants.</p>
                    </div>
                    <button onClick={() => setShowModal(true)} className="neon-btn">
                        <Plus size={18} style={{ marginRight: '8px' }} /> Post New Job
                    </button>
                </header>

                <div className="jobs-list-grid">
                    {jobs.length > 0 ? jobs.map(job => (
                        <Motion.div
                            key={job._id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-panel job-manage-card"
                        >
                            <div className="card-top">
                                <div>
                                    <h3 className="job-title">{job.title}</h3>
                                    <div className="job-meta">
                                        <span><MapPin size={14} /> {job.location}</span>
                                        <span><Briefcase size={14} /> {job.salaryRange || 'N/A'}</span>
                                    </div>
                                </div>
                                <button onClick={() => handleDelete(job._id)} className="delete-btn-circ">
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <p className="job-desc-short">{job.description.substring(0, 100)}...</p>

                            <div className="card-footer-manage">
                                <div className="applicants-count">
                                    <Users size={16} color="var(--primary)" />
                                    <span>{job.applicants?.length || 0} Applicants</span>
                                </div>
                                <button className="outline-btn-sm">Review App →</button>
                            </div>
                        </Motion.div>
                    )) : (
                        <div className="empty-state">
                            <Briefcase size={48} opacity={0.2} />
                            <p>No active vacancies found.</p>
                        </div>
                    )}
                </div>

                <AnimatePresence>
                    {showModal && (
                        <Motion.div
                            className="modal-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <Motion.div
                                className="glass-panel job-modal"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                            >
                                <div className="modal-head">
                                    <h3>Create New Opening</h3>
                                    <button onClick={() => setShowModal(false)} className="close-btn"><X /></button>
                                </div>
                                <form onSubmit={handleSubmit} className="job-form">
                                    <input
                                        type="text"
                                        placeholder="Job Title (e.g. Senior React Developer)"
                                        value={newJob.title}
                                        onChange={e => setNewJob({ ...newJob, title: e.target.value })}
                                        required
                                    />
                                    <textarea
                                        placeholder="Full Job Description..."
                                        rows="4"
                                        value={newJob.description}
                                        onChange={e => setNewJob({ ...newJob, description: e.target.value })}
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Requirements (comma separated: React, Node.js, CSS)"
                                        value={newJob.requirements}
                                        onChange={e => setNewJob({ ...newJob, requirements: e.target.value })}
                                        required
                                    />
                                    <div className="form-row">
                                        <input
                                            type="text"
                                            placeholder="Location"
                                            value={newJob.location}
                                            onChange={e => setNewJob({ ...newJob, location: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Salary Range"
                                            value={newJob.salaryRange}
                                            onChange={e => setNewJob({ ...newJob, salaryRange: e.target.value })}
                                        />
                                    </div>
                                    <button type="submit" className="neon-btn full-width">Publish Vacancy</button>
                                </form>
                            </Motion.div>
                        </Motion.div>
                    )}
                </AnimatePresence>
            </AnimatedPage>
        </div>
    );
}
