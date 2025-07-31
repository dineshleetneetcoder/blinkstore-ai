import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { useAuth, useUser } from '@clerk/clerk-react';
import { MessageSquareIcon, XIcon } from './Icons';
import Draggable from './Draggable';

const SendIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
);

const AIChat = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([ { sender: 'ai', text: 'Hi! How can I help you today?' } ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [actionableProducts, setActionableProducts] = useState([]);
    const { addToCart } = useCart();
    const { getProductById } = useProducts();
    const { getToken } = useAuth();
    const { isSignedIn } = useUser();
    const chatEndRef = useRef(null);

    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const textToSend = inputValue.trim();
        if (!textToSend || isLoading) return;

        const userMessage = { sender: 'user', text: textToSend };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);
        setActionableProducts([]);

        try {
            const history = messages.slice(-5).map(msg => ({ sender: msg.sender, text: msg.text }));
            history.push({ sender: 'user', text: textToSend });

            const response = await axios.post('http://localhost:8080/api/v1/ai/chat', { history });
            
            const aiResponse = response.data;
            const aiMessage = { sender: 'ai', text: aiResponse.responseText };
            setMessages(prev => [...prev, aiMessage]);

            if (aiResponse.actionableProducts && aiResponse.actionableProducts.length > 0) {
                setActionableProducts(aiResponse.actionableProducts);
            }
        } catch (error) {
            console.error("Error with AI Service:", error);
            const errorMessage = { sender: 'ai', text: "Sorry, I'm having a little trouble thinking right now." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleConfirmAddToCart = async () => {
        if (!isSignedIn) {
            alert("Please sign in to add items to your cart.");
            setActionableProducts([]);
            return;
        }
        if (!actionableProducts.length) return;

        const token = await getToken();
        
        for (const actionableProduct of actionableProducts) {
            const fullProduct = getProductById(actionableProduct.productId);
            if (fullProduct) {
                try {
                    await axios.post(
                        'http://localhost:8080/api/v1/cart/add',
                        { productId: fullProduct.id, quantity: 1 },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    addToCart(fullProduct);
                } catch (error) {
                    console.error(`Failed to add ${fullProduct.name} to cart:`, error);
                }
            }
        }

        const successMessage = { sender: 'ai', text: `Okay, I've added ${actionableProducts.length} item(s) to your cart!` };
        setMessages(prev => [...prev, successMessage]);
        setActionableProducts([]);
    };

    return (
        <>
            <button onClick={() => setIsChatOpen(true)} className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg z-40">
                <MessageSquareIcon />
            </button>
            {isChatOpen && (
                <Draggable initialPosition={{ x: window.innerWidth - 450, y: window.innerHeight - 560 }}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col h-[32rem]">
                        <div className="flex items-center justify-between p-4 border-b draggable-header cursor-move">
                            <h3 className="text-lg font-bold text-gray-800">BlinkStore AI Assistant</h3>
                            <button onClick={() => setIsChatOpen(false)} className="text-gray-400 hover:text-gray-600"><XIcon /></button>
                        </div>
                        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`${msg.sender === 'user' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800'} p-3 rounded-lg max-w-xs whitespace-pre-wrap`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && <div className="flex justify-start"><div className="bg-gray-100 p-3 rounded-lg"><span className="animate-pulse">...</span></div></div>}
                            <div ref={chatEndRef} />
                        </div>
                        {actionableProducts.length > 0 && (
                            <div className="p-4 border-t">
                                <button onClick={handleConfirmAddToCart} className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600">
                                    Yes, add {actionableProducts.length} item(s) to cart
                                </button>
                            </div>
                        )}
                        <form onSubmit={handleSendMessage} className="p-4 border-t flex items-center">
                            <input type="text" placeholder="Type your message..." className="w-full border-gray-300 rounded-lg" value={inputValue} onChange={(e) => setInputValue(e.target.value)} disabled={isLoading} autoFocus />
                            <button type="submit" className="ml-3 bg-green-600 text-white p-3 rounded-lg" disabled={isLoading || !inputValue.trim()}>
                                <SendIcon />
                            </button>
                        </form>
                    </div>
                </Draggable>
            )}
        </>
    );
};

export default AIChat;