import React, { useState } from 'react';
import { FaTrash, FaCartPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

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
       <SidebarItem to="/categories" label="Categories" />
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
      <Link to="/home" className="text-xl font-bold">Thirumathi Kart</Link>
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

const Wishlist = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [wishlist, setWishlist] = useState([
    { id: 1, name: 'Handcrafted Bowl', price: 399, rating: 4 },
    { id: 2, name: 'Organic Honey', price: 249, rating: 5 },
    { id: 3, name: 'Clay Water Jug', price: 499, rating: 4 },
    { id: 4, name: 'Bamboo Basket', price: 299, rating: 5 },
    { id: 5, name: 'Herbal Soap Set', price: 199, rating: 4 },
    { id: 6, name: 'Cotton Saree', price: 799, rating: 5 },
    { id: 7, name: 'Brass Diya Set', price: 599, rating: 4 },
    { id: 8, name: 'Jute Handbag', price: 349, rating: 4 },
    { id: 9, name: 'Millet Combo Pack', price: 699, rating: 5 },
    { id: 10, name: 'Terracotta Mug Set', price: 549, rating: 4 },
  ]);

  const handleRemove = (id) => setWishlist(wishlist.filter(item => item.id !== id));
  const handleAddToCart = (item) => alert(`${item.name} added to cart!`);

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
              <div key={item.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between">
                <div>
                  <div className="w-full h-40 bg-gray-200 rounded mb-4 flex items-center justify-center text-4xl">
                    📦
                  </div>
                  <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                  <p className="text-yellow-500 text-sm mt-1">
                    {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                  </p>
                  <p className="text-gray-700 font-medium mt-2">₹ {item.price}</p>
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
      <footer className="mt-12 text-center text-sm py-4 text-gray-500 border-t">
        Copyright © 2025 Thirumathi Kart. All Rights Reserved.
      </footer>
    </div>
  );
};

export default Wishlist;
