import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../context/ChatContext';

const ChatWidget = () => {
    const { isOpen, setIsOpen, activeChat, setActiveChat, chats, messages, sendMessage } = useChat();
    const [message, setMessage] = useState('');
    const messagesEndRef = React.useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    React.useEffect(() => {
        scrollToBottom();
    }, [messages, activeChat, isOpen]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const success = await sendMessage(message);
        if (success) {
            setMessage('');
        }
    };

    return (
        <div className="position-fixed bottom-0 end-0 p-4 z-3 d-flex flex-column align-items-end gap-3" style={{ zIndex: 1050 }}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="rounded-4 overflow-hidden shadow-lg d-flex flex-column"
                        style={{
                            width: '350px',
                            height: '500px',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            backdropFilter: 'blur(16px)',
                            WebkitBackdropFilter: 'blur(16px)',
                        }}
                    >

                        <div className="p-3 border-bottom border-secondary-subtle d-flex align-items-center justify-content-between" 
                             style={{ background: 'rgba(var(--bg-primary-rgb), 0.5)' }}>
                            {activeChat ? (
                                <div className="d-flex align-items-center gap-2">
                                    <button onClick={() => setActiveChat(null)} className="btn btn-sm btn-icon p-0 border-0 text-muted">
                                        <i className="bi bi-arrow-left fs-5"></i>
                                    </button>
                                    <div className="position-relative">
                                        <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white small"
                                            style={{ width: '32px', height: '32px', background: 'var(--accent-primary)' }}>
                                            {activeChat.avatar}
                                        </div>
                                        {activeChat.online && <span className="position-absolute bottom-0 end-0 bg-success rounded-circle border border-white" style={{ width: '8px', height: '8px' }}></span>}
                                    </div>
                                    <div>
                                        <div className="fw-bold small" style={{ color: 'var(--text-main)' }}>{activeChat.name}</div>
                                        <div className="text-muted" style={{ fontSize: '0.7rem' }}>{activeChat.online ? 'Active now' : 'Offline'}</div>
                                    </div>
                                </div>
                            ) : (
                                <h5 className="m-0 fw-bold" style={{ color: 'var(--text-main)' }}>Chats</h5>
                            )}
                            <div className="d-flex gap-2">
                                
                            </div>
                        </div>


                        <div className="flex-grow-1 overflow-y-auto custom-scrollbar bg-opacity-10" style={{ background: 'rgba(0,0,0,0.02)' }}>
                            {activeChat ? (
                                <div className="p-3 d-flex flex-column gap-3">
                                    {messages.map((msg) => (
                                        <div key={msg.id} className={`d-flex ${msg.sender === 'me' ? 'justify-content-end' : 'justify-content-start'}`}>
                                            <div className={`p-2 px-3 rounded-4 ${msg.sender === 'me' ? 'rounded-tr-0' : 'rounded-tl-0'}`}
                                                style={{
                                                    maxWidth: '80%',
                                                    background: msg.sender === 'me' ? 'var(--accent-primary)' : 'var(--bg-primary)',
                                                    color: msg.sender === 'me' ? '#fff' : 'var(--text-main)',
                                                    border: msg.sender === 'me' ? 'none' : '1px solid var(--border-color)',
                                                    fontSize: '0.9rem'
                                                }}
                                            >
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            ) : (
                                <div className="p-2">
                                    {chats.length === 0 ? (
                                        <div className="text-center text-muted mt-5">
                                            <p>No conversations yet.</p>
                                        </div>
                                    ) : (
                                        chats.map(chat => (
                                            <div key={chat.id} 
                                                onClick={() => setActiveChat(chat)}
                                                className="d-flex align-items-center gap-3 p-2 rounded-3 cursor-pointer hover-bg"
                                                style={{ cursor: 'pointer', transition: 'background 0.2s' }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-primary)'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                            >
                                                <div className="position-relative">
                                                    <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
                                                        style={{ width: '40px', height: '40px', background: 'var(--accent-primary)' }}>
                                                        {chat.avatar}
                                                    </div>
                                                    {chat.online && <span className="position-absolute bottom-0 end-0 bg-success rounded-circle border border-white" style={{ width: '10px', height: '10px' }}></span>}
                                                </div>
                                                <div className="flex-grow-1 overflow-hidden">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <span className="fw-semibold small" style={{ color: 'var(--text-main)' }}>{chat.name}</span>
                                                        <span className="text-muted" style={{ fontSize: '0.7rem' }}>{chat.time}</span>
                                                    </div>
                                                    <div className="text-muted small text-truncate">{chat.lastMessage}</div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>


                        {activeChat && (
                            <div className="p-3 border-top border-secondary-subtle" style={{ background: 'rgba(var(--bg-primary-rgb), 0.5)' }}>
                                <form onSubmit={handleSendMessage} className="d-flex gap-2">
                                    <input 
                                        type="text" 
                                        className="form-control rounded-pill border-0 small" 
                                        placeholder="Type a message..." 
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        style={{ background: 'var(--bg-primary)', color: 'var(--text-main)', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)' }}
                                    />
                                    <button type="submit" className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center p-0" 
                                        style={{ width: '36px', height: '36px', background: 'var(--accent-primary)', border: 'none' }}>
                                        <i className="bi bi-send-fill small"></i>
                                    </button>
                                </form>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="rounded-circle border-0 shadow-lg d-flex align-items-center justify-content-center position-relative"
                style={{
                    width: '60px',
                    height: '60px',
                    background: 'var(--accent-primary)',
                    color: '#fff',
                    fontSize: '1.5rem'
                }}
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.i
                        key={isOpen ? 'close' : 'open'}
                        initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                        transition={{ duration: 0.2 }}
                        className={`bi ${isOpen ? 'bi-x-lg' : 'bi-chat-dots-fill'}`}
                    />
                </AnimatePresence>
                {!isOpen && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white"></span>}
            </motion.button>
        </div>
    );
};

export default ChatWidget;
