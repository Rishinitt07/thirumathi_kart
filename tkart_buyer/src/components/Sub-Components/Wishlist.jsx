import React, { useState } from 'react';
import { FaTrash, FaCartPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Reusable Sidebar Component
const SidebarItem = ({ to, label, icon }) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
  >
    <span className="text-lg">{icon}</span>
    <span className="font-medium">{label}</span>
  </Link>
);

const Sidebar = ({ isOpen, closeSidebar }) => (
  <>
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transition-all duration-300 z-40 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="h-16 flex items-center px-6 border-b">
        <h2 className="text-xl font-bold">Menu</h2>
      </div>
      <div className="p-4 space-y-2 mt-4">
        <SidebarItem to="/home" label="Home" icon="🏠" />
        <SidebarItem to="/categories" label="Categories" icon="🗂️" />
        <SidebarItem to="/cart" label="My Cart" icon="🛒" />
        <SidebarItem to="/orders" label="My Orders" icon="📦" />
        <SidebarItem to="/wishlist" label="Wishlist" icon="❤️" />
        <SidebarItem to="/profile" label="Profile" icon="👤" />
      </div>
    </div>
    {isOpen && (
      <div
        onClick={closeSidebar}
        className="fixed inset-0 bg-transparent bg-opacity-50 z-30 md:hidden"
      />
    )}
  </>
);

// Enhanced Navbar Component
const Navbar = ({ toggleSidebar }) => (
  <header className="sticky top-0 z-30 bg-white shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="mr-4 text-gray-500 hover:text-gray-600 md:hidden"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link to="/home" className="flex items-center">
            <img
              src="https://thirumathikart.nitt.edu/assets/img/tklogo.png"
              alt="Logo"
              className="h-8 w-8"
            />
            <span className="ml-2 text-xl font-bold text-gray-800">Thirumathi Kart</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600 hidden sm:inline">Hi! Buyer</span>
          <Link to="/cart" className="p-1 text-gray-500 hover:text-gray-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  </header>
);

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  React.useEffect(() => {
    const stored = localStorage.getItem('wishlist');
    if (stored) {
      setWishlist(JSON.parse(stored));
    }
  }, []);

  const handleRemove = (id) => {
    const updated = wishlist.filter(item => item.id !== id);
    setWishlist(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
  };

  const handleAddToCart = (item) => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = storedCart.find(i => i.name === item.name);

    const updatedCart = existing
      ? storedCart.map(i =>
        i.name === item.name ? { ...i, qty: i.qty + 1 } : i
      )
      : [...storedCart, { ...item, qty: 1 }];

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    alert(`${item.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-josefin">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
      <main className="max-w-7xl mx-auto p-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Your Wishlist</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.length === 0 ? (
            <p className="text-gray-500 col-span-full">Your wishlist is empty.</p>
          ) : (
            wishlist.map(item => (
             <div key={`${item.id}-${item.name}`} className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between">
                <div>
                  <div className="w-full h-40 bg-gray-200 rounded mb-4 flex items-center justify-center text-4xl">
                    📦
                  </div>
                  <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                  <p className="text-yellow-500 text-sm mt-1">
                    {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                  </p>
                  <p className="text-gray-700 font-medium mt-2">₹ {item.price || 'N/A'}</p>

                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200"
                  >
                    <FaTrash /> Remove
                  </button>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded hover:bg-green-200"
                  >
                    <FaCartPlus /> Add Cart
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
     <footer className="mt-85 text-center text-sm py-3 text-gray-500 border-t">
        Copyright © 2025 Thirumathi Kart. All Rights Reserved.
      </footer>

    </div>
  );
};

export default Wishlist;
