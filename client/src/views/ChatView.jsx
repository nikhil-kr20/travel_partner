import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Send } from 'lucide-react';
import './ChatView.css';

const ChatView = ({ chat, user, messages, onSend }) => {
    const navigate = useNavigate();
    const [text, setText] = useState('');
    const endRef = useRef(null);

    useEffect(() => endRef.current?.scrollIntoView(), [messages]);

    const isGroup = chat.type === 'group';

    const handleSubmit = (e) => {
        e.preventDefault();
        onSend(text);
        setText('');
    };

    return (
        <div className="chat-view">
            <div className="chat-header">
                <button onClick={() => navigate(-1)} className="btn btn-ghost chat-back-btn">
                    <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
                </button>
                <div>
                    <div className="chat-title">{chat.name}</div>
                    <div className="chat-subtitle">
                        {isGroup ? `Host: ${chat.data.hostName}` : 'Private Conversation'}
                    </div>
                </div>
            </div>

            <div className="chat-messages">
                {messages.map((m) => (
                    <div key={m.id} style={{ alignSelf: m.senderId === user.id ? 'flex-end' : 'flex-start' }} className="message-bubble">
                        {isGroup && m.senderId !== user.id && (
                            <div className="message-sender">{m.senderName}</div>
                        )}
                        <div
                            className="message-content"
                            style={{
                                background: m.senderId === user.id ? 'var(--primary)' : 'white',
                                color: m.senderId === user.id ? 'white' : 'black',
                                border: m.senderId === user.id ? 'none' : '1px solid #e2e8f0',
                                borderBottomRightRadius: m.senderId === user.id ? '0' : '1rem',
                                borderBottomLeftRadius: m.senderId !== user.id ? '0' : '1rem'
                            }}
                        >
                            {m.text}
                        </div>
                    </div>
                ))}
                <div ref={endRef}></div>
            </div>

            <div className="chat-input-area">
                <form onSubmit={handleSubmit} className="chat-form">
                    <input
                        className="form-input chat-input"
                        placeholder="Message..."
                        value={text}
                        onChange={e => setText(e.target.value)}
                    />
                    <button className="btn btn-primary chat-send-btn"><Send size={18} /></button>
                </form>
            </div>
        </div>
    );
};

export default ChatView;
