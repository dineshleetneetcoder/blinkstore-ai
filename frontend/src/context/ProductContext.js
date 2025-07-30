import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/v1/products');
                setProducts(response.data);
            } catch (error) {
                console.error("Failed to fetch all products:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllProducts();
    }, []);

    const getProductById = (productId) => {
        return products.find(p => p.id === productId);
    };

    const value = { products, isLoading, getProductById };

    return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

