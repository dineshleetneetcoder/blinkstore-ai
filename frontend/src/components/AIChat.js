import React, { useState, useEffect, useRef } from 'react';
import { MessageSquareIcon, XIcon } from './Icons';

// Helper component for the Send Icon
const SendIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
);

// THE FIX: The Modal is now its own component, outside of AIChat.
// This prevents it from being re-created every time you type.
const AIChatModal = ({
    isOpen,
    onClose,
    messages,
    isLoading,
    chatEndRef,
    inputValue,
    onInputChange,
    onSendMessage
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center transition-opacity">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-transform">
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center space-x-3">
                        <span className="bg-green-100 p-2 rounded-full"><MessageSquareIcon className="text-green-600" /></span>
                        <h3 className="text-lg font-bold text-gray-800">BlinkStore AI Assistant</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XIcon /></button>
                </div>
                <div className="p-6 h-96 flex flex-col">
                    <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`${msg.sender === 'user' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800'} p-3 rounded-lg max-w-xs whitespace-pre-wrap`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start"><div className="bg-gray-100 text-gray-800 p-3 rounded-lg"><span className="animate-pulse">...</span></div></div>
                        )}
                        <div ref={chatEndRef} />
                    </div>
                    <form onSubmit={onSendMessage} className="mt-4 flex items-center">
                        <input
                            type="text"
                            placeholder="Type your message..."
                            className="w-full border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                            value={inputValue}
                            onChange={onInputChange}
                            disabled={isLoading}
                            autoFocus
                        />
                        <button type="submit" className="ml-3 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 disabled:bg-green-300" disabled={isLoading || !inputValue.trim()}>
                            <SendIcon />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};


// This is the main component that manages the state and logic.
const AIChat = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'ai', text: 'Hi! How can I help you today? Ask me anything like "What do I need for a healthy breakfast?"' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const textToSend = inputValue.trim();
        if (!textToSend || isLoading) return;

        const userMessage = { sender: 'user', text: textToSend };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const prompt = `You are BlinkStore.AI, a helpful grocery assistant. A user is asking: "${textToSend}". Based on typical grocery store inventory, provide a helpful response.`;
            const apiKey = "AIzaSyA3PWiUSjaDfGVr6bF2ktB7G39jpUsYXbc";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] })
            });

            if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
            const result = await response.json();
            const aiText = result.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't think of a response.";
            setMessages(prev => [...prev, { sender: 'ai', text: aiText }]);

        } catch (error) {
            console.error("Error calling Gemini API:", error);
            setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I'm having trouble connecting. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button onClick={() => setIsChatOpen(true)} className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-transform transform hover:scale-110 z-50" aria-label="Open AI Assistant">
                <MessageSquareIcon />
            </button>
            <AIChatModal
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                messages={messages}
                isLoading={isLoading}
                chatEndRef={chatEndRef}
                inputValue={inputValue}
                onInputChange={(e) => setInputValue(e.target.value)}
                onSendMessage={handleSendMessage}
            />
        </>
    );
};

export default AIChat;
