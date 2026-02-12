import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mic, MicOff, Phone, FileText, Code, Database, Server, Gamepad2, User, TrendingUp, Clock, MessageSquare, CheckCircle, Layout, Shield, Cpu, Globe, Smartphone, Lock, Palette, Zap, Users, BarChart, Briefcase, Radio } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import GlitchText from '../components/GlitchText';
import './mockinterview.css';

const roles = [
    { id: 'frontend', title: 'Frontend Developer', icon: Code, color: 'var(--primary)', description: 'User Interface & UX' },
    { id: 'backend', title: 'Backend Developer', icon: Server, color: 'var(--secondary)', description: 'Server Logic & DBs' },
    { id: 'fullstack', title: 'Full Stack Developer', icon: Layout, color: 'var(--accent)', description: 'Frontend & Backend' },
    { id: 'devops', title: 'DevOps Engineer', icon: Cpu, color: 'var(--matrix)', description: 'Operations & CI/CD' },
    { id: 'devsecops', title: 'DevSecOps Engineer', icon: Shield, color: '#ff6b6b', description: 'Securing DevOps' },
    { id: 'ai-engineer', title: 'AI Engineer', icon: Zap, color: '#ffd93d', description: 'AI & Models' },
    { id: 'data-analyst', title: 'Data Analyst', icon: BarChart, color: '#6bcf7f', description: 'Insights from Data' },
    { id: 'ai-data-scientist', title: 'AI & Data Scientist', icon: TrendingUp, color: '#a29bfe', description: 'Science of Data' },
    { id: 'data-engineer', title: 'Data Engineer', icon: Database, color: '#fd79a8', description: 'Big Data Pipelines' },
    { id: 'android', title: 'Android Developer', icon: Smartphone, color: '#3ddc84', description: 'Mobile Apps (Kotlin)' },
    { id: 'ios', title: 'iOS Developer', icon: Smartphone, color: '#007aff', description: 'Mobile Apps (Swift)' },
    { id: 'postgresql', title: 'PostgreSQL DBA', icon: Database, color: '#336791', description: 'DB Administration' },
    { id: 'blockchain', title: 'Blockchain Developer', icon: Globe, color: '#f7931a', description: 'Web3 & Crypto' },
    { id: 'qa', title: 'QA Engineer', icon: CheckCircle, color: '#00b894', description: 'Quality Assurance' },
    { id: 'software-architect', title: 'Software Architect', icon: Layout, color: '#0984e3', description: 'System Design' },
    { id: 'cyber-security', title: 'Cyber Security', icon: Lock, color: '#d63031', description: 'Security' },
    { id: 'ux-design', title: 'UX Designer', icon: Palette, color: '#e17055', description: 'User Experience' },
    { id: 'game-developer', title: 'Game Developer', icon: Gamepad2, color: '#6c5ce7', description: 'Game Creation' },
    { id: 'mlops', title: 'MLOps Engineer', icon: Cpu, color: '#fdcb6e', description: 'ML Operations' },
    { id: 'product-manager', title: 'Product Manager', icon: Briefcase, color: '#74b9ff', description: 'Product Lifecycle' },
    { id: 'engineering-manager', title: 'Engineering Manager', icon: Users, color: '#a29bfe', description: 'Leading Teams' },
    { id: 'devrel', title: 'Developer Relations', icon: Radio, color: '#fd79a8', description: 'Community' },
    { id: 'bi-analyst', title: 'BI Analyst', icon: BarChart, color: '#55efc4', description: 'Business Intelligence' },
];

const featuredInterview = {
    id: 'top-companies',
    title: 'Top Companies Interview',
    icon: Briefcase,
    color: '#ff6348',
    description: 'AI-powered FAANG+ Interview Practice'
};

