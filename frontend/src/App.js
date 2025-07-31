import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

import Header from './components/Header';
import Footer from './components/Footer';
import AIChat from './components/AIChat';
import CartModal from './components/CartModal';
import Toast from './components/Toast';

import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import CheckoutPage from './pages/CheckoutPage';
import MyOrdersPage from './pages/MyOrdersPage';
import AdminPage from './pages/AdminPage'; // 👈 Added AdminPage

export default function App() {
    const [view, setView] = useState('home');
    const [context, setContext] = useState({});
    const [toast, setToast] = useState({ message: '', show: false });

    const { isSignedIn, user, isLoaded } = useUser();
    const isAdmin = user?.publicMetadata?.role === 'admin'; // 👈 Determine admin role

    useEffect(() => {
        const welcomeTimer = setTimeout(() => {
            if (isLoaded && !isSignedIn) {
                showToast("👋 Welcome! Ask our AI assistant for help anytime.");
            }
        }, 2000);
        return () => clearTimeout(welcomeTimer);
    }, [isLoaded, isSignedIn]);

    useEffect(() => {
        if (isSignedIn && user) {
            showToast(`Welcome back, ${user.firstName}! 🚀`);
        }
    }, [isSignedIn, user]);

    const showToast = (message) => {
        setToast({ message, show: true });
    };

    const navigate = (targetView, data = {}) => {
        setView(targetView);
        setContext(data);
    };

    const renderView = () => {
        switch (view) {
            case 'products':
                return <ProductListPage context={context} onNavigate={navigate} />;
            case 'checkout':
                return <CheckoutPage onNavigate={navigate} />;
            case 'orders':
                return <MyOrdersPage onNavigate={navigate} />;
            case 'admin': // 👈 Admin case
                return <AdminPage onNavigate={navigate} />;
            case 'home':
            default:
                return <HomePage onNavigate={navigate} />;
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <Toast
                message={toast.message}
                show={toast.show}
                onHide={() => setToast({ ...toast, show: false })}
            />
            <Header onNavigate={navigate} isAdmin={isAdmin} /> {/* 👈 Pass isAdmin */}
            <CartModal onNavigate={navigate} />
            <main>{renderView()}</main>
            <AIChat />
            <Footer />
        </div>
    );
}
