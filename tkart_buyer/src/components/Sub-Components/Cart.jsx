import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Reusable Sidebar Component
const SidebarItem = ({ to, label, icon }) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
  >
    <span className="text-lg">{icon}</span>
    <span className="font-medium">{label}</span>
  </Link>
);

const Sidebar = ({ isOpen, closeSidebar }) => (
  <>
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transition-all duration-300 z-40 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="h-16 flex items-center px-6 border-b">
        <h2 className="text-xl font-bold">Menu</h2>
      </div>
      <div className="p-4 space-y-2 mt-4">
        <SidebarItem to="/home" label="Home" icon="🏠" />
        <SidebarItem to="/categories" label="Categories" icon="🗂️" />
        <SidebarItem to="/cart" label="My Cart" icon="🛒" />
        <SidebarItem to="/orders" label="My Orders" icon="📦" />
        <SidebarItem to="/wishlist" label="Wishlist" icon="❤️" />
        <SidebarItem to="/profile" label="Profile" icon="👤" />
      </div>
    </div>
    {isOpen && (
      <div
        onClick={closeSidebar}
        className="fixed inset-0 bg-transparent bg-opacity-50 z-30 md:hidden"
      />
    )}
  </>
);

// Enhanced Navbar Component
const Navbar = ({ toggleSidebar }) => (
  <header className="sticky top-0 z-30 bg-white shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="mr-4 text-gray-500 hover:text-gray-600 md:hidden"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
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
    setShowModal(true); // open modal first
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
    <div className="min-h-screen flex flex-col bg-gray-50 font-josefin">
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
                  <button onClick={() => updateQty(item.id, -1)} className="px-2 py-1 border rounded text-sm hover:bg-gray-100">−</button>
                  <span className="text-sm">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="px-2 py-1 border rounded text-sm hover:bg-gray-100">+</button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm h-[500px] overflow-y-auto">
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
