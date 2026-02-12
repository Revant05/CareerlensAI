import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Radar, RadarChart, BarChart, Bar, XAxis, YAxis, Tooltip, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Cell } from 'recharts';
import { ArrowLeft, Brain, Target, TrendingUp, AlertTriangle, Lightbulb, Award, BookOpen, Briefcase, Code, CheckCircle, XCircle, Zap, Star, Clock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import AnimatedPage from '../components/AnimatedPage';
import GlitchText from '../components/GlitchText';
import './profileanalysis.css';

export default function ProfileAnalysis() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/auth/me');
            setProfile(res.data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loader-container">Analyzing Your Career Profile...</div>;
    if (!profile) return <div className="loader-container">No profile data found.</div>;

    const analysis = analyzeProfile(profile);

    return (
        <AnimatedPage className="profile-analysis-container container">
            {/* Header */}
            <div className="analysis-header">
                <button onClick={() => navigate('/dashboard')} className="back-link">
                    <ArrowLeft size={16} /> Back to Dashboard
                </button>
                <GlitchText text="Career Intelligence Dashboard" />
                <p className="analysis-subtitle">AI-Powered Career Gap Analysis & Strategic Roadmap</p>
            </div>

            {/* Tab Navigation */}
            <div className="tab-navigation">
                <button
                    className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    <Brain size={18} /> Overview
                </button>
                <button
                    className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
                    onClick={() => setActiveTab('skills')}
                >
                    <Code size={18} /> Skills Analysis
                </button>
                <button
                    className={`tab-btn ${activeTab === 'roadmap' ? 'active' : ''}`}
                    onClick={() => setActiveTab('roadmap')}
                >
                    <Target size={18} /> Action Roadmap
                </button>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                    <Motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <OverviewTab analysis={analysis} profile={profile} />
                    </Motion.div>
                )}

                {activeTab === 'skills' && (
                    <Motion.div
                        key="skills"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <SkillsTab analysis={analysis} />
                    </Motion.div>
                )}

                {activeTab === 'roadmap' && (
                    <Motion.div
                        key="roadmap"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <RoadmapTab analysis={analysis} />
                    </Motion.div>
                )}
            </AnimatePresence>
        </AnimatedPage>
    );
}

