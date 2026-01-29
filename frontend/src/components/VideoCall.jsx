import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useChat } from '../context/ChatContext';
import GlassCard from './GlassCard';
import toast from 'react-hot-toast';
import { BACKEND_TYPE } from '../config';

const VideoCall = ({ otherUserId, isInitiator, onClose }) => {
    const { connection } = useChat();
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('Initializing...');

    useEffect(() => {
        if (!connection) {
            setConnectionStatus('Connecting to server...');
        } else {
            setConnectionStatus('Initializing media...');
        }
    }, [connection]);

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnection = useRef(null);
    const iceCandidatesQueue = useRef([]);

    const rtcConfig = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478' }
        ]
    };

    useEffect(() => {
        let subscription = null;

        const startCall = async () => {
            try {
                // Check if the context is secure (HTTPS or localhost)
                if (!window.isSecureContext) {
                    throw new Error("Camera access requires a secure connection (HTTPS) or localhost.");
                }

                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setLocalStream(stream);
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                peerConnection.current = new RTCPeerConnection(rtcConfig);

                stream.getTracks().forEach(track => {
                    peerConnection.current.addTrack(track, stream);
                });

                peerConnection.current.ontrack = (event) => {
                    setRemoteStream(event.streams[0]);
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = event.streams[0];
                    }
                };

                peerConnection.current.onicecandidate = (event) => {
                    if (event.candidate) {
                        sendSignal({ type: 'candidate', candidate: event.candidate });
                    }
                };

                peerConnection.current.onconnectionstatechange = () => {
                    setConnectionStatus(peerConnection.current.connectionState);
                    if (peerConnection.current.connectionState === 'disconnected') {
                        toast.error("Peer disconnected");
                        onClose();
                    }
                };

                // Send ready signal to announce presence
                sendSignal({ type: 'ready' });

            } catch (err) {
                console.error("Error starting call:", err);
                toast.error(err.message || "Could not access camera/microphone");
                onClose();
            }
        };

        if (connection) {
            startCall();
            
            if (BACKEND_TYPE === 'DOTNET') {
                connection.on('ReceiveSignal', handleSignal);
            } else {
                subscription = connection.subscribe('/user/queue/video/signal', (msg) => {
                    const payload = JSON.parse(msg.body);
                    handleSignal(payload.senderId, payload.signalData);
                });
            }
        }

        return () => {
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
            if (peerConnection.current) {
                peerConnection.current.close();
            }
            if (BACKEND_TYPE === 'DOTNET') {
                if (connection) connection.off('ReceiveSignal', handleSignal);
            } else {
                if (subscription) subscription.unsubscribe();
            }
        };
    }, [connection, isInitiator, otherUserId]);

    const sendSignal = async (signal) => {
        if (connection) {
            if (BACKEND_TYPE === 'DOTNET') {
                await connection.invoke("SendSignal", otherUserId.toString(), JSON.stringify(signal));
            } else {
                connection.publish({
                    destination: '/app/video/signal',
                    body: JSON.stringify({
                        targetUserId: otherUserId.toString(),
                        signalData: JSON.stringify(signal),
                        type: signal.type
                    })
                });
            }
        }
    };

    const handleSignal = async (senderId, signalData) => {
        if (senderId.toString() !== otherUserId.toString()) return;

        const signal = JSON.parse(signalData);
        const pc = peerConnection.current;

        if (!pc) return;

        try {
            if (signal.type === 'ready') {
                // If we are initiator and haven't started yet, start now
                if (isInitiator && pc.signalingState === 'stable') {
                    console.log("Received ready, creating offer...");
                    const offer = await pc.createOffer();
                    await pc.setLocalDescription(offer);
                    sendSignal({ type: 'offer', sdp: offer });
                } else if (!isInitiator) {
                     // If we are not initiator, we just acknowledge by sending ready back if we haven't received offer
                     // But to avoid loops, maybe we don't need to do anything if we already sent ready on mount.
                     // However, if the initiator joined AFTER us, they missed our first ready.
                     // So we should resend ready? 
                     // Let's just rely on the fact that the Initiator sends ready when THEY join.
                     // If Initiator joins second: Initiator sends Ready. We receive Ready. We do nothing?
                     // Wait, if We (Learner) receive Ready, it means Initiator is here.
                     // Initiator (Tutor) receives Ready (ours, if we resent, or if we joined second).
                     
                     // Scenario 1: Tutor joins first. Sends Ready. Learner not there.
                     // Learner joins. Sends Ready. Tutor receives Ready. Tutor creates Offer. Success.
                     
                     // Scenario 2: Learner joins first. Sends Ready. Tutor not there.
                     // Tutor joins. Sends Ready. Learner receives Ready. Learner does nothing?
                     // Tutor needs to receive Ready to start.
                     // So Learner MUST respond to Ready with Ready?
                     // If Learner responds with Ready, Tutor receives Ready -> Creates Offer. Success.
                     // But if Tutor sends Ready, Learner responds Ready, Tutor receives Ready -> Creates Offer.
                     // Does Tutor respond to Learner's Ready?
                     // If Tutor responds, we get a loop.
                     
                     // Fix: Only respond to 'ready' if I am NOT the initiator.
                     // If I am Initiator, I don't respond to ready, I act on it (create offer).
                     
                     sendSignal({ type: 'ready' });
                }
            } else if (signal.type === 'offer') {
                await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
                
                // Process queued candidates
                while (iceCandidatesQueue.current.length > 0) {
                    await pc.addIceCandidate(iceCandidatesQueue.current.shift());
                }

                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                sendSignal({ type: 'answer', sdp: answer });
            } else if (signal.type === 'answer') {
                await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
            } else if (signal.type === 'candidate') {
                if (pc.remoteDescription) {
                    await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
                } else {
                    iceCandidatesQueue.current.push(new RTCIceCandidate(signal.candidate));
                }
            }
        } catch (err) {
            console.error("Error handling signal:", err);
        }
    };

    const toggleMute = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
            setIsMuted(!isMuted);
        }
    };

    const toggleVideo = () => {
        if (localStream) {
            localStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
            setIsVideoOff(!isVideoOff);
        }
    };

    return ReactDOM.createPortal(
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
             style={{ backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 9999, backdropFilter: 'blur(5px)' }}>
            
            <GlassCard className="p-0 overflow-hidden position-relative" style={{ width: '90%', maxWidth: '1000px', height: '80vh', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="position-relative w-100 h-100 bg-black">
                    {/* Remote Video (Full Screen) */}
                    <video 
                        ref={remoteVideoRef} 
                        autoPlay 
                        playsInline 
                        className="w-100 h-100 object-fit-cover"
                    />
                    
                    {/* Connection Status Overlay */}
                    {connectionStatus !== 'connected' && (
                        <div className="position-absolute top-50 start-50 translate-middle text-white text-center">
                            <div className="spinner-border mb-3 text-primary" role="status" style={{ width: '3rem', height: '3rem' }}></div>
                            <p className="fs-5 fw-medium">{connectionStatus}</p>
                        </div>
                    )}

                    {/* Local Video (PIP) */}
                    <div className="position-absolute top-0 end-0 m-3 rounded-4 overflow-hidden shadow-lg" 
                         style={{ width: '240px', height: '180px', border: '2px solid rgba(255,255,255,0.2)', zIndex: 10 }}>
                        <video 
                            ref={localVideoRef} 
                            autoPlay 
                            playsInline 
                            muted 
                            className="w-100 h-100 object-fit-cover"
                            style={{ transform: 'scaleX(-1)' }} // Mirror local video
                        />
                    </div>

                    {/* Controls */}
                    <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4 d-flex gap-3 p-3 rounded-pill" 
                         style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <button 
                            onClick={toggleMute} 
                            className={`btn rounded-circle p-3 d-flex align-items-center justify-content-center ${isMuted ? 'btn-danger' : 'btn-secondary'}`}
                            style={{ width: '50px', height: '50px' }}
                            title={isMuted ? "Unmute" : "Mute"}
                        >
                            <i className={`bi ${isMuted ? 'bi-mic-mute-fill' : 'bi-mic-fill'} fs-5`}></i>
                        </button>
                        
                        <button 
                            onClick={toggleVideo} 
                            className={`btn rounded-circle p-3 d-flex align-items-center justify-content-center ${isVideoOff ? 'btn-danger' : 'btn-secondary'}`}
                            style={{ width: '50px', height: '50px' }}
                            title={isVideoOff ? "Turn Video On" : "Turn Video Off"}
                        >
                            <i className={`bi ${isVideoOff ? 'bi-camera-video-off-fill' : 'bi-camera-video-fill'} fs-5`}></i>
                        </button>

                        <button 
                            onClick={onClose} 
                            className="btn btn-danger rounded-circle p-3 d-flex align-items-center justify-content-center"
                            style={{ width: '50px', height: '50px' }}
                            title="End Call"
                        >
                            <i className="bi bi-telephone-x-fill fs-5"></i>
                        </button>
                    </div>
                </div>
            </GlassCard>
        </div>,
        document.body
    );
};

export default VideoCall;
