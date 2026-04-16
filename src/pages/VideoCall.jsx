import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import {
    Mic, MicOff, Video, VideoOff, Phone, PhoneOff,
    Maximize2, Minimize2, Users, Clock, Copy, CheckCircle,
    AlertCircle, Wifi, WifiOff, Loader2, ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './VideoCall.css';

const SOCKET_URL = 'http://localhost:5000';

const ICE_SERVERS = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
    ]
};

export default function VideoCall() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const isRecruiter = user?.role === 'recruiter';

    // Refs
    const socketRef = useRef(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const localStreamRef = useRef(null);
    const callDurationRef = useRef(null);

    // State
    const [callStatus, setCallStatus] = useState('connecting'); // connecting | waiting | in-call | ended | error
    const [micEnabled, setMicEnabled] = useState(true);
    const [cameraEnabled, setCameraEnabled] = useState(true);
    const [remoteMicEnabled, setRemoteMicEnabled] = useState(true);
    const [remoteCameraEnabled, setRemoteCameraEnabled] = useState(true);
    const [isPiP, setIsPiP] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [copied, setCopied] = useState(false);
    const [networkQuality, setNetworkQuality] = useState('good'); // good | poor | lost
    const [remoteUserName, setRemoteUserName] = useState('');
    const [showControls, setShowControls] = useState(true);
    const [modalType, setModalType] = useState(null); // 'end-confirm'

    const callLink = `${window.location.origin}/video-call/${roomId}`;

    // ─── Timer ────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (callStatus === 'in-call') {
            callDurationRef.current = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(callDurationRef.current);
    }, [callStatus]);

    const formatDuration = (secs) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    // ─── Setup Media + Socket + WebRTC ────────────────────────────────────────
    useEffect(() => {
        let mounted = true;

        const setup = async () => {
            try {
                // 1. Check for Secure Context (required for Camera/Mic)
                if (!window.isSecureContext) {
                    const msg = "Security Error: Camera/Mic access is blocked because this site is not running over HTTPS or localhost.";
                    toast.error(msg);
                    if (mounted) setCallStatus('error');
                    return;
                }

                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    const msg = "Your browser does not support media access or it is disabled.";
                    toast.error(msg);
                    if (mounted) setCallStatus('error');
                    return;
                }

                // 2. Get local media with robust detection
                let stream = null;
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter(d => d.kind === 'videoinput');
                const audioDevices = devices.filter(d => d.kind === 'audioinput');

                try {
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: videoDevices.length > 0 ? { facingMode: 'user' } : false,
                        audio: audioDevices.length > 0
                    });
                } catch (err) {
                    console.warn("First media attempt failed, trying fallback...", err);
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: videoDevices.length > 0,
                        audio: audioDevices.length > 0
                    });
                }
                
                localStreamRef.current = stream;
                setCameraEnabled(!!stream.getVideoTracks().length);
                setMicEnabled(!!stream.getAudioTracks().length);

                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                    localVideoRef.current.onloadedmetadata = () => {
                        localVideoRef.current.play().catch(e => console.error("Play error:", e));
                    };
                }

                // 3. Connect socket
                socketRef.current = io(SOCKET_URL, { 
                    transports: ['websocket'],
                    reconnectionAttempts: 5
                });

                socketRef.current.on('connect', () => {
                    console.log('Socket connected:', socketRef.current.id);
                    if (isRecruiter) {
                        socketRef.current.emit('create-room', { roomId, userName: user?.name });
                    } else {
                        socketRef.current.emit('join-room', { roomId, userName: user?.name });
                    }
                });

                socketRef.current.on('room-created', () => {
                    if (mounted) setCallStatus('waiting');
                });

                socketRef.current.on('room-joined', () => {
                    if (mounted) setCallStatus('waiting');
                });

                socketRef.current.on('user-joined', async ({ userName }) => {
                    if (!mounted) return;
                    setRemoteUserName(userName);
                    toast.success(`${userName} joined the call!`);
                    if (isRecruiter) {
                        await createAndSendOffer();
                    }
                });

                socketRef.current.on('offer', async ({ offer }) => {
                    if (!mounted) return;
                    await handleOffer(offer);
                });

                socketRef.current.on('answer', async ({ answer }) => {
                    if (!mounted) return;
                    if (peerConnectionRef.current) {
                        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
                    }
                });

                socketRef.current.on('ice-candidate', async ({ candidate }) => {
                    if (!mounted) return;
                    try {
                        if (peerConnectionRef.current && candidate) {
                            await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                        }
                    } catch (e) { /* ignore */ }
                });

                socketRef.current.on('peer-media-toggle', ({ type, enabled }) => {
                    if (type === 'audio') setRemoteMicEnabled(enabled);
                    if (type === 'video') setRemoteCameraEnabled(enabled);
                });

                socketRef.current.on('call-ended', () => {
                    if (mounted) {
                        setCallStatus('ended');
                        toast('The other party left the call.', { icon: '📴' });
                        cleanup();
                    }
                });

                socketRef.current.on('error', ({ msg }) => {
                    toast.error(msg);
                    if (mounted) setCallStatus('error');
                });

            } catch (err) {
                console.error('Setup error:', err);
                toast.error('Could not access camera/microphone. Please grant permissions.');
                if (mounted) setCallStatus('error');
            }
        };

        setup();

        return () => {
            mounted = false;
            cleanup();
        };
    }, [roomId]);

    const createPeerConnection = useCallback(() => {
        const pc = new RTCPeerConnection(ICE_SERVERS);

        // Add local tracks
        localStreamRef.current?.getTracks().forEach(track => {
            pc.addTrack(track, localStreamRef.current);
        });

        // Receive remote tracks
        pc.ontrack = (event) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
                setCallStatus('in-call');
            }
        };

        // Send ICE candidates
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socketRef.current?.emit('ice-candidate', { roomId, candidate: event.candidate });
            }
        };

        pc.onconnectionstatechange = () => {
            const state = pc.connectionState;
            if (state === 'connected') {
                setCallStatus('in-call');
                setNetworkQuality('good');
            } else if (state === 'disconnected') {
                setNetworkQuality('poor');
            } else if (state === 'failed') {
                setNetworkQuality('lost');
            }
        };

        peerConnectionRef.current = pc;
        return pc;
    }, [roomId]);

    const createAndSendOffer = useCallback(async () => {
        const pc = createPeerConnection();
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socketRef.current?.emit('offer', { roomId, offer });
    }, [createPeerConnection, roomId]);

    const handleOffer = useCallback(async (offer) => {
        const pc = createPeerConnection();
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socketRef.current?.emit('answer', { roomId, answer });
        setCallStatus('in-call');
    }, [createPeerConnection, roomId]);

    const cleanup = () => {
        clearInterval(callDurationRef.current);
        localStreamRef.current?.getTracks().forEach(t => t.stop());
        peerConnectionRef.current?.close();
        socketRef.current?.disconnect();
    };

    // ─── Controls ─────────────────────────────────────────────────────────────
    const toggleMic = () => {
        const track = localStreamRef.current?.getAudioTracks()[0];
        if (track) {
            track.enabled = !track.enabled;
            setMicEnabled(track.enabled);
            socketRef.current?.emit('media-toggle', { roomId, type: 'audio', enabled: track.enabled });
        }
    };

    const toggleCamera = () => {
        const track = localStreamRef.current?.getVideoTracks()[0];
        if (track) {
            track.enabled = !track.enabled;
            setCameraEnabled(track.enabled);
            socketRef.current?.emit('media-toggle', { roomId, type: 'video', enabled: track.enabled });
        }
    };

    const endCall = () => {
        socketRef.current?.emit('end-call', { roomId });
        setCallStatus('ended');
        cleanup();
    };

    const copyLink = () => {
        navigator.clipboard.writeText(callLink);
        setCopied(true);
        toast.success('Interview link copied!');
        setTimeout(() => setCopied(false), 2000);
    };

    // ─── Auto-hide controls ───────────────────────────────────────────────────
    useEffect(() => {
        let timer;
        const show = () => {
            setShowControls(true);
            clearTimeout(timer);
            timer = setTimeout(() => {
                if (callStatus === 'in-call') setShowControls(false);
            }, 4000);
        };
        window.addEventListener('mousemove', show);
        return () => { window.removeEventListener('mousemove', show); clearTimeout(timer); };
    }, [callStatus]);

    // ─── Render: ended / error ────────────────────────────────────────────────
    if (callStatus === 'ended' || callStatus === 'error') {
        return (
            <div className="vc-ended-screen">
                <Motion.div
                    className="vc-ended-card glass-panel"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                >
                    <div className={`vc-ended-icon ${callStatus === 'error' ? 'error' : ''}`}>
                        {callStatus === 'error' ? <AlertCircle size={56} /> : <PhoneOff size={56} />}
                    </div>
                    <h2>{callStatus === 'error' ? 'Connection Failed' : 'Call Ended'}</h2>
                    {callStatus === 'ended' && (
                        <p className="vc-ended-duration">
                            <Clock size={16} /> Duration: {formatDuration(callDuration)}
                        </p>
                    )}
                    <p className="vc-ended-sub">
                        {callStatus === 'error'
                            ? 'Please check your camera/mic permissions and try again.'
                            : 'The interview session has concluded.'}
                    </p>
                    <div className="vc-ended-actions">
                        <button
                            className="neon-btn"
                            onClick={() => navigate(isRecruiter ? '/recruiter-jobs' : '/jobs')}
                        >
                            Back to {isRecruiter ? 'Jobs' : 'Job Board'}
                        </button>
                        {callStatus === 'error' && (
                            <button className="outline-btn" onClick={() => window.location.reload()}>
                                Retry
                            </button>
                        )}
                    </div>
                </Motion.div>
            </div>
        );
    }

    return (
        <div className="vc-room">
            {/* ── Header ── */}
            <AnimatePresence>
                {(showControls || callStatus !== 'in-call') && (
                    <Motion.header
                        className="vc-header glass-panel"
                        initial={{ y: -60, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -60, opacity: 0 }}
                    >
                        <div className="vc-header-left">
                            <div className="vc-logo-badge">
                                <span className="vc-logo-dot" />
                                CareerLens AI
                            </div>
                            {callStatus === 'in-call' && (
                                <div className="vc-timer">
                                    <Clock size={14} />
                                    {formatDuration(callDuration)}
                                </div>
                            )}
                        </div>
                        <div className="vc-header-right">
                            <div className={`vc-network-badge ${networkQuality}`}>
                                {networkQuality === 'good' ? <Wifi size={14} /> : <WifiOff size={14} />}
                                {networkQuality === 'good' ? 'Connected' : networkQuality === 'poor' ? 'Unstable' : 'Lost'}
                            </div>
                            <div className="vc-room-id">
                                Room: {roomId?.slice(0, 8)}...
                            </div>
                        </div>
                    </Motion.header>
                )}
            </AnimatePresence>

            {/* ── Video Grid ── */}
            <div className={`vc-video-grid ${callStatus === 'in-call' ? 'active' : ''}`}>
                {/* Remote Video (main) */}
                <div className="vc-remote-wrapper">
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="vc-remote-video"
                    />
                    {callStatus !== 'in-call' && (
                        <div className="vc-waiting-overlay">
                            {callStatus === 'connecting' ? (
                                <>
                                    <Loader2 size={48} className="vc-spin" />
                                    <p>Connecting to interview room...</p>
                                </>
                            ) : (
                                <>
                                    <div className="vc-waiting-avatar">
                                        <Users size={48} />
                                    </div>
                                    <h3 className="vc-waiting-title">
                                        {isRecruiter ? 'Waiting for candidate...' : 'Waiting for recruiter...'}
                                    </h3>
                                    <p className="vc-waiting-sub">
                                        Share this link with {isRecruiter ? 'the candidate' : 'your recruiter'}
                                    </p>
                                    {isRecruiter && (
                                        <button className="vc-copy-btn" onClick={copyLink}>
                                            {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                                            {copied ? 'Copied!' : 'Copy Interview Link'}
                                        </button>
                                    )}
                                    <div className="vc-link-box">
                                        <span>{callLink}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                    {callStatus === 'in-call' && remoteUserName && (
                        <div className="vc-remote-name-tag">
                            {remoteUserName}
                            {!remoteMicEnabled && <MicOff size={14} color="#ef4444" />}
                            {!remoteCameraEnabled && <VideoOff size={14} color="#ef4444" />}
                        </div>
                    )}
                </div>

                {/* Local Video (PiP) */}
                <div className={`vc-local-wrapper ${isPiP ? 'pip-mode' : ''}`}>
                    <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="vc-local-video"
                    />
                    {!cameraEnabled && (
                        <div className="vc-camera-off-overlay">
                            <VideoOff size={32} />
                        </div>
                    )}
                    <div className="vc-local-name-tag">
                        You ({user?.name})
                        {!micEnabled && <MicOff size={12} color="#ef4444" />}
                    </div>
                    <button className="vc-pip-toggle" onClick={() => setIsPiP(!isPiP)}>
                        {isPiP ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
                    </button>
                </div>
            </div>

            {/* ── Controls Bar ── */}
            <AnimatePresence>
                {(showControls || callStatus !== 'in-call') && (
                    <Motion.div
                        className="vc-controls glass-panel"
                        initial={{ y: 80, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 80, opacity: 0 }}
                    >
                        {/* Mic */}
                        <button
                            className={`vc-ctrl-btn ${!micEnabled ? 'active-off' : ''}`}
                            onClick={toggleMic}
                            title={micEnabled ? 'Mute mic' : 'Unmute mic'}
                        >
                            {micEnabled ? <Mic size={22} /> : <MicOff size={22} />}
                            <span>{micEnabled ? 'Mute' : 'Unmute'}</span>
                        </button>

                        {/* Camera */}
                        <button
                            className={`vc-ctrl-btn ${!cameraEnabled ? 'active-off' : ''}`}
                            onClick={toggleCamera}
                            title={cameraEnabled ? 'Turn off camera' : 'Turn on camera'}
                        >
                            {cameraEnabled ? <Video size={22} /> : <VideoOff size={22} />}
                            <span>{cameraEnabled ? 'Camera' : 'Cam Off'}</span>
                        </button>

                        {/* End Call */}
                        <button className="vc-ctrl-btn end-call-btn" onClick={() => setModalType('end-confirm')}>
                            <PhoneOff size={22} />
                            <span>End Call</span>
                        </button>

                        {/* Copy Link (recruiter in-call) */}
                        {isRecruiter && callStatus === 'in-call' && (
                            <button className="vc-ctrl-btn" onClick={copyLink}>
                                {copied ? <CheckCircle size={22} /> : <Copy size={22} />}
                                <span>Copy Link</span>
                            </button>
                        )}
                    </Motion.div>
                )}
            </AnimatePresence>

            {/* ── End Call Confirmation Modal ── */}
            <AnimatePresence>
                {modalType === 'end-confirm' && (
                    <Motion.div
                        className="vc-modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setModalType(null)}
                    >
                        <Motion.div
                            className="vc-modal glass-panel"
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.85, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <PhoneOff size={40} color="#ef4444" />
                            <h3>End Interview?</h3>
                            <p>This will disconnect both parties from the session.</p>
                            <div className="vc-modal-actions">
                                <button className="outline-btn" onClick={() => setModalType(null)}>
                                    Continue Call
                                </button>
                                <button className="vc-end-confirm-btn" onClick={endCall}>
                                    Yes, End Call
                                </button>
                            </div>
                        </Motion.div>
                    </Motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