// Overview Tab Component
const OverviewTab = ({ analysis, profile }) => (
    <div className="dashboard-grid">
        {/* Hero Stats */}
        <div className="hero-stats">
            <Motion.div
                className="stat-card glass-panel"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}>
                    <Target size={24} />
                </div>
                <div className="stat-content">
                    <h3>{analysis.compatibilityScore}%</h3>
                    <p>Career Ready</p>
                </div>
            </Motion.div>

            <Motion.div
                className="stat-card glass-panel"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, var(--matrix), var(--accent))' }}>
                    <CheckCircle size={24} />
                </div>
                <div className="stat-content">
                    <h3>{analysis.whatYouHave.length}</h3>
                    <p>Skills Acquired</p>
                </div>
            </Motion.div>

            <Motion.div
                className="stat-card glass-panel"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, var(--accent), var(--secondary))' }}>
                    <AlertTriangle size={24} />
                </div>
                <div className="stat-content">
                    <h3>{analysis.whatsMissing.length}</h3>
                    <p>Skills to Learn</p>
                </div>
            </Motion.div>

            <Motion.div
                className="stat-card glass-panel"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, var(--secondary), var(--primary))' }}>
                    <Award size={24} />
                </div>
                <div className="stat-content">
                    <h3>{profile.completedRoadmaps?.length || 0}</h3>
                    <p>Roadmaps Done</p>
                </div>
            </Motion.div>
        </div>

        {/* Main Radar Chart */}
        <Motion.div
            className="radar-card glass-panel"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
        >
            <h3><Brain size={20} /> Skill Radar Analysis</h3>
            <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={analysis.radarData}>
                    <PolarGrid stroke="rgba(99, 102, 241, 0.3)" />
                    <PolarAngleAxis dataKey="skill" tick={{ fill: 'var(--text-muted)', fontSize: 13 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: 'var(--text-muted)' }} />
                    <Radar name="Your Skills" dataKey="current" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.6} />
                    <Radar name="Industry Standard" dataKey="target" stroke="var(--secondary)" fill="var(--secondary)" fillOpacity={0.2} strokeDasharray="5 5" />
                </RadarChart>
            </ResponsiveContainer>
        </Motion.div>

        {/* AI Insight Card */}
        <Motion.div
            className="insight-card glass-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
        >
            <div className="insight-header">
                <Lightbulb size={24} color="var(--accent)" />
                <h3>AI Career Insight</h3>
            </div>
            <p className="insight-main">{analysis.compatibilityInsight}</p>
            <div className="target-display">
                <Briefcase size={18} />
                <span>Target Role: <strong>{profile.aspiration || 'Not Set'}</strong></span>
            </div>
            <div className="progress-ring">
                <svg viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(99, 102, 241, 0.1)" strokeWidth="10" />
                    <Motion.circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="url(#grad)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 50}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - analysis.compatibilityScore / 100) }}
                        transition={{ duration: 1.5 }}
                        transform="rotate(-90 60 60)"
                    />
                    <defs>
                        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="var(--primary)" />
                            <stop offset="100%" stopColor="var(--secondary)" />
                        </linearGradient>
                    </defs>
                    <text x="60" y="65" textAnchor="middle" fill="var(--text-main)" fontSize="24" fontWeight="700">
                        {analysis.compatibilityScore}%
                    </text>
                </svg>
            </div>
        </Motion.div>

        {/* Quick Actions */}
        <Motion.div
            className="quick-actions glass-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
        >
            <h3><Zap size={20} /> Quick Actions</h3>
            <div className="action-list">
                {analysis.recommendations.learningPath.slice(0, 3).map((action, idx) => (
                    <Motion.div
                        key={idx}
                        className="action-item"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + idx * 0.1 }}
                        whileHover={{ x: 5 }}
                    >
                        <ArrowRight size={16} color="var(--primary)" />
                        <span>{action}</span>
                    </Motion.div>
                ))}
            </div>
        </Motion.div>
    </div>
);

