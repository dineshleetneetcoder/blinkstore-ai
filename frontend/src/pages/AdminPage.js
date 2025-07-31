import React, { useState } from 'react';
import { useUser, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminProducts from '../components/admin/AdminProducts';
import AdminOrders from '../components/admin/AdminOrders';
import AdminAnalytics from '../components/admin/AdminAnalytics';

const AdminPage = ({ onNavigate }) => {
    const { user, isLoaded } = useUser();
    const [activeTab, setActiveTab] = useState('dashboard');

    if (!isLoaded) return <div>Loading...</div>;

    const isAdmin = user?.publicMetadata?.role === 'admin';

    const renderAdminContent = () => {
        if (!isAdmin) {
            return (
                <div className="text-center p-10">
                    <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
                    <p className="mt-2 text-slate-600">You do not have permission to view this page.</p>
                    <button onClick={() => onNavigate('home')} className="mt-4 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">Go to Homepage</button>
                </div>
            );
        }

        return (
            <div className="flex">
                {/* Sidebar Navigation */}
                <aside className="w-64 bg-slate-800 text-white p-4 shrink-0">
                    <h2 className="text-xl font-bold mb-6">Admin Menu</h2>
                    <nav className="space-y-2">
                        <button onClick={() => setActiveTab('dashboard')} className={`w-full text-left p-2 rounded-lg ${activeTab === 'dashboard' ? 'bg-slate-700' : 'hover:bg-slate-700'}`}>Dashboard</button>
                        <button onClick={() => setActiveTab('products')} className={`w-full text-left p-2 rounded-lg ${activeTab === 'products' ? 'bg-slate-700' : 'hover:bg-slate-700'}`}>Products</button>
                        <button onClick={() => setActiveTab('orders')} className={`w-full text-left p-2 rounded-lg ${activeTab === 'orders' ? 'bg-slate-700' : 'hover:bg-slate-700'}`}>Orders</button>
                        <button onClick={() => setActiveTab('analytics')} className={`w-full text-left p-2 rounded-lg ${activeTab === 'analytics' ? 'bg-slate-700' : 'hover:bg-slate-700'}`}>AI Analytics</button>
                    </nav>
                </aside>
                {/* Main Content */}
                <main className="flex-grow p-8 bg-slate-100">
                    {activeTab === 'dashboard' && <AdminDashboard />}
                    {activeTab === 'products' && <AdminProducts />}
                    {activeTab === 'orders' && <AdminOrders />}
                    {activeTab === 'analytics' && <AdminAnalytics />}
                </main>
            </div>
        );
    };

    return (
        <>
            <SignedIn>{renderAdminContent()}</SignedIn>
            <SignedOut><RedirectToSignIn /></SignedOut>
        </>
    );
};

export default AdminPage;