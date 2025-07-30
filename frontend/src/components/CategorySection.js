import React from 'react';

// Mock data for categories - this can be moved or fetched from an API later
const categories = [
    { name: 'Fruits & Vegetables', image: 'https://placehold.co/400x400/84CC16/FFFFFF?text=Fruits' },
    { name: 'Dairy & Bread', image: 'https://placehold.co/400x400/FBBF24/FFFFFF?text=Dairy' },
    { name: 'Snacks & Munchies', image: 'https://placehold.co/400x400/F97316/FFFFFF?text=Snacks' },
    { name: 'Cold Drinks & Juices', image: 'https://placehold.co/400x400/3B82F6/FFFFFF?text=Drinks' },
    { name: 'Instant & Frozen Food', image: 'https://placehold.co/400x400/6366F1/FFFFFF?text=Frozen' },
    { name: 'Tea, Coffee & More', image: 'https://placehold.co/400x400/A855F7/FFFFFF?text=Beverages' },
];

const CategoryCard = ({ category }) => (
    <div className="group text-center">
        <div className="w-28 h-28 md:w-40 md:h-40 mx-auto rounded-full overflow-hidden shadow-md group-hover:shadow-xl transition-shadow transform group-hover:-translate-y-1">
            <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
        </div>
        <h3 className="mt-4 text-sm md:text-base font-semibold text-gray-800">{category.name}</h3>
    </div>
);

const CategorySection = () => (
    <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900">Shop by Category</h2>
            <div className="mt-8 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 md:gap-8">
                {categories.map(cat => <CategoryCard key={cat.name} category={cat} />)}
            </div>
        </div>
    </section>
);

export default CategorySection;
