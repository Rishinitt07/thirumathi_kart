import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

const ToastifyCSS = () => (
  <style>{`
    .Toastify__toast-container {
      z-index: 9999; position: fixed; padding: 4px; width: 320px; box-sizing: border-box; color: #fff;
    }
    .Toastify__toast-container--top-center { top: 1em; left: 50%; transform: translateX(-50%); }
    .Toastify__toast {
      position: relative; min-height: 64px; box-sizing: border-box; margin-bottom: 1rem; padding: 8px;
      border-radius: 8px; box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.1), 0 2px 15px 0 rgba(0, 0, 0, 0.05);
      display: flex; justify-content: space-between; max-height: 800px; overflow: hidden;
      font-family: sans-serif; cursor: pointer; direction: ltr; background: #fff; color: #333;
    }
    .Toastify__toast-body { margin: auto 0; flex: 1 1 auto; padding: 6px; }
    .Toastify__close-button {
      color: #333; background: transparent; outline: none; border: none; padding: 0; cursor: pointer;
      opacity: 0.7; transition: 0.3s ease; align-self: flex-start;
    }
    .Toastify__toast--success { background-color: #4caf50; color: white; }
    .Toastify__toast--warning { background-color: #f1c40f; color: white; }
    .Toastify__toast--error { background-color: #e74c3c; color: white; }
  `}</style>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const MyCart = () => {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    phone: '', address: '', city: '', pincode: '', state: '', paymentMethod: '',
  });

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const sanitizedCart = storedCart.map(item => ({
      ...item,
      qty: item.qty > 0 ? item.qty : 1,
    }));
    setCart(sanitizedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleInputChange = useCallback(e => {
    const { name, value } = e.target;
    setOrderDetails(prev => ({ ...prev, [name]: value }));
  }, []);

  const updateQty = useCallback((id, delta) => {
    setCart(currentCart =>
      currentCart.map(item =>
        item.id === id
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item
      )
    );
  }, []);

  const removeItem = useCallback(id => {
    setCart(currentCart => currentCart.filter(item => item.id !== id));
  }, []);

  const filteredCart = useMemo(() => {
    if (!searchTerm) return cart;
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
      toast.warn("Your cart is empty. Let's add some items!");
      return;
    }
    setShowModal(true);
  };

  const handleConfirmOrder = async () => {
    const { phone, address, pincode } = orderDetails;
    if (!phone || !address || !pincode) {
      toast.error('Whoops! Please fill in your phone, address, and pincode.');
      return;
    }

    try {
      await axios.post('http://localhost:8081/orders/place', {
        items: cart,
        ...orderDetails,
      });

      toast.success('Success! Your order has been placed.');
      setCart([]);
      localStorage.removeItem('cart');
      setShowModal(false);
    } catch (err) {
      toast.error('Oh no! Something went wrong. Please try placing your order again.');
    }
  };
  
  const InputField = (props) => (
    <input
      {...props}
      className="border border-pink-300 rounded px-3 py-2 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
    />
  );

  const CartItem = ({ item }) => (
    <div className="flex items-center justify-between border-b py-4 animate-fade-in">
      <img
        src={item.image || 'https://placehold.co/64x64/f472b6/ffffff?text=Item'}
        alt={item.name}
        className="w-16 h-16 object-cover rounded mr-4"
      />
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">{item.name}</h3>
        <p className="text-gray-700">₹{item.price}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm text-gray-600">Qty:</span>
          <button onClick={() => updateQty(item.id, -1)} className="px-2 py-1 border rounded hover:bg-pink-100 transition-colors"> − </button>
          <span className="text-md font-medium w-8 text-center">{item.qty}</span>
          <button onClick={() => updateQty(item.id, 1)} className="px-2 py-1 border rounded hover:bg-pink-100 transition-colors"> + </button>
        </div>
      </div>
      <button onClick={() => removeItem(item.id)} className="text-pink-600 hover:text-pink-800 ml-4 flex items-center gap-1 transition-colors">
        <TrashIcon /> Remove
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-pink-50 font-sans">
      <ToastifyCSS />
      <main className="max-w-2xl mx-auto w-full p-6 bg-white rounded-lg shadow-lg mt-10">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Your Shopping Cart</h2>

        <InputField
          type="text"
          placeholder="Search for an item in your cart..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        {filteredCart.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">
            {searchTerm ? `Nothing found for "${searchTerm}". Try another search!` : "Your cart is currently empty."}
          </p>
        ) : (
          filteredCart.map(item => <CartItem key={item.id} item={item} />)
        )}

        <div className="mt-6 border-t pt-4 text-right">
          <p className="text-xl font-bold text-gray-800">
            Total: ₹{total.toFixed(2)}
          </p>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className={`mt-4 w-full py-3 rounded-lg font-semibold text-lg transition-all duration-300 ${
              cart.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-pink-600 text-white hover:bg-pink-700 hover:shadow-lg transform hover:-translate-y-1'
            }`}
          >
            Proceed to Checkout
          </button>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-sm">
            <h2 className="text-2xl font-semibold mb-6 text-center">Delivery Information</h2>
            <InputField name="phone" placeholder="Phone Number" value={orderDetails.phone} onChange={handleInputChange} maxLength="10" />
            <textarea name="address" placeholder="Full Address" value={orderDetails.address} onChange={handleInputChange} className="border border-pink-300 p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-pink-400" rows="3" />
            <div className="flex gap-4">
              <InputField name="city" placeholder="City" value={orderDetails.city} onChange={handleInputChange} />
              <InputField name="pincode" placeholder="Pincode" value={orderDetails.pincode} onChange={handleInputChange} maxLength="6" />
            </div>
            <InputField name="state" placeholder="State" value={orderDetails.state} onChange={handleInputChange} />
            <select name="paymentMethod" value={orderDetails.paymentMethod} onChange={handleInputChange} className="border border-pink-300 p-2 w-full mb-6 rounded focus:outline-none focus:ring-2 focus:ring-pink-400">
              <option value="">Select Payment Method</option>
              <option value="cod">Cash on Delivery</option>
            </select>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
              <button onClick={handleConfirmOrder} className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">Confirm Order</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default MyCart;
