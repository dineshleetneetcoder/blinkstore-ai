import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import AIChat from './components/AIChat';
import CartModal from './components/CartModal';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';

export default function App() {
    const [view, setView] = useState('home');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // State for the search query

    const navigateToCategory = (categoryName) => {
        setSearchQuery(''); // Clear search when navigating to a category
        setSelectedCategory(categoryName);
        setView('products');
    };

    const handleSearch = (query) => {
        setSelectedCategory(null); // Clear category when searching
        setSearchQuery(query);
        setView('products'); // Reuse the product list page for search results
    };
    
    const navigateToHome = () => {
        setSelectedCategory(null);
        setSearchQuery('');
        setView('home');
    }

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <Header onLogoClick={navigateToHome} onSearch={handleSearch} />
            <CartModal />
            <main>
                {view === 'home' && <HomePage onCategoryClick={navigateToCategory} />}
                {view === 'products' && (
                    <ProductListPage 
                        category={selectedCategory} 
                        searchQuery={searchQuery}
                        onBackToHome={navigateToHome} 
                    />
                )}
            </main>
            <AIChat />
            <Footer />
        </div>
    );
}