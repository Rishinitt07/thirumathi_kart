// layout.jsx
import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';


import axios from 'axios';
import { FiShoppingCart, FiUser, FiHome, FiShoppingBag, FiXCircle } from 'react-icons/fi';
import tklogo from '../assets/tklogo.png';




// Reusable Sidebar Component
const Bounce = null;
const toast = {
  success: (msg) => console.log(msg),
  error: (msg) => console.log(msg),
  info: (msg) => console.log(msg),
  warn: (msg) => console.log(msg)
};

const SidebarItem = ({ to, label, icon, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `group flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 font-normal relative overflow-hidden ${
        isActive
          ? 'text-white shadow-lg shadow-hotpink-500/30'
          : 'text-gray-600 hover:bg-hotpink-50 hover:text-hotpink-600'
      }`
    }
  >
    {({ isActive }) => (
      <>
        {isActive && (
          <motion.div
            layoutId="active-sidebar-bg"
            className="absolute inset-0 bg-gradient-to-r from-hotpink-500 to-hotpink-600 -z-10"
            initial={false}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        <span className={`text-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 z-10 ${isActive ? 'text-white drop-shadow-sm' : 'text-hotpink-500'}`}>
          {icon}
        </span>
        <span className="transition-transform duration-300 group-hover:translate-x-1 z-10 tracking-wide">{label}</span>
      </>
    )}
  </NavLink>
);

// Sidebar with pink theme accents
const Sidebar = ({ isOpen, closeSidebar }) => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get("http://localhost:8080/profile", {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => {
        const name = res.data?.name || "Guest";
        setFirstName(name.split(" ")[0]);
      }).catch(() => {});
    }
  }, []);
  const icons = {
    home: <FiHome className="w-5 h-5 text-hotpink-500" />,
    upload: <FiShoppingBag className="w-5 h-5 text-hotpink-500" />,
    myproducts: <svg className="w-5 h-5 text-hotpink-500" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    orders: <FiShoppingCart className="w-5 h-5 text-hotpink-500" />,
    profile: <FiUser className="w-5 h-5 text-hotpink-500" />,
    about: <svg className="w-5 h-5 text-hotpink-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" /></svg>,
    logout: <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg>
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem('token');
      void 0;
      navigate('/');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
            className="fixed inset-0 bg-black/40 z-40"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-[280px] bg-white/90 backdrop-blur-xl shadow-2xl border-r border-white/20 z-50 flex flex-col overflow-hidden"
          >
            {/* Header / Profile Summary */}
            <div className="relative p-6 bg-gradient-to-br from-hotpink-50 to-white border-b border-hotpink-100/50">
              <button onClick={closeSidebar} className="absolute top-4 right-4 p-2 rounded-full hover:bg-hotpink-100 text-hotpink-400 hover:text-hotpink-600 transition-colors md:hidden">
                <FiXCircle size={24} />
              </button>
              <div className="flex items-center gap-4 mt-2">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-hotpink-400 to-hotpink-600 p-0.5 shadow-lg shadow-hotpink-500/20">
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center border-2 border-white overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Seller" alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-normal text-gray-800 tracking-tight">Hello!</h2>
                  <p className="text-sm font-normal text-hotpink-500 tracking-widest">{firstName || "Guest"}</p>
                </div>
              </div>
            </div>
            
            {/* Navigation Links */}
            <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
              <SidebarItem to="/home" label="Dashboard" icon={icons.home} onClick={closeSidebar} />
              <SidebarItem to="/upload" label="Add Product" icon={icons.upload} onClick={closeSidebar} />
              <SidebarItem to="/myproducts" label="My Products" icon={icons.myproducts} onClick={closeSidebar} />
              <SidebarItem to="/orders" label="Orders" icon={icons.orders} onClick={closeSidebar} />
              <div className="my-4 border-t border-gray-100/80"></div>
              <SidebarItem to="/profile" label="Profile" icon={icons.profile} onClick={closeSidebar} />
              <SidebarItem to="/about" label="About Us" icon={icons.about} onClick={closeSidebar} />
            </div>
            
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Navbar with pink theme
const Navbar = ({ toggleSidebar }) => {
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    axios.get("http://localhost:8080/profile", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      const name = res.data?.name || "";
      setFirstName(name.split(" ")[0]);
    }).catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md shadow-sm border-b border-hotpink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/home" className="flex items-center">
              <img
                src={tklogo}
                alt="Logo"
                className="h-10 w-10 drop-shadow-sm"
              />
              <span className="ml-3 text-2xl font-normal text-transparent bg-clip-text bg-gradient-to-r from-hotpink-500 to-hotpink-700 notranslate" style={{ fontFamily: 'inherit', fontSize: '1.5rem' }}>TKart</span>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <span className="text-sm font-normal text-hotpink-600 hidden sm:inline">
              Hi! {firstName || "Seller"}
            </span>
            
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
};

