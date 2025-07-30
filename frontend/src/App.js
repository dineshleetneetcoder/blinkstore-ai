import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import AIChat from './components/AIChat';
import CartModal from './components/CartModal';
import HomePage from './pages/HomePage'; // Import new HomePage
import ProductListPage from './pages/ProductListPage'; // Import new ProductListPage

export default function App() {
    // 'view' controls which page is shown. 'home' or 'products'.
    const [view, setView] = useState('home'); 
    // 'selectedCategory' holds the category the user clicked on.
    const [selectedCategory, setSelectedCategory] = useState(null);

    // This function is passed to other components to allow them to change the view.
    const navigateToCategory = (categoryName) => {
        setSelectedCategory(categoryName);
        setView('products');
    };
    
    const navigateToHome = () => {
        setSelectedCategory(null);
        setView('home');
    }

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <Header onLogoClick={navigateToHome} />
            <CartModal />
            <main>
                {/* Conditional rendering: show a page based on the 'view' state */}
                {view === 'home' && <HomePage onCategoryClick={navigateToCategory} />}
                {view === 'products' && <ProductListPage category={selectedCategory} onBackToHome={navigateToHome} />}
            </main>
            <AIChat />
            <Footer />
        </div>
    );
}
