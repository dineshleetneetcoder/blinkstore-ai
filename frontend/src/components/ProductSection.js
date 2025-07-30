import React from 'react';
import ProductCard from './ProductCard';

const ProductSection = ({ products, isLoading }) => {
    return (
        <section className="py-12 md:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900">Trending Products</h2>
                
                {isLoading ? (
                    <div className="text-center mt-8">Loading...</div>
                ) : (
                    <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                        {products.map(prod => <ProductCard key={prod.id} product={prod} />)}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProductSection;