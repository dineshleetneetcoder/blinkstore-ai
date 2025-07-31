import React, { useState } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { SearchIcon, ShoppingCartIcon, UserIcon } from './Icons';
import { useCart } from '../context/CartContext';

const Header = ({ onNavigate, isAdmin }) => {
    const { cartQuantity, setIsCartOpen } = useCart();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            onNavigate('products', { search: searchTerm.trim() });
        }
    };

    return (
        <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <button onClick={() => onNavigate('home')} className="flex-shrink-0 flex items-center space-x-2">
                        <span className="text-2xl font-bold text-green-600">BlinkStore</span>
                        <span className="text-2xl font-light text-gray-700">.AI</span>
                    </button>

                    {/* Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-xl mx-8">
                        <form onSubmit={handleSearchSubmit} className="relative w-full">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon />
                            </div>
                            <input
                                type="text"
                                placeholder="Search for products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full bg-gray-100 border border-gray-200 rounded-lg py-2 pl-10 pr-3"
                            />
                        </form>
                    </div>

                    {/* Navigation & Actions */}
                    <div className="hidden md:flex items-center space-x-6">
                        {/* Admin Panel */}
                        {isAdmin && (
                            <button
                                onClick={() => onNavigate('admin')}
                                className="font-bold text-blue-600 hover:text-blue-800"
                            >
                                Admin Panel
                            </button>
                        )}

                        {/* My Orders */}
                        <button onClick={() => onNavigate('orders')} className="text-gray-600 hover:text-green-600">
                            My Orders
                        </button>

                        {/* Cart Button */}
                        <button onClick={() => setIsCartOpen(true)} className="relative text-gray-600 hover:text-green-600">
                            <ShoppingCartIcon />
                            {cartQuantity > 0 && (
                                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartQuantity}
                                </span>
                            )}
                        </button>

                        {/* User Auth */}
                        <SignedIn>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600">
                                    <UserIcon />
                                    <span>Login</span>
                                </button>
                            </SignInButton>
                        </SignedOut>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
