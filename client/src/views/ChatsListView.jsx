import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Users, User } from 'lucide-react';
import './ChatsListView.css';

const ChatsListView = ({ messages, user, onOpenChat }) => {
    const navigate = useNavigate();

    // Get unique chats from messages
    const getUniqueChats = () => {
        const chatsMap = new Map();

        // Process all message groups
        Object.entries(messages).forEach(([chatId, msgs]) => {
            if (msgs.length === 0) return;

            const lastMessage = msgs[msgs.length - 1];

            // Try to determine chat type
            // If chatId is a trip ID (from group chats), it will have trip data
            // If chatId is a user ID (from private chats), it's private

            // For now, we'll use a simple heuristic:
            // - If chatId looks like a MongoDB ID (24 chars, hex), it's likely a trip or user
            // - We need more context to differentiate

            chatsMap.set(chatId, {
                id: chatId,
                lastMessage: lastMessage.text,
                timestamp: lastMessage.timestamp,
                name: lastMessage.senderName || 'Unknown',
                type: 'private' // Default to private, would need backend support for proper typing
            });
        });

        // Convert to array and sort by timestamp
        return Array.from(chatsMap.values()).sort((a, b) =>
            new Date(b.timestamp) - new Date(a.timestamp)
        );
    };

    const chats = getUniqueChats();

    const handleChatClick = (chat) => {
        if (onOpenChat) {
            onOpenChat(chat);
        }
        navigate(`/chat/${chat.id}`);
    };

    return (
        <div className="chats-list-view">
            <h1 className="chats-header">Messages</h1>

            <div className="chats-container">
                {chats.length === 0 ? (
                    <div className="empty-chats">
                        <MessageSquare size={64} className="empty-chats-icon" />
                        <h3>No conversations yet</h3>
                        <p style={{ marginTop: '0.5rem' }}>
                            Start exploring trips and connect with travelers!
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
                    chats.map(chat => (
                        <div
                            key={chat.id}
                            className="chat-item"
                            onClick={() => handleChatClick(chat)}
                        >
                            <div className={`chat-avatar ${chat.type === 'group' ? 'group' : ''}`}>
                                {chat.type === 'group' ? (
                                    <Users size={24} />
                                ) : (
                                    chat.name?.[0]?.toUpperCase()
                                )}
                            </div>
                            <div className="chat-info">
                                <div className="chat-name">{chat.name}</div>
                                <div className="chat-preview">{chat.lastMessage}</div>
                            </div>
                            <div className={`chat-badge ${chat.type === 'group' ? 'group' : ''}`}>
                                {chat.type === 'group' ? 'Group' : 'Private'}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ChatsListView;
