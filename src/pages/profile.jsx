import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import GlitchText from '../components/GlitchText';
import AnimatedPage from '../components/AnimatedPage';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, FileText, Target, Award, Edit2, Save, X, Zap, ShieldAlert, Phone, GraduationCap, Plus, Trash2, CheckCircle, Mail, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import './profile.css';

export default function Profile() {
    const navigate = useNavigate();
    const { user, setUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [tokens, setTokens] = useState([]); // Restored state
    const [isEditing, setIsEditing] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [tempPhone, setTempPhone] = useState('');

    const [formData, setFormData] = useState({
        headline: '',
        aspirations: '', // Changed to handle string input for tags
        phone: '',
        resume: '',
        strengths: '',
        weaknesses: '',
        opportunities: '',
        threats: '',
        education: [],
        certifications: []
    });

    const fetchProfile = async () => {
        try {
            const res = await api.get('/auth/me');
            setProfile(res.data);
            setFormData({
                headline: res.data.headline || '',
                aspirations: res.data.aspirations?.length ? res.data.aspirations.join(', ') : (res.data.aspiration || ''),
                phone: res.data.phone || '',
                resume: res.data.resume || '',
                strengths: res.data.swot?.strengths.join(', ') || '',
                weaknesses: res.data.swot?.weaknesses.join(', ') || '',
                opportunities: res.data.swot?.opportunities.join(', ') || '',
                threats: res.data.swot?.threats.join(', ') || '',
                education: res.data.education || [],
                certifications: res.data.certifications || []
            });
        } catch (err) {
            console.error(err);
        }
    };

    const fetchTokens = async () => {
        try {
            const res = await api.get('/auth/tokens');
            setTokens(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchProfile();
        fetchTokens(); // Restored call
    }, []);

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
                aspirations: formData.aspirations.split(',').map(s => s.trim()).filter(Boolean),
                phone: formData.phone,
                resume: formData.resume,
                swot,
                education: formData.education,
                certifications: formData.certifications
            };

            const res = await api.put('/auth/profile', payload);
            setProfile(res.data);
            setUser(res.data); // Update global user state for the guard
            setIsEditing(false);
            toast.success('Profile Synced Successfully!');
        } catch (err) {
            if (err.response && err.response.data && err.response.data.msg) {
                toast.error(err.response.data.msg); // Show AI validation error from backend
            } else {
                toast.error('Failed to sync profile');
            }
        }
    };

    const handleRequestOtp = async () => {
        if (!formData.phone) return toast.error('Enter phone number first');
        try {
            await api.post('/auth/request-otp', { phone: formData.phone });
            setTempPhone(formData.phone);
            setShowOtpModal(true);
            toast.success('Check console for mock OTP!');
        } catch (err) {
            console.error(err);
            toast.error('Failed to send OTP');
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const res = await api.post('/auth/verify-otp', { code: otpCode });
            setProfile(res.data.user);
            setUser(res.data.user);
            setShowOtpModal(false);
            setOtpCode('');
            toast.success('Identity Verified!');
        } catch (err) {
            console.error(err);
            toast.error('Invalid OTP');
        }
    };

    const addEducation = () => {
        setFormData({
            ...formData,
            education: [...formData.education, { level: '10th', institution: '', year: '', percentage: '', proofUrl: '' }]
        });
    };

    const removeEducation = (index) => {
        const list = [...formData.education];
        list.splice(index, 1);
        setFormData({ ...formData, education: list });
    };

    const updateEducation = (index, field, value) => {
        const list = [...formData.education];
        list[index][field] = value;
        setFormData({ ...formData, education: list });
    };

    const addCertification = () => {
        setFormData({
            ...formData,
            certifications: [...formData.certifications, { title: '', organization: '', date: '', proofUrl: '' }]
        });
    };

    const removeCertification = (index) => {
        const list = [...formData.certifications];
        list.splice(index, 1);
        setFormData({ ...formData, certifications: list });
    };

    const updateCertification = (index, field, value) => {
        const list = [...formData.certifications];
        list[index][field] = value;
        setFormData({ ...formData, certifications: list });
    };

    if (!profile) return <div className="loader-container">Initialising Recruiter Dashboard...</div>;

    // Calculate Progress
    const progressItems = [
        profile.headline,
        (profile.aspirations && profile.aspirations.length > 0) || profile.aspiration,
        profile.isVerifiedPhone,
        profile.education.length > 0,
        profile.swot?.strengths.length > 0
    ];
    const progressPercent = Math.round((progressItems.filter(Boolean).length / progressItems.length) * 100);

    return (
        <AnimatedPage className="profile-container container">
            {/* Completion Progress */}
            <div className="profile-progress-section glass-panel">
                <div className="flex-between">
                    <span>Profile Strength: {progressPercent}%</span>
                    {profile.isProfileComplete ?
                        <span className="verified-badge"><CheckCircle size={14} /> ELIGIBLE FOR ALL SERVICES</span> :
                        <span className="unverified-badge" style={{ textDecoration: 'none' }}>RECRUITER VISIBILITY: LOW</span>
                    }
                </div>
                <div className="profile-progress-bar">
                    <div className="profile-progress-fill" style={{ width: `${progressPercent}%` }}></div>
                </div>
                {!profile.isProfileComplete && (
                    <p className="polite-msg" style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                        "We require your details in order to make your profile strong and future bright."
                    </p>
                )}
            </div>

            <div className="profile-header glass-panel">
                <div className="profile-avatar">
                    {profile.isProfileComplete ? <Award size={64} color="var(--matrix)" /> : <User size={64} color="var(--primary)" />}
                </div>
                <div className="profile-info">
                    <GlitchText text={user.name} />
                    <div className="profile-meta">
                        {isEditing ? (
                            <div className="edit-row">
                                <input
                                    className="edit-input"
                                    value={formData.headline}
                                    onChange={e => setFormData({ ...formData, headline: e.target.value })}
                                    placeholder="Headline (e.g. Full Stack Architect)"
                                />
                                <input
                                    className="edit-input"
                                    value={formData.aspirations}
                                    onChange={e => setFormData({ ...formData, aspirations: e.target.value })}
                                    placeholder="Career Aspirations (comma separated, e.g. Data Scientist, AI Engineer)"
                                />
                            </div>
                        ) : (
                            <>
                                <p className="profile-headline">{profile.headline}</p>
                                {((profile.aspirations && profile.aspirations.length > 0) || profile.aspiration) && (
                                    <p className="profile-aspiration">
                                        <Zap size={14} fill="var(--secondary)" stroke="none" /> Goal: {profile.aspirations?.length ? profile.aspirations.join(' • ') : profile.aspiration}
                                    </p>
                                )}
                            </>
                        )}
                    </div>

                    <div className="contact-details">
                        <p className="profile-email"><Mail size={14} /> {user.email} <span className="verified-badge"><CheckCircle size={12} /> Verified</span></p>
                        <div className="phone-verification">
                            <Phone size={14} /> {isEditing ? (
                                <input
                                    className="edit-input small"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="Phone Number"
                                />
                            ) : (
                                <span>{profile.phone || 'No phone added'}</span>
                            )}
                            {!profile.isVerifiedPhone && !isEditing && profile.phone && (
                                <span className="unverified-badge" onClick={handleRequestOtp}>Verify Identity</span>
                            )}
                            {profile.isVerifiedPhone && <span className="verified-badge"><CheckCircle size={12} /> Secure</span>}
                        </div>
                    </div>
                </div>
                <button className="neon-btn edit-btn" onClick={() => isEditing ? handleSave() : setIsEditing(true)}>
                    {isEditing ? <Save size={18} /> : <Edit2 size={18} />}
                    {isEditing ? ' Finalise' : ' Modify'}
                </button>
            </div>

            <div className="profile-grid">
                <div className="profile-section glass-panel">
                    <h3><GraduationCap size={20} /> Academic History & Qualifications</h3>
                    <div className="entry-list">
                        {(isEditing ? formData.education : profile.education).map((edu, idx) => (
                            <div key={idx} className="entry-card">
                                <div className="entry-main">
                                    {isEditing ? (
                                        <div className="edu-edit-grid">
                                            <select value={edu.level} onChange={e => updateEducation(idx, 'level', e.target.value)}>
                                                <option>10th Std</option>
                                                <option>12th Std / HSC</option>
                                                <option>Diploma</option>
                                                <option>Undergraduate (UG)</option>
                                                <option>Postgraduate (PG)</option>
                                                <option>PhD / Doctorate</option>
                                                <option>Professional Certificate</option>
                                            </select>
                                            <input placeholder="Institution Name" value={edu.institution} onChange={e => updateEducation(idx, 'institution', e.target.value)} />
                                            <input placeholder="Major / Course Name (e.g. Science, CSE, MBA)" value={edu.course} onChange={e => updateEducation(idx, 'course', e.target.value)} />
                                            <input placeholder="Year of Completion" value={edu.year} onChange={e => updateEducation(idx, 'year', e.target.value)} />
                                            <input placeholder="Percentage / CGPA" value={edu.percentage} onChange={e => updateEducation(idx, 'percentage', e.target.value)} />
                                            <div className="proof-upload-row">
                                                <input placeholder="Proof URL (or select file)" value={edu.proofUrl} onChange={e => updateEducation(idx, 'proofUrl', e.target.value)} />
                                                <button className="neon-btn small" style={{ whiteSpace: 'nowrap' }} onClick={() => toast('File selector opened (Mock)')}>Upload Proof</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <h4>{edu.level} - {edu.course || 'General Stream'}</h4>
                                            <p className="edu-institution">{edu.institution}</p>
                                            <div className="entry-details">Batch: {edu.year} | Performance: {edu.percentage}%</div>
                                            {edu.proofUrl && <a href={edu.proofUrl} target="_blank" className="entry-proof"><FileText size={12} /> View Verified Document</a>}
                                        </>
                                    )}
                                </div>
                                {isEditing && <button className="remove-entry" onClick={() => removeEducation(idx)}><Trash2 size={18} /></button>}
                            </div>
                        ))}
                    </div>
                    {isEditing && <button className="add-btn" onClick={addEducation}><Plus size={16} /> Add Educational Entry</button>}
                </div>

                {/* Certifications Section */}
                <div className="profile-section glass-panel">
                    <h3><FileText size={20} /> Professional Certifications</h3>
                    <div className="entry-list">
                        {(isEditing ? formData.certifications : profile.certifications).map((cert, idx) => (
                            <div key={idx} className="entry-card">
                                <div className="entry-main">
                                    {isEditing ? (
                                        <div className="edu-edit-grid">
                                            <input placeholder="Certificate Title" value={cert.title} onChange={e => updateCertification(idx, 'title', e.target.value)} />
                                            <input placeholder="Issuing Organization" value={cert.organization} onChange={e => updateCertification(idx, 'organization', e.target.value)} />
                                            <input placeholder="Date Issued" value={cert.date} onChange={e => updateCertification(idx, 'date', e.target.value)} />
                                            <div className="proof-upload-row">
                                                <input placeholder="Proof/Verify URL" value={cert.proofUrl} onChange={e => updateCertification(idx, 'proofUrl', e.target.value)} />
                                                <button className="neon-btn small" style={{ whiteSpace: 'nowrap' }} onClick={() => toast('Certificate uploaded (Mock)')}>Upload PDF</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <h4>{cert.title}</h4>
                                            <p className="edu-institution">{cert.organization} | {cert.date}</p>
                                            {cert.proofUrl && <a href={cert.proofUrl} target="_blank" className="entry-proof"><FileText size={12} /> View Certificate</a>}
                                        </>
                                    )}
                                </div>
                                {isEditing && <button className="remove-entry" onClick={() => removeCertification(idx)}><Trash2 size={18} /></button>}
                            </div>
                        ))}
                    </div>
                    {isEditing && <button className="add-btn" onClick={addCertification}><Plus size={16} /> Add Certification</button>}
                </div>

                {/* SWOT Analysis */}
                <div className="profile-section glass-panel">
                    <h3><Target size={20} /> Career SWOT Analysis</h3>
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

                {/* Assessment History */}
                <div className="profile-section glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', textAlign: 'center' }}>
                    <FileText size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                    <h3 style={{ margin: 0 }}>Detailed Assessment Reports</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '400px' }}>Your AI interview and technical skill evaluation reports have been moved to a dedicated dashboard for deep analysis.</p>
                    <button className="neon-btn" onClick={() => navigate('/assessment-history')}>
                        <ExternalLink size={16} style={{ marginRight: '8px' }} /> View Assessment History
                    </button>
                </div>

                {/* Achievements */}
                <div className="profile-section glass-panel">
                    <h3><Award size={20} /> Career Achievement Badges</h3>
                    {tokens.length === 0 ? (
                        <p className="placeholder-text">Tokens are awarded upon roadmap completion.</p>
                    ) : (
                        <div className="tokens-grid">
                            {tokens.map(token => {
                                // Title Normalization for professional look
                                let displayTitle = token.title
                                    .replace(/Completer/g, 'Roadmap Master')
                                    .replace(/Communicator/g, 'Interview Ace')
                                    .replace(/Expert/g, 'Skill Verified');

                                return (
                                    <Motion.div
                                        key={token._id}
                                        className="token-card"
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        whileInView={{ scale: 1, opacity: 1 }}
                                        viewport={{ once: true }}
                                        whileHover={{ y: -10 }}
                                    >
                                        <div className="token-icon">🏆</div>
                                        <h4>{displayTitle}</h4>
                                        <span className="token-date">{new Date(token.issuedAt).toLocaleDateString()}</span>
                                    </Motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* OTP Modal */}
            <AnimatePresence>
                {showOtpModal && (
                    <div className="modal-overlay">
                        <Motion.div
                            className="modal-content glass-panel"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                        >
                            <h3>Verify Identity</h3>
                            <p>Verification code sent to {tempPhone}</p>
                            <input
                                className="otp-input"
                                value={otpCode}
                                onChange={e => setOtpCode(e.target.value)}
                                maxLength={6}
                                placeholder="000000"
                            />
                            <div className="flex-between">
                                <button className="neon-btn small" onClick={() => setShowOtpModal(false)}>Cancel</button>
                                <button className="neon-btn" onClick={handleVerifyOtp}>Confirm Identity</button>
                            </div>
                        </Motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AnimatedPage>
    );
}

const SwotBox = ({ label, color, isEditing, value, onChange, items }) => (
    <div className="swot-box" style={{ borderColor: color }}>
        <h4 style={{ color }}>{label}</h4>
        {isEditing ? (
            <textarea
                className="swot-input"
                placeholder="Core strengths..."
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
