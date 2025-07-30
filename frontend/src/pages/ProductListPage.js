import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductGrid from '../components/ProductGrid';

const ProductListPage = ({ context, onNavigate }) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [title, setTitle] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            let url = 'http://localhost:8080/api/v1/products';
            let params = {};

            if (context.search) {
                params.search = context.search;
                setTitle(`Search results for "${context.search}"`);
            } else if (context.category) {
                params.category = context.category;
                setTitle(context.category);
            }

            try {
                const response = await axios.get(url, { params });
                setProducts(response.data);
            } catch (error) {
                console.error(`Failed to fetch products:`, error);
                setProducts([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [context]);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
             <button onClick={() => onNavigate('home')} className="mb-4 text-green-600 hover:text-green-800 font-semibold">
                &larr; Back to Home
            </button>
            <ProductGrid title={title} products={products} isLoading={isLoading} />
        </div>
    );
};

export default ProductListPage;