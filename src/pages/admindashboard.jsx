import React, { useState, useEffect } from 'react';
import { Shield, Users, Activity, MessageSquare, Trash2, UserPlus, Cpu, Zap, Radio, Database, Server, Key, LogOut } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import api from '../api/api';
import toast from 'react-hot-toast';
import './admindashboard.css';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [students, setStudents] = useState([]);
    const [recruiters, setRecruiters] = useState([]);
    const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [trainStatus, setTrainStatus] = useState({});
    const fetchStats = async () => {
        try {
            const res = await api.get('/admin/stats');
            setStats(res.data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch system stats');
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setStudents(res.data.students);
            setRecruiters(res.data.recruiters);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch user data');
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchStats();
        fetchUsers();
    }, []);

    const deleteUser = async (id) => {
        if (!window.confirm('Are you sure? This action is irreversible.')) return;
        try {
            await api.delete(`/admin/user/${id}`);
            toast.success('User purged from biological records.');
            fetchUsers();
            fetchStats();
        } catch (err) {
            console.error(err);
            toast.error('Purge failed. External interference detected.');
        }
    };

    const handleAddAdmin = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/register', newAdmin);
            toast.success('New operator added to the network.');
            setShowAdminModal(false);
            setNewAdmin({ name: '', email: '', password: '' });
            fetchStats();
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Registration failed.');
        }
    };

    const triggerTraining = async (agent) => {
        setTrainStatus({ ...trainStatus, [agent]: 'Initializing...' });
        try {
            await api.post('/admin/train', { agent });
            toast.success(`${agent} optimization sequences started.`);
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.floor(Math.random() * 20);
                if (progress >= 100) {
                    progress = 100;
                    setTrainStatus({ ...trainStatus, [agent]: '100% - Optimized' });
                    clearInterval(interval);
                } else {
                    setTrainStatus({ ...trainStatus, [agent]: `${progress}% - Syncing...` });
                }
            }, 500);
        } catch (err) {
            console.error(err);
            setTrainStatus({ ...trainStatus, [agent]: 'FAILED' });
            toast.error('Neural link severed.');
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const data = JSON.parse(event.target.result);
                toast.success(`Dataset loaded: ${Object.keys(data).length} entries found. Commencing feed.`);
                triggerTraining('Core Dataset Injection');
            } catch (err) {
                toast.error("Invalid JSON format. Engine rejected the payload.");
            }
        };
        reader.readAsText(file);
    };

    const triggerMaintenance = async () => {
        if (!window.confirm('WARNING: Force System Maintenance?')) return;
        try {
            await api.post('/admin/broadcast', { target: 'GLOBAL', message: 'SYSTEM KERNEL UPDATE. PLEASE DISCONNECT.' });
            toast.success('Maintenance override engaged. Broadcast sent.');
        } catch (err) {
            toast.error('Failed to engage maintenance mode.');
        }
    };

    const handleAuthOverride = (e) => {
        e.preventDefault();
        const cid = document.getElementById('override-id').value;
        if (!cid) return toast.error('Specimen ID required.');
        toast.promise(
            new Promise(resolve => setTimeout(resolve, 1500)),
            {
                loading: 'Bypassing Security Protocols...',
                success: 'Override successful. Redirecting to user lens.',
                error: 'Override failed.'
            }
        ).then(() => {
            // Wait for toast then redirect
            setTimeout(() => { window.location.href = '/dashboard'; }, 1000);
        });
    };

    return (
        <AnimatedPage className="admin-dashboard">
            <div className="admin-header">
                <div>
                    <div className="admin-title">SYSTEM CONTROL DECK</div>
                    <p style={{ opacity: 0.5, fontSize: '0.8rem' }}>Welcome, Operator [Dhruva]</p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button className="glow-btn" onClick={() => setShowAdminModal(true)}><UserPlus size={16} /> Deploy Admin</button>
                    <button className="glow-btn" style={{ borderColor: '#ff4444', color: '#ff4444' }} onClick={() => { localStorage.removeItem('token'); window.location.href = '/'; }}><LogOut size={16} /> Terminate Session</button>
                </div>
            </div>

            <div className="admin-tabs">
                <button className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}><Activity size={18} /> Overview</button>
                <button className={`admin-tab ${activeTab === 'students' ? 'active' : ''}`} onClick={() => setActiveTab('students')}><Users size={18} /> Students</button>
                <button className={`admin-tab ${activeTab === 'recruiters' ? 'active' : ''}`} onClick={() => setActiveTab('recruiters')}><Zap size={18} /> Recruiters</button>
                <button className={`admin-tab ${activeTab === 'ai' ? 'active' : ''}`} onClick={() => setActiveTab('ai')}><Cpu size={18} /> AI Training</button>
                <button className={`admin-tab ${activeTab === 'system' ? 'active' : ''}`} onClick={() => setActiveTab('system')}><Server size={18} /> System</button>
            </div>

            {activeTab === 'overview' && stats && (
                <div>
                    <div className="stats-grid">
                        <StatCard label="Total Specimens" value={stats.userCount} icon={<Users />} />
                        <StatCard label="Corporate Entities" value={stats.recruiterCount} icon={<Zap />} />
                        <StatCard label="Active Nodes (Jobs)" value={stats.jobCount} icon={<Database />} />
                        <StatCard label="Level 1 Operators" value={stats.adminCount} icon={<Shield />} />
                    </div>
                    <div className="stats-grid">
                        <StatCard label="System Health" value={stats.systemHealth} icon={<Activity />} />
                        <StatCard label="Uptime" value={stats.uptime} icon={<Radio />} />
                        <StatCard label="Active AI Agents" value={stats.activeAgents} icon={<Cpu />} />
                    </div>
                </div>
            )}

            {activeTab === 'students' && (
                <div className="data-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Specimen Name</th>
                                <th>Email Address</th>
                                <th>Rank</th>
                                <th>Trust Score</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(s => (
                                <tr key={s._id}>
                                    <td>{s.name}</td>
                                    <td style={{ opacity: 0.6 }}>{s.email}</td>
                                    <td><span className={`ranking-badge ${s.ranking > 70 ? 'ranking-high' : 'ranking-mid'}`}>{s.ranking}%</span></td>
                                    <td>{s.trustScore}/100</td>
                                    <td><button className="glow-btn" style={{ padding: '5px', borderColor: '#ff4444' }} onClick={() => deleteUser(s._id)}><Trash2 size={14} /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'recruiters' && (
                <div className="data-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Organization</th>
                                <th>Representative</th>
                                <th>Market Index</th>
                                <th>Integrity</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recruiters.map(r => (
                                <tr key={r._id}>
                                    <td>{r.companyName || 'N/A'}</td>
                                    <td>{r.name}</td>
                                    <td><span className={`ranking-badge ${r.ranking > 50 ? 'ranking-high' : 'ranking-mid'}`}>{r.ranking} pts</span></td>
                                    <td>{r.integrity}%</td>
                                    <td><button className="glow-btn" style={{ padding: '5px', borderColor: '#ff4444' }} onClick={() => deleteUser(r._id)}><Trash2 size={14} /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'ai' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                    <div className="training-agent-card">
                        <h3><Cpu size={20} color="var(--admin-primary)" /> Roadmap Oracle</h3>
                        <p style={{ fontSize: '0.85rem', opacity: 0.7, margin: '10px 0' }}>Neural network responsible for generating career paths and learning trajectories.</p>
                        <div className="progress-bar-bg">
                            <div className="progress-bar-fill" style={{ width: trainStatus['Roadmap']?.includes('100') ? '100%' : trainStatus['Roadmap'] ? '40%' : '0%' }}></div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem' }}>{trainStatus['Roadmap'] || 'Standby'}</span>
                            <button className="glow-btn" onClick={() => triggerTraining('Roadmap')}>Optimize</button>
                        </div>
                    </div>

                    <div className="training-agent-card">
                        <h3><Cpu size={20} color="var(--admin-secondary)" /> Interview Phantom</h3>
                        <p style={{ fontSize: '0.85rem', opacity: 0.7, margin: '10px 0' }}>Voice-enabled interviewer agent specializing in behavioral and technical analysis.</p>
                        <div className="progress-bar-bg">
                            <div className="progress-bar-fill" style={{ width: trainStatus['Interview']?.includes('100') ? '100%' : trainStatus['Interview'] ? '40%' : '0%' }}></div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem' }}>{trainStatus['Interview'] || 'Standby'}</span>
                            <button className="glow-btn" onClick={() => triggerTraining('Interview')}>Optimize</button>
                        </div>
                    </div>

                    <div className="training-agent-card">
                        <Database size={24} color="var(--admin-accent)" />
                        <h3>Feed Data Core</h3>
                        <p style={{ fontSize: '0.85rem', opacity: 0.7, margin: '10px 0' }}>Select dataset for injection into the main neural hive.</p>
                        <div className="progress-bar-bg" style={{ display: trainStatus['Core Dataset Injection'] ? 'block' : 'none' }}>
                            <div className="progress-bar-fill" style={{ width: trainStatus['Core Dataset Injection']?.includes('100') ? '100%' : trainStatus['Core Dataset Injection'] ? '40%' : '0%', background: 'var(--admin-accent)', boxShadow: '0 0 10px var(--admin-accent)' }}></div>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--admin-accent)', marginBottom: '10px' }}>
                           {trainStatus['Core Dataset Injection'] || ''}
                        </p>
                        <input type="file" style={{ display: 'none' }} id="feed-data" accept=".json" onChange={handleFileUpload} />
                        <button className="glow-btn" style={{ width: '100%', borderColor: 'var(--admin-accent)', color: 'var(--admin-accent)' }} onClick={() => document.getElementById('feed-data').click()}>Upload Dataset (.json)</button>
                    </div>
                </div>
            )}

            {activeTab === 'system' && (
                <div style={{ maxWidth: '600px' }}>
                    <div className="training-agent-card">
                        <h3><Shield size={20} /> Force Maintenance Mode</h3>
                        <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '15px' }}>Sever all external connections and place the system in a locked state for kernel updates.</p>
                        <button className="glow-btn" style={{ width: '100%', borderColor: '#ff4444', color: '#ff4444' }} onClick={triggerMaintenance}>Initiate Kill Switch</button>
                    </div>
                    <div className="training-agent-card">
                        <h3><Key size={20} /> Auth Override</h3>
                        <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '15px' }}>Enter a specimen ID to bypass authentication and view the ecosystem through their lens.</p>
                        <form style={{ display: 'flex', gap: '10px' }} onSubmit={handleAuthOverride}>
                            <input id="override-id" className="input-futuristic" placeholder="Node ID..." style={{ marginBottom: 0 }} />
                            <button type="submit" className="glow-btn">Engage</button>
                        </form>
                    </div>
                </div>
            )}

            {showAdminModal && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <h2 style={{ marginBottom: '20px' }}>DEPLOY NEW OPERATOR</h2>
                        <form onSubmit={handleAddAdmin}>
                            <input className="input-futuristic" placeholder="Full Name" value={newAdmin.name} onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })} required />
                            <input className="input-futuristic" placeholder="Email Address" type="email" value={newAdmin.email} onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })} required />
                            <input className="input-futuristic" placeholder="Access Cipher" type="password" value={newAdmin.password} onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })} required />
                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button type="button" className="glow-btn" style={{ flex: 1, borderColor: '#666', color: '#666' }} onClick={() => setShowAdminModal(false)}>Abort</button>
                                <button type="submit" className="glow-btn" style={{ flex: 1 }}>Confirm Deployment</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AnimatedPage>
    );
}

const StatCard = ({ label, value, icon }) => (
    <div className="stat-card">
        <div style={{ color: 'var(--admin-primary)', marginBottom: '10px' }}>{icon}</div>
        <span className="stat-value">{value}</span>
        <span className="stat-label">{label}</span>
    </div>
);
