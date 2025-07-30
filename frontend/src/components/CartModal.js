import React from 'react';
import { useCart } from '../context/CartContext';
import { XIcon } from './Icons';

const CartModal = () => {
    const { cart, isCartOpen, setIsCartOpen, cartQuantity } = useCart();

    if (!isCartOpen) return null;

    const subtotal = cart ? cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0) : 0;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
            <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-bold">Your Cart ({cartQuantity})</h2>
                    <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-gray-800">
                        <XIcon />
                    </button>
                </div>

                {cart && cart.items.length > 0 ? (
                    <>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {cart.items.map(item => (
                                <div key={item.productId} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {item.quantity} x ₹{item.price.toFixed(2)}
                                        </p>
                                    </div>
                                    <p className="font-bold">₹{(item.quantity * item.price).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t">
                            <div className="flex justify-between font-bold text-lg mb-4">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <button className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700">
                                Proceed to Checkout
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-gray-500">Your cart is empty.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartModal;