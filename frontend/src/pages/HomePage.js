import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeroSection from '../components/HeroSection';
import CategorySection from '../components/CategorySection';
import ProductGrid from '../components/ProductGrid';

const HomePage = ({ onCategoryClick }) => {
    const [trendingProducts, setTrendingProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // For the homepage, we'll just fetch all products.
                const response = await axios.get('http://localhost:8080/api/v1/products');
                // Slice the array to show a limited number of trending items (e.g., 10).
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
            <CategorySection onCategoryClick={onCategoryClick} />
            <ProductGrid title="Trending Products" products={trendingProducts} isLoading={isLoading} />
        </>
    );
};

export default HomePage;