export default function MockInterview() {
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState(null);
    const [interviewActive, setInterviewActive] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [showTranscript, setShowTranscript] = useState(false);
    const [aiStatus, setAiStatus] = useState('Ready to start');
    const [liveMetrics, setLiveMetrics] = useState({
        fillerWords: 0,
        speakingPace: 120, // words per minute
        confidence: 85,
        eyeContact: 90
    });

    // Simulate AI speaking and listening
    useEffect(() => {
        if (!interviewActive) return;

        const interval = setInterval(() => {
            const random = Math.random();

            if (random > 0.7) {
                setIsSpeaking(true);
                setAiStatus('AI is speaking...');
                setTimeout(() => {
                    setIsSpeaking(false);
                    setAiStatus('AI is listening...');
                }, 2000);
            } else if (random > 0.4) {
                setAiStatus('AI is thinking...');
            } else {
                setAiStatus('AI is listening...');
            }

            // Update metrics randomly
            setLiveMetrics(prev => ({
                fillerWords: Math.min(prev.fillerWords + Math.floor(Math.random() * 2), 15),
                speakingPace: Math.max(100, Math.min(150, prev.speakingPace + (Math.random() - 0.5) * 10)),
                confidence: Math.max(70, Math.min(100, prev.confidence + (Math.random() - 0.5) * 5)),
                eyeContact: Math.max(75, Math.min(100, prev.eyeContact + (Math.random() - 0.5) * 5))
            }));
        }, 3000);

        return () => clearInterval(interval);
    }, [interviewActive]);

    const handleRoleSelect = (role) => {
        setSelectedRole(role.id);
        setTimeout(() => {
            setInterviewActive(true);
            setAiStatus('AI is listening...');
        }, 500);
    };

    const handleEndInterview = () => {
        setInterviewActive(false);
        setSelectedRole(null);
        setLiveMetrics({
            fillerWords: 0,
            speakingPace: 120,
            confidence: 85,
            eyeContact: 90
        });
        setAiStatus('Ready to start');
    };

    return (
        <AnimatedPage className="mock-interview-container container">
            {/* Header */}
            <div className="interview-header">
                <button onClick={() => navigate('/dashboard')} className="back-link">
                    <ArrowLeft size={16} /> Back to Dashboard
                </button>
                <GlitchText text="AI Mock Interview" />
                <p className="interview-subtitle">Practice with AI-powered interviewer</p>
            </div>

            <AnimatePresence mode="wait">
                {!interviewActive ? (
                    // Role Selection State
                    <Motion.div
                        key="role-selection"
                        className="role-selection-layout"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Role-Specific Interviews */}
                        <div className="role-section">
                            <h3 className="section-title">Role-Specific Interviews</h3>
                            <div className="role-cards-grid">
                                {roles.map((role, idx) => {
                                    const Icon = role.icon;
                                    return (
                                        <Motion.div
                                            key={role.id}
                                            className="role-card glass-panel"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 + idx * 0.02 }}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            onClick={() => handleRoleSelect(role)}
                                        >
                                            <div className="role-icon" style={{ color: role.color }}>
                                                <Icon size={32} />
                                            </div>
                                            <h4>{role.title}</h4>
                                            <p>{role.description}</p>
                                        </Motion.div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Featured Interview */}
                        <Motion.div
                            className="featured-interview-section"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <h3 className="section-title">Featured Interview</h3>
                            <Motion.div
                                className="featured-card glass-panel"
                                whileHover={{ scale: 1.02, y: -5 }}
                                onClick={() => handleRoleSelect(featuredInterview)}
                            >
                                <div className="featured-content">
                                    <div className="featured-icon" style={{ color: featuredInterview.color }}>
                                        <Briefcase size={48} />
                                    </div>
                                    <div className="featured-text">
                                        <h2>{featuredInterview.title}</h2>
                                        <p>{featuredInterview.description}</p>
                                        <span className="featured-badge">🔥 Most Popular</span>
                                    </div>
                                </div>
                            </Motion.div>
                        </Motion.div>
                    </Motion.div>
                ) : (
                    // Active Interview State
                    <Motion.div
                        key="interview-active"
                        className="interview-active-layout"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Main Interview Area */}
                        <div className="interview-main">
                            {/* AI Avatar */}
                            <Motion.div
                                className="ai-avatar-container"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div className={`ai-avatar ${isSpeaking ? 'speaking' : ''}`}>
                                    <div className="avatar-suit">
                                        <User size={120} strokeWidth={1.5} />
                                    </div>
                                </div>

                                {/* Voice Visualizer */}
                                <div className="voice-visualizer">
                                    {[...Array(7)].map((_, i) => (
                                        <Motion.div
                                            key={i}
                                            className={`visualizer-bar ${isSpeaking ? 'active' : ''}`}
                                            animate={{
                                                height: isSpeaking
                                                    ? [20, 60, 40, 70, 30, 60, 20][i]
                                                    : 20
                                            }}
                                            transition={{
                                                duration: 0.5,
                                                repeat: isSpeaking ? Infinity : 0,
                                                repeatType: 'reverse',
                                                delay: i * 0.1
                                            }}
                                        />
                                    ))}
                                </div>

                                {/* Status Indicator */}
                                <Motion.div
                                    className="status-indicator"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <div className={`status-dot ${isSpeaking ? 'speaking' : 'listening'}`} />
                                    <span>{aiStatus}</span>
                                </Motion.div>
                            </Motion.div>

                            {/* Selected Role Badge */}
                            <Motion.div
                                className="selected-role-badge"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                {(() => {
                                    const role = roles.find(r => r.id === selectedRole) || (selectedRole === featuredInterview.id ? featuredInterview : null);
                                    const Icon = role?.icon;
                                    return (
                                        <>
                                            <Icon size={20} />
                                            <span>{role?.title} Interview</span>
                                        </>
                                    );
                                })()}
                            </Motion.div>
                        </div>

                        {/* Live Soft-Skill Tracker */}
                        <Motion.div
                            className="skill-tracker glass-panel"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <h4><TrendingUp size={18} /> Live Metrics</h4>

                            <div className="metric-item">
                                <div className="metric-header">
                                    <MessageSquare size={16} />
                                    <span>Filler Words</span>
                                </div>
                                <div className="metric-value">{liveMetrics.fillerWords}</div>
                            </div>

                            <div className="metric-item">
                                <div className="metric-header">
                                    <Clock size={16} />
                                    <span>Speaking Pace</span>
                                </div>
                                <div className="metric-bar">
                                    <Motion.div
                                        className="metric-fill"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(liveMetrics.speakingPace / 150) * 100}%` }}
                                    />
                                </div>
                                <div className="metric-value">{Math.round(liveMetrics.speakingPace)} wpm</div>
                            </div>

                            <div className="metric-item">
                                <div className="metric-header">
                                    <TrendingUp size={16} />
                                    <span>Confidence</span>
                                </div>
                                <div className="metric-bar">
                                    <Motion.div
                                        className="metric-fill"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${liveMetrics.confidence}%` }}
                                    />
                                </div>
                                <div className="metric-value">{Math.round(liveMetrics.confidence)}%</div>
                            </div>

                            <div className="metric-item">
                                <div className="metric-header">
                                    <User size={16} />
                                    <span>Eye Contact</span>
                                </div>
                                <div className="metric-bar">
                                    <Motion.div
                                        className="metric-fill"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${liveMetrics.eyeContact}%` }}
                                    />
                                </div>
                                <div className="metric-value">{Math.round(liveMetrics.eyeContact)}%</div>
                            </div>
                        </Motion.div>

                        {/* Control Bar */}
                        <Motion.div
                            className="control-bar"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <button
                                className={`control-btn ${isMuted ? 'muted' : ''}`}
                                onClick={() => setIsMuted(!isMuted)}
                            >
                                {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                                <span>{isMuted ? 'Unmute' : 'Mute'}</span>
                            </button>

                            <button
                                className="control-btn end-btn"
                                onClick={handleEndInterview}
                            >
                                <Phone size={24} />
                                <span>End Interview</span>
                            </button>

                            <button
                                className={`control-btn ${showTranscript ? 'active' : ''}`}
                                onClick={() => setShowTranscript(!showTranscript)}
                            >
                                <FileText size={24} />
                                <span>Transcript</span>
                            </button>
                        </Motion.div>

                        {/* Live Transcript (if enabled) */}
                        <AnimatePresence>
                            {showTranscript && (
                                <Motion.div
                                    className="transcript-panel glass-panel"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                >
                                    <h4>Live Transcript</h4>
                                    <div className="transcript-content">
                                        <div className="transcript-message ai">
                                            <strong>AI:</strong> Tell me about yourself and your experience with {(roles.find(r => r.id === selectedRole) || (selectedRole === featuredInterview.id ? featuredInterview : null))?.title.toLowerCase()}.
                                        </div>
                                        <div className="transcript-message user">
                                            <strong>You:</strong> I have been working on various projects...
                                        </div>
                                    </div>
                                </Motion.div>
                            )}
                        </AnimatePresence>
                    </Motion.div>
                )}
            </AnimatePresence>
        </AnimatedPage>
    );
}
