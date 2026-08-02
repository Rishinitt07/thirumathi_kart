import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiHome,
  FiShoppingBag,
  FiHeart,
  FiXCircle,
  FiChevronDown,
  FiInfo,
  FiLogOut
} from 'react-icons/fi';
import tklogo from './tkart.png';
import axios from 'axios';
import { fetchInitialData } from '../utils/sync';

// Error boundary for sidebar items
const withErrorBoundary = (Component) => (props) => {
  try {
    return <Component {...props} />;
  } catch (error) {
    console.error('Component error:', error);
    return null;
  }
};

// Reusable Sidebar Component from Seller UI
const SidebarItem = withErrorBoundary(({ to, label, icon, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `group flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 font-normal relative overflow-hidden ${isActive
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
));

// Sidebar with pink theme accents
const Sidebar = ({ isOpen, closeSidebar }) => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get("http://localhost:8081/profile", {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => {
        const fName = res.data?.firstName || res.data?.username || "Guest";
        setFirstName(fName.split(" ")[0]);
      }).catch(() => { });
    }
  }, []);

  // Cart count synchronization
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartCount(cart.reduce((sum, item) => sum + (item.qty || 1), 0));
      } catch (error) {
        setCartCount(0);
      }
    };
    updateCartCount();
    const storageListener = () => updateCartCount();
    window.addEventListener('storage', storageListener);
    return () => window.removeEventListener('storage', storageListener);
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      try {
        ['token', 'userData', 'cart', 'wishlist'].forEach(item => {
          localStorage.removeItem(item);
          sessionStorage.removeItem(item);
        });
        void 0;
        navigate('/login');
        window.dispatchEvent(new Event('storage'));
      } catch (error) {
        void 0;
      }
    }
  };

  const icons = {
    home: <FiHome className="w-5 h-5 text-hotpink-500" />,
    categories: (
      <svg className="w-5 h-5 text-hotpink-500" fill="currentColor" viewBox="0 0 20 20">
        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    cart: (
      <div className="relative">
        <FiShoppingCart className="w-5 h-5 text-hotpink-500" />
        {cartCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-hotpink-600 text-white text-[10px] font-normal rounded-full h-4 w-4 flex items-center justify-center border border-white"
          >
            {cartCount > 9 ? '9+' : cartCount}
          </motion.span>
        )}
      </div>
    ),
    orders: <FiShoppingBag className="w-5 h-5 text-hotpink-500" />,
    wishlist: <FiHeart className="w-5 h-5 text-hotpink-500" />,
    profile: <FiUser className="w-5 h-5 text-hotpink-500" />,
    about: <FiInfo className="w-5 h-5 text-hotpink-500" />,
    logout: <FiLogOut className="w-5 h-5 text-red-600" />
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
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Buyer" alt="Avatar" className="w-full h-full object-cover" />
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
              <SidebarItem to="/home" label="Home" icon={icons.home} onClick={closeSidebar} />
              <SidebarItem to="/categories" label="Categories" icon={icons.categories} onClick={closeSidebar} />
              <SidebarItem to="/cart" label="My Cart" icon={icons.cart} onClick={closeSidebar} />
              <SidebarItem to="/orders" label="My Orders" icon={icons.orders} onClick={closeSidebar} />
              <SidebarItem to="/wishlist" label="Wishlist" icon={icons.wishlist} onClick={closeSidebar} />
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
const Navbar = withErrorBoundary(React.memo(({ toggleSidebar }) => {
  const [firstName, setFirstName] = useState("");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Get user name
    const token = localStorage.getItem("token");
    if (token) {
      axios.get("http://localhost:8081/profile", {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => {
        const fName = res.data?.firstName || res.data?.username || "";
        setFirstName(fName.split(" ")[0]);
      }).catch(() => { });
    }

    // Get cart count
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartCount(cart.reduce((sum, item) => sum + (item.qty || 1), 0));
      } catch (error) {
        setCartCount(0);
      }
    };
    updateCartCount();
    const storageListener = () => updateCartCount();
    window.addEventListener('storage', storageListener);
    return () => window.removeEventListener('storage', storageListener);
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
              <span className="ml-3 text-2xl font-normal text-transparent bg-clip-text bg-gradient-to-r from-hotpink-500 to-hotpink-700 hidden sm:block notranslate">TKart</span>
            </Link>
          </div>

          {/* Lenght Minimal Pill Search Bar */}
          <div className="flex-1 max-w-xl mx-4 lg:mx-12 hidden md:block">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const q = e.target.search.value;
                if (q) window.location.href = `/categories?search=${encodeURIComponent(q)}`;
              }}
              className="relative group w-full"
            >
              <input
                name="search"
                type="text"
                placeholder="Search anything..."
                className="w-full px-5 py-2 rounded-full border border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white focus:outline-none focus:border-hotpink-300 focus:ring-2 focus:ring-hotpink-100 transition-all text-sm text-gray-700 pl-11 placeholder-gray-400"
              />
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-hotpink-400 transition-colors" />
            </form>
          </div>

          <div className="flex items-center space-x-4 sm:space-x-6">
            <span className="text-sm font-normal text-hotpink-600 hidden sm:inline">
              Hi! {firstName || "Buyer"}
            </span>

            <Link to="/cart" className="relative p-1 text-hotpink-500 hover:text-hotpink-700 transition" aria-label="Cart">
              <FiShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-hotpink-600 text-white text-[10px] font-normal rounded-full h-4 w-4 flex items-center justify-center border border-white shadow-sm"
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </motion.span>
              )}
            </Link>

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
}));

// Mobile Bottom Navigation
const MobileBottomNav = withErrorBoundary(React.memo(() => {
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartCount(cart.reduce((sum, item) => sum + (item.qty || 1), 0));
      } catch (error) {
        setCartCount(0);
      }
    };
    updateCartCount();
    const storageListener = () => updateCartCount();
    window.addEventListener('storage', storageListener);
    return () => window.removeEventListener('storage', storageListener);
  }, []);

  return (
    <div className="fixed sm:hidden bottom-0 left-0 right-0 bg-white border-t border-hotpink-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
      <div className="flex justify-around items-center h-16">
        <Link to="/home" className={`flex flex-col items-center justify-center p-1 ${location.pathname === '/home' ? 'text-hotpink-600' : 'text-gray-600 hover:text-hotpink-500'}`}>
          <FiHome className="w-6 h-6" />
          <span className="text-xs mt-0.5">Home</span>
        </Link>
        <Link to="/categories" className={`flex flex-col items-center justify-center p-1 ${location.pathname === '/categories' ? 'text-hotpink-600' : 'text-gray-600 hover:text-hotpink-500'}`}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span className="text-xs mt-0.5">Categories</span>
        </Link>

        {/* Cart as prominent middle button */}
        <Link
          to="/cart"
          className="sm:hidden flex items-center justify-center bg-gradient-to-r from-hotpink-500 to-hotpink-600 hover:from-hotpink-600 hover:to-hotpink-700 text-white shadow-lg rounded-full p-4 transition-all duration-300 transform hover:scale-105 relative -mt-5 border-4 border-white"
          title="My Cart"
        >
          <FiShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-white text-hotpink-600 text-[10px] font-normal rounded-full h-4 w-4 flex items-center justify-center border-2 border-hotpink-500 shadow-sm">
              {cartCount > 9 ? '9+' : cartCount}
            </span>
          )}
        </Link>

        <Link to="/orders" className={`flex flex-col items-center justify-center p-1 ${location.pathname === '/orders' ? 'text-hotpink-600' : 'text-gray-600 hover:text-hotpink-500'}`}>
          <FiShoppingBag className="w-6 h-6" />
          <span className="text-xs mt-0.5">Orders</span>
        </Link>
        <Link to="/profile" className={`flex flex-col items-center justify-center p-1 ${location.pathname === '/profile' ? 'text-hotpink-600' : 'text-gray-600 hover:text-hotpink-500'}`}>
          <FiUser className="w-6 h-6" />
          <span className="text-xs mt-0.5">Account</span>
        </Link>
      </div>
    </div>
  );
}));

// Main Layout Component
export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  return (
    <div className="min-h-screen bg-white font-josefin">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
      />

      <Navbar toggleSidebar={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="pb-20 sm:pb-0"> {/* Padding bottom for mobile bottom nav */}
        <Outlet />
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