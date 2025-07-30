import React from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { ShoppingCartIcon, UserIcon } from './Icons';
import { useCart } from '../context/CartContext';

const Header = ({ onLogoClick }) => { // Accept onLogoClick prop
    const { cartQuantity, setIsCartOpen } = useCart();

    return (
        <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <button onClick={onLogoClick} className="flex-shrink-0 flex items-center space-x-2">
                        <span className="text-2xl font-bold text-green-600">BlinkStore</span>
                        <span className="text-2xl font-light text-gray-700">.AI</span>
                    </button>
                    {/* ... other header content ... */}
                     <div className="hidden md:flex items-center space-x-6">
                        <a href="#" className="text-gray-600 hover:text-green-600">Deals</a>
                        <a href="#" className="text-gray-600 hover:text-green-600">My Orders</a>
                        <button onClick={() => setIsCartOpen(true)} className="relative text-gray-600 hover:text-green-600 transition-colors">
                            <ShoppingCartIcon />
                            {cartQuantity > 0 && (
                                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartQuantity}
                                </span>
                            )}
                        </button>
                        <SignedIn><UserButton afterSignOutUrl="/" /></SignedIn>
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