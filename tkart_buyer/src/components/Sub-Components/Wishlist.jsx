import React, { useState, useEffect, useCallback } from 'react';
import { FaTrash, FaCartPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const WishlistCard = ({ item, onRemove, onAddToCart }) => (
  <div className="bg-pink-50 p-4 rounded-lg shadow flex flex-col justify-between">
    <div>
      <div className="w-full h-40 bg-pink-100 rounded mb-4 flex items-center justify-center text-4xl">
        📦
      </div>
      <h3 className="font-semibold text-lg text-pink-700">{item.name}</h3>
      <p className="text-yellow-500 text-sm mt-1">
        {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
      </p>
      <p className="text-gray-700 font-medium mt-2">₹ {item.price || 'N/A'}</p>
    </div>
    <div className="flex gap-3 mt-4">
      <button
        onClick={() => onRemove(item.id)}
        className="flex-1 flex items-center justify-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200"
      >
        <FaTrash /> Remove
      </button>
      <button
        onClick={() => onAddToCart(item)}
        className="flex-1 flex items-center justify-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded hover:bg-green-200"
      >
        <FaCartPlus /> Add Cart
      </button>
    </div>
  </div>
);

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('wishlist')) || [];
    setWishlist(stored);
  }, []);

  const handleRemove = useCallback(
    (id) => {
      const updated = wishlist.filter(item => item.id !== id);
      setWishlist(updated);
      localStorage.setItem('wishlist', JSON.stringify(updated));
    },
    [wishlist]
  );

  const handleAddToCart = useCallback(
    (item) => {
      const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
      const existing = storedCart.find(i => i.name === item.name);

      const updatedCart = existing
        ? storedCart.map(i =>
            i.name === item.name ? { ...i, qty: i.qty + 1 } : i
          )
        : [...storedCart, { ...item, qty: 1 }];

      localStorage.setItem('cart', JSON.stringify(updatedCart));
      toast.success(`${item.name} added to cart!`);
    },
    []
  );

  return (
    <div className="min-h-screen font-josefin bg-[url('https://www.transparenttextures.com/patterns/white-leather.png')] bg-cover bg-fixed">
      <div className="min-h-screen bg-white/50 backdrop-blur-md">
        <main className="max-w-7xl mx-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-3xl font-semibold text-pink-700 mb-6">Your Wishlist</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {wishlist.length === 0 ? (
                <div className="col-span-full text-center text-gray-500">
                  Your wishlist is empty. Browse products and add some! 💖
                </div>
              ) : (
                wishlist.map(item => (
                  <WishlistCard
                    key={`${item.id}-${item.name}`}
                    item={item}
                    onRemove={handleRemove}
                    onAddToCart={handleAddToCart}
                  />
                ))
              )}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Wishlist;