// Skills Tab Component
const SkillsTab = ({ analysis }) => (
    <div className="skills-grid">
        {/* Skills Comparison */}
        <Motion.div
            className="skills-comparison glass-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <h3><TrendingUp size={20} /> Skills Breakdown</h3>
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={analysis.skillBarData} layout="vertical">
                    <XAxis type="number" domain={[0, 100]} stroke="var(--text-muted)" />
                    <YAxis type="category" dataKey="name" stroke="var(--text-muted)" width={150} />
                    <Tooltip
                        contentStyle={{ background: 'var(--bg-dark)', border: '1px solid var(--glass-border)' }}
                        cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                    />
                    <Bar dataKey="value" radius={[0, 10, 10, 0]}>
                        {analysis.skillBarData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`url(#barGrad${index})`} />
                        ))}
                    </Bar>
                    <defs>
                        {analysis.skillBarData.map((_, index) => (
                            <linearGradient key={index} id={`barGrad${index}`} x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="var(--primary)" />
                                <stop offset="100%" stopColor="var(--secondary)" />
                            </linearGradient>
                        ))}
                    </defs>
                </BarChart>
            </ResponsiveContainer>
        </Motion.div>

        {/* What You Have */}
        <Motion.div
            className="skill-badges-card glass-panel"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className="card-header">
                <CheckCircle size={20} color="var(--matrix)" />
                <h3>Your Skills</h3>
            </div>
            <div className="badge-container">
                {analysis.whatYouHave.map((skill, idx) => (
                    <Motion.div
                        key={idx}
                        className="skill-badge acquired"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + idx * 0.05 }}
                        whileHover={{ scale: 1.1 }}
                    >
                        <Star size={14} fill="var(--matrix)" stroke="none" />
                        <span>{skill}</span>
                    </Motion.div>
                ))}
            </div>
        </Motion.div>

        {/* What's Missing */}
        <Motion.div
            className="skill-badges-card glass-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className="card-header">
                <AlertTriangle size={20} color="var(--accent)" />
                <h3>Skills to Acquire</h3>
            </div>
            <div className="badge-container">
                {analysis.whatsMissing.map((skill, idx) => (
                    <Motion.div
                        key={idx}
                        className="skill-badge missing"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + idx * 0.05 }}
                        whileHover={{ scale: 1.1 }}
                    >
                        <XCircle size={14} />
                        <span>{skill}</span>
                    </Motion.div>
                ))}
            </div>
        </Motion.div>

        {/* Project Impact */}
        {analysis.projectImpact && (
            <Motion.div
                className="project-metrics glass-panel full-width"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <h3><Code size={20} /> Project Quality Metrics</h3>
                <div className="metrics-grid">
                    <div className="metric-card">
                        <div className="metric-label">Complexity</div>
                        <div className="metric-visual">
                            <Motion.div
                                className="metric-bar-fill"
                                initial={{ width: 0 }}
                                animate={{ width: `${analysis.projectImpact.complexity}%` }}
                                transition={{ duration: 1, delay: 0.6 }}
                            />
                        </div>
                        <div className="metric-value">{analysis.projectImpact.complexity}%</div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-label">Tech Stack</div>
                        <div className="metric-visual">
                            <Motion.div
                                className="metric-bar-fill"
                                initial={{ width: 0 }}
                                animate={{ width: `${analysis.projectImpact.techStack}%` }}
                                transition={{ duration: 1, delay: 0.7 }}
                            />
                        </div>
                        <div className="metric-value">{analysis.projectImpact.techStack}%</div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-label">Best Practices</div>
                        <div className="metric-visual">
                            <Motion.div
                                className="metric-bar-fill"
                                initial={{ width: 0 }}
                                animate={{ width: `${analysis.projectImpact.bestPractices}%` }}
                                transition={{ duration: 1, delay: 0.8 }}
                            />
                        </div>
                        <div className="metric-value">{analysis.projectImpact.bestPractices}%</div>
                    </div>
                </div>
            </Motion.div>
        )}
    </div>
);

// Roadmap Tab Component
const RoadmapTab = ({ analysis }) => (
    <div className="roadmap-grid">
        {/* Timeline */}
        <Motion.div
            className="timeline-card glass-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <h3><Clock size={20} /> Learning Timeline</h3>
            <div className="timeline">
                {analysis.recommendations.learningPath.map((item, idx) => (
                    <Motion.div
                        key={idx}
                        className="timeline-item"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + idx * 0.1 }}
                    >
                        <div className="timeline-marker">{idx + 1}</div>
                        <div className="timeline-content">
                            <p>{item}</p>
                        </div>
                    </Motion.div>
                ))}
            </div>
        </Motion.div>

        {/* Project Ideas */}
        <Motion.div
            className="projects-card glass-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <h3><Code size={20} /> Recommended Projects</h3>
            <div className="project-list">
                {analysis.recommendations.projectIdeas.map((project, idx) => (
                    <Motion.div
                        key={idx}
                        className="project-card"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + idx * 0.1 }}
                        whileHover={{ scale: 1.02, borderColor: 'var(--primary)' }}
                    >
                        <div className="project-icon">
                            <Code size={20} />
                        </div>
                        <p>{project}</p>
                    </Motion.div>
                ))}
            </div>
        </Motion.div>

        {/* Job Matches */}
        <Motion.div
            className="jobs-card glass-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
        >
            <h3><Briefcase size={20} /> Career Opportunities</h3>
            <div className="job-list">
                {analysis.recommendations.jobMatches.map((job, idx) => (
                    <Motion.div
                        key={idx}
                        className="job-item"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + idx * 0.1 }}
                        whileHover={{ x: 5 }}
                    >
                        <Award size={18} color="var(--accent)" />
                        <span>{job}</span>
                    </Motion.div>
                ))}
            </div>
        </Motion.div>
    </div>
);

