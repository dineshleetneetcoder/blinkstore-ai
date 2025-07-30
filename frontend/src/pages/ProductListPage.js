import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductGrid from '../components/ProductGrid';

const ProductListPage = ({ category, onBackToHome }) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!category) return;

        const fetchProductsByCategory = async () => {
            setIsLoading(true);
            try {
                // This API call now includes the category query parameter.
                const response = await axios.get(`http://localhost:8080/api/v1/products?category=${encodeURIComponent(category)}`);
                setProducts(response.data);
            } catch (error) {
                console.error(`Failed to fetch products for category ${category}:`, error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProductsByCategory();
    }, [category]); // This effect re-runs whenever the category prop changes.

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
             <button onClick={onBackToHome} className="mb-4 text-green-600 hover:text-green-800 font-semibold">
                &larr; Back to Home
            </button>
            <ProductGrid title={category} products={products} isLoading={isLoading} />
        </div>
    );
};

export default ProductListPage;