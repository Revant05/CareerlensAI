import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import GlitchText from '../components/GlitchText';
import AnimatedPage from '../components/AnimatedPage';
import { motion as Motion } from 'framer-motion';
import { User, FileText, Target, Award, Edit2, Save, X, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import './profile.css';

export default function Profile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [tokens, setTokens] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        headline: '',
        aspiration: '',
        resume: '',
        strengths: '',
        weaknesses: '',
        opportunities: '',
        threats: ''
    });

    useEffect(() => {
        fetchProfile();
        fetchTokens();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/auth/me');
            setProfile(res.data);
            setFormData({
                headline: res.data.headline || '',
                aspiration: res.data.aspiration || '',
                resume: res.data.resume || '',
                strengths: res.data.swot?.strengths.join(', ') || '',
                weaknesses: res.data.swot?.weaknesses.join(', ') || '',
                opportunities: res.data.swot?.opportunities.join(', ') || '',
                threats: res.data.swot?.threats.join(', ') || ''
            });
        } catch (err) {
            console.error(err);
        }
    };

    const fetchTokens = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/auth/tokens');
            setTokens(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSave = async () => {
        try {
            const swot = {
                strengths: formData.strengths.split(',').map(s => s.trim()).filter(Boolean),
                weaknesses: formData.weaknesses.split(',').map(s => s.trim()).filter(Boolean),
                opportunities: formData.opportunities.split(',').map(s => s.trim()).filter(Boolean),
                threats: formData.threats.split(',').map(s => s.trim()).filter(Boolean)
            };

            const payload = {
                headline: formData.headline,
                aspiration: formData.aspiration,
                resume: formData.resume,
                swot
            };

            const res = await axios.put('http://localhost:5000/api/auth/profile', payload);
            setProfile(res.data);
            setIsEditing(false);
            toast.success('Profile Updated!');
        } catch (err) {
            toast.error('Failed to update profile');
        }
    };

    if (!profile) return <div className="loader-container">Loading Profile...</div>;

    return (
        <AnimatedPage className="profile-container container">
            <div className="profile-header glass-panel">
                <div className="profile-avatar">
                    <User size={64} color="var(--primary)" />
                </div>
                <div className="profile-info">
                    <GlitchText text={user.name} />

                    <div className="profile-meta">
                        {isEditing ? (
                            <>
                                <input
                                    className="edit-input"
                                    value={formData.headline}
                                    onChange={e => setFormData({ ...formData, headline: e.target.value })}
                                    placeholder="Headline (e.g. Frontend Dev)"
                                />
                                <input
                                    className="edit-input"
                                    value={formData.aspiration}
                                    onChange={e => setFormData({ ...formData, aspiration: e.target.value })}
                                    placeholder="Aspiration (e.g. Future CTO)"
                                />
                            </>
                        ) : (
                            <>
                                <p className="profile-headline">{profile.headline}</p>
                                {profile.aspiration && (
                                    <p className="profile-aspiration"><Zap size={14} fill="var(--secondary)" stroke="none" /> Aspiration: {profile.aspiration}</p>
                                )}
                            </>
                        )}
                    </div>

                    <p className="profile-email">{user.email}</p>
                </div>
                <button className="neon-btn edit-btn" onClick={() => isEditing ? handleSave() : setIsEditing(true)}>
                    {isEditing ? <Save size={18} /> : <Edit2 size={18} />}
                    {isEditing ? ' Save' : ' Edit'}
                </button>
            </div>

            <div className="profile-grid">
                {/* Tokens / Badges - Moved up for prominence */}
                <div className="profile-section glass-panel">
                    <h3><Award size={20} /> Achievements & Tokens</h3>
                    {tokens.length === 0 ? (
                        <p className="placeholder-text">Complete roadmaps to earn tokens!</p>
                    ) : (
                        <div className="tokens-grid">
                            {tokens.map(token => (
                                <Motion.div
                                    key={token._id}
                                    className="token-card"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                >
                                    <div className="token-icon">🏆</div>
                                    <h4>{token.title}</h4>
                                    <span className="token-date">{new Date(token.issuedAt).toLocaleDateString()}</span>
                                </Motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Resume Section */}
                <div className="profile-section glass-panel">
                    <h3><FileText size={20} /> Resume / CV</h3>
                    {isEditing ? (
                        <textarea
                            className="edit-textarea"
                            placeholder="Paste Resume Text or Link"
                            value={formData.resume}
                            onChange={e => setFormData({ ...formData, resume: e.target.value })}
                        />
                    ) : (
                        <div className="resume-content">
                            {profile.resume ? profile.resume : <span className="placeholder-text">No resume added yet.</span>}
                        </div>
                    )}
                </div>

                {/* SWOT Analysis */}
                <div className="profile-section glass-panel">
                    <h3><Target size={20} /> SWOT Analysis</h3>
                    <div className="swot-grid">
                        <SwotBox label="Strengths" color="var(--matrix)" isEditing={isEditing}
                            value={formData.strengths}
                            onChange={v => setFormData({ ...formData, strengths: v })}
                            items={profile.swot?.strengths} />
                        <SwotBox label="Weaknesses" color="var(--accent)" isEditing={isEditing}
                            value={formData.weaknesses}
                            onChange={v => setFormData({ ...formData, weaknesses: v })}
                            items={profile.swot?.weaknesses} />
                        <SwotBox label="Opportunities" color="var(--primary)" isEditing={isEditing}
                            value={formData.opportunities}
                            onChange={v => setFormData({ ...formData, opportunities: v })}
                            items={profile.swot?.opportunities} />
                        <SwotBox label="Threats" color="var(--secondary)" isEditing={isEditing}
                            value={formData.threats}
                            onChange={v => setFormData({ ...formData, threats: v })}
                            items={profile.swot?.threats} />
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
}

const SwotBox = ({ label, color, isEditing, value, onChange, items }) => (
    <div className="swot-box" style={{ borderColor: color }}>
        <h4 style={{ color }}>{label}</h4>
        {isEditing ? (
            <textarea
                className="swot-input"
                placeholder="Comma separated..."
                value={value}
                onChange={e => onChange(e.target.value)}
            />
        ) : (
            <ul>
                {items && items.length > 0 ? items.map((i, idx) => <li key={idx}>{i}</li>) : <li>-</li>}
            </ul>
        )}
    </div>
);
