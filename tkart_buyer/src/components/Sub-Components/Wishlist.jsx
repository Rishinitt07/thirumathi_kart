import React, { useState, useEffect, useCallback, useMemo } from "react";
import { FaTrash, FaCartPlus } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import ProductDetailModal from './ProductDetailModal';
import { syncCartToDB, syncWishlistToDB } from '../../utils/sync';


const WishlistCard = ({ item, onRemove, onAddToCart, onSelectProduct }) => {
  
  const ratingValue = item.rating ? Math.round(item.rating) : 5;
  const stars = "★".repeat(ratingValue) + "☆".repeat(5 - ratingValue);

  return (
    <div className="group bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 bg-hotpink-50 text-hotpink-600 text-xs font-normal px-3 py-1 rounded-bl-xl z-10 shadow-sm">
        Wishlist
      </div>
      
      {/* Image half */}
      <div 
        className="w-full h-56 bg-gray-50 overflow-hidden relative border-b border-gray-50 cursor-pointer"
        onClick={() => onSelectProduct(item)}
      >
        <img 
          src={item.images?.[0] || 'https://placehold.co/400x400/f472b6/ffffff?text=No+Image'} 
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
      </div>

      {/* Content half */}
      <div className="p-5 flex flex-col flex-1 justify-between bg-white z-10">
        <div>
          <h3 
            className="font-normal text-lg text-gray-800 line-clamp-2 group-hover:text-hotpink-600 transition-colors min-h-[56px] leading-tight cursor-pointer"
            onClick={() => onSelectProduct(item)}
          >
            {item.name}
          </h3>
          <div className="flex items-center justify-between mt-3">
            <p className="text-yellow-400 text-sm flex items-center">{stars} <span className="text-gray-400 text-xs ml-1">({ratingValue}.0)</span></p>
            <p className="text-xl font-normal text-gray-900">
              ₹{item.price !== undefined ? item.price.toLocaleString() : "N/A"}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 mt-5">
          <button
            onClick={() => onAddToCart(item)}
            className="w-full flex items-center justify-center gap-2 bg-hotpink-500 text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-hotpink-600 shadow-md hover:shadow-hotpink-500/30 transition-all active:scale-95"
            aria-label={`Add ${item.name} to cart`}
          >
            <FaCartPlus className="text-lg" />
            Move to Cart
          </button>
          <button
            onClick={() => onRemove(item.id)}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-600 font-medium px-4 py-2 rounded-xl hover:bg-gray-50 hover:text-red-500 hover:border-red-200 transition-all active:scale-95"
            aria-label={`Remove ${item.name} from wishlist`}
          >
            <FaTrash className="text-sm" />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

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
      syncWishlistToDB(updatedList);
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
      syncCartToDB(updatedCart);
      window.dispatchEvent(new Event('storage'));
      toast.success(`${item.name} added to cart!`);
    } catch (error) {
      toast.error("Failed to add to cart, please try again.");
      console.error("Add to cart error:", error);
    }
  }, []);

  const filteredWishlist = useMemo(() => {
    if (!searchTerm) return wishlist;
    return wishlist.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [wishlist, searchTerm]);

  return (
    <div className="min-h-screen font-josefin bg-white">
      <div className="min-h-screen py-10 px-4">
        <main className="max-w-7xl mx-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <h2 className="text-3xl font-normal text-black">
                Your Wishlist
              </h2>

              <div className="relative group w-full sm:w-1/2 md:max-w-sm">
                <input
                  type="text"
                  placeholder="Search your wishlist..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full px-5 py-2.5 rounded-full border border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white focus:outline-none focus:border-hotpink-300 focus:ring-2 focus:ring-hotpink-100 transition-all text-sm text-gray-700 pl-11 placeholder-gray-400"
                />
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-hotpink-400 transition-colors h-4 w-4" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
            </div>

            {filteredWishlist.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">
                {searchTerm ? `No matches found for "${searchTerm}"` : "Your wishlist is empty. Browse products and add some! 💖"}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {filteredWishlist.map((item) => (
                  <WishlistCard
                    key={`${item.id}-${item.name}`}
                    item={item}
                    onRemove={handleRemove}
                    onAddToCart={handleAddToCart}
                    onSelectProduct={setSelectedProduct}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </main>
      </div>

      <ProductDetailModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default Wishlist;
