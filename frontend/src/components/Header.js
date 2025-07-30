import React, { useState } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { SearchIcon, ShoppingCartIcon, UserIcon, MenuIcon } from './Icons'; // Assuming Icons.js exists

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <a href="/" className="flex-shrink-0 flex items-center space-x-2">
                        <span className="text-2xl font-bold text-green-600">BlinkStore</span>
                        <span className="text-2xl font-light text-gray-700">.AI</span>
                    </a>

                    {/* Desktop Search */}
                    <div className="hidden md:flex flex-1 max-w-xl mx-8">
                         {/* Search bar can be made functional later */}
                    </div>

                    {/* Desktop Nav & Actions */}
                    <div className="hidden md:flex items-center space-x-6">
                        <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Deals</a>
                        <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">My Orders</a>
                        <button className="relative text-gray-600 hover:text-green-600 transition-colors">
                            <ShoppingCartIcon />
                            {/* Cart count can be made dynamic later */}
                            <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
                        </button>
                        
                        {/* === CLERK INTEGRATION START === */}
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors">
                                    <UserIcon />
                                    <span>Login</span>
                                </button>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>
                        {/* === CLERK INTEGRATION END === */}

                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-green-600">
                            <MenuIcon />
                        </button>
                    </div>
                </div>
            </div>
            {/* Mobile Menu (can be enhanced with Clerk later) */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    {/* ... your mobile menu code ... */}
                </div>
            )}
        </header>
    );
};

export default Header;