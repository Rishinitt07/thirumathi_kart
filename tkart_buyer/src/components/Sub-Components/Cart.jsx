import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';


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
      <Link to="/Home" className="text-xl font-bold">
        Thirumathi Kart
      </Link>
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

const MyCart = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [checkoutMessage, setCheckoutMessage] = useState("");

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

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8081/orders/place', {
        items: cart, // or cart if you're using that
        date: new Date().toISOString(),
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      // Clear cart after successful checkout
      setCart([]);
      localStorage.removeItem('cart');
      setCheckoutMessage('✅ Order placed successfully!');
    } catch (error) {
      console.error('Checkout failed:', error);
      setCheckoutMessage('❌ Failed to place order.');
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
                  <button
                    onClick={() => updateQty(item.id, -1)}
                    className="px-2 py-1 border rounded text-sm hover:bg-gray-100"
                  >−</button>
                  <span className="text-sm">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, 1)}
                    className="px-2 py-1 border rounded text-sm hover:bg-gray-100"
                  >+</button>
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
            className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-900 font-semibold"
          >
            Proceed to Checkout
          </button>
          {checkoutMessage && <p className="text-center mt-4 text-green-600 font-medium">{checkoutMessage}</p>}
        </div>
      </main>

      <footer className="mt-auto text-center text-sm py-4 text-gray-500 border-t">
        © 2025 Thirumathi Kart. All Rights Reserved.
      </footer>
    </div>
  );
};

export default MyCart;
