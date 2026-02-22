import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, X, Bot, User, Loader2 } from 'lucide-react';

const ChatInterface = ({ onClose }) => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hi there! I am brocode, your AI banking assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e?.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        const newMessages = [...messages, userMsg];

        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const res = await axios.post(`${API_URL}/api/chat`, {
                messages: newMessages
            }, { withCredentials: true });

            setMessages([...newMessages, { role: 'assistant', content: res.data.reply }]);
        } catch (error) {
            console.error(error);
            setMessages([...newMessages, { role: 'assistant', content: 'Oops! I am having trouble connecting to my brain right now. Please try again later.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chat-modal-overlay">
            <div className="chat-container">
                <div className="chat-header">
                    <div className="chat-header-info">
                        <Bot className="bot-icon-large" />
                        <div>
                            <h3>brocode Assistant</h3>
                            <span className="status-dot"></span> Online
                        </div>
                    </div>
                    <button onClick={onClose} className="close-btn"><X /></button>
                </div>

                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message-wrapper ${msg.role}`}>
                            <div className="message-avatar">
                                {msg.role === 'assistant' ? <Bot size={18} /> : <User size={18} />}
                            </div>
                            <div className={`message-bubble ${msg.role}`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="message-wrapper assistant">
                            <div className="message-avatar"><Bot size={18} /></div>
                            <div className="message-bubble assistant loading">
                                <Loader2 className="spinner" size={18} /> Thinking...
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form className="chat-input-area" onSubmit={handleSend}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask me anything about your finances..."
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading || !input.trim()}>
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatInterface;
