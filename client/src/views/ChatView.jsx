import React, { useEffect, useState, useRef } from 'react';
import { Search, Send, Plus, MoreVertical, Compass } from 'lucide-react';
import { getChats, getMessages, markRead } from '../services/chat.service.js';
import { getSocket } from '../lib/socket.js';
import { useAuth } from '../context/AuthContext.jsx';

function formatTime(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return 'now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString();
}

export default function ChatView({ onUnreadChange }) {
    const { user } = useAuth();
    const [chats, setChats] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [msgText, setMsgText] = useState('');
    const [filter, setFilter] = useState('all');
    const [typing, setTyping] = useState(false);
    const [typingUser, setTypingUser] = useState('');
    const bottomRef = useRef(null);
    const typingTimer = useRef(null);

    // Load chat list
    useEffect(() => {
        getChats(filter).then(list => {
            setChats(list || []);
            const unread = (list || []).reduce((sum, c) => sum + (c.unreadCount || 0), 0);
            onUnreadChange?.(unread);
        }).catch(() => setChats([]));
    }, [filter]);

    // Load messages when active chat changes
    useEffect(() => {
        if (!activeChatId) return;
        getMessages(activeChatId).then(d => setMessages(d.messages || [])).catch(() => setMessages([]));
        markRead(activeChatId).catch(() => { });
    }, [activeChatId]);

    // Socket: join room + listen
    useEffect(() => {
        const socket = getSocket();
        if (!socket || !activeChatId) return;

        socket.emit('join_chat', { chatId: activeChatId });

        const onMsg = ({ message }) => {
            setMessages(prev => [...prev, message]);
        };
        const onTyping = ({ name }) => { setTypingUser(name); };
        const onStopTyping = () => { setTypingUser(''); };

        socket.on('receive_message', onMsg);
        socket.on('user_typing', onTyping);
        socket.on('user_stop_typing', onStopTyping);

        return () => {
            socket.off('receive_message', onMsg);
            socket.off('user_typing', onTyping);
            socket.off('user_stop_typing', onStopTyping);
        };
    }, [activeChatId]);

    // Auto-scroll to bottom
    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const handleSend = () => {
        if (!msgText.trim() || !activeChatId) return;
        const socket = getSocket();
        if (socket) {
            socket.emit('send_message', { chatId: activeChatId, content: msgText.trim() });
            clearTimeout(typingTimer.current);
            socket.emit('stop_typing', { chatId: activeChatId });
        }
        setMsgText('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') { handleSend(); return; }
        const socket = getSocket();
        if (socket && activeChatId) {
            socket.emit('typing', { chatId: activeChatId });
            clearTimeout(typingTimer.current);
            typingTimer.current = setTimeout(() => socket.emit('stop_typing', { chatId: activeChatId }), 1500);
        }
    };

    const activeChat = chats.find(c => c._id === activeChatId);
    const chatName = (chat) => {
        if (!chat) return '';
        if (chat.type === 'personal') {
            const other = chat.participants?.find(p => (p._id || p) !== user._id);
            return other?.name || 'Chat';
        }
        if (chat.tripId?.fromLocation) return `${chat.tripId.fromLocation} → ${chat.tripId.toLocation}`;
        if (chat.rideId?.fromLocation) return `Ride: ${chat.rideId.fromLocation} → ${chat.rideId.toLocation}`;
        return `Group Chat`;
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '24px 32px 12px' }}><h2>Messages</h2></div>
            <div className="chat-layout">
                {/* Sidebar */}
                <div className="chat-sidebar">
                    <div className="chat-sidebar-header">
                        <div className="search-bar" style={{ width: '100%', background: 'white' }}>
                            <Search size={16} color="var(--text-muted)" />
                            <input type="text" placeholder="Search chats..." style={{ fontSize: '0.9rem' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                            {['all', 'personal', 'group'].map(f => (
                                <span key={f} className={`status-badge ${filter === f ? 'status-upcoming' : ''}`}
                                    style={{ cursor: 'pointer', background: filter === f ? undefined : '#f1f5f9', textTransform: 'capitalize' }}
                                    onClick={() => setFilter(f)}>{f}</span>
                            ))}
                        </div>
                    </div>
                    <div className="contact-list">
                        {chats.length === 0 && <p style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>No chats yet.</p>}
                        {chats.map(chat => {
                            const name = chatName(chat);
                            const isGroup = chat.type !== 'personal';
                            return (
                                <div key={chat._id} className={`contact-item ${activeChatId === chat._id ? 'active' : ''}`} onClick={() => setActiveChatId(chat._id)}>
                                    <div className="user-avatar" style={{ background: isGroup ? 'var(--accent-light)' : 'var(--primary-light)', color: isGroup ? 'var(--accent)' : 'var(--primary)' }}>
                                        {isGroup ? <Compass size={20} /> : name.charAt(0)}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <h4 style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.95rem' }}>{name}</h4>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatTime(chat.updatedAt)}</span>
                                        </div>
                                        <p className="text-sm" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                                            {chat.lastMessage?.content || 'No messages yet'}
                                        </p>
                                    </div>
                                    {chat.unreadCount > 0 && (
                                        <div style={{ background: 'var(--accent)', color: 'white', fontSize: '0.7rem', fontWeight: 'bold', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{chat.unreadCount}</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Chat Main */}
                <div className="chat-main">
                    {activeChatId ? (
                        <>
                            <div className="chat-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div className="user-avatar">{chatName(activeChat)?.charAt(0)}</div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{chatName(activeChat)}</h3>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>{activeChat?.participants?.length || 2} members</span>
                                    </div>
                                </div>
                                <button className="icon-btn"><MoreVertical size={20} /></button>
                            </div>
                            <div className="chat-messages">
                                {messages.map((msg, i) => {
                                    const isMine = (msg.sender?._id || msg.sender) === user._id;
                                    return (
                                        <div key={msg._id || i} className={`message ${isMine ? 'sent' : 'received'}`}>
                                            {!isMine && <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 'bold', marginBottom: '4px' }}>{msg.sender?.name}</div>}
                                            {msg.content}
                                            <div className="message-time">{formatTime(msg.createdAt)}</div>
                                        </div>
                                    );
                                })}
                                {typingUser && <div className="typing-indicator">{typingUser} is typing...</div>}
                                <div ref={bottomRef} />
                            </div>
                            <div className="chat-input-area">
                                <button className="icon-btn" style={{ padding: '0 8px' }}><Plus size={24} /></button>
                                <input type="text" placeholder="Type a message..."
                                    value={msgText} onChange={e => setMsgText(e.target.value)} onKeyDown={handleKeyDown} />
                                <button className="send-btn" onClick={handleSend}><Send size={18} style={{ marginLeft: '-2px' }} /></button>
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                            Select a chat to start messaging
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
