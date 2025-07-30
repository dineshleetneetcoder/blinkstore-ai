import React, { useState } from 'react';
import { useAuth, useUser } from "@clerk/clerk-react";
import { useCart } from '../context/CartContext'; // Import the useCart hook
import axios from 'axios';

const ProductCard = ({ product }) => {
    const { getToken } = useAuth();
    const { isSignedIn } = useUser();
    const { addToCart, setIsCartOpen } = useCart(); // Get cart functions from context
    const [buttonText, setButtonText] = useState('Add');

    const handleAddToCart = async () => {
        if (!isSignedIn) {
            alert("Please sign in to add items to your cart.");
            return;
        }

        setButtonText('Adding...');
        const token = await getToken();

        try {
            await axios.post(
                'http://localhost:8080/api/v1/cart/add',
                { productId: product.id, quantity: 1 },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            // Update the global cart state instantly
            addToCart(product);

            setButtonText('Added!');
            setTimeout(() => setButtonText('Add'), 2000);
        } catch (error) {
            console.error("Failed to add to cart:", error);
            setButtonText('Error');
            setTimeout(() => setButtonText('Add'), 2000);
        }
    };

    // ... your JSX for the card ...
    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden group">
            <div className="relative h-40">
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
                <h4 className="text-md font-semibold text-gray-800 truncate">{product.name}</h4>
                <p className="text-sm text-gray-500">{product.unit || product.category}</p>
                <div className="flex items-center justify-between mt-4">
                    <span className="text-lg font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
                    <button
                        onClick={handleAddToCart}
                        className="border border-green-600 text-green-600 font-bold py-1 px-4 rounded-lg hover:bg-green-600 hover:text-white transition-colors disabled:bg-gray-300"
                        disabled={buttonText !== 'Add'}
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;