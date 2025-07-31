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
        if (!isSignedIn) { setCart({ items: [] }); return; }
        try {
            const token = await getToken();
            const response = await axios.get('http://localhost:8080/api/v1/cart', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCart(response.data);
        } catch (error) {
            if (error.response?.status === 404) setCart({ items: [] });
            else console.error('Failed to fetch cart:', error);
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
                const newItem = { productId: product.id, name: product.name, quantity: 1, price: product.price, imageUrl: product.imageUrl };
                newItems = [...(prevCart?.items || []), newItem];
            }
            return { ...prevCart, items: newItems };
        });
    };
    
    const updateItemQuantity = async (productId, quantity) => {
        if (!isSignedIn) return;
        if (quantity < 1) { // If quantity is less than 1, remove the item
            removeItem(productId);
            return;
        }
        try {
            const token = await getToken();
            const response = await axios.put('http://localhost:8080/api/v1/cart/item', 
                { productId, quantity },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCart(response.data);
        } catch (error) {
            console.error('Failed to update quantity:', error);
        }
    };

    const removeItem = async (productId) => {
        if (!isSignedIn) return;
        try {
            const token = await getToken();
            const response = await axios.delete(`http://localhost:8080/api/v1/cart/item/${productId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCart(response.data);
        } catch (error) {
            console.error('Failed to remove item:', error);
        }
    };

    const clearCart = async () => {
        if (!isSignedIn) return;
        try {
            const token = await getToken();
            await axios.delete('http://localhost:8080/api/v1/cart', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCart({ items: [] });
        } catch (error) {
            console.error('Failed to clear cart:', error);
        }
    };

    useEffect(() => { fetchCart(); }, [isSignedIn, getToken]);

    const cartQuantity = cart ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0;
    const value = { cart, isCartOpen, setIsCartOpen, cartQuantity, addToCart, fetchCart, clearCart, updateItemQuantity, removeItem };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
