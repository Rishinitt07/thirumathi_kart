import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Sidebar item
const SidebarItem = ({ to, label }) => {
  const [hover, setHover] = useState(false);
  return (
    <Link
      to={to}
      style={{
        padding: '12px 20px',
        textDecoration: 'none',
        color: '#333',
        fontWeight: '500',
        borderRadius: '4px',
        backgroundColor: hover ? '#E5E7EB' : 'transparent',
        display: 'block',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {label}
    </Link>
  );
};

// Sidebar layout
const Sidebar = ({ isOpen, closeSidebar }) => (
  <>
    <div
      style={{
        position: 'fixed',
        top: '60px',
        left: isOpen ? 0 : '-200px',
        width: '200px',
        height: '100%',
        backgroundColor: 'white',
        borderRight: '1px solid lightgray',
        paddingTop: '20px',
        transition: 'left 0.3s ease',
        zIndex: 1000,
      }}
    >
      <SidebarItem to="/home" label="Home" />
      <SidebarItem to="/cart" label="My Cart" />
      <SidebarItem to="/orders" label="My Orders" />
      <SidebarItem to="/wishlist" label="Wishlist" />
      <SidebarItem to="/profile" label="Profile" />
    </div>
    {isOpen && window.innerWidth <= 768 && (
      <div
        onClick={closeSidebar}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 900,
        }}
      />
    )}
  </>
);

// Navbar layout
const Navbar = ({ toggleSidebar }) => (
  <div
    style={{
      fontFamily: 'Poppins',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px',
      borderBottom: '1px solid lightgray',
      position: 'sticky',
      top: 0,
      zIndex: 1001,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      backdropFilter: 'blur(25px)',
    }}
    
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <img
        src="https://thirumathikart.nitt.edu/assets/img/tklogo.png"
        alt="Logo"
        style={{ width: '40px', height: '40px' }}
      />
       <Link to="/Home" className="text-xl font-bold ">
        Thirumathi Kart
      </Link>

      <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#333' }}></span>
    </div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
      <span style={{ fontSize: '14px', color: 'gray' }}>Hi! Buyer</span>
      <motion.img
        src="https://cdn-icons-png.flaticon.com/128/1828/1828859.png"
        alt="Menu"
        onClick={toggleSidebar}
        style={{ width: '20px', height: '20px', cursor: 'pointer', filter: 'grayscale(100%)' }}
        whileHover={{ scale: 1.2 }}
        transition={{ type: 'spring', stiffness: 300, damping: 12 }}
      />
    </div>
  </div>
);

// Main Orders Page
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
        setOrders(res.data);
      } catch (err) {
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
        <main style={{ flex: 1, padding: '40px', marginLeft: window.innerWidth > 768 && sidebarOpen ? '200px' : 0 }}>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h2>

          {loading && <p className="text-blue-600">Loading your order history...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {orders.length === 0 && !loading && !error && (
            <p className="text-gray-600">You have no orders yet.</p>
          )}

          {orders.map(order => (
            <div
              key={order.id}
              className="bg-white border border-gray-300 rounded-xl shadow-md p-6 mb-6 flex flex-col md:flex-row justify-between items-center gap-6"
            >
              <div className="flex items-center gap-4 w-full md:w-auto">
                <img
                  src={order.items[0]?.image || 'https://via.placeholder.com/100'}
                  alt="Product"
                  className="w-24 h-24 object-cover rounded border"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{order.items[0]?.name || 'Product name'}</h3>
                  <p className="text-sm text-gray-600">Order Date: {new Date(order.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600">Order ID: {String(order.id).padStart(8, '0')}</p>
                </div>
              </div>
              <button className="px-6 py-2 bg-gray-100 border border-gray-400 rounded hover:bg-gray-200 text-sm font-medium">
                View Order
              </button>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};

export default Orders;
