import React, { useState, useEffect, useCallback } from "react";
import { FaTrash, FaCartPlus } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

// Single wishlist item card
const WishlistCard = ({ item, onRemove, onAddToCart }) => {
  // Render star rating as filled and empty stars
  const stars = "★".repeat(item.rating) + "☆".repeat(5 - item.rating);

  return (
    <div className="bg-pink-50 p-4 rounded-lg shadow flex flex-col justify-between">
      <div>
        {/* Placeholder box for product image or icon */}
        <div className="w-full h-40 bg-pink-100 rounded mb-4 flex items-center justify-center text-4xl">
          📦
        </div>
        <h3 className="font-semibold text-lg text-pink-700">{item.name}</h3>
        <p className="text-yellow-500 text-sm mt-1">{stars}</p>
        <p className="text-gray-700 font-medium mt-2">
          ₹ {item.price !== undefined ? item.price : "N/A"}
        </p>
      </div>
      <div className="flex gap-3 mt-4">
        <button
          onClick={() => onRemove(item.id)}
          className="flex-1 flex items-center justify-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200 transition"
          aria-label={`Remove ${item.name} from wishlist`}
        >
          <FaTrash />
          Remove
        </button>
        <button
          onClick={() => onAddToCart(item)}
          className="flex-1 flex items-center justify-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded hover:bg-green-200 transition"
          aria-label={`Add ${item.name} to cart`}
        >
          <FaCartPlus />
          Add Cart
        </button>
      </div>
    </div>
  );
};

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  // Load wishlist from localStorage when component mounts
  useEffect(() => {
    try {
      const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      setWishlist(storedWishlist);
    } catch {
      // In case storage is corrupted or missing
      setWishlist([]);
    }
  }, []);

  // Remove item from wishlist, update state & storage
  const handleRemove = useCallback(
    (id) => {
      const updatedList = wishlist.filter((item) => item.id !== id);
      setWishlist(updatedList);
      localStorage.setItem("wishlist", JSON.stringify(updatedList));
      toast.info("Item removed from wishlist");
    },
    [wishlist]
  );

  // Add item to cart or increase qty, update localStorage
  const handleAddToCart = useCallback((item) => {
    try {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];

      const existing = storedCart.find((cartItem) => cartItem.id === item.id);

      let updatedCart;
      if (existing) {
        updatedCart = storedCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, qty: cartItem.qty + 1 }
            : cartItem
        );
      } else {
        updatedCart = [...storedCart, { ...item, qty: 1 }];
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      toast.success(`${item.name} added to cart!`);
    } catch (error) {
      toast.error("Failed to add to cart, please try again.");
      console.error("Add to cart error:", error);
    }
  }, []);

  return (
    <div className="min-h-screen font-josefin bg-[url('https://www.transparenttextures.com/patterns/white-leather.png')] bg-cover bg-fixed">
      <div className="min-h-screen bg-white/50 backdrop-blur-md">
        <main className="max-w-7xl mx-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-3xl font-semibold text-pink-700 mb-6">
              Your Wishlist
            </h2>

            {wishlist.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">
                Your wishlist is empty. Browse products and add some! 💖
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {wishlist.map((item) => (
                  <WishlistCard
                    key={`${item.id}-${item.name}`}
                    item={item}
                    onRemove={handleRemove}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </main>
      </div>
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default Wishlist;