// Analysis functions (same as before)
function analyzeProfile(profile) {
    const completedRoadmaps = profile.completedRoadmaps || [];
    const strengths = profile.swot?.strengths || [];
    const aspiration = profile.aspiration || '';

    const technicalSkills = extractTechnicalSkills(completedRoadmaps);
    const softSkills = extractSoftSkills(strengths);

    const radarData = calculateRadarData(technicalSkills, softSkills, completedRoadmaps.length, profile);
    const compatibilityScore = calculateCompatibilityScore(profile, technicalSkills, softSkills);
    const compatibilityInsight = generateCompatibilityInsight(compatibilityScore, aspiration, technicalSkills);
    const whatYouHave = identifySkills(technicalSkills, strengths, completedRoadmaps);
    const whatsMissing = identifyMissingSkills(aspiration, technicalSkills, completedRoadmaps);
    const projectImpact = calculateProjectImpact(completedRoadmaps, technicalSkills);
    const recommendations = generateRecommendations(aspiration, whatsMissing, completedRoadmaps);

    // Create bar chart data from radar data
    const skillBarData = radarData.map(item => ({
        name: item.skill,
        value: item.current
    }));

    return {
        radarData,
        skillBarData,
        compatibilityScore,
        compatibilityInsight,
        whatYouHave,
        whatsMissing,
        projectImpact,
        recommendations
    };
}

// Helper functions (same as before - keeping them for completeness)
function extractTechnicalSkills(roadmaps) {
    const skillMap = {
        'frontend': ['HTML', 'CSS', 'JavaScript', 'React', 'Responsive Design'],
        'backend': ['Node.js', 'APIs', 'Databases', 'Authentication', 'Server Logic'],
        'fullstack': ['Frontend', 'Backend', 'Databases', 'Deployment'],
        'devops': ['Docker', 'CI/CD', 'Linux', 'Cloud', 'Monitoring'],
        'ai-engineer': ['Python', 'Machine Learning', 'Deep Learning', 'LLMs'],
        'react': ['React', 'Hooks', 'State Management', 'React Router'],
        'python': ['Python', 'Django', 'Flask', 'Data Structures'],
        'java': ['Java', 'Spring Boot', 'OOP', 'Maven'],
        'sql': ['SQL', 'Databases', 'Query Optimization'],
    };

    const skills = new Set();
    roadmaps.forEach(roadmap => {
        const roadmapSkills = skillMap[roadmap.roadmapId] || [];
        roadmapSkills.forEach(skill => skills.add(skill));
    });

    return Array.from(skills);
}

function extractSoftSkills(strengths) {
    const softSkillKeywords = ['communication', 'leadership', 'teamwork', 'problem solving', 'creativity', 'adaptability'];
    return strengths.filter(s =>
        softSkillKeywords.some(keyword => s.toLowerCase().includes(keyword))
    );
}

function calculateRadarData(technicalSkills, softSkills, roadmapCount, profile) {
    return [
        { skill: 'Technical Skills', current: Math.min(100, technicalSkills.length * 15 + roadmapCount * 10), target: 85 },
        { skill: 'Soft Skills', current: Math.min(100, softSkills.length * 20), target: 75 },
        { skill: 'Problem Solving', current: Math.min(100, roadmapCount * 15 + (profile.swot?.strengths?.length || 0) * 5), target: 80 },
        { skill: 'Experience', current: Math.min(100, roadmapCount * 20), target: 70 },
        { skill: 'Tools & Frameworks', current: Math.min(100, technicalSkills.length * 12), target: 75 },
        { skill: 'Industry Knowledge', current: profile.resume ? 60 : 30, target: 65 }
    ];
}

function calculateCompatibilityScore(profile, technicalSkills, softSkills) {
    let score = 0;
    score += Math.min(40, (profile.completedRoadmaps?.length || 0) * 10);
    let completeness = 0;
    if (profile.resume) completeness += 7;
    if (profile.aspiration) completeness += 7;
    if (profile.swot?.strengths?.length > 0) completeness += 6;
    score += completeness;
    score += Math.min(30, technicalSkills.length * 3 + softSkills.length * 2);
    score += Math.min(10, (profile.completedRoadmaps?.length || 0) * 2);
    return Math.min(100, Math.round(score));
}

