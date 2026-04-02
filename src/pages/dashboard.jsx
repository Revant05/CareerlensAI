import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { LogOut, User, Map, MessageSquare, BookOpen, BarChart2, Users, Sun, Moon, Award, Briefcase, Shield, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import AnimatedPage from '../components/AnimatedPage';
import SkillChart from '../components/skillchart.jsx';
import GlitchText from '../components/GlitchText';
import api from '../api/api';
import './dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [liveUser, setLiveUser] = useState(user);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Fetch fresh user data from DB on mount
  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const res = await api.get('/auth/me');
        setLiveUser(res.data);
        setUser(res.data); // update global context too
      } catch (err) {
        setLiveUser(user); // fallback to context
      } finally {
        setDataLoaded(true);
      }
    };
    fetchLiveData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const activeUser = liveUser || user;

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  React.useEffect(() => {
    if (user?.role === 'recruiter') navigate('/recruiter-dashboard');
    if (user?.role === 'admin') navigate('/admin-dashboard');
  }, [user, navigate]);

  return (
    <AnimatedPage className="dashboard-container">
      <nav className="dashboard-nav glass-panel">
        <div className="nav-branding">
          <img className="logo" src="logo.jpeg" alt="Logo" />
          <GlitchText text="CareerLens AI" as="div" className="nav-logo" />
        </div>
        <div className="nav-profile">
          <button onClick={() => navigate('/profile')} className="user-name-btn" title="View Profile">
            {activeUser?.role === 'admin' ? <Shield size={18} style={{ marginRight: '5px' }} /> : <User size={18} style={{ marginRight: '5px' }} />}
            {activeUser?.name || 'User'}
          </button>
          <button onClick={toggleTheme} className="logout-btn" title="Toggle Theme" style={{ marginRight: '10px' }}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={handleLogout} className="logout-btn" title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <div className="dashboard-wrapper container">
        <section className="hero-section">
          <Motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="hero-badge">AI-Powered Career Guidance</div>
            <h1 className="hero-title">
              Transform Your <br />
              <GlitchText text="Career Journey" as="span" className="hero-glitch" />
            </h1>
            <p className="hero-subtitle">
              Welcome back, <strong>{activeUser?.name?.split(' ')[0] || 'there'}</strong>. Your AI career engine is ready.
            </p>
            <div className="hero-content-wrapper">
              <div className="hero-actions">
                <button onClick={() => navigate('/profile-analysis')} className="neon-btn">Start Analysis</button>
                <button onClick={() => navigate('/roadmap')} className="outline-btn">Explore Roadmaps</button>
              </div>
            </div>
          </Motion.div>
        </section>

        <div className="hero-chart-aside glass-panel">
          <SkillChart />
        </div>

        <section className="features-section">
          <div className="section-header">
            <h2 className="section-title">Everything You Need to Succeed</h2>
            <p className="section-subtitle">Comprehensive tools and AI-powered insights</p>
          </div>

          <Motion.div
            className="features-grid"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <FeatureCard
              icon={<User size={24} />}
              title="Profile Analysis"
              desc={dataLoaded
                ? `${activeUser?.assessments?.length || 0} assessments · ${activeUser?.completedRoadmaps?.length || 0} roadmaps done`
                : 'Loading your data...'}
              onClick={() => navigate('/profile-analysis')}
            />

            <Motion.div
              variants={item}
              className="feature-card highlighted-card glass-panel"
              onClick={() => navigate('/roadmap')}
              whileHover={{ scale: 1.05, borderColor: 'var(--primary)' }}
            >
              <div className="feature-icon"><Map size={24} color="#6366f1" /></div>
              <h3>Career Roadmap</h3>
              <p>{activeUser?.completedRoadmaps?.length > 0
                ? `${activeUser.completedRoadmaps.length} completed · Keep going!`
                : 'Start your first roadmap today.'}
              </p>
              <span className="card-action">View Path →</span>
            </Motion.div>

            <FeatureCard
              icon={<Briefcase size={24} color="#00f3ff" />}
              title="Job Marketplace"
              desc="See vacancies and apply for roles matching your level."
              onClick={() => navigate('/jobs')}
            />

            <FeatureCard
              icon={<MessageSquare size={24} color="#6366f1" />}
              title="Direct Messages"
              desc="Chat with recruiters about your applications."
              onClick={() => navigate('/messages')}
            />

            <FeatureCard
              icon={<Award size={24} />}
              title="Achievements"
              desc={dataLoaded
                ? `${activeUser?.tokens?.length || 0} career tokens earned`
                : 'Loading achievements...'}
              onClick={() => navigate('/profile')}
            />

            <FeatureCard
              icon={<Users size={24} />}
              title="Practice Interview"
              desc={dataLoaded && activeUser?.assessments?.filter(a => a.type === 'mock_interview').length > 0
                ? `${activeUser.assessments.filter(a => a.type === 'mock_interview').length} interviews completed`
                : 'Real-time AI-powered practice — all 24 roles.'}
              onClick={() => navigate('/mock-interview')}
            />

            <FeatureCard
              icon={<BarChart2 size={24} />}
              title="Skill Evaluation"
              desc="Assess your technical skills comprehensively."
              onClick={() => navigate('/skill-evaluation')}
            />
          </Motion.div>
        </section>
      </div>
    </AnimatedPage>
  );
}

const FeatureCard = ({ icon, title, desc, onClick }) => (
  <Motion.div
    variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
    className="feature-card glass-panel"
    whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.03)' }}
    onClick={onClick}
    style={{ cursor: onClick ? 'pointer' : 'default' }}
  >
    <div className="feature-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{desc}</p>
  </Motion.div>
);
