import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

// Reusable Sidebar Component
const SidebarItem = ({ to, label, icon }) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
    style={{ fontFamily: "'Roboto Serif', serif" }}
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
        <div className="h-16 flex items-center px-6 border-b" style={{ fontFamily: "'Roboto Serif', serif" }}>
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
            style={{ fontFamily: "'Roboto Serif', serif" }}
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
  <header className="sticky top-0 z-30 bg-white shadow-sm" style={{ fontFamily: "'Roboto Serif', serif" }}>
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
            style={{ display: 'block' }}
          />
        </div>
      </div>
    </div>
  </header>
);

const MyCart = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    phone: '',
    address: '',
    city: '',
    pincode: '',
    state: '',
    paymentMethod: '',
  });

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      const sanitizedCart = parsedCart.map(item => ({
        ...item,
        qty: item.qty && item.qty > 0 ? item.qty : 1,
      }));
      setCart(sanitizedCart);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails(prev => ({ ...prev, [name]: value }));
  };

  const updateQty = (id, delta) => {
    const updatedCart = cart.map(item =>
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    const updated = cart.filter(item => item.id !== id);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const filteredCart = cart.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const total = filteredCart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.warn("Your cart is empty.");
      return;
    }
    setShowModal(true);
  };

  const handleConfirmOrder = async () => {
    const { phone, address, pincode } = orderDetails;
    if (!phone || !address || !pincode) {
      toast.error("Please fill all delivery details");
      return;
    }

    try {
      await axios.post('http://localhost:8081/orders/place', {
        items: cart,
        phone: orderDetails.phone,
        address: orderDetails.address,
        pincode: orderDetails.pincode,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      toast.success("✅ Order placed successfully!");
      setCart([]);
      localStorage.removeItem("cart");
      setShowModal(false);
    } catch (err) {
      console.error("Checkout failed:", err);
      toast.error("❌ Failed to place order");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50" style={{ fontFamily: "'Roboto Serif', serif" }}>
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />

      <main className="max-w-2xl mx-auto w-full p-6 bg-white rounded-lg shadow mt-10">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">My Cart</h2>
        <input
          type="text"
          placeholder="Search your cart..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border rounded-full px-4 py-2 text-sm w-full mb-4"
          style={{ fontFamily: "'Roboto Serif', serif" }}
        />

        {filteredCart.length === 0 ? (
          <p className="text-center text-gray-400">No items in your cart matching '{searchTerm}'</p>
        ) : (
          filteredCart.map(item => (
            <div key={item.id} className="flex items-center justify-between border-b py-4">
              <img
                src={item.image || "https://cdn-icons-png.flaticon.com/128/1040/1040230.png"}
                alt={item.name}
                className="w-16 h-16 object-cover rounded mr-4"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-700">₹{item.price}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-600">Qty:</span>
                  <button 
                    onClick={() => updateQty(item.id, -1)} 
                    className="px-2 py-1 border rounded text-sm hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="text-sm">{item.qty}</span>
                  <button 
                    onClick={() => updateQty(item.id, 1)} 
                    className="px-2 py-1 border rounded text-sm hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 text-sm hover:text-red-700 ml-4 flex items-center gap-1"
              >
                <FaTrash /> Remove
              </button>
            </div>
          ))
        )}

        <div className="mt-6 border-t pt-4 text-right">
          <p className="text-lg font-bold text-gray-800">Total: ₹{total}</p>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className={`mt-4 w-full py-2 rounded font-semibold transition-colors ${cart.length === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-900'}`}
          >
            Proceed to Checkout
          </button>
          {cart.length === 0 && (
            <p className="text-sm text-gray-500 mt-2 text-center">Add items to your cart to enable checkout</p>
          )}
        </div>
      </main>

      <footer className="mt-auto text-center text-sm py-4 text-gray-500 border-t">
        © 2025 Thirumathi Kart. All Rights Reserved.
      </footer>

      <ToastContainer position="top-center" autoClose={3000} />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div 
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm h-[500px] overflow-y-auto"
            style={{ fontFamily: "'Roboto Serif', serif" }}
          >
            <h2 className="text-lg font-semibold mb-4">Enter Delivery Information</h2>

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={orderDetails.phone}
              onChange={handleInputChange}
              className="border p-2 w-full mb-3 rounded"
              maxLength="10"
            />
            <textarea
              name="address"
              placeholder="Address"
              value={orderDetails.address}
              onChange={handleInputChange}
              className="border p-2 w-full mb-3 rounded"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={orderDetails.city}
              onChange={handleInputChange}
              className="border p-2 w-full mb-3 rounded"
            />
            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={orderDetails.pincode}
              onChange={handleInputChange}
              className="border p-2 w-full mb-3 rounded"
              maxLength="6"
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={orderDetails.state}
              onChange={handleInputChange}
              className="border p-2 w-full mb-3 rounded"
            />

            <select
              name="paymentMethod"
              value={orderDetails.paymentMethod}
              onChange={handleInputChange}
              className="border p-2 w-full mb-3 rounded"
            >
              <option value="">Select Payment Method</option>
              <option value="cod">Cash on Delivery</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmOrder}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCart;