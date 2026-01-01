import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import { API_BASE_URL, HUB_URL } from '../config';

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

    // SignalR Connection
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(HUB_URL, {
                accessTokenFactory: () => token
            })
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);

        return () => {
            if (newConnection) {
                newConnection.stop();
            }
        };
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => console.log('Connected to SignalR'))
                .catch(e => console.error('Connection failed: ', e));

            connection.on('ReceiveMessage', (newMsg) => {
                fetchConversations();
                if (activeChatIdRef.current === newMsg.senderId) {
                    setMessages(prev => [...prev, newMsg]);
                }
            });
        }
    }, [connection]);

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
            sendMessage, openChat
        }}>
            {children}
        </ChatContext.Provider>
    );
};
