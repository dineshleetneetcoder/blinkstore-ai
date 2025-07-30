import React from 'react';

const HeroSection = () => {
    const handleShopNowClick = () => {
        // This finds the element with the id 'trending-products' and scrolls to it.
        document.getElementById('trending-products')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="bg-green-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-center">
                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                    Groceries delivered to your doorstep <span className="text-green-600">in minutes.</span>
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-600">
                    Your favourite local store, now online. Fresh produce, daily essentials, and more.
                </p>
                <div className="mt-8 flex justify-center">
                    <button 
                        onClick={handleShopNowClick}
                        className="bg-green-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-green-700 transition-transform transform hover:scale-105 shadow-lg">
                        Shop Now
                    </button>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;