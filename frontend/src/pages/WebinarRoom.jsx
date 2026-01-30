import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import GlassCard from '../components/GlassCard';
import toast from 'react-hot-toast';
import { API_BASE_URL, BACKEND_TYPE } from '../config';

const rtcConfig = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
    ]
};

const WebinarRoom = () => {
    const { id: webinarId } = useParams();
    const navigate = useNavigate();
    const { connection } = useChat();
    const [localStream, setLocalStream] = useState(null);
    const [peers, setPeers] = useState([]); // Array of { socketId, stream } basically
    const peersRef = useRef({}); // Store RTCPeerConnections mapped by user ID
    const user = JSON.parse(localStorage.getItem('user'));
    const localVideoRef = useRef(null);

    useEffect(() => {
        if (!user) {
            toast.error("Please login to join.");
            navigate('/login');
            return;
        }

        if (connection) {
            startWebinar();
        }

        return () => {
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
            Object.values(peersRef.current).forEach(({ pc }) => pc.close());
            
            // Send leave signal
            if (connection) {
                try {
                    sendWebinarSignal({ type: 'leave', userId: user.id.toString(), webinarId });
                } catch (e) {
                    console.log("Connection closed before leave signal could be sent.");
                }
                
                if (BACKEND_TYPE === 'DOTNET') {
                    connection.off('ReceiveWebinarSignal');
                    connection.off('ReceiveSignal');
                }
            }
        };
    }, [connection]); // Depend on connection

    const startWebinar = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }

            if (connection) {
                if (BACKEND_TYPE === 'DOTNET') {
                    // SignalR
                    connection.on('ReceiveWebinarSignal', (message) => {
                        const signal = JSON.parse(message);
                        handleSignal(signal);
                    });

                    connection.on('ReceiveSignal', (senderId, signalData) => {
                        // senderId comes separately in SignalR ReceiveSignal(string senderId, string signalData)
                        const payload = JSON.parse(signalData);
                        handleP2PSignal(senderId, payload.signalData, payload.type);
                    });

                    await connection.invoke("JoinWebinar", webinarId);
                } else {
                    // STOMP
                    connection.subscribe(`/topic/webinar/${webinarId}`, (message) => {
                        const signal = JSON.parse(message.body);
                        handleSignal(signal);
                    });

                    // P2P Subscription
                     connection.subscribe('/user/queue/video/signal', (msg) => {
                        const payload = JSON.parse(msg.body);
                        handleP2PSignal(payload.senderId, payload.signalData, payload.type);
                    });
                }

                // Announce join
                sendWebinarSignal({ type: 'join', userId: user.id.toString(), name: user.name, webinarId });
            }

        } catch (err) {
            console.error("Failed to access media", err);
            toast.error("Could not access camera/microphone.");
        }
    };

    const sendWebinarSignal = (signal) => {
        if (connection) {
            if (BACKEND_TYPE === 'DOTNET') {
                connection.invoke("SendWebinarSignal", webinarId, JSON.stringify(signal));
            } else {
                 connection.publish({
                    destination: '/app/webinar/signal',
                    body: JSON.stringify(signal)
                });
            }
        }
    };

    // Send P2P signal (Offer/Answer/Candidate)
    const sendP2PSignal = (targetUserId, type, data) => {
        if (connection) {
            if (BACKEND_TYPE === 'DOTNET') {
                 connection.invoke("SendSignal", targetUserId.toString(), JSON.stringify({
                    targetUserId: targetUserId,
                    type: type,
                    signalData: JSON.stringify(data)
                }));
            } else {
                connection.publish({
                    destination: '/app/video/signal',
                    body: JSON.stringify({
                        targetUserId: targetUserId,
                        type: type,
                        signalData: JSON.stringify(data)
                    })
                });
            }
        }
    };


    const handleSignal = async (signal) => {
        // Handle Broadcast Signals (Join/Leave)
        if (signal.userId === user.id.toString()) return; // Ignore self

        if (signal.type === 'join') {
            toast.success(`${signal.name} joined!`);
            // Initiate connection to new user
            createPeer(signal.userId, true);
        } else if (signal.type === 'leave') {
            removePeer(signal.userId);
        }
    };

    const handleP2PSignal = async (senderId, dataStr, type) => {
        const data = dataStr ? JSON.parse(dataStr) : null;
        
        if (type === 'offer') {
             // Incoming call from existing user (or new user if we joined late? No, new user initiates)
             // Create peer as answerer
             const pc = createPeer(senderId, false);
             await pc.setRemoteDescription(new RTCSessionDescription(data));
             const answer = await pc.createAnswer();
             await pc.setLocalDescription(answer);
             sendP2PSignal(senderId, 'answer', answer);
             
        } else if (type === 'answer') {
            const pc = peersRef.current[senderId]?.pc;
            if (pc) {
                await pc.setRemoteDescription(new RTCSessionDescription(data));
            }
        } else if (type === 'candidate') {
            const pc = peersRef.current[senderId]?.pc;
            if (pc) {
                await pc.addIceCandidate(new RTCIceCandidate(data));
            }
        }
    };

    const createPeer = (targetUserId, isInitiator) => {
        if (peersRef.current[targetUserId]) return peersRef.current[targetUserId].pc;

        const pc = new RTCPeerConnection(rtcConfig);
        
        // Add local tracks
        localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

        // Handle ICE candidates
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                sendP2PSignal(targetUserId, 'candidate', event.candidate);
            }
        };

        // Handle remote stream
        pc.ontrack = (event) => {
            setPeers(prev => {
                const existing = prev.find(p => p.userId === targetUserId);
                if (existing) return prev;
                return [...prev, { userId: targetUserId, stream: event.streams[0] }];
            });
        };

        peersRef.current[targetUserId] = { pc };

        if (isInitiator) {
            pc.onnegotiationneeded = async () => {
                try {
                    const offer = await pc.createOffer();
                    await pc.setLocalDescription(offer);
                    sendP2PSignal(targetUserId, 'offer', offer);
                } catch (err) {
                    console.error("Offer Error", err);
                }
            };
        }

        return pc;
    };

    const removePeer = (userId) => {
        if (peersRef.current[userId]) {
            peersRef.current[userId].pc.close();
            delete peersRef.current[userId];
            setPeers(prev => prev.filter(p => p.userId !== userId));
        }
    };

    return (
        <div className="min-vh-100 bg-dark text-white p-4">
            <h2 className="mb-4">Webinar Room: {webinarId}</h2>
            
            <div className="row g-3">
                {/* Local Video */}
                <div className="col-md-4">
                    <div className="position-relative bg-black rounded overflow-hidden" style={{ aspectRatio: '16/9' }}>
                         <video ref={localVideoRef} autoPlay playsInline muted className="w-100 h-100 object-fit-cover" style={{ transform: 'scaleX(-1)' }} />
                         <span className="position-absolute bottom-0 start-0 m-2 badge bg-primary">You</span>
                    </div>
                </div>

                {/* Remote Videos */}
                {peers.map(peer => (
                    <div className="col-md-4" key={peer.userId}>
                        <div className="position-relative bg-black rounded overflow-hidden" style={{ aspectRatio: '16/9' }}>
                             <VideoPlayer stream={peer.stream} />
                             <span className="position-absolute bottom-0 start-0 m-2 badge bg-secondary">User {peer.userId}</span>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="fixed-bottom p-4 d-flex justify-content-center gap-3">
                <button className="btn btn-danger rounded-pill px-4" onClick={() => navigate('/webinars')}>Leave Webinar</button>
            </div>
        </div>
    );
};

const VideoPlayer = ({ stream }) => {
    const videoRef = useRef(null);
    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);
    return <video ref={videoRef} autoPlay playsInline className="w-100 h-100 object-fit-cover" />;
};

export default WebinarRoom;