function generateCompatibilityInsight(score, aspiration, skills) {
    const role = aspiration || 'your target role';
    if (score >= 80) return `Excellent! You are ${score}% ready for ${role}. You're well-prepared to apply for positions.`;
    if (score >= 60) return `You are ${score}% ready for ${role}. Focus on advanced frameworks to reach 80%+.`;
    if (score >= 40) return `You are ${score}% ready for ${role}. Complete more roadmaps and build projects to improve.`;
    return `You are ${score}% ready for ${role}. Start with foundational roadmaps to build your skills.`;
}

function identifySkills(technicalSkills, strengths, roadmaps) {
    const skills = [...technicalSkills];
    roadmaps.forEach(r => skills.push(`${r.roadmapTitle}`));
    strengths.slice(0, 3).forEach(s => skills.push(s));
    return skills.slice(0, 12);
}

function identifyMissingSkills(aspiration, currentSkills, roadmaps) {
    const roleRequirements = {
        'frontend': ['TypeScript', 'Next.js', 'Testing', 'Webpack', 'Performance'],
        'backend': ['Microservices', 'Docker', 'Redis', 'Message Queues', 'System Design'],
        'fullstack': ['TypeScript', 'Docker', 'Testing', 'CI/CD', 'Cloud'],
        'devops': ['Kubernetes', 'Terraform', 'Monitoring', 'Security'],
        'ai': ['TensorFlow', 'PyTorch', 'MLOps', 'Model Deployment'],
    };

    let requirements = [];
    const aspirationLower = aspiration.toLowerCase();

    if (aspirationLower.includes('frontend')) requirements = roleRequirements.frontend;
    else if (aspirationLower.includes('backend')) requirements = roleRequirements.backend;
    else if (aspirationLower.includes('fullstack')) requirements = roleRequirements.fullstack;
    else if (aspirationLower.includes('devops')) requirements = roleRequirements.devops;
    else if (aspirationLower.includes('ai') || aspirationLower.includes('ml')) requirements = roleRequirements.ai;
    else requirements = ['System Design', 'Testing', 'Git', 'Deployment', 'Best Practices'];

    return requirements.filter(req =>
        !currentSkills.some(skill => skill.toLowerCase().includes(req.toLowerCase()))
    );
}

function calculateProjectImpact(roadmaps, skills) {
    if (roadmaps.length === 0) return null;
    return {
        complexity: Math.min(100, roadmaps.length * 25 + 20),
        techStack: Math.min(100, skills.length * 10 + 30),
        bestPractices: Math.min(100, roadmaps.length * 20 + 25)
    };
}

function generateRecommendations(aspiration, missingSkills, roadmaps) {
    const learningPath = missingSkills.length > 0
        ? missingSkills.slice(0, 5).map(skill => `Master ${skill} - Official docs & tutorials`)
        : ['Explore advanced topics', 'Contribute to open source', 'Build complex projects'];

    const aspirationLower = aspiration.toLowerCase();
    let projectIdeas = [];

    if (aspirationLower.includes('frontend')) {
        projectIdeas = ['Real-time dashboard with React & WebSockets', 'Component library with Storybook', 'Progressive Web App (PWA)'];
    } else if (aspirationLower.includes('backend')) {
        projectIdeas = ['RESTful API with authentication', 'Microservices architecture', 'Real-time chat application'];
    } else if (aspirationLower.includes('fullstack')) {
        projectIdeas = ['E-commerce platform end-to-end', 'Social media clone', 'Project management tool'];
    } else {
        projectIdeas = ['Portfolio website', 'CRUD application', 'Open source contribution'];
    }

    const completedCount = roadmaps.length;
    const jobMatches = completedCount >= 3
        ? ['Mid-level Developer', 'Specialized roles', 'Team lead opportunities']
        : completedCount >= 1
            ? ['Junior Developer', 'Internships', 'Entry-level roles']
            : ['Complete roadmaps first', 'Build portfolio projects'];

    return { learningPath, projectIdeas, jobMatches };
}
