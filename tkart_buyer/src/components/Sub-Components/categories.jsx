import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


// Reusable Sidebar Component
const SidebarItem = ({ to, label, icon }) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
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
        <div className="h-16 flex items-center px-6 border-w">
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

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

const Navbar = ({ toggleSidebar }) => (
  <header className="sticky top-0 z-30 bg-white shadow-sm">
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

const Categories = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Household');
  const [selectedSubCategory, setSelectedSubCategory] = useState('Bedroom');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Available categories structure
  const categoryStructure = {
    Household: {
      subcategories: ['Bedroom', 'Living Room', 'Bathroom', 'Cleaning Supplies', 'Electrical & Misc']
    },
    Fashion: {
      subcategories: ['Clothing', 'Accessories', 'Footwear', 'Materials']
    },
    Kitchen: {
      subcategories: ['Cooking Appliances', 'Cookware', 'Utensils & Cutlery', 'Storage Containers', 'Cleaning', 'Food Basics', 'Prep Tools']
    },
    Cosmetics: {
      subcategories: ['Makeup', 'Skincare', 'Haircare', 'Bodycare', 'Nailcare']
    },
    Organics: {
      subcategories: ['Skincare & Beauty', 'Organic Food', 'Wellness', 'Home & Personal', 'Gardening', 'Eco Products']
    },
    Handcrafts: {
      subcategories: ['Home Decor', 'Fashion Accessories', 'Traditional Crafts', 'Fabric Crafts', 'Gifts & Stationery', 'Kids & DIY', 'Kitchen Items']
    },
    Groceries: {
      subcategories: ['Grains & Staples', 'Pulses', 'Oils & Ghee', 'Spices', 'Sweeteners', 'Beverages', 'Snacks', 'Essentials', 'Vegetables']
    },
    Jewellery: {
      subcategories: ['Earrings', 'Necklaces', 'Rings', 'Bracelets/Bangles', 'Anklets', 'Nose Jewelry', 'Hair/Head Jewelry', 'Other Accessories', 'Eco-Friendly']
    },
    Stationery: {
      subcategories: ['Writing Tools', 'Paper Products', 'Office Supplies', 'Art Supplies', 'Math Tools', 'Misc']
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/products');
        setProducts(response.data || []); // Ensure we always have an array
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
        setLoading(false);
        setProducts([]); // Set to empty array on error
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      setWishlistItems(JSON.parse(storedWishlist));
    }
  }, []);

  const addToCart = (product) => {
    const existing = cartItems.find(item => item.id === product.id);
    const updatedCart = existing
      ? cartItems.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...cartItems, { ...product, quantity: 1 }];

    setCartItems(updatedCart);
    setConfirmationMessage(`${product.name} added to cart!`);
    setTimeout(() => setConfirmationMessage(''), 2000);
  };

  const addToWishlist = (product) => {
    const exists = wishlistItems.find(item => item.id === product.id);
    if (!exists) {
      const updated = [...wishlistItems, product];
      setWishlistItems(updated);
      localStorage.setItem('wishlist', JSON.stringify(updated));
      toast.success(`❤️ ${product.name} added to wishlist!`);
    } else {
      toast.info(`${product.name} is already in wishlist`);
    }
  };

  const filteredProducts = Array.isArray(products)
    ? products.filter(product => {
      if (!product) return false; // Skip null/undefined products
      const matchesCategory = product.category === selectedCategory;
      const matchesSubCategory = product.subcategory === selectedSubCategory;
      const matchesSearch =
        (product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSubCategory && matchesSearch;
    })
    : [];

  return (
    <div className="min-h-screen bg-white text-black font-josefin flex flex-col">
      <div className="w-full">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />

      <AnimatePresence>
        {confirmationMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              boxShadow: "0 0 20px rgba(74, 222, 128, 0.7)" // Glow effect (green)
            }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{
              type: "spring",
              damping: 10,
              stiffness: 100
            }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4 border border-white/30 shadow-lg">
              <div className="text-white font-medium text-sm sm:text-base">
                {confirmationMessage}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-1">
        <aside className="w-64 bg-gray-100 border-w p-4 hidden sm:block sticky top-0 h-[calc(100vh-64px)] overflow-auto">
          <h2 className="text-xl font-bold mb-4">Categories</h2>
          <ul>
            {Object.keys(categoryStructure).map((category) => (
              <li key={category} className="mb-3">
                <button
                  className={`w-full text-left font-semibold ${selectedCategory === category ? 'text-blue-600' : 'hover:text-blue-400'}`}
                  onClick={() => {
                    setSelectedCategory(category);
                    setSelectedSubCategory(categoryStructure[category].subcategories[0]);
                    setSearchQuery('');
                  }}
                >
                  {category}
                </button>
                {selectedCategory === category && (
                  <ul className="ml-4 mt-2">
                    {categoryStructure[category].subcategories.map((subcategory) => (
                      <li key={subcategory} className="mb-1">
                        <button
                          className={`text-sm ${selectedSubCategory === subcategory ? 'text-blue-500 font-semibold' : 'text-gray-700 hover:text-blue-400'}`}
                          onClick={() => {
                            setSelectedSubCategory(subcategory);
                            setSearchQuery('');
                          }}
                        >
                          {subcategory}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </aside>

        <main className="flex-1 p-6 overflow-x-hidden">
          <div className="sm:hidden mb-4 text-right">
            <button
              onClick={() => setShowCategoryModal(true)}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded"
            >
              Browse Categories
            </button>
          </div>

          <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h1 className="text-2xl font-bold">
              {selectedCategory} - {selectedSubCategory}
            </h1>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border px-4 py-2 rounded-md w-full sm:w-64"
            />
          </header>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading ? (
              <div className="col-span-full text-center py-8">Loading products...</div>
            ) : filteredProducts.length > 0 ? (
              <>
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: 0,
                      background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.9) 100%)",
                      boxShadow: "0 4px 15px rgba(100, 100, 255, 0.2)"
                    }}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 8px 25px rgba(100, 100, 255, 0.3)",
                      background: "linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(240,240,255,0.92) 100%)"
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 15
                    }}
                    className="border border-white/30 rounded-md p-4 shadow-sm relative overflow-hidden backdrop-blur-sm"
                  >
                    {/* Subtle glow overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-pink-100/20 opacity-0 pointer-events-none"
                      animate={{
                        opacity: [0, 0.2, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                    />

                    {/* Card content (unchanged but now semi-transparent) */}
                    {product.image1 && (
                      <motion.img
                        src={`data:image/jpeg;base64,${product.image1}`}
                        alt={product.name}
                        className="w-full h-40 object-cover mb-2 rounded"
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}

                    <div className="relative z-10"> {/* Ensure text stays readable */}
                      <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                      <p className="font-bold text-blue-600 mb-2">₹{product.price}</p>

                      <div className="flex flex-wrap gap-2 mt-3">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => addToCart(product)}
                          className="px-4 py-1 text-sm bg-blue-500/90 text-white rounded hover:bg-blue-600 flex-1 min-w-[120px]"
                        >
                          Add to Cart
                        </motion.button>

                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => addToWishlist(product)}
                          className="px-4 py-1 text-sm bg-pink-500/90 text-white rounded hover:bg-pink-600 flex-1 min-w-[120px]"
                        >
                          Add to Wishlist
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </>
            ) : (
              <div className="col-span-full text-center py-8">
                No products found in this category.
              </div>
            )}
          </div>
        </main>
      </div>

      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-start pt-20 bg-grey bg-opacity-0 sm:hidden">
          <div className="bg-white w-11/12 max-w-sm p-4 rounded-lg shadow-lg overflow-auto max-h-[80vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Categories</h2>
              <button onClick={() => setShowCategoryModal(false)} className="text-gray-500 text-xl">✖</button>
            </div>
            <ul>
              {Object.keys(categoryStructure).map((category) => (
                <li key={category} className="mb-3">
                  <button
                    className={`w-full text-left font-semibold ${selectedCategory === category ? 'text-blue-600' : 'hover:text-blue-400'}`}
                    onClick={() => {
                      setSelectedCategory(category);
                      setSelectedSubCategory(categoryStructure[category].subcategories[0]);
                      setSearchQuery('');
                      setShowCategoryModal(false);
                    }}
                  >
                    {category}
                  </button>
                  {selectedCategory === category && (
                    <ul className="ml-4 mt-2">
                      {categoryStructure[category].subcategories.map((subcategory) => (
                        <li key={subcategory} className="mb-1">
                          <button
                            className={`text-sm ${selectedSubCategory === subcategory ? 'text-blue-500 font-semibold' : 'text-gray-700 hover:text-blue-400'}`}
                            onClick={() => {
                              setSelectedSubCategory(subcategory);
                              setSearchQuery('');
                              setShowCategoryModal(false);
                            }}
                          >
                            {subcategory}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <footer className="mt-auto text-center text-sm py-3 text-gray-500 border-t">
        Copyright © 2025 Thirumathi Kart. All Rights Reserved.
      </footer>

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}

export default Categories;