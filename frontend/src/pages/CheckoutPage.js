import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';

const CheckoutPage = ({ onNavigate }) => {
    const { cart, clearCart, cartQuantity } = useCart();
    const [address, setAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { getToken } = useAuth();

    const subtotal = cart ? cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0) : 0;

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!address.trim()) {
            setError('Please enter a delivery address.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const token = await getToken();
            await axios.post(
                'http://localhost:8080/api/v1/orders',
                { deliveryAddress: address },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            clearCart();
            onNavigate('orders'); // Navigate to the "My Orders" page
        } catch (err) {
            setError('Failed to place order. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-4xl px-4 py-8">
            <button onClick={() => onNavigate('home')} className="mb-4 text-green-600 hover:text-green-800 font-semibold">
                &larr; Continue Shopping
            </button>
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                    <div className="space-y-2">{/* ... order summary items ... */}</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Delivery Information</h2>
                    <form onSubmit={handlePlaceOrder}>{/* ... form ... */}</form>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
