import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

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

  // Enhanced category structure with elegant icons
  const categoryStructure = {
    Household: {
      subcategories: ['Bedroom', 'Living Room', 'Bathroom', 'Cleaning Supplies', 'Electrical & Misc'],
      icon: '🛋️'
    },
    Fashion: {
      subcategories: ['Clothing', 'Accessories', 'Footwear', 'Materials'],
      icon: '👗'
    },
    Kitchen: {
      subcategories: ['Cooking Appliances', 'Cookware', 'Utensils & Cutlery', 'Storage Containers', 'Cleaning', 'Food Basics', 'Prep Tools'],
      icon: '🍳'
    },
    Cosmetics: {
      subcategories: ['Makeup', 'Skincare', 'Haircare', 'Bodycare', 'Nailcare'],
      icon: '💄'
    },
    Organics: {
      subcategories: ['Skincare & Beauty', 'Organic Food', 'Wellness', 'Home & Personal', 'Gardening', 'Eco Products'],
      icon: '🌿'
    },
    Handcrafts: {
      subcategories: ['Home Decor', 'Fashion Accessories', 'Traditional Crafts', 'Fabric Crafts', 'Gifts & Stationery', 'Kids & DIY', 'Kitchen Items'],
      icon: '✂️'
    },
    Groceries: {
      subcategories: ['Grains & Staples', 'Pulses', 'Oils & Ghee', 'Spices', 'Sweeteners', 'Beverages', 'Snacks', 'Essentials', 'Vegetables'],
      icon: '🛒'
    },
    Jewellery: {
      subcategories: ['Earrings', 'Necklaces', 'Rings', 'Bracelets/Bangles', 'Anklets', 'Nose Jewelry', 'Hair/Head Jewelry', 'Other Accessories', 'Eco-Friendly'],
      icon: '💍'
    },
    Stationery: {
      subcategories: ['Writing Tools', 'Paper Products', 'Office Supplies', 'Art Supplies', 'Math Tools', 'Misc'],
      icon: '📝'
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/products');
        setProducts(response.data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
        setLoading(false);
        setProducts([]);
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
    toast.success(`${product.name} added to cart!`, {
      icon: '🛒',
      style: {
        background: 'linear-gradient(to right, #f9a8d4, #f472b6)',
        color: 'white',
      }
    });
  };

  const addToWishlist = (product) => {
    const exists = wishlistItems.find(item => item.id === product.id);
    if (!exists) {
      const updated = [...wishlistItems, product];
      setWishlistItems(updated);
      localStorage.setItem('wishlist', JSON.stringify(updated));
      toast.success(`❤️ ${product.name} added to wishlist!`, {
        style: {
          background: 'linear-gradient(to right, #f9a8d4, #f472b6)',
          color: 'white',
        }
      });
    } else {
      toast.info(`${product.name} is already in wishlist`, {
        style: {
          background: 'linear-gradient(to right, #f9a8d4, #f472b6)',
          color: 'white',
        }
      });
    }
  };

  const filteredProducts = Array.isArray(products)
    ? products.filter(product => {
      if (!product) return false;
      const matchesCategory = product.category === selectedCategory;
      const matchesSubCategory = product.subcategory === selectedSubCategory;
      const matchesSearch =
        (product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchesCategory && matchesSubCategory && matchesSearch;
    })
    : [];

  const FloatingFooterBar = () => {
    return (
      <div className="fixed sm:hidden bottom-0 left-0 right-0 bg-white border-t border-pink-200 shadow-lg z-50">
        <div className="flex justify-around items-center h-16">
          {/* Home */}
          <Link to="/home" className="flex flex-col items-center justify-center p-1 text-gray-600 hover:text-pink-500">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs mt-0.5">Home</span>
          </Link>

          {/* Categories */}
          <button className="flex flex-col items-center justify-center p-1 text-gray-600 hover:text-pink-500">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="text-xs mt-0.5">Categories</span>
          </button>

          {/* Search */}
          <button className="flex flex-col items-center justify-center p-1 text-gray-600 hover:text-pink-500">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-xs mt-0.5">Search</span>
          </button>

          {/* Cart with badge */}
          <Link to="/cart" className="flex flex-col items-center justify-center p-1 text-gray-600 hover:text-pink-500 relative">
            <div className="relative">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </div>
            <span className="text-xs mt-0.5">Cart</span>
          </Link>

          {/* Account */}
          <Link to="/profile" className="flex flex-col items-center justify-center p-1 text-gray-600 hover:text-pink-500">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs mt-0.5">Account</span>
          </Link>
        </div>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white text-gray-900 font-sans flex flex-col">
      <div className="w-full">
        
      </div>

      <AnimatePresence>
        {confirmationMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-white px-6 py-3 rounded-full shadow-lg border border-pink-100 flex items-center">
              <div className="w-4 h-4 bg-pink-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium">{confirmationMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="w-64 bg-gradient-to-b from-white to-pink-50 border-r border-pink-100 p-4 hidden sm:block sticky top-20 h-[calc(100vh-80px)] overflow-auto">
          <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Categories</h2>
          <ul className="space-y-2">
            {Object.entries(categoryStructure).map(([category, data]) => (
              <li key={category}>
                <button
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${selectedCategory === category
                      ? 'bg-pink-100/50 text-pink-700 font-semibold shadow-pink-sm'
                      : 'hover:bg-pink-50/30 text-gray-700'
                    }`}
                  onClick={() => {
                    setSelectedCategory(category);
                    setSelectedSubCategory(data.subcategories[0]);
                    setSearchQuery('');
                  }}
                >
                  <div className="flex items-center">
                    <span className="mr-3 text-xl">{data.icon}</span>
                    <span>{category}</span>
                  </div>
                  <svg
                    className={`w-4 h-4 transition-transform ${selectedCategory === category ? 'rotate-90 text-pink-500' : 'text-gray-400'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {selectedCategory === category && (
                  <motion.ul
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.2 }}
                    className="ml-10 mt-1 space-y-1"
                  >
                    {data.subcategories.map((subcategory) => (
                      <li key={subcategory}>
                        <button
                          className={`w-full text-left px-3 py-2 text-sm rounded-xl transition-all ${selectedSubCategory === subcategory
                              ? 'text-pink-600 font-medium bg-pink-100/50 shadow-pink-xs'
                              : 'text-gray-600 hover:bg-pink-50/20'
                            }`}
                          onClick={() => {
                            setSelectedSubCategory(subcategory);
                            setSearchQuery('');
                          }}
                        >
                          {subcategory}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </li>
            ))}
          </ul>
        </aside>

        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
          {/* Mobile Category Button */}
          <div className="sm:hidden mb-4">
            <button
              onClick={() => setShowCategoryModal(true)}
              className="w-full px-4 py-3 bg-white border border-pink-200 rounded-xl shadow-xs flex items-center justify-between hover:bg-pink-50/50 transition-colors"
            >
              <span className="font-medium text-pink-700">Browse Categories</span>
              <svg className="w-5 h-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Header with search */}
          <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {selectedCategory} <span className="text-pink-400">/</span> {selectedSubCategory}
              </h1>
              <p className="text-sm text-pink-500 mt-1">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} available
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-transparent bg-white/50 backdrop-blur-sm shadow-xs"
              />
              <svg
                className="absolute left-3 top-3 h-5 w-5 text-pink-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </header>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden border border-pink-100">
                  <div className="animate-pulse">
                    <div className="bg-pink-100 h-48 w-full"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-pink-100 rounded w-3/4"></div>
                      <div className="h-3 bg-pink-100 rounded w-full"></div>
                      <div className="h-3 bg-pink-100 rounded w-1/2"></div>
                      <div className="h-8 bg-pink-100 rounded-xl mt-4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-pink-100 hover:shadow-md transition-all group"
                >
                  {/* Product Image */}
                  <div className="relative overflow-hidden h-48 bg-pink-50">
                    {product.image1 && (
                      <motion.img
                        src={`data:image/jpeg;base64,${product.image1}`}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <button
                      onClick={() => addToWishlist(product)}
                      className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-pink-100 transition-colors"
                    >
                      <svg
                        className={`w-5 h-5 ${wishlistItems.some(item => item.id === product.id) ? 'text-pink-500 fill-pink-500' : 'text-gray-400 hover:text-pink-500'}`}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-gray-500 text-sm mb-2 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-pink-600">₹{product.price}</span>
                      {product.rating && (
                        <div className="flex items-center text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {product.rating}
                        </div>
                      )}
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addToCart(product)}
                      className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-pink-sm"
                    >
                      Add to Cart
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-pink-100">
              <svg className="w-16 h-16 mx-auto text-pink-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-700 mb-1">No products found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                We couldn't find any products matching your criteria. Try adjusting your search or filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('Household');
                  setSelectedSubCategory('Bedroom');
                }}
                className="mt-4 px-4 py-2 bg-gradient-to-r from-pink-100 to-rose-100 text-pink-600 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Reset Filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Category Modal */}
      <AnimatePresence>
        {showCategoryModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCategoryModal(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-xl border-t border-pink-100"
            >
              <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Categories</h2>
                  <button
                    onClick={() => setShowCategoryModal(false)}
                    className="p-2 text-gray-500 hover:text-pink-500 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto pb-4">
                  {Object.entries(categoryStructure).map(([category, data]) => (
                    <div key={category} className="mb-2">
                      <button
                        className={`w-full flex items-center justify-between p-3 rounded-xl ${selectedCategory === category
                            ? 'bg-pink-100/50 text-pink-700 font-medium'
                            : 'hover:bg-pink-50/30 text-gray-700'
                          }`}
                        onClick={() => {
                          setSelectedCategory(category);
                          setSelectedSubCategory(data.subcategories[0]);
                          setSearchQuery('');
                          setShowCategoryModal(false);
                        }}
                      >
                        <div className="flex items-center">
                          <span className="mr-3 text-xl">{data.icon}</span>
                          <span>{category}</span>
                        </div>
                        <svg className="w-5 h-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <footer className="mt-12 bg-white border-t border-pink-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <img
                src="https://thirumathikart.nitt.edu/assets/img/tklogo.png"
                alt="Logo"
                className="h-8 w-8"
              />
              <span className="ml-2 text-lg font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Thirumathi Kart</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-pink-600 transition-colors">About</a>
              <a href="#" className="text-gray-500 hover:text-pink-600 transition-colors">Contact</a>
              <a href="#" className="text-gray-500 hover:text-pink-600 transition-colors">Privacy</a>
              <a href="#" className="text-gray-500 hover:text-pink-600 transition-colors">Terms</a>
            </div>
          </div>
          <div className="mt-6 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Thirumathi Kart. All rights reserved.
          </div>
        </div>
      </footer>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastClassName="rounded-xl shadow-lg border border-pink-100"
        bodyClassName="p-3 font-medium"
        progressClassName="bg-gradient-to-r from-pink-500 to-rose-500"
      />
      <FloatingFooterBar />
    </div>
  );
}

export default Categories;