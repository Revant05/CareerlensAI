import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { motion as Motion } from 'framer-motion';
import { Users, Briefcase, Search, Activity, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import RecruiterSidebar from '../components/RecruiterSidebar';
import AnimatedPage from '../components/AnimatedPage';
import './RecruiterDashboard.css';

export default function RecruiterDashboard() {
    const { user, logout } = useAuth();
    const [stats, setStats] = useState({
        totalOpenings: 0,
        totalApplicants: 0,
        topMatchesCount: 0,
        activeJobs: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/recruiter/dashboard-stats');
                setStats(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="recruiter-loading">
            <div className="scanner-line"></div>
            <p>SYNCING REAL-TIME DATA...</p>
        </div>
    );

    return (
        <div className="recruiter-layout">
            <RecruiterSidebar user={user} onLogout={logout} />

            <AnimatedPage className="recruiter-content">
                <header className="content-header">
                    <div>
                        <h1 className="welcome-text">Analytics Overview</h1>
                        <p className="welcome-sub">Management console for {user?.companyName || 'CareerLens'}</p>
                    </div>
                    <div className="header-actions">
                        <button className="neon-btn">Download Report</button>
                    </div>
                </header>

                <div className="stats-grid">
                    <StatCard
                        icon={<Briefcase color="var(--primary)" />}
                        label="Total Openings"
                        value={stats.totalOpenings}
                        trend="+12%"
                    />
                    <StatCard
                        icon={<Users color="#a855f7" />}
                        label="Total Applicants"
                        value={stats.totalApplicants}
                        trend="+18%"
                    />
                    <StatCard
                        icon={<Search color="#22c55e" />}
                        label="AI Talent Matches"
                        value={stats.topMatchesCount}
                        trend="New"
                    />
                    <StatCard
                        icon={<Activity color="#eab308" />}
                        label="Active Pipelines"
                        value={stats.activeJobs}
                        trend="Live"
                    />
                </div>

                <div className="dashboard-main-grid">
                    <section className="glass-panel main-section">
                        <div className="section-head">
                            <h3>Platform Growth</h3>
                            <button className="text-btn">View All</button>
                        </div>
                        <div className="placeholder-chart">
                            {/* In a real app, integrate Recharts here */}
                            <div className="chart-bar" style={{ height: '40%' }}></div>
                            <div className="chart-bar" style={{ height: '60%' }}></div>
                            <div className="chart-bar" style={{ height: '80%' }}></div>
                            <div className="chart-bar" style={{ height: '50%' }}></div>
                            <div className="chart-bar" style={{ height: '90%' }}></div>
                        </div>
                    </section>

                    <section className="glass-panel side-section">
                        <div className="section-head">
                            <h3>Recruitment Tip</h3>
                        </div>
                        <div className="tip-card">
                            <p>"Candidates with 85%+ AI scores are 3x more likely to clear technical rounds. We've highlighted 12 new matches for you."</p>
                            <button className="outline-btn-sm">Scan Talent</button>
                        </div>
                    </section>
                </div>
            </AnimatedPage>
        </div>
    );
}

const StatCard = ({ icon, label, value, trend }) => (
    <Motion.div
        className="stat-card glass-panel"
        whileHover={{ y: -5, borderColor: 'var(--primary)' }}
    >
        <div className="stat-head">
            <div className="stat-icon-wrapper">{icon}</div>
            <span className="stat-trend">{trend}</span>
        </div>
        <div className="stat-body">
            <h2 className="stat-value">{value}</h2>
            <p className="stat-label">{label}</p>
        </div>
    </Motion.div>
);
