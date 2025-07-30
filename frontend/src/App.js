import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CategorySection from './components/CategorySection';
import ProductSection from './components/ProductSection';
import Footer from './components/Footer';
import AIChat from './components/AIChat';
import CartModal from './components/CartModal'; // Import the new modal

export default function App() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/v1/products');
                setProducts(response.data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <Header />
            <CartModal /> {/* Add the CartModal here */}
            <main>
                <HeroSection />
                <CategorySection />
                <ProductSection products={products} isLoading={isLoading} />
            </main>
            <AIChat />
            <Footer />
        </div>
    );
}