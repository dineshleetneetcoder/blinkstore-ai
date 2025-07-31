import React from 'react';
import { useCart } from '../context/CartContext';
import Draggable from './Draggable';

const CartItem = ({ item, onUpdateQuantity, onRemoveItem }) => (
    <div className="flex items-center justify-between py-4 border-b border-slate-100">
        <div className="flex items-center gap-4">
            <img src={item.imageUrl || `https://placehold.co/64x64/E0E7FF/4F46E5?text=${item.name.charAt(0)}`} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-slate-100" />
            <div>
                <p className="font-semibold text-slate-800">{item.name}</p>
                <p className="text-sm text-slate-500">₹{item.price.toFixed(2)}</p>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex items-center border border-slate-200 rounded-lg">
                <button onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-l-md">-</button>
                <span className="px-3 text-sm font-medium">{item.quantity}</span>
                <button onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-r-md">+</button>
            </div>
            <button onClick={() => onRemoveItem(item.productId)} className="text-slate-400 hover:text-red-500 transition-colors" title="Remove item">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
        </div>
    </div>
);

const CartModal = ({ onNavigate }) => {
    const { cart, isCartOpen, setIsCartOpen, cartQuantity, clearCart, updateItemQuantity, removeItem } = useCart();
    
    if (!isCartOpen) return null;

    const subtotal = cart ? cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0) : 0;

    return (
        <Draggable initialPosition={{ x: window.innerWidth - 450, y: 50 }}>
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col h-[90vh] max-h-[700px]">
                <header className="p-6 border-b border-slate-200 flex justify-between items-center shrink-0 draggable-header cursor-move">
                    <h1 className="text-xl font-bold text-slate-800">Your Cart ({cartQuantity})</h1>
                    <button onClick={() => setIsCartOpen(false)} className="text-slate-500 hover:text-slate-800">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </header>
                <div className="flex-grow p-6 overflow-y-auto">
                    {cart && cart.items.length > 0 ? (
                        cart.items.map(item => (
                            <CartItem key={item.productId} item={item} onUpdateQuantity={updateItemQuantity} onRemoveItem={removeItem} />
                        ))
                    ) : (
                        <p className="text-center text-slate-500 mt-10">Your cart is empty.</p>
                    )}
                </div>
                <footer className="p-6 border-t border-slate-200 shrink-0">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-slate-500 font-medium">Subtotal</span>
                        <span className="text-slate-800 font-bold text-lg">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <button onClick={() => { setIsCartOpen(false); onNavigate('checkout'); }} className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600" disabled={!cartQuantity}>
                        Proceed to Checkout
                    </button>
                    <button onClick={clearCart} className="w-full mt-3 bg-transparent text-red-500 font-bold py-2" disabled={!cartQuantity}>
                        Clear Cart
                    </button>
                </footer>
            </div>
        </Draggable>
    );
};

export default CartModal;