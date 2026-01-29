import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { API_BASE_URL, HUB_URL, WS_URL, BACKEND_TYPE } from '../config';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeChat, setActiveChat] = useState(null);
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [connection, setConnection] = useState(null);
    const activeChatIdRef = useRef(null);

    useEffect(() => {
        activeChatIdRef.current = activeChat?.id;
    }, [activeChat]);

    // Connection Logic
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        let newConnection;
        let stompClient;

        if (BACKEND_TYPE === 'DOTNET') {
            // SignalR Connection
            newConnection = new signalR.HubConnectionBuilder()
                .withUrl(HUB_URL, {
                    accessTokenFactory: () => token
                })
                .withAutomaticReconnect()
                .build();

            newConnection.start()
                .then(() => console.log('Connected to SignalR'))
                .catch(e => console.error('Connection failed: ', e));

            newConnection.on('ReceiveMessage', (newMsg) => {
                fetchConversations();
                if (activeChatIdRef.current === newMsg.senderId) {
                    setMessages(prev => [...prev, newMsg]);
                }
            });

            setConnection(newConnection);
        } else {
            // STOMP Connection
            stompClient = new Client({
                webSocketFactory: () => new SockJS(WS_URL),
                connectHeaders: {
                    Authorization: `Bearer ${token}`
                },
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                onConnect: () => {
                    console.log('Connected to STOMP');
                    setConnection(stompClient);

                    // Subscribe to chat messages
                    stompClient.subscribe('/user/queue/messages', (message) => {
                        const newMsg = JSON.parse(message.body);
                        fetchConversations();
                        if (activeChatIdRef.current === newMsg.senderId) {
                            setMessages(prev => [...prev, newMsg]);
                        }
                    });
                },
                onStompError: (frame) => {
                    console.error('Broker reported error: ' + frame.headers['message']);
                    console.error('Additional details: ' + frame.body);
                }
            });

            stompClient.activate();
        }

        return () => {
            if (newConnection) {
                newConnection.stop();
            }
            if (stompClient) {
                stompClient.deactivate();
            }
        };
    }, []);

    const fetchConversations = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await fetch(`${API_BASE_URL}/chat/conversations`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setChats(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchConversations();
        }
    }, [isOpen]);

    useEffect(() => {
        if (activeChat) {
            const fetchMessages = async () => {
                const token = localStorage.getItem('token');
                try {
                    const res = await fetch(`${API_BASE_URL}/chat/messages/${activeChat.id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setMessages(data);
                    }
                } catch (err) {
                    console.error(err);
                }
            };
            fetchMessages();
        }
    }, [activeChat]);

    const sendMessage = async (content) => {
        if (!content.trim() || !activeChat) return;

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_BASE_URL}/chat/send`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ receiverId: activeChat.id, content })
            });

            if (res.ok) {
                const newMessage = await res.json();
                setMessages([...messages, newMessage]);
                fetchConversations();
                return true;
            }
        } catch (err) {
            console.error(err);
        }
        return false;
    };

    const openChat = (user) => {
        setActiveChat({
            id: user.id,
            name: user.name,
            avatar: user.name ? user.name.substring(0, 2).toUpperCase() : 'U',
            online: false // Default
        });
        setIsOpen(true);
    };

    return (
        <ChatContext.Provider value={{
            isOpen, setIsOpen,
            activeChat, setActiveChat,
            chats, messages,
            sendMessage, openChat,
            connection
        }}>
            {children}
        </ChatContext.Provider>
    );
};
