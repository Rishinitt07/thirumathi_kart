import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';


import axios from 'axios';
import { FiUser, FiHome, FiMap, FiBox, FiXCircle } from 'react-icons/fi';
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
          ? 'text-white shadow-lg shadow-blue-500/30'
          : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
      }`
    }
  >
    {({ isActive }) => (
      <>
        {isActive && (
          <motion.div
            layoutId="active-sidebar-bg"
            className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 -z-10"
            initial={false}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        <span className={`text-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 z-10 ${isActive ? 'text-white drop-shadow-sm' : 'text-blue-500'}`}>
          {icon}
        </span>
        <span className="transition-transform duration-300 group-hover:translate-x-1 z-10 tracking-wide">{label}</span>
      </>
    )}
  </NavLink>
);

// Sidebar with blue theme accents
const Sidebar = ({ isOpen, closeSidebar }) => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get("http://localhost:8082/profile", {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => {
        const name = res.data?.name || "Guest";
        setFirstName(name.split(" ")[0]);
      }).catch(() => {});
    }
  }, []);
  const icons = {
    dashboard: <FiHome className="w-5 h-5 text-blue-500" />,
    notifications: <FiBox className="w-5 h-5 text-blue-500" />,
    delivery: <FiMap className="w-5 h-5 text-blue-500" />,
    profile: <FiUser className="w-5 h-5 text-blue-500" />,
    logout: <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg>
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem('token');
      navigate('/login');
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
            className="fixed top-0 left-0 h-full w-[280px] bg-white shadow-2xl border-r border-gray-200 z-50 flex flex-col overflow-hidden"
          >
            {/* Header / Profile Summary */}
            <div className="relative p-6 bg-gradient-to-br from-blue-50 to-white border-b border-blue-100/50">
              <button onClick={closeSidebar} className="absolute top-4 right-4 p-2 rounded-full hover:bg-blue-100 text-blue-400 hover:text-blue-600 transition-colors md:hidden">
                <FiXCircle size={24} />
              </button>
              <div className="flex items-center gap-4 mt-2">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 p-0.5 shadow-lg shadow-blue-500/20">
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center border-2 border-white overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Delivery" alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-normal text-gray-800 tracking-tight">Hello!</h2>
                  <p className="text-sm font-normal text-blue-500 tracking-widest">{firstName || "Delivery"}</p>
                </div>
              </div>
            </div>
            
            {/* Navigation Links */}
            <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
              <SidebarItem to="/dashboard" label="Dashboard" icon={icons.dashboard} onClick={closeSidebar} />
              <SidebarItem to="/notifications" label="Notifications" icon={icons.notifications} onClick={closeSidebar} />
              <SidebarItem to="/active-delivery" label="Active Delivery" icon={icons.delivery} onClick={closeSidebar} />
              <div className="my-4 border-t border-gray-100/80"></div>
              <SidebarItem to="/profile" label="Profile" icon={icons.profile} onClick={closeSidebar} />
              <div
                onClick={handleLogout}
                className="group flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 font-normal relative overflow-hidden text-gray-600 hover:bg-red-50 hover:text-red-600 cursor-pointer"
              >
                <span className="text-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 z-10 text-red-500">
                  {icons.logout}
                </span>
                <span className="transition-transform duration-300 group-hover:translate-x-1 z-10 tracking-wide">Logout</span>
              </div>
            </div>
            
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Navbar with blue theme
const Navbar = ({ toggleSidebar }) => {
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    axios.get("http://localhost:8082/profile", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      const name = res.data?.name || "";
      setFirstName(name.split(" ")[0]);
    }).catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <img
                src={tklogo}
                alt="Logo"
                className="h-10 w-10 drop-shadow-sm"
              />
              <span className="ml-3 text-2xl font-normal text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700 notranslate" style={{ fontFamily: 'inherit', fontSize: '1.5rem' }}>TKart Delivery</span>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <span className="text-sm font-normal text-blue-600 hidden sm:inline">
              Hi! {firstName || "Delivery"}
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
  <div className="fixed sm:hidden bottom-0 left-0 right-0 bg-white border-t border-blue-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
    <div className="flex justify-around items-center h-16">
      <Link to="/dashboard" className="flex flex-col items-center justify-center p-1 text-blue-500">
        <FiHome className="text-xl" />
        <span className="text-xs mt-0.5">Home</span>
      </Link>
      <Link to="/notifications" className="flex flex-col items-center justify-center p-1 text-gray-600 hover:text-blue-500">
        <FiBox className="text-xl" />
        <span className="text-xs mt-0.5">Alerts</span>
      </Link>
      <Link
        to="/active-delivery"
        className="sm:hidden flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg rounded-full p-4 transition-all duration-300 transform hover:scale-105 -mt-6"
        title="Active Delivery"
      >
        <FiMap className="text-xl text-white" />
      </Link>

      <Link to="/profile" className="flex flex-col items-center justify-center p-1 text-gray-600 hover:text-blue-500">
        <FiUser className="text-xl" />
        <span className="text-xs mt-0.5">Profile</span>
      </Link>
    </div>
  </div>
);

// Main Layout Component
export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const initialLoadRef = React.useRef(true);
  const prevOrderIdsRef = React.useRef([]);

  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  };

  useEffect(() => {
    const checkNewOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const response = await axios.get('http://localhost:8082/available', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const currentOrders = response.data || [];
        const currentOrderIds = currentOrders.map(o => o.order_id);
        
        // Check for new orders if not initial load
        if (!initialLoadRef.current) {
          const hasNew = currentOrderIds.some(id => !prevOrderIdsRef.current.includes(id));
          if (hasNew) {
            playNotificationSound();
            toast.info(' New Delivery Order Available!', {
              position: "top-center",
              autoClose: 3000,
              theme: "light",
              style: { fontWeight: 'bold', fontSize: '16px' }
            });
          }
        }
        
        // Update state
        initialLoadRef.current = false;
        prevOrderIdsRef.current = currentOrderIds;
        
      } catch (error) {
        // Silent fail for background polling
      }
    };

    checkNewOrders();
    const intervalId = setInterval(checkNewOrders, 5000); // Check every 5 seconds for snappier notifications
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar toggleSidebar={() => setSidebarOpen(prev => !prev)} />
      <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <main className="pb-16 sm:pb-0 flex-1"> {/* Padding bottom for mobile bottom nav */}
        <Outlet /> {/* This is where child routes will be rendered */}
      </main>

      <MobileBottomNav />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Thirumathi Kart Delivery. All rights reserved.
          </div>
        </div>
      </footer>
      
    </div>
  );
};

export default Layout;
