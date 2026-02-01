import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { LogOut, User, Map, MessageSquare, BookOpen, BarChart2, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AnimatedPage from '../components/AnimatedPage';
import SkillChart from '../components/skillchart.jsx';
import GlitchText from '../components/GlitchText';
import './dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <AnimatedPage className="dashboard-container">
      <nav className="dashboard-nav glass-panel">
        <GlitchText text="CareerLens AI" as="div" className="nav-logo" />
        <div className="nav-profile">
          <span className="user-name">Hello, {user?.name || 'User'}</span>
          <button onClick={handleLogout} className="logout-btn" title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <div className="dashboard-wrapper container">
        <div className="hero-chart-aside glass-panel">
          <SkillChart />
        </div>

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
              Get personalized roadmaps, skill assessments, and AI-driven advice to accelerate your professional growth.
            </p>
            <div className="hero-content-wrapper">
              <div className="hero-actions">
                <button className="neon-btn">Start Analysis</button>
                <button className="outline-btn">Explore Courses</button>
              </div>
            </div>
          </Motion.div>
        </section>

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
              desc="Deep dive into your professional profile to identify strengths."
            />

            <Motion.div
              variants={item}
              className="feature-card highlighted-card glass-panel"
              onClick={() => navigate('/roadmap')}
              whileHover={{ scale: 1.05, borderColor: 'var(--primary)' }}
            >
              <div className="feature-icon"><Map size={24} color="#6366f1" /></div>
              <h3>Career Roadmap</h3>
              <p>Visual path to your dream job with actionable steps.</p>
              <span className="card-action">View Path →</span>
            </Motion.div>

            <FeatureCard
              icon={<MessageSquare size={24} />}
              title="Mock Interviews"
              desc="Practice with AI-driven interview simulations."
            />

            <FeatureCard
              icon={<BookOpen size={24} />}
              title="Learning Resources"
              desc="Access curated courses and materials custom to you."
            />

            <FeatureCard
              icon={<BarChart2 size={24} />}
              title="Progress Tracking"
              desc="Monitor your growth with detailed analytics."
            />

            <FeatureCard
              icon={<Users size={24} />}
              title="Mentor Network"
              desc="Connect with industry experts in your field."
            />
          </Motion.div>
        </section>
      </div>
    </AnimatedPage>
  );
}

const FeatureCard = ({ icon, title, desc }) => (
  <Motion.div
    variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
    className="feature-card glass-panel"
    whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.03)' }}
  >
    <div className="feature-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{desc}</p>
  </Motion.div>
);
