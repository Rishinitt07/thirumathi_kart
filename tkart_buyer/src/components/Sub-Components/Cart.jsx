// MyCart.jsx
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

const MyCart = () => {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [orderDetails, setOrderDetails] = useState({
    phone: '',
    address: '',
    city: '',
    pincode: '',
    state: '',
    paymentMethod: '',
  });

  // ✅ Load cart from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const sanitizedCart = storedCart.map(item => ({
      ...item,
      qty: item.qty > 0 ? item.qty : 1,
    }));
    setCart(sanitizedCart);
  }, []);

  // ✅ Save cart to localStorage on update
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // ✅ Input handling
  const handleInputChange = useCallback(e => {
    const { name, value } = e.target;
    setOrderDetails(prev => ({ ...prev, [name]: value }));
  }, []);

  const updateQty = useCallback((id, delta) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item
      )
    );
  }, []);

  const removeItem = useCallback(id => {
    setCart(prev => prev.filter(item => item.id !== id));
  }, []);

  const filteredCart = useMemo(() => {
    return cart.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cart, searchTerm]);

  const total = useMemo(() => {
    return filteredCart.reduce(
      (sum, item) => sum + item.price * (item.qty || 1),
      0
    );
  }, [filteredCart]);

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.warn('🛒 Your cart is empty.');
      return;
    }
    setShowModal(true);
  };

  const handleConfirmOrder = async () => {
    const { phone, address, pincode } = orderDetails;
    if (!phone || !address || !pincode) {
      toast.error('⚠️ Please fill all required delivery details.');
      return;
    }

    try {
      await axios.post('http://localhost:8081/orders/place', {
        items: cart,
        ...orderDetails,
      });

      toast.success('✅ Order placed successfully!');
      setCart([]);
      localStorage.removeItem('cart');
      setShowModal(false);
    } catch (err) {
      toast.error('❌ Failed to place order. Try again!');
    }
  };

  // ✅ Input Field Component
  const InputField = ({ ...props }) => (
    <input
      {...props}
      className="border border-pink-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
    />
  );

  // ✅ Cart Item Component
  const CartItem = ({ item }) => (
    <div className="flex items-center justify-between border-b py-4">
      <img
        src={item.image || 'https://cdn-icons-png.flaticon.com/128/1040/1040230.png'}
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
            className="px-2 py-1 border rounded hover:bg-pink-100"
          >
            −
          </button>
          <span className="text-sm">{item.qty}</span>
          <button
            onClick={() => updateQty(item.id, 1)}
            className="px-2 py-1 border rounded hover:bg-pink-100"
          >
            +
          </button>
        </div>
      </div>
      <button
        onClick={() => removeItem(item.id)}
        className="text-pink-600 text-sm hover:text-pink-800 ml-4 flex items-center gap-1"
      >
        <FaTrash /> Remove
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-pink-50">
      <main className="max-w-2xl mx-auto w-full p-6 bg-white rounded-lg shadow mt-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">My Cart</h2>

        <InputField
          type="text"
          placeholder="Search your cart..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        {filteredCart.length === 0 ? (
          <p className="text-center text-gray-400 mt-4">
            No items in your cart matching '{searchTerm}'
          </p>
        ) : (
          filteredCart.map(item => <CartItem key={item.id} item={item} />)
        )}

        <div className="mt-6 border-t pt-4 text-right">
          <p className="text-lg font-bold text-gray-800">
            Total: ₹{total}
          </p>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className={`mt-4 w-full py-2 rounded font-semibold transition-colors ${
              cart.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-pink-600 text-white hover:bg-pink-700'
            }`}
          >
            Proceed to Checkout
          </button>
        </div>
      </main>

      {/* Checkout Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">
              Enter Delivery Information
            </h2>

            <InputField
              name="phone"
              placeholder="Phone Number"
              value={orderDetails.phone}
              onChange={handleInputChange}
              maxLength="10"
            />
            <textarea
              name="address"
              placeholder="Address"
              value={orderDetails.address}
              onChange={handleInputChange}
              className="border border-pink-300 p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <InputField
              name="city"
              placeholder="City"
              value={orderDetails.city}
              onChange={handleInputChange}
            />
            <InputField
              name="pincode"
              placeholder="Pincode"
              value={orderDetails.pincode}
              onChange={handleInputChange}
              maxLength="6"
            />
            <InputField
              name="state"
              placeholder="State"
              value={orderDetails.state}
              onChange={handleInputChange}
            />

            <select
              name="paymentMethod"
              value={orderDetails.paymentMethod}
              onChange={handleInputChange}
              className="border border-pink-300 p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
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
                className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default MyCart;
