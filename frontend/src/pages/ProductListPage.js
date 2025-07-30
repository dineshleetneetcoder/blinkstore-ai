import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductGrid from '../components/ProductGrid';

const ProductListPage = ({ category, searchQuery, onBackToHome }) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [title, setTitle] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            let url = 'http://localhost:8080/api/v1/products';
            let params = {};

            if (searchQuery) {
                params.search = searchQuery;
                setTitle(`Search results for "${searchQuery}"`);
            } else if (category) {
                params.category = category;
                setTitle(category);
            }

            try {
                const response = await axios.get(url, { params });
                setProducts(response.data);
            } catch (error) {
                console.error(`Failed to fetch products:`, error);
                setProducts([]); // Clear products on error
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [category, searchQuery]);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
             <button onClick={onBackToHome} className="mb-4 text-green-600 hover:text-green-800 font-semibold">
                &larr; Back to Home
            </button>
            <ProductGrid title={title} products={products} isLoading={isLoading} />
        </div>
    );
};

export default ProductListPage;