// Mobile Bottom Navigation
const MobileBottomNav = () => (
  <div className="fixed sm:hidden bottom-0 left-0 right-0 bg-white border-t border-hotpink-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
    <div className="flex justify-around items-center h-16">
      <Link to="/home" className="flex flex-col items-center justify-center p-1 text-hotpink-500">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span className="text-xs mt-0.5">Home</span>
      </Link>
      <Link to="/myproducts" className="flex flex-col items-center justify-center p-1 text-gray-600 hover:text-hotpink-500">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        <span className="text-xs mt-0.5">My Products</span>
      </Link>
      <Link
  to="/upload"
  className="sm:hidden flex items-center justify-center bg-gradient-to-r from-hotpink-500 to-hotpink-600 hover:from-hotpink-600 hover:to-hotpink-700 text-white shadow-lg rounded-full p-4 transition-all duration-300 transform hover:scale-105"
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

      <Link to="/orders" className="flex flex-col items-center justify-center p-1 text-gray-600 hover:text-hotpink-500 relative">
        <div className="relative">
          <FiShoppingCart className="text-xl" />
          <span className="absolute -top-1 -right-1 bg-hotpink-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center shadow-sm">
            3
          </span>
        </div>
        <span className="text-xs mt-0.5">Orders</span>
      </Link>
      <Link to="/Profile" className="flex flex-col items-center justify-center p-1 text-gray-600 hover:text-hotpink-500">
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
    <div className="min-h-screen bg-hotpink-50 font-josefin">
      <Navbar toggleSidebar={() => setSidebarOpen(prev => !prev)} />
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
              <h3 className="text-sm font-normal text-gray-900 tracking-wider uppercase">Customer Service</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/contact" className="text-sm text-gray-600 hover:text-hotpink-600 transition-colors">Contact Us</Link></li>
                <li><Link to="/faq" className="text-sm text-gray-600 hover:text-hotpink-600 transition-colors">FAQs</Link></li>
                <li><Link to="/returns" className="text-sm text-gray-600 hover:text-hotpink-600 transition-colors">Returns & Exchanges</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-normal text-gray-900 tracking-wider uppercase">About Us</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/about" className="text-sm text-gray-600 hover:text-hotpink-600 transition-colors">Our Story</Link></li>
                <li><Link to="/careers" className="text-sm text-gray-600 hover:text-hotpink-600 transition-colors">Careers</Link></li>
                <li><Link to="/blog" className="text-sm text-gray-600 hover:text-hotpink-600 transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-normal text-gray-900 tracking-wider uppercase">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/privacy" className="text-sm text-gray-600 hover:text-hotpink-600 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-sm text-gray-600 hover:text-hotpink-600 transition-colors">Terms of Service</Link></li>
                <li><Link to="/shipping" className="text-sm text-gray-600 hover:text-hotpink-600 transition-colors">Shipping Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-normal text-gray-900 tracking-wider uppercase">Connect With Us</h3>
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