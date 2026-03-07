import React, { useEffect, useState, useRef } from 'react';
import { Search, Send, Plus, MoreVertical, Compass, MessageCircle, ArrowLeft } from 'lucide-react';
import { getChats, getMessages, markRead } from '../services/chat.service.js';
import { getSocket } from '../lib/socket.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useLocation } from 'react-router-dom';

function formatTime(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return 'now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default function ChatView({ onUnreadChange, onChatOpen }) {
    const { user } = useAuth();
    const location = useLocation();
    const [chats, setChats] = useState([]);
    const [activeChatId, setActiveChatId] = useState(location.state?.activeChatId || null);
    const [messages, setMessages] = useState([]);
    const [msgText, setMsgText] = useState('');
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [typingUser, setTypingUser] = useState('');
    const bottomRef = useRef(null);
    const typingTimer = useRef(null);

    // Load chats
    useEffect(() => {
        getChats(filter)
            .then(list => {
                setChats(list || []);
                const unread = (list || []).reduce((sum, c) => sum + (c.unreadCount || 0), 0);
                onUnreadChange?.(unread);
            })
            .catch(() => setChats([]));
    }, [filter]);

    // Load messages
    useEffect(() => {
        if (!activeChatId) return;
        getMessages(activeChatId)
            .then(d => setMessages(d.messages || []))
            .catch(() => setMessages([]));
        markRead(activeChatId).catch(() => { });
    }, [activeChatId]);

    // Handle mobile chat open state for navigation bar hiding
    useEffect(() => {
        onChatOpen?.(!!activeChatId);
        return () => onChatOpen?.(false);
    }, [activeChatId, onChatOpen]);

    // Socket
    useEffect(() => {
        const socket = getSocket();
        if (!socket || !activeChatId) return;
        socket.emit('join_chat', { chatId: activeChatId });

        const onMsg = ({ message }) => setMessages(prev => [...prev, message]);
        const onTyping = ({ name }) => setTypingUser(name);
        const onStopTyping = () => setTypingUser('');

        socket.on('receive_message', onMsg);
        socket.on('user_typing', onTyping);
        socket.on('user_stop_typing', onStopTyping);

        return () => {
            socket.off('receive_message', onMsg);
            socket.off('user_typing', onTyping);
            socket.off('user_stop_typing', onStopTyping);
        };
    }, [activeChatId]);

    // Auto-scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

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
        if (chat.rideId?.fromLocation) return `Ride: ${chat.rideId.fromLocation}`;
        return 'Group Chat';
    };

    const filteredChats = chats.filter(chat =>
        chatName(chat).toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header bar */}
            <div style={{
                padding: '16px 32px 12px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
            }}>
                <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Messages</h2>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                    {['all', 'personal', 'group'].map(f => (
                        <button
                            key={f}
                            className={`filter-tab ${filter === f ? 'active' : ''}`}
                            onClick={() => setFilter(f)}
                            style={{ textTransform: 'capitalize' }}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="chat-layout">
                {/* ── Sidebar ─────────────────────────── */}
                <div className={`chat-sidebar ${activeChatId ? 'mobile-hidden' : ''}`}>
                    <div className="chat-sidebar-header">
                        <div className="search-bar" style={{ width: '100%' }}>
                            <Search size={15} color="var(--text-faint)" />
                            <input
                                placeholder="Search conversations..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                style={{ fontSize: '0.85rem' }}
                            />
                        </div>
                    </div>

                    <div className="contact-list">
                        {filteredChats.length === 0 && (
                            <div style={{ padding: '24px 20px', textAlign: 'center' }}>
                                <MessageCircle size={28} color="#475569" style={{ margin: '0 auto 8px' }} />
                                <p style={{ color: '#475569', fontSize: '0.85rem' }}>
                                    {searchTerm ? 'No chats found' : 'No conversations yet'}
                                </p>
                            </div>
                        )}

                        {filteredChats.map(chat => {
                            const name = chatName(chat);
                            const isGroup = chat.type !== 'personal';
                            const isActive = activeChatId === chat._id;

                            return (
                                <div
                                    key={chat._id}
                                    className={`contact-item ${isActive ? 'active' : ''}`}
                                    onClick={() => setActiveChatId(chat._id)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => e.key === 'Enter' && setActiveChatId(chat._id)}
                                    aria-label={`Open chat with ${name}`}
                                >
                                    {/* Avatar */}
                                    <div style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: '50%',
                                        background: isGroup
                                            ? 'linear-gradient(135deg, rgba(244,114,182,0.2), rgba(139,92,246,0.2))'
                                            : 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(139,92,246,0.15))',
                                        border: `1px solid ${isGroup ? 'rgba(244,114,182,0.3)' : 'rgba(6,182,212,0.25)'}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: isGroup ? '#f472b6' : '#06b6d4',
                                        fontWeight: 700,
                                        fontSize: '0.875rem',
                                        flexShrink: 0,
                                    }}>
                                        {isGroup ? <Compass size={17} /> : name.charAt(0).toUpperCase()}
                                    </div>

                                    {/* Info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                                            <span style={{
                                                fontWeight: 600,
                                                fontSize: '0.875rem',
                                                color: isActive ? '#06b6d4' : '#f1f5f9',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                maxWidth: '60%',
                                            }}>{name}</span>
                                            <span style={{ fontSize: '0.7rem', color: '#475569' }}>
                                                {formatTime(chat.updatedAt)}
                                            </span>
                                        </div>
                                        <p style={{
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            margin: 0,
                                            fontSize: '0.78rem',
                                            color: '#475569',
                                        }}>
                                            {chat.lastMessage?.content || 'No messages yet'}
                                        </p>
                                    </div>

                                    {/* Unread badge */}
                                    {chat.unreadCount > 0 && (
                                        <div style={{
                                            background: '#06b6d4',
                                            color: '#0A0F1E',
                                            fontSize: '0.65rem',
                                            fontWeight: 800,
                                            minWidth: 18,
                                            height: 18,
                                            borderRadius: 9999,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '0 5px',
                                            boxShadow: '0 0 8px rgba(6,182,212,0.5)',
                                            flexShrink: 0,
                                        }}>
                                            {chat.unreadCount}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── Chat Main ────────────────────────── */}
                <div className={`chat-main ${!activeChatId ? 'mobile-hidden' : ''}`}>
                    {activeChatId ? (
                        <>
                            {/* Chat Header */}
                            <div className="chat-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <button
                                        className="icon-btn chat-back-btn"
                                        onClick={() => setActiveChatId(null)}
                                        style={{ display: 'none', width: 32, height: 32, padding: 0, border: 'none', background: 'transparent' }}
                                        aria-label="Back to chat list"
                                    >
                                        <ArrowLeft size={20} color="var(--text-muted)" />
                                    </button>
                                    <div style={{
                                        width: 38,
                                        height: 38,
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: 700,
                                        fontSize: '0.875rem',
                                        boxShadow: '0 0 10px rgba(6,182,212,0.3)',
                                    }}>
                                        {chatName(activeChat)?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '0.975rem', fontWeight: 700 }}>
                                            {chatName(activeChat)}
                                        </h3>
                                        <span style={{ fontSize: '0.75rem', color: '#34d399' }}>
                                            {activeChat?.participants?.length || 2} members · Online
                                        </span>
                                    </div>
                                </div>
                                <button className="icon-btn" aria-label="Chat options">
                                    <MoreVertical size={18} />
                                </button>
                            </div>

                            {/* Messages */}
                            <div className="chat-messages">
                                {messages.length === 0 && (
                                    <div style={{
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#475569',
                                        gap: 10,
                                        padding: 40,
                                    }}>
                                        <MessageCircle size={32} />
                                        <p style={{ fontSize: '0.875rem' }}>No messages yet. Say hello! 👋</p>
                                    </div>
                                )}

                                {messages.map((msg, i) => {
                                    const isMine = (msg.sender?._id || msg.sender) === user._id;
                                    return (
                                        <div
                                            key={msg._id || i}
                                            className={`message ${isMine ? 'sent' : 'received'}`}
                                        >
                                            {!isMine && (
                                                <div style={{
                                                    fontSize: '0.72rem',
                                                    color: '#06b6d4',
                                                    fontWeight: 700,
                                                    marginBottom: 5,
                                                }}>
                                                    {msg.sender?.name}
                                                </div>
                                            )}
                                            {msg.content}
                                            <div className="message-time" style={{ textAlign: isMine ? 'right' : 'left' }}>
                                                {formatTime(msg.createdAt)}
                                            </div>
                                        </div>
                                    );
                                })}

                                {typingUser && (
                                    <div className="typing-indicator">
                                        <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 6,
                                            background: 'rgba(6,182,212,0.08)',
                                            border: '1px solid rgba(6,182,212,0.15)',
                                            borderRadius: 9999,
                                            padding: '5px 12px',
                                            fontSize: '0.75rem',
                                            color: '#94a3b8',
                                        }}>
                                            <span style={{ display: 'flex', gap: 3 }}>
                                                {[0, 1, 2].map(i => (
                                                    <span key={i} style={{
                                                        width: 5, height: 5, borderRadius: '50%', background: '#06b6d4',
                                                        animation: `bounce 1.2s ${i * 0.2}s infinite`,
                                                        display: 'inline-block',
                                                    }} />
                                                ))}
                                            </span>
                                            {typingUser} is typing...
                                        </span>
                                    </div>
                                )}

                                <div ref={bottomRef} />
                            </div>

                            {/* Input */}
                            <div className="chat-input-area">
                                <button className="icon-btn" aria-label="Add attachment">
                                    <Plus size={18} />
                                </button>
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    value={msgText}
                                    onChange={e => setMsgText(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    aria-label="Message input"
                                />
                                <button
                                    className="send-btn"
                                    onClick={handleSend}
                                    aria-label="Send message"
                                    disabled={!msgText.trim()}
                                    style={{ opacity: msgText.trim() ? 1 : 0.5 }}
                                >
                                    <Send size={17} style={{ marginLeft: '-1px' }} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div style={{
                            flex: 1, display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center',
                            color: '#475569', gap: 12, padding: 40, textAlign: 'center',
                        }}>
                            <div style={{
                                width: 72, height: 72, borderRadius: 20,
                                background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.12)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#06b6d4',
                            }}>
                                <MessageCircle size={30} />
                            </div>
                            <div>
                                <p style={{ fontWeight: 600, color: '#94a3b8', marginBottom: 6, fontSize: '1rem' }}>
                                    Select a conversation
                                </p>
                                <p style={{ fontSize: '0.85rem', color: '#475569' }}>
                                    Choose a chat from the left to start messaging
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
        </div>
    );
}
