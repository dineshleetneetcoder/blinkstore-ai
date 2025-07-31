import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import apiClient from '../../api'; // Import our new API client

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { getToken } = useAuth();

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const token = await getToken();
            const response = await apiClient.get('/api/v1/admin/orders', { headers: { Authorization: `Bearer ${token}` } });
            setOrders(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (error) { console.error("Failed to fetch orders:", error); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchOrders(); }, [getToken]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const token = await getToken();
            await apiClient.put(`/api/v1/admin/orders/${orderId}/status`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
            fetchOrders();
        } catch (error) {
            console.error("Failed to update order status:", error);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Manage Orders</h1>
            <div className="space-y-4">
                {orders.map(order => (
                    <div key={order.id} className="bg-white p-4 rounded-lg shadow-md">
                        <div className="flex justify-between">
                            <div>
                                <p className="font-bold">Order #{order.id.slice(-6)}</p>
                                <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">Total: ₹{order.totalAmount.toFixed(2)}</p>
                                <p className="text-sm text-slate-500">User ID: {order.userId.slice(-6)}</p>
                            </div>
                        </div>
                        <div className="mt-2">
                            <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)} className="p-2 border rounded">
                                <option value="Placed">Placed</option>
                                <option value="Packed">Packed</option>
                                <option value="Dispatched">Dispatched</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminOrders;