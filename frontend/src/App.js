import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import AIChat from './components/AIChat';
import CartModal from './components/CartModal';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import CheckoutPage from './pages/CheckoutPage';
import MyOrdersPage from './pages/MyOrdersPage';

export default function App() {
    const [view, setView] = useState('home');
    const [context, setContext] = useState({});

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
            case 'home':
            default:
                return <HomePage onNavigate={navigate} />;
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <Header onNavigate={navigate} />
            <CartModal onNavigate={navigate} />
            <main>
                {renderView()}
            </main>
            <AIChat />
            <Footer />
        </div>
    );
}
