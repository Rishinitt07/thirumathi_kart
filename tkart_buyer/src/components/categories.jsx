import React, { useEffect, useState } from 'react';

// Dummy static data (replace with actual API call if needed)
const dummySubCategories = [
    'Electronics', 'Clothing', 'Books', 'Furniture', 'Beauty',
    'Toys', 'Groceries', 'Sports', 'Automotive', 'Jewelry'
];

const dummyProducts = Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: `${(i + 1) * 99}₹`,
    image: '',
}));

const Categories = () => {
    const [subCategories, setSubCategories] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Simulate API calls
        setSubCategories(dummySubCategories);
        setProducts(dummyProducts);
    }, []);

    return (
        <div className="min-h-screen bg-white text-black font-sans">
            {/* Navbar */}
            <header className="flex items-center justify-between px-6 py-3 border-b shadow-md sticky top-0 bg-white z-50">
                <div className="flex items-center gap-4">
                    <span className="text-xl font-bold">🛒 Thirumathi Kart</span>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="border px-4 py-1 rounded-md w-64"
                        />
                        <img
                            src="https://i.pinimgproxy.com/?url=aHR0cHM6Ly9jZG4taWNvbnMtcG5nLmZsYXRpY29uLmNvbS8yNTYvOTU0Lzk1NDU5MS5wbmc=&ts=1749492863&sig=c91ece3551bae0771addaed2ba6e4855ae62155f0dbeb170a0c1001196338908" // ✅ Replace with your actual image path or URL
                            alt="Search"
                            className="absolute right-3 top-1.5 w-4 h-4"
                        />
                    </div>
                </div>
                <nav className="flex items-center space-x-6 text-sm">
                    <a href="/Home" className="hover:underline">Home</a>
                    <a href="/categories" className="hover:underline">Cart</a>
                    <a href="/cart" className="hover:underline">🛒</a>
                </nav>
            </header>

            {/* Main Content */}
            <main className="px-6 py-6">
                {/* Sub Categories Section */}
                <section className="mb-10">
                    <h2 className="text-xl font-semibold mb-6">Sub Categories</h2>
                    <div className="flex gap-6 flex-wrap">
                        {subCategories.map((category, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center"
                            >
                                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center shadow-sm">
                                    <span className="text-sm text-gray-600">📦</span>
                                </div>
                                <span className="mt-2 text-xs text-gray-700 text-center max-w-[70px] truncate">
                                    {category}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Products Section */}
                <section>
                    <h2 className="text-xl font-semibold mb-6">Products</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {products.map(product => (
                            <div
                                key={product.id}
                                className="bg-gray-100 p-4 rounded-xl shadow hover:shadow-lg transition-all"
                            >
                                <div className="aspect-square bg-white rounded-md mb-3 flex items-center justify-center">
                                    <span className="text-gray-400 text-3xl">📷</span>
                                </div>
                                <div className="text-center">
                                    <h3 className="text-sm font-medium text-gray-800 truncate">
                                        {product.name}
                                    </h3>
                                    <p className="text-xs text-gray-600 mt-1">{product.price}</p>
                                    <button className="mt-2 text-xs px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="text-center py-6 text-sm text-gray-500 border-t mt-12">
                <p>Copyright 2025 © Thirumathi Kart All Right Reserved.</p>
            </footer>
        </div>
    );
};

export default Categories;
