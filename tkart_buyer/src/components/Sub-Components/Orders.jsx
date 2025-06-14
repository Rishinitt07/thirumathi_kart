import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Sidebar item
const SidebarItem = ({ to, label }) => (
  <Link
    to={to}
    className="block px-5 py-2 text-gray-800 font-medium hover:bg-gray-200 rounded"
  >
    {label}
  </Link>
);

// Sidebar layout
const Sidebar = ({ isOpen, closeSidebar }) => (
  <>
    <div
      className={`fixed top-[60px] left-0 w-48 h-full bg-white transition-transform duration-300 z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      style={{ borderRight: '1px solid transparent' }}
    >
      <SidebarItem to="/home" label="Home" />
      <SidebarItem to="/categories" label="Categories" />
      <SidebarItem to="/cart" label="My Cart" />
      <SidebarItem to="/orders" label="My Orders" />
      <SidebarItem to="/wishlist" label="Wishlist" />
      <SidebarItem to="/profile" label="Profile" />
    </div>
    {isOpen && (
      <div
        onClick={closeSidebar}
        className="fixed inset-0 bg-transparent bg-opacity-30 z-40"
      />
    )}
  </>
);

// Navbar layout
const Navbar = ({ toggleSidebar }) => (
  <div className="flex items-center justify-between px-6 py-3 shadow-md sticky top-0 bg-white z-50">
    <div className="flex items-center gap-3">
      <img
        src="https://thirumathikart.nitt.edu/assets/img/tklogo.png"
        alt="Logo"
        className="w-10 h-10"
      />
      <Link to="/home" className="text-xl font-bold">
        Thirumathi Kart
      </Link>
    </div>
    <div
      className="flex items-center gap-4 cursor-pointer"
      onClick={toggleSidebar}
    >
      <span className="text-sm text-gray-600">Hi! Buyer</span>
      <motion.img
        src="https://cdn-icons-png.flaticon.com/128/1828/1828859.png"
        alt="Menu"
        className="w-5 h-5 cursor-pointer"
        whileHover={{ scale: 1.2 }}
      />
    </div>
  </div>
);

// Orders Component
const Orders = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:8081/orders', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (error) {
          return (
            <div className="p-10 text-red-500 text-center">
              <h2>Error: {error}</h2>
            </div>
          );
        }

       setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);


  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-josefin">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />

      <div className="flex flex-1">
        <div className="hidden md:block w-48 flex-shrink-0" />

        <main className="flex-1 p-6 md:ml-0 transition-all duration-300">
          <motion.h2
            className="text-3xl font-bold text-gray-800 mb-6"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            My Orders
          </motion.h2>

          {loading && <p className="text-blue-600">Loading your order history...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && Array.isArray(orders) && orders.length === 0 && (
            <p className="text-gray-600">You have no orders yet.</p>
          )}


          {Array.isArray(orders) && orders.length > 0 &&
            orders.map((order) =>
              Array.isArray(order.items) && order.items.length > 0 ? (
                <div key={order.id} className="bg-white border border-gray-300 rounded-xl shadow-sm p-6 mb-6 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <img
                      src={order.items[0]?.image || 'https://via.placeholder.com/100'}
                      alt={order.items[0]?.name || 'Product'}
                      className="w-24 h-24 object-cover rounded border"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {order.items[0]?.name || 'Product name'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Order Date: {new Date(order.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Order ID: {String(order.id).padStart(8, '0')}
                      </p>
                    </div>
                  </div>
                  <button className="px-6 py-2 bg-gray-100 border border-gray-400 rounded hover:bg-gray-200 text-sm font-medium">
                    View Order
                  </button>
                </div>
              ) : null
            )
          }



        </main>
      </div>

      <footer className="mt-auto text-center text-sm py-4 text-gray-500 border-t">
        © 2025 Thirumathi Kart. All Rights Reserved.
      </footer>
    </div>
  );
};

export default Orders;
