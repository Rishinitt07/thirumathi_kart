import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';

const MyCart = () => {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [checkoutMessage, setCheckoutMessage] = useState("");

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
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

  const total = filteredCart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleCheckout = () => {
    if (filteredCart.length === 0) {
      setCheckoutMessage("Your cart is empty.");
    } else {
      setCheckoutMessage("✅ Order placed successfully! Thank you for shopping with us.");
      setCart([]);
      localStorage.removeItem('cart');
    }
    setTimeout(() => setCheckoutMessage(""), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-josefin">
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <a href="/home" className="flex items-center gap-2">
          <img src="https://thirumathikart.nitt.edu/assets/img/tklogo.png" alt="Logo" className="w-10 h-10 object-contain" />
          <span className="text-xl font-bold text-gray-800">Thirumathi Kart</span>
        </a>
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            placeholder="Search your cart..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="border rounded-full px-4 py-1 text-sm w-full"
          />
        </div>
      </header>

      <main className="max-w-2xl mx-auto w-full p-6 bg-white rounded-lg shadow mt-10">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">My Cart</h2>
        <p className="text-sm text-gray-500 mb-4">{filteredCart.length} Item(s)</p>

        {filteredCart.length === 0 ? (
          <p className="text-center text-gray-400">No items in your cart matching {searchTerm}</p>
        ) : (
          filteredCart.map(item => (
            <div key={item.id} className="flex items-center justify-between border-b py-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded mr-4" />
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
