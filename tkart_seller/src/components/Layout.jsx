// layout.jsx
import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiShoppingCart, FiUser, FiHome, FiShoppingBag, FiXCircle } from 'react-icons/fi';
import tklogo from './tklogo.png';

// Reusable Sidebar Component
const SidebarItem = ({ to, label, icon }) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-pink-50 rounded-lg transition-colors"
  >
    <span className="text-lg text-pink-500">{icon}</span>
    <span className="font-medium">{label}</span>
  </Link>
);

// Sidebar with pink theme accents
const Sidebar = ({ isOpen, closeSidebar }) => {
  const navigate = useNavigate();
  const icons = {
    home: <FiHome className="w-5 h-5 text-pink-500" />,
    upload: <FiShoppingBag className="w-5 h-5 text-pink-500" />,
    myproducts: <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    orders: <FiShoppingCart className="w-5 h-5 text-pink-500" />,
    profile: <FiUser className="w-5 h-5 text-pink-500" />,
    about: <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" /></svg>,
    logout: <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg>
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
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transition-all duration-300 z-40 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="h-16 flex items-center px-6 border-b border-pink-100">
          <h2 className="text-xl font-bold text-pink-700">Menu</h2>
          <button onClick={closeSidebar} className="ml-auto p-1 rounded-md hover:bg-gray-100">
            <FiXCircle className="text-gray-500" size={20} />
          </button>
        </div>
        
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
        <SidebarItem to="/home" label="Home" icon={icons.home} onClick={closeSidebar} />
          <SidebarItem to="/upload" label="Add Product" icon={icons.upload} onClick={closeSidebar} />
          <SidebarItem to="/myproducts" label="My Product" icon={icons.myproducts} onClick={closeSidebar} />
          <SidebarItem to="/orders" label="Orders" icon={icons.orders} onClick={closeSidebar} />
          <SidebarItem to="/profile" label="Profile" icon={icons.profile} onClick={closeSidebar} />
          <SidebarItem to="/about" label="about" icon={icons.about} onClick={closeSidebar} />

          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
          >
            <span className="text-lg">{icons.logout}</span>
            <span className="font-medium">Logout</span>
          </button>
       
        </div>
        
      </div>
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
        />
      )}
    </>
  );
};

// Navbar with pink theme
const Navbar = ({ toggleSidebar }) => (
  <header className="sticky top-0 z-30 bg-white shadow-sm border-b border-pink-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center">
          <Link to="/home" className="flex items-center">
            <img
              src={tklogo}
              alt="Logo"
              className="h-8 w-8"
            />
            <span className="ml-2 text-xl font-bold text-pink-700">Thirumathi Kart</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-pink-600 hidden sm:inline">Hi! Seller</span>
          
          <motion.img
            src="https://cdn-icons-png.flaticon.com/128/1828/1828859.png"
            alt="Menu"
            onClick={toggleSidebar}
            className="w-5 h-5 cursor-pointer filter grayscale hover:grayscale-0 transition"
            whileHover={{ scale: 1.2 }}
            style={{ display: 'block' }}
          />
        </div>
      </div>
    </div>
  </header>
);

// Mobile Bottom Navigation
const MobileBottomNav = () => (
  <div className="fixed sm:hidden bottom-0 left-0 right-0 bg-white border-t border-pink-200 shadow-lg z-50">
    <div className="flex justify-around items-center h-16">
      <Link to="/home" className="flex flex-col items-center justify-center p-1 text-pink-500">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span className="text-xs mt-0.5">Home</span>
      </Link>
      <Link to="/myproducts" className="flex flex-col items-center justify-center p-1 text-gray-600 hover:text-pink-500">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        <span className="text-xs mt-0.5">My Products</span>
      </Link>
      <Link
  to="/upload"
  className="sm:hidden flex items-center justify-center bg-pink-600 hover:bg-pink-500 text-white shadow-lg rounded-full p-4 transition transform hover:scale-105"
  title="Add Product"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
</Link>

      <Link to="/orders" className="flex flex-col items-center justify-center p-1 text-gray-600 hover:text-pink-500 relative">
        <div className="relative">
          <FiShoppingCart className="text-xl" />
          <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            3
          </span>
        </div>
        <span className="text-xs mt-0.5">Orders</span>
      </Link>
      <Link to="/Profile" className="flex flex-col items-center justify-center p-1 text-gray-600 hover:text-pink-500">
        <FiUser className="text-xl" />
        <span className="text-xs mt-0.5">Account</span>
      </Link>
    </div>
  </div>
);

// Main Layout Component
export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleSidebar={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <main className="pb-16 sm:pb-0"> {/* Padding bottom for mobile bottom nav */}
        <Outlet /> {/* This is where child routes will be rendered */}
      </main>

      <MobileBottomNav />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Customer Service</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/contact" className="text-sm text-gray-600 hover:text-pink-600">Contact Us</Link></li>
                <li><Link to="/faq" className="text-sm text-gray-600 hover:text-pink-600">FAQs</Link></li>
                <li><Link to="/returns" className="text-sm text-gray-600 hover:text-pink-600">Returns & Exchanges</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">About Us</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/about" className="text-sm text-gray-600 hover:text-pink-600">Our Story</Link></li>
                <li><Link to="/careers" className="text-sm text-gray-600 hover:text-pink-600">Careers</Link></li>
                <li><Link to="/blog" className="text-sm text-gray-600 hover:text-pink-600">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/privacy" className="text-sm text-gray-600 hover:text-pink-600">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-sm text-gray-600 hover:text-pink-600">Terms of Service</Link></li>
                <li><Link to="/shipping" className="text-sm text-gray-600 hover:text-pink-600">Shipping Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Connect With Us</h3>
              <div className="mt-4 flex space-x-4">
                {/* Social media links */}
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Thirumathi Kart. All rights reserved.
          </div>
        </div>
      </footer>
      
    </div>
  );
};
 export default Layout;