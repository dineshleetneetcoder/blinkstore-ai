import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import apiClient from '../../api'; // Import our new API client

const StatCard = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
        <div className="bg-blue-100 text-blue-600 p-3 rounded-full">{icon}</div>
        <div>
            <p className="text-sm text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalProducts: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const { getToken } = useAuth();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = await getToken();
                const config = { headers: { Authorization: `Bearer ${token}` } };
                
                const [ordersRes, productsRes] = await Promise.all([
                    apiClient.get('/api/v1/admin/orders', config),
                    apiClient.get('/api/v1/products', config) // Public endpoint, but good practice to send token
                ]);
                
                const totalRevenue = ordersRes.data.reduce((sum, order) => sum + order.totalAmount, 0);
                const totalOrders = ordersRes.data.length;
                const totalProducts = productsRes.data.length;

                setStats({ totalRevenue, totalOrders, totalProducts });
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, [getToken]);

    if (isLoading) return <div>Loading dashboard...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toFixed(2)}`} icon={'💰'} />
                <StatCard title="Total Orders" value={stats.totalOrders} icon={'📦'} />
                <StatCard title="Total Products" value={stats.totalProducts} icon={'🍎'} />
            </div>
        </div>
    );
};

export default AdminDashboard;

