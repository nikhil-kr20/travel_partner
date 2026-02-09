import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Users, User } from 'lucide-react';
import './ChatsListView.css';

const ChatsListView = ({ messages, user, onOpenChat, trips }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'private', 'group'

    // Separate private and group chats
    const getChatsList = () => {
        const privateChats = [];
        const groupChats = [];

        Object.entries(messages).forEach(([chatId, msgs]) => {
            if (!msgs || msgs.length === 0) return;

            const lastMessage = msgs[msgs.length - 1];

            // Check if this is a group chat by looking for tripId in the message
            if (lastMessage.tripId) {
                // This is a group chat
                const trip = trips?.find(t => t.id === chatId);
                groupChats.push({
                    id: chatId,
                    lastMessage: lastMessage.text,
                    timestamp: lastMessage.timestamp,
                    senderName: lastMessage.senderName,
                    name: trip ? `${trip.origin} → ${trip.destination}` : 'Group Chat',
                    type: 'group'
                });
            } else {
                // This is a private chat
                // The chatId is the other user's ID
                // Don't show if the only messages are from the current user
                const hasReceivedMessages = msgs.some(msg => msg.senderId !== user.id);
                const hasSentMessages = msgs.some(msg => msg.senderId === user.id);

                if (hasReceivedMessages || hasSentMessages) {
                    const otherUserName = lastMessage.senderId === user.id
                        ? lastMessage.recipientName || 'User'
                        : lastMessage.senderName;

                    privateChats.push({
                        id: chatId,
                        lastMessage: lastMessage.text,
                        timestamp: lastMessage.timestamp,
                        senderName: lastMessage.senderName,
                        name: otherUserName,
                        type: 'private'
                    });
                }
            }
        });

        // Sort by timestamp
        privateChats.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        groupChats.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        return { privateChats, groupChats };
    };

    const { privateChats, groupChats } = getChatsList();

    // Filter based on active tab
    const getFilteredChats = () => {
        if (activeTab === 'private') return privateChats;
        if (activeTab === 'group') return groupChats;
        return [...privateChats, ...groupChats].sort((a, b) =>
            new Date(b.timestamp) - new Date(a.timestamp)
        );
    };

    const filteredChats = getFilteredChats();

    const handleChatClick = (chat) => {
        if (onOpenChat) {
            onOpenChat(chat);
        }
        navigate(`/chat/${chat.id}`);
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="chats-list-view">
            <div className="chats-header-section">
                <h1 className="chats-header">Messages</h1>

                {/* Tabs */}
                <div className="chats-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        All ({privateChats.length + groupChats.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'private' ? 'active' : ''}`}
                        onClick={() => setActiveTab('private')}
                    >
                        <User size={16} />
                        Private ({privateChats.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'group' ? 'active' : ''}`}
                        onClick={() => setActiveTab('group')}
                    >
                        <Users size={16} />
                        Groups ({groupChats.length})
                    </button>
                </div>
            </div>

            <div className="chats-container">
                {filteredChats.length === 0 ? (
                    <div className="empty-chats">
                        <MessageSquare size={64} className="empty-chats-icon" />
                        <h3>No {activeTab !== 'all' ? activeTab : ''} conversations yet</h3>
                        <p style={{ marginTop: '0.5rem' }}>
                            {activeTab === 'group'
                                ? 'Join trip group chats to connect with travelers!'
                                : activeTab === 'private'
                                    ? 'Send private messages to other users!'
                                    : 'Start exploring trips and connect with travelers!'}
                        </p>
                        <button
                            onClick={() => navigate('/browse')}
                            className="btn btn-primary"
                            style={{ marginTop: '1.5rem' }}
                        >
                            Browse Trips
                        </button>
                    </div>
                ) : (
                    filteredChats.map(chat => (
                        <div
                            key={chat.id}
                            className="chat-item"
                            onClick={() => handleChatClick(chat)}
                        >
                            <div className={`chat-avatar ${chat.type === 'group' ? 'group' : ''}`}>
                                {chat.type === 'group' ? (
                                    <Users size={24} />
                                ) : (
                                    chat.name?.[0]?.toUpperCase() || 'U'
                                )}
                            </div>
                            <div className="chat-info">
                                <div className="chat-name">{chat.name}</div>
                                <div className="chat-preview">
                                    {chat.senderName !== user.name && chat.type === 'group'
                                        ? `${chat.senderName}: `
                                        : ''}
                                    {chat.lastMessage}
                                </div>
                            </div>
                            <div className="chat-meta">
                                <div className="chat-time">{formatTimestamp(chat.timestamp)}</div>
                                <div className={`chat-badge ${chat.type === 'group' ? 'group' : ''}`}>
                                    {chat.type === 'group' ? 'Group' : 'Private'}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ChatsListView;
