import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeroSection from '../components/HeroSection';
import CategorySection from '../components/CategorySection';
import ProductGrid from '../components/ProductGrid';

const HomePage = ({ onNavigate }) => {
    const [trendingProducts, setTrendingProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/v1/products');
                setTrendingProducts(response.data.slice(0, 10)); 
            } catch (error) {
                console.error("Failed to fetch trending products:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <>
            <HeroSection />
            <CategorySection onNavigate={onNavigate} />
            <ProductGrid title="Trending Products" products={trendingProducts} isLoading={isLoading} />
        </>
    );
};

export default HomePage;
