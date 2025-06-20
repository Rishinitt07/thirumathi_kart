import React, { useState } from 'react';
import { FaTrash, FaCartPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


// Reusable Sidebar Component
const SidebarItem = ({ to, label, icon }) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
  >
    <span className="text-lg text-pink-500">{icon}</span>
    <span className="font-medium">{label}</span>
  </Link>
);

const Sidebar = ({ isOpen, closeSidebar }) => {
  const navigate = useNavigate();

  // Pink-themed SVG icons
  const icons = {
    home: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>
    ),
    categories: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    cart: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
      </svg>
    ),
    orders: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
      </svg>
    ),
    wishlist: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
      </svg>
    ),
    profile: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    ),
    logout: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
      </svg>
    )
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem('token');
      toast.success("Logged out successfully");
      navigate('/');
    }
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transition-all duration-300 z-40 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="h-16 flex items-center px-6 border-b">
          <h2 className="text-xl font-bold">Menu</h2>
        </div>
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          <SidebarItem to="/home" label="Home" icon={icons.home} />
          <SidebarItem to="/categories" label="Categories" icon={icons.categories} />
          <SidebarItem to="/cart" label="My Cart" icon={icons.cart} />
          <SidebarItem to="/orders" label="My Orders" icon={icons.orders} />
          <SidebarItem to="/wishlist" label="Wishlist" icon={icons.wishlist} />
          <SidebarItem to="/profile" label="Profile" icon={icons.profile} />
        </div>

        {/* Logout Button at Bottom */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <span className="text-lg text-red-600">{icons.logout}</span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-transparent bg-opacity-30 z-30 md:hidden"
        />
      )}
    </>
  );
};

// Enhanced Navbar Component
const Navbar = ({ toggleSidebar }) => (
  <header className="sticky top-0 z-30 bg-white shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center">
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
          <motion.img
            src="https://cdn-icons-png.flaticon.com/128/1828/1828859.png"
            alt="Menu"
            onClick={toggleSidebar}
            className="w-5 h-5 cursor-pointer filter grayscale"
            whileHover={{ scale: 1.2 }}
            style={{ display: 'block' }} // ✅ force visibility
          />

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
      <footer className="mt-99 text-center text-sm py-3 text-gray-500 border-t">
        Copyright © 2025 Thirumathi Kart. All Rights Reserved.
      </footer>

    </div>
  );
};

export default Wishlist;
