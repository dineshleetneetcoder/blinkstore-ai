import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';

const MyOrdersPage = ({ onNavigate }) => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { getToken } = useAuth();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = await getToken();
                const response = await axios.get('http://localhost:8080/api/v1/orders', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            } finally {
                setIsLoading(false);
            }
        };
        if (getToken) fetchOrders();
    }, [getToken]);

    return (
        <div className="container mx-auto max-w-4xl px-4 py-8">
            <button onClick={() => onNavigate('home')} className="mb-4 text-green-600 hover:text-green-800 font-semibold">
                &larr; Back to Home
            </button>
            <h1 className="text-3xl font-bold mb-6">My Orders</h1>
            {isLoading ? (
                <p>Loading orders...</p>
            ) : orders.length > 0 ? (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-lg">Order #{order.id.slice(-6)}</p>
                                    <p className="text-sm text-gray-500">
                                        Placed on: {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className="bg-green-100 text-green-800 font-semibold px-3 py-1 rounded-full text-sm">
                                    {order.status}
                                </span>
                            </div>
                            <hr className="my-4" />
                            <div className="space-y-2">
                                {order.items.map(item => (
                                    <div key={item.productId} className="flex justify-between text-gray-700">
                                        <span>{item.name} x {item.quantity}</span>
                                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <hr className="my-4" />
                            <div className="text-right">
                                <p className="font-bold text-lg">Total: ₹{order.totalAmount.toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>You haven't placed any orders yet.</p>
            )}
        </div>
    );
};

export default MyOrdersPage;
