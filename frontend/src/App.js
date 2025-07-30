import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Import all your new components
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CategorySection from './components/CategorySection';
import ProductSection from './components/ProductSection';
import Footer from './components/Footer';
import AIChat from './components/AIChat';

export default function App() {
    // State to hold products fetched from the backend
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // useEffect to fetch data when the component loads
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // API call to your running Java backend
                const response = await axios.get('http://localhost:8080/api/v1/products');
                setProducts(response.data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
                // You could set an error state here to show a message to the user
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []); // Empty array means this runs only once on mount

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <Header />
            <main>
                <HeroSection />
                <CategorySection />
                {/* Pass the real product data to the ProductSection */}
                <ProductSection products={products} isLoading={isLoading} />
            </main>
            <AIChat />
            <Footer />
        </div>
    );
}
