import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { getToken, isSignedIn } = useAuth();

    const fetchCart = async () => {
        if (!isSignedIn) {
            setCart({ items: [] });
            return;
        };
        try {
            const token = await getToken();
            const response = await axios.get('http://localhost:8080/api/v1/cart', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCart(response.data);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setCart({ items: [] });
            } else {
                console.error('Failed to fetch cart:', error);
            }
        }
    };

    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.items.find(item => item.productId === product.id);
            let newItems;
            if (existingItem) {
                newItems = prevCart.items.map(item =>
                    item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                const newItem = { productId: product.id, name: product.name, quantity: 1, price: product.price };
                newItems = [...(prevCart?.items || []), newItem];
            }
            return { ...prevCart, items: newItems };
        });
    };
    
    const clearCart = () => {
        setCart({ items: [] });
    };

    useEffect(() => {
        fetchCart();
    }, [isSignedIn]);

    const cartQuantity = cart ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0;
    const value = { cart, addToCart, fetchCart, clearCart, cartQuantity, isCartOpen, setIsCartOpen };
    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};