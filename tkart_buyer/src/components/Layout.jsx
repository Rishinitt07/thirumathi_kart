import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
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
import tklogo from './tklogo.png';

// Error boundary for sidebar items
const withErrorBoundary = (Component) => (props) => {
  try {
    return <Component {...props} />;
  } catch (error) {
    console.error('Component error:', error);
    return null;
  }
};

// Enhanced SidebarItem with error boundary and prop validation
const SidebarItem = withErrorBoundary(React.memo(({ to, label, icon, isActive, hasSubmenu, isExpanded, onClick }) => {
  const location = useLocation();
  const active = isActive || location.pathname === to;
  
  return (
    <motion.div whileTap={{ scale: 0.98 }}>
      <Link
        to={to}
        onClick={onClick}
        className={`flex items-center justify-between px-5 py-3 rounded-lg transition-colors ${
          active ? 'bg-pink-100 text-pink-700' : 'text-gray-700 hover:bg-pink-50'
        }`}
        aria-current={active ? 'page' : undefined}
      >
        <div className="flex items-center gap-3">
          <span className={`text-lg ${active ? 'text-pink-600' : 'text-pink-500'}`}>
            {icon}
          </span>
          <span className="font-medium">{label}</span>
        </div>
        {hasSubmenu && (
          <motion.span 
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="text-gray-400"
            aria-hidden="true"
          >
            <FiChevronDown size={18} />
          </motion.span>
        )}
      </Link>
    </motion.div>
  );
}));

// Sidebar component with enhanced reliability
const Sidebar = ({ isOpen, closeSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState({});
  const [cartCount, setCartCount] = useState(0);

  // Cart count synchronization with cleanup
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartCount(cart.length);
      } catch (error) {
        console.error('Error reading cart data:', error);
        setCartCount(0);
      }
    };
    
    updateCartCount();
    const storageListener = () => updateCartCount();
    
    window.addEventListener('storage', storageListener);
    return () => window.removeEventListener('storage', storageListener);
  }, []);

  const toggleItem = (itemKey) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemKey]: !prev[itemKey]
    }));
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      try {
        // Clear user data more safely
        ['token', 'userData', 'cart', 'wishlist'].forEach(item => {
          localStorage.removeItem(item);
          sessionStorage.removeItem(item);
        });
        
        toast.success("Logged out successfully", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
        
        navigate('/login');
        window.dispatchEvent(new Event('storage'));
      } catch (error) {
        console.error('Logout error:', error);
        toast.error("Failed to log out. Please try again.");
      }
    }
  };

  const menuItems = [
    {
      key: 'home',
      label: 'Home',
      icon: <FiHome className="w-5 h-5" />,
      to: '/home'
    },
    {
      key: 'categories',
      label: 'Categories',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
      to: '/categories'
    },
    {
      key: 'cart',
      label: 'My Cart',
      icon: (
        <div className="relative">
          <FiShoppingCart className="w-5 h-5" />
          {cartCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
            >
              {cartCount > 9 ? '9+' : cartCount}
            </motion.span>
          )}
        </div>
      ),
      to: '/cart'
    },
    {
      key: 'orders',
      label: 'My Orders',
      icon: <FiShoppingBag className="w-5 h-5" />,
      to: '/orders'
    },
    {
      key: 'wishlist',
      label: 'Wishlist',
      icon: <FiHeart className="w-5 h-5" />,
      to: '/wishlist'
    },
    {
      key: 'profile',
      label: 'Profile',
      icon: <FiUser className="w-5 h-5" />,
      to: '/profile'
    },
    {
      key: 'about',
      label: 'About Us',
      icon: <FiInfo className="w-5 h-5" />,
      to: '/about'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
            className="fixed inset-0 bg-black/20 z-30 md:hidden"
            role="presentation"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 flex flex-col"
            aria-modal="true"
          >
            <div className="h-16 flex items-center px-6 border-b border-pink-100">
              <h2 className="text-xl font-bold text-pink-700">Menu</h2>
              <button 
                onClick={closeSidebar} 
                className="ml-auto p-1 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
              >
                <FiXCircle className="text-gray-500" size={20} />
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-5 py-3 mx-4 my-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
              aria-label="Logout"
            >
              <FiLogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>

            <div className="flex-1 p-4 space-y-1 overflow-y-auto">
              {menuItems.map((item) => (
                <React.Fragment key={item.key}>
                  <SidebarItem
                    to={item.to}
                    label={item.label}
                    icon={item.icon}
                    hasSubmenu={item.subItems}
                    isExpanded={expandedItems[item.key]}
                    onClick={() => item.subItems ? toggleItem(item.key) : null}
                  />
                  {item.subItems && expandedItems[item.key] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.2 }}
                      className="ml-12 mt-1 space-y-1"
                    >
                      {item.subItems.map((subItem) => (
                        <SidebarItem
                          key={subItem.key}
                          to={subItem.to}
                          label={subItem.label}
                          icon={subItem.icon}
                        />
                      ))}
                    </motion.div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Navbar component with error boundary
const Navbar = withErrorBoundary(React.memo(({ toggleSidebar }) => {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartCount(cart.length);
      } catch (error) {
        console.error('Error reading cart data:', error);
        setCartCount(0);
      }
    };
    
    updateCartCount();
    const storageListener = () => updateCartCount();
    
    window.addEventListener('storage', storageListener);
    return () => window.removeEventListener('storage', storageListener);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm border-b border-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/home" className="flex items-center" aria-label="Home">
              <img src={tklogo} alt="Logo" className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold text-pink-700">Thirumathi Kart</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-pink-600 hidden sm:inline">Hi! Buyer</span>
            <Link to="/cart" className="p-1 text-pink-600 hover:text-pink-700 relative" aria-label="Cart">
              <FiShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </motion.span>
              )}
            </Link>
            <motion.button
              onClick={toggleSidebar}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1 text-gray-600 hover:text-pink-600"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
}));

// MobileBottomNav with error boundary
const MobileBottomNav = withErrorBoundary(React.memo(() => {
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartCount(cart.length);
      } catch (error) {
        console.error('Error reading cart data:', error);
        setCartCount(0);
      }
    };
    
    updateCartCount();
    const storageListener = () => updateCartCount();
    
    window.addEventListener('storage', storageListener);
    return () => window.removeEventListener('storage', storageListener);
  }, []);

  const navItems = [
    { path: '/home', icon: <FiHome />, label: 'Home' },
    { path: '/categories', icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ), label: 'Categories' },
    { path: '/Home', icon: <FiSearch />, label: 'Search' },
    { path: '/cart', icon: (
      <div className="relative">
        <FiShoppingCart />
        {cartCount > 0 && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
          >
            {cartCount}
          </motion.span>
        )}
      </div>
    ), label: 'Cart' },
    { path: '/profile', icon: <FiUser />, label: 'Account' }
  ];

  return (
    <motion.div
      initial={{ y: 50 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 25 }}
      className="fixed sm:hidden bottom-0 left-0 right-0 bg-white border-t border-pink-200 shadow-lg z-50"
    >
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center p-1 transition-colors ${
              location.pathname === item.path ? 'text-pink-500' : 'text-gray-600 hover:text-pink-500'
            }`}
            aria-label={item.label}
          >
            <div className="text-xl">{item.icon}</div>
            <span className="text-xs mt-0.5">{item.label}</span>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}));

// Main Layout Component with error handling
const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
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
      
      <main className="pb-16 sm:pb-0">
        <Outlet />
      </main>

      <MobileBottomNav />

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
                {/* Social media links would go here */}
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Thirumathi Kart. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;