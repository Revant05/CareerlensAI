import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mic, MicOff, Phone, FileText, Code, Database, Server, Gamepad2, User, TrendingUp, Clock, MessageSquare, CheckCircle, Layout, Shield, Cpu, Globe, Smartphone, Lock, Palette, Zap, Users, BarChart, Briefcase, Radio, ShieldAlert } from 'lucide-react';
import api, { AI_ENGINE_URL } from '../api/api';
import { useAuth } from '../context/AuthContext';
import AnimatedPage from '../components/AnimatedPage';
import GlitchText from '../components/GlitchText';
import toast from 'react-hot-toast';
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
    const { setUser } = useAuth();
    const [selectedRole, setSelectedRole] = useState(null);
    const [interviewActive, setInterviewActive] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [showTranscript, setShowTranscript] = useState(false);
    const [aiStatus, setAiStatus] = useState('Ready to start');
    const [liveMetrics, setLiveMetrics] = useState({
        fillerWords: 0,
        speakingPace: 0,
        confidence: 85,
        eyeContact: 90
    });
    const [isAiThinking, setIsAiThinking] = useState(false);
    const recognitionRef = useRef(null);
    const [speakingRate, setSpeakingRate] = useState(1.05);
    const [transcript, setTranscript] = useState([
        { role: 'assistant', content: 'Hello! I am your AI interviewer. Shall we begin?' }
    ]);
    const [interviewResults, setInterviewResults] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const location = useLocation();
    // Live metrics tracking refs
    const speechStartRef = useRef(null);
    const totalWordsRef = useRef(0);
    const totalSpeakingSecRef = useRef(0);
    const fillerCountRef = useRef(0);
    const FILLER_WORDS = ['um', 'uh', 'like', 'you know', 'basically', 'literally', 'actually', 'sort of', 'kind of', 'i mean', 'right', 'so yeah'];

    // Load voices and handle async nature of getVoices()
    useEffect(() => {
        const loadVoices = () => {
            window.speechSynthesis.getVoices();
        };

        if ('speechSynthesis' in window) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
            loadVoices();
        }

        return () => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.onvoiceschanged = null;
            }
        };
    }, []);

    // Handle pre-selection from Skill Evaluation
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const roleFromUrl = queryParams.get('role');
        if (roleFromUrl) {
            const role = roles.find(r => r.id === roleFromUrl) || (roleFromUrl === featuredInterview.id ? featuredInterview : null);
            if (role) {
                handleRoleSelect(role);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    // Initialize Web Speech API
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition && !recognitionRef.current) {
            const recog = new SpeechRecognition();
            recog.continuous = true;
            recog.interimResults = true;
            recog.lang = 'en-US';

            recog.onresult = (event) => {
                let fullStr = '';
                for (let i = 0; i < event.results.length; ++i) {
                    fullStr += event.results[i][0].transcript;
                }

                if (fullStr) {
                    // Real-time filler word detection
                    const lower = fullStr.toLowerCase();
                    let fillers = 0;
                    FILLER_WORDS.forEach(fw => {
                        const regex = new RegExp(`\\b${fw}\\b`, 'g');
                        fillers += (lower.match(regex) || []).length;
                    });
                    fillerCountRef.current = fillers;

                    // WPM tracking
                    const wordCount = fullStr.trim().split(/\s+/).filter(Boolean).length;
                    totalWordsRef.current = wordCount;
                    if (speechStartRef.current) {
                        const elapsed = (Date.now() - speechStartRef.current) / 1000;
                        if (elapsed > 0) totalSpeakingSecRef.current = elapsed;
                    }

                    // Dynamic confidence score
                    const wpm = totalSpeakingSecRef.current > 0
                        ? Math.round((totalWordsRef.current / totalSpeakingSecRef.current) * 60)
                        : 0;
                    const fillerPenalty = Math.min(30, fillerCountRef.current * 5);
                    const lengthBonus = Math.min(15, Math.floor(wordCount / 5));
                    const newConfidence = Math.max(20, Math.min(99, 70 - fillerPenalty + lengthBonus));

                    const now = Date.now();
                    const isFinal = event.results[event.results.length - 1].isFinal;
                    
                    if (!window.lastRecogUpdate || now - window.lastRecogUpdate > 250 || isFinal) {
                        window.lastRecogUpdate = now;
                        setLiveMetrics(prev => ({
                            ...prev,
                            fillerWords: fillerCountRef.current,
                            speakingPace: wpm,
                            confidence: newConfidence
                        }));

                        setTranscript(prev => {
                            const newArr = [...prev];
                            const lastMsg = newArr[newArr.length - 1];
                            if (lastMsg?.role === 'user') {
                                newArr[newArr.length - 1] = { role: 'user', content: fullStr };
                                return newArr;
                            } else {
                                speechStartRef.current = now;
                                return [...prev, { role: 'user', content: fullStr }];
                            }
                        });
                    }
                }
            };

            recog.onend = () => {
                // Auto-restart if interview is active and not speaking/thinking
                // Fixed: Only restart if we still want to be listening
                if (window.isInterviewRunning && !window.isAiActive && !window.isMutedState) {
                    try {
                        recog.start();
                    } catch (e) {
                        if (e.name !== 'InvalidStateError') console.error("Recog restart failed", e);
                    }
                }
            };

            recog.onerror = (event) => {
                if (event.error === 'aborted') return; // Ignore manual aborts
                console.error('Speech recognition error:', event.error);
                if (event.error === 'no-speech') {
                    setAiStatus('Waiting for your response...');
                } else if (event.error === 'network') {
                    setAiStatus('Network error. Retrying...');
                    toast.error('Speech recognition network error. Please check your connection.');
                } else {
                    setAiStatus('Mic issue: ' + event.error);
                }
            };

            recognitionRef.current = recog;
        } else if (!SpeechRecognition) {
            toast.error('Speech recognition not supported in this browser.');
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.onend = null;
                recognitionRef.current.onresult = null;
                recognitionRef.current.onerror = null;
                try { recognitionRef.current.stop(); } catch (e) { console.error(e); }
                recognitionRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Sync state to window for the onend callback (avoids closure staleness)
    useEffect(() => {
        window.isInterviewRunning = interviewActive;
        window.isAiActive = isSpeaking || isAiThinking;
        window.isMutedState = isMuted;
    }, [interviewActive, isSpeaking, isAiThinking, isMuted]);

    // Natural text preprocessing — adds rhythm and pauses like a real speaker
    const humanizeText = (text) => {
        return text
            // Slow down after colons (listing items)
            .replace(/:\s/g, '... ')
            // Pause on dashes used as clauses
            .replace(/\s—\s/g, ', ')
            .replace(/\s-\s/g, ', ')
            // Slight pause after "so", "now", "well" at start of sentences
            .replace(/^(So|Now|Well|Right|Okay|Alright),?\s/i, '$1... ')
            // Don't rush through numbers
            .replace(/(\d+)\./g, '$1 point ')
            // Trim any double spaces
            .replace(/\s{2,}/g, ' ')
            .trim();
    };

    // AI Speaking Function — Indian accent, human pace
    const speak = (text) => {
        if (!('speechSynthesis' in window)) {
            toast.error('Speech synthesis not supported');
            return;
        }

        window.speechSynthesis.cancel();

        setTimeout(() => {
            const processedText = humanizeText(text);
            const utterance = new SpeechSynthesisUtterance(processedText);

            const currentVoices = window.speechSynthesis.getVoices();

            // Voice priority: High-quality Neural Indian → Local Indian → Google Indian → Any Natural English → Any English
            const preferredVoice =
                currentVoices.find(v => v.name.includes('Online (Natural) - English (India)')) || // Edge Neural Indian (extremely high quality)
                currentVoices.find(v => v.name.includes('Neerja') && v.name.includes('Natural')) || // Edge Neural Neerja
                currentVoices.find(v => v.name.includes('Prabhat') && v.name.includes('Natural')) || // Edge Neural Prabhat
                currentVoices.find(v => v.name === 'Microsoft Ravi - English (India)') ||       // Windows local Indian male
                currentVoices.find(v => v.name === 'Microsoft Heera - English (India)') ||      // Windows local Indian female
                currentVoices.find(v => v.name.toLowerCase().includes('ravi')) ||               // Any Ravi voice
                currentVoices.find(v => v.name.toLowerCase().includes('heera')) ||              // Any Heera voice
                currentVoices.find(v => (v.lang === 'en-IN' || v.lang === 'en_IN') && v.name.includes('Google')) || // Chrome Google en-IN
                currentVoices.find(v => (v.lang === 'en-IN' || v.lang === 'en_IN') && v.name.includes('Natural')) || // Any other en-IN Natural
                currentVoices.find(v => v.lang === 'en-IN' || v.lang === 'en_IN') ||           // Any en-IN
                currentVoices.find(v => v.name.toLowerCase().includes('india')) ||              // Name has India
                currentVoices.find(v => v.name.includes('Natural') && v.lang.startsWith('en')) || // Any English Natural voice
                currentVoices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) || // Google en
                currentVoices.find(v => v.lang.startsWith('en-')) ||
                currentVoices[0];

            if (preferredVoice) utterance.voice = preferredVoice;

            // Human-like tuning:
            // Using 1.0 pitch for neural voices sounds more authentic, and speakingRate for pace.
            utterance.pitch = 1.0;
            utterance.rate = speakingRate;
            utterance.volume = 1.0;

            utterance.onstart = () => {
                setIsSpeaking(true);
                setAiStatus('Interviewer is speaking...');
                if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch (e) { console.error(e); } }
            };
            utterance.onend = () => {
                setIsSpeaking(false);
                setAiStatus('Listening...');
                if (recognitionRef.current && !window.isMutedState) {
                    try { recognitionRef.current.start(); } catch (e) {
                        if (e.name !== 'InvalidStateError') console.error("Start failed on utterance end", e);
                    }
                }
            };
            utterance.onerror = (err) => {
                console.error("SpeechSynthesisUtterance error", err);
                setIsSpeaking(false);
            };

            window.speechSynthesis.speak(utterance);
        }, 100);
    };

    // AI Speaking Function via Backend MP3 Base64 Stream (Extremely realistic Edge Neural voices)
    const playBackendAudio = (base64Audio, fallbackText) => {
        try {
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            
            const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
            audio.playbackRate = speakingRate;
            window.currentAiAudio = audio; // Keep track for termination
            
            audio.onplay = () => {
                setIsSpeaking(true);
                setAiStatus('Interviewer is speaking...');
                if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch (e) {} }
            };
            
            audio.onended = () => {
                setIsSpeaking(false);
                setAiStatus('Listening...');
                if (recognitionRef.current && !window.isMutedState) {
                    try { recognitionRef.current.start(); } catch (e) {}
                }
            };
            
            audio.onerror = () => {
                console.error("Audio playback error, taking fallback");
                speak(fallbackText);
            };
            
            audio.play().catch(e => {
                console.error("Autoplay blocked:", e);
                speak(fallbackText);
            });
        } catch (err) {
            console.error("Backend audio failed:", err);
            speak(fallbackText);
        }
    };

    // AI Question Logic
    const fetchNextQuestion = async (currentTranscript, domainOverride = null) => {
        const controller = new AbortController();
        const fetchTimeout = setTimeout(() => controller.abort(), 8000); // Hard 8s timeout
        try {
            setIsAiThinking(true);
            setAiStatus('AI is thinking...');
            const domainToUse = domainOverride || selectedRole || 'general';

            const response = await axios.get(`${AI_ENGINE_URL}/next-question`, {
                params: {
                    domain: domainToUse,
                    history: currentTranscript.map(m => m.content).join('|||')
                },
                headers: { 'X-Internal-Secret': 'careerlens_default_67890' },
                signal: controller.signal
            });

            clearTimeout(fetchTimeout);
            const nextQ = response.data.question;
            setTranscript(prev => [...prev, { role: 'assistant', content: nextQ }]);
            
            // Prefer high-quality backend streaming if provided, else use browser TTS instantly
            if (response.data.audioBase64) {
                playBackendAudio(response.data.audioBase64, nextQ);
            } else {
                speak(nextQ);
            }
        } catch (err) {
            clearTimeout(fetchTimeout);
            if (err.name === 'CanceledError' || err.name === 'AbortError') {
                console.warn('AI question fetch timed out, using fallback');
            } else {
                console.error('AI thinking failed:', err);
            }
            const fallback = "Tell me more about your recent project achievements.";
            setTranscript(prev => [...prev, { role: 'assistant', content: fallback }]);
            speak(fallback);
        } finally {
            setIsAiThinking(false);
        }
    };

    // Watch transcript for user answers to trigger next question
    useEffect(() => {
        if (!interviewActive || isAiThinking || isSpeaking) return;

        const lastMessage = transcript[transcript.length - 1];
        // Snappier: If user just finished speaking and it's a real answer
        if (lastMessage?.role === 'user' && lastMessage.content.length > 2) {
            const timer = setTimeout(() => {
                if (recognitionRef.current) {
                    try { recognitionRef.current.stop(); } catch (e) { console.error(e); }
                }
                fetchNextQuestion(transcript);
            }, 800); // 0.8s wait is very fast, reducing analysis stall
            return () => clearTimeout(timer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transcript, interviewActive, isAiThinking, isSpeaking]);

    const handleRoleSelect = (role) => {
        setSelectedRole(role.id);
        setInterviewActive(true);
        setTranscript([]);
        setIsSpeaking(false);
        setAiStatus('Preparing your interview...');
        // Fetch first question immediately — no local greeting to avoid double-speaking
        fetchNextQuestion([], role.id);
    };

    const handleEndInterview = async () => {
        try {
            const role = roles.find(r => r.id === selectedRole) || (selectedRole === featuredInterview.id ? featuredInterview : null);

            const response = await api.post('/assessment/submit', {
                type: 'mock_interview',
                category: role?.id || 'general',
                score: liveMetrics.confidence,
                metrics: { ...liveMetrics, transcript }
            });

            if (response.data.tokenAwarded) {
                toast.success(`Congratulations! You earned the "${response.data.tokenTitle}" token!`, {
                    duration: 5000,
                    icon: '🎓'
                });
            }

            if (response.data.assessment?.aiInsights) {
                setInterviewResults(response.data.assessment.aiInsights);
                setShowResults(true);
            } else {
                toast.success('Interview session recorded successfully!');
            }

            // Refresh user context to show new tokens/assessments elsewhere
            try {
                const userRes = await api.get('/auth/me');
                if (setUser) setUser(userRes.data);
            } catch (e) { console.error(e); }

        } catch (err) {
            console.error('Failed to save interview:', err);
            toast.error('Failed to save interview results.');
        } finally {
            if (recognitionRef.current) {
                try { recognitionRef.current.stop(); } catch (e) { console.error(e); }
            }
            if (window.currentAiAudio) {
                window.currentAiAudio.pause();
                window.currentAiAudio.currentTime = 0;
            }
            window.speechSynthesis.cancel();
            setInterviewActive(false);
            setSelectedRole(null);
            setAiStatus('Ready to start');
        }
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
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: idx * 0.05 }}
                                            whileHover={{ scale: 1.02, y: -5 }}
                                            onClick={() => handleRoleSelect(role)}
                                        >
                                            <div className="role-card-content">
                                                <div className="role-icon" style={{ borderColor: role.color }}>
                                                    <Icon size={32} style={{ color: role.color }} />
                                                </div>
                                                <div className="role-info">
                                                    <h4>{role.title}</h4>
                                                    <p>{role.description}</p>
                                                </div>
                                            </div>
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
                    // Nexus Cinema Mode: Immersive Environment
                    <Motion.div
                        key="interview-active"
                        className="nexus-interview-room"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Background Neural Layers */}
                        <div className="nexus-neural-background">
                            <div className="neural-grid" />
                            <div className="neural-aura" />
                        </div>

                        {/* CENTER: Main AI Entity */}
                        <div className="nexus-ai-stage">
                            <div className={`nexus-ai-entity ${isSpeaking ? 'speaking' : ''}`}>
                                <div className="nexus-avatar-core">
                                    <User size={140} strokeWidth={1} />
                                </div>
                                <div className="nexus-resonance-rings">
                                    <div className="nexus-ring r1" />
                                    <div className="nexus-ring r2" />
                                    <div className="nexus-ring r3" />
                                </div>
                                <div className="nexus-consciousness-glow" />

                                <div className="nexus-ai-status">
                                    <div className={`nexus-status-dot ${isSpeaking ? 'speaking' : 'listening'}`} />
                                    <span className="nexus-status-text">{aiStatus.toUpperCase()}</span>
                                </div>
                            </div>

                            {/* Center HUD Viz */}
                            <div className="nexus-neural-viz">
                                {[...Array(20)].map((_, i) => (
                                    <Motion.div
                                        key={i}
                                        className="nexus-viz-bar"
                                        animate={{
                                            height: isSpeaking ? [20, 60, 30, 80, 20][i % 5] : 5
                                        }}
                                        transition={{ duration: 0.3, repeat: Infinity, delay: i * 0.05 }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* RIGHT HUD: Floating Transcript */}
                        <AnimatePresence>
                            {showTranscript && (
                                <Motion.div
                                    className="nexus-hud-transcript"
                                    initial={{ x: 300, opacity: 0, scale: 0.9 }}
                                    animate={{ x: 0, opacity: 1, scale: 1 }}
                                    exit={{ x: 300, opacity: 0, scale: 0.9 }}
                                    transition={{ type: 'spring', damping: 30 }}
                                >
                                    <div className="hud-header">
                                        <div className="hud-label">
                                            <MessageSquare size={16} /> DATA_TRANSCRIPT
                                        </div>
                                        <button className="hud-close" onClick={() => setShowTranscript(false)}>×</button>
                                    </div>
                                    <div className="hud-scroll-area">
                                        <div className="hud-log">
                                            {transcript.map((msg, idx) => (
                                                <div key={idx} className={`hud-entry ${msg.role}`}>
                                                    <span className="hud-sender">[{msg.role === 'assistant' ? 'AI_SYSTEM' : 'CANDIDATE'}]</span>
                                                    <p className="hud-text">{msg.content}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="hud-metrics">
                                        <div className="hud-metric">
                                            <span>NEURAL_CONFIDENCE</span>
                                            <div className="hud-bar"><div className="hud-fill" style={{ width: `${liveMetrics.confidence}%` }} /></div>
                                        </div>
                                        <div className="hud-metric">
                                            <span>SPEECH_PACE</span>
                                            <div className="hud-value">{Math.round(liveMetrics.speakingPace)} WPM</div>
                                        </div>
                                        <div className="hud-metric" style={{ marginTop: '15px' }}>
                                            <span>AI_VOICE_SPEED: {speakingRate.toFixed(2)}x</span>
                                            <input 
                                                type="range" 
                                                min="0.5" 
                                                max="2.0" 
                                                step="0.05" 
                                                value={speakingRate} 
                                                onChange={(e) => setSpeakingRate(parseFloat(e.target.value))} 
                                                style={{ width: '100%', accentColor: 'var(--matrix)', cursor: 'pointer', marginTop: '5px' }} 
                                            />
                                        </div>
                                    </div>
                                </Motion.div>
                            )}
                        </AnimatePresence>

                        {/* BOTTOM HUB: Orbital Controls */}
                        <div className="nexus-orbital-hub">
                            <div className="nexus-control-core">
                                <button className={`nexus-btn ${isMuted ? 'active-mute' : ''}`} onClick={() => setIsMuted(!isMuted)}>
                                    {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
                                </button>
                                <button className="nexus-btn restart" onClick={() => {
                                    if (recognitionRef.current) {
                                        try {
                                            recognitionRef.current.stop();
                                            setTimeout(() => recognitionRef.current.start(), 300);
                                            toast.success('Microphone restarted');
                                        } catch (e) {
                                            console.error(e);
                                            toast.error('Failed to restart microphone');
                                        }
                                    }
                                }} title="Restart Mic">
                                    <Zap size={22} />
                                </button>
                                <button className="nexus-btn terminate" onClick={handleEndInterview}>
                                    <div className="btn-inner">
                                        <Phone size={22} />
                                        <span>TERMINATE SESSION</span>
                                    </div>
                                </button>
                                <button className={`nexus-btn ${showTranscript ? 'active' : ''}`} onClick={() => setShowTranscript(!showTranscript)}>
                                    <FileText size={22} />
                                </button>
                            </div>
                        </div>

                        {/* Environment Overlays */}
                        <div className="nexus-scanlines" />
                        <div className="nexus-vignette" />
                    </Motion.div>
                )}

                {/* Performance Report Modal */}
                <AnimatePresence>
                    {showResults && interviewResults && (
                        <Motion.div
                            className="results-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <Motion.div
                                className="results-modal glass-panel"
                                initial={{ y: 50, scale: 0.9 }}
                                animate={{ y: 0, scale: 1 }}
                            >
                                <div className="results-header">
                                    <GlitchText text="Interview Performance Report" />
                                    <button className="close-btn" onClick={() => setShowResults(false)}>×</button>
                                </div>

                                <div className="results-grid">
                                    <div className={`result-stat-card ${interviewResults.technicalScore >= 85 ? 'success' : interviewResults.technicalScore < 60 ? 'danger' : 'warning'}`}>
                                        <div className="stat-label">TECHNICAL_DEPTH</div>
                                        <div className="stat-score">{interviewResults.technicalScore}%</div>
                                        <div className="stat-bar"><div className="fill" style={{ width: `${interviewResults.technicalScore}%` }}></div></div>
                                    </div>
                                    <div className="result-stat-card secondary">
                                        <div className="stat-label">SOFT_SKILLS</div>
                                        <div className="stat-score">{interviewResults.softSkillsScore}%</div>
                                        <div className="stat-bar"><div className="fill" style={{ width: `${interviewResults.softSkillsScore}%` }}></div></div>
                                    </div>
                                    <div className="result-stat-card info">
                                        <div className="stat-label">NEURAL_CONFIDENCE</div>
                                        <div className="stat-score">{liveMetrics.confidence}%</div>
                                        <div className="stat-bar"><div className="fill" style={{ width: `${liveMetrics.confidence}%` }}></div></div>
                                    </div>
                                    <div className="result-stat-card info">
                                        <div className="stat-label">SPEECH_PRECISION</div>
                                        <div className="stat-score">{Math.round(liveMetrics.speakingPace / 1.5)}%</div>
                                        <div className="stat-bar"><div className="fill" style={{ width: `${Math.min(100, liveMetrics.speakingPace / 1.5)}%` }}></div></div>
                                    </div>
                                </div>

                                <div className="swot-section">
                                    <div className="swot-block strength">
                                        <h4>🚀 Key Strengths</h4>
                                        <ul>{interviewResults.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
                                    </div>
                                    <div className="swot-block weakness">
                                        <h4>🎯 Areas to Improve</h4>
                                        <ul>{interviewResults.weaknesses.map((w, i) => <li key={i}>{w}</li>)}</ul>
                                    </div>
                                </div>

                                <div className="ai-feedback-section">
                                    <div className="feedback-main">
                                        <h4><Cpu size={18} /> NEURAL_FEEDBACK</h4>
                                        <p>{interviewResults.emotionalFeedback}</p>
                                    </div>

                                    <div className="critics-panel">
                                        <h4><ShieldAlert size={18} /> CRITICS & REMARKS</h4>
                                        <div className="critics-list">
                                            {interviewResults.weaknesses.length > 0 ? (
                                                interviewResults.weaknesses.map((w, i) => (
                                                    <div key={i} className="critic-item">
                                                        <span className="critic-bullet">▶</span>
                                                        <p>{w} - <em>Requires immediate attention.</em></p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="no-critics">No critical flaws detected. Performance within high-compliance parameters.</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="next-step-badge">
                                        <strong>OPTIMAL_NEXT_STEP:</strong> {interviewResults.nextRoadmapStep}
                                    </div>
                                </div>

                                <button
                                    className="master-btn"
                                    onClick={() => navigate('/dashboard')}
                                >
                                    Return to Dashboard
                                </button>
                            </Motion.div>
                        </Motion.div>
                    )}
                </AnimatePresence>
            </AnimatePresence>
        </AnimatedPage>
    );
}
