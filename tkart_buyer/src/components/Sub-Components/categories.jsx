import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import {
  FaSearch,
  FaHeart,
  FaShoppingCart,
  FaFilter,
  FaTimes,
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaMinus,
  FaExpand,
  FaCompress,
} from 'react-icons/fa';
import { debounce } from 'lodash';
import ReactGA from 'react-ga4';

// Initialize Google Analytics (Replace 'G-XXXXXXXXXX' with your actual GA4 tracking ID)
ReactGA.initialize('G-YOUR_ACTUAL_TRACKING_ID');

const Categories = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [expandedImage, setExpandedImage] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [compareProducts, setCompareProducts] = useState([]);
  const [showCompareBar, setShowCompareBar] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortOption, setSortOption] = useState('featured');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [colorFilters, setColorFilters] = useState([]);
  const [sizeFilters, setSizeFilters] = useState([]);
  const [brandFilters, setBrandFilters] = useState([]);
  const [discountFilter, setDiscountFilter] = useState(false);

  const categoryStructure = {
    'All': { subcategories: ['All'], icon: '🛍️', colors: [], sizes: [], brands: [] },
    'Food': {
      subcategories: ['All', 'Snacks', 'Beverages', 'Packaged Foods'],
      icon: '🍎',
      colors: [],
      sizes: ['Small', 'Medium', 'Large'],
      brands: ['HealthyBites', 'TasteGood', 'PureEats'],
    },
    'Clothing': {
      subcategories: ['All', 'Men', 'Women', 'Kids'],
      icon: '👕',
      colors: ['Red', 'Blue', 'Green', 'Black', 'White'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      brands: ['StyleTrend', 'UrbanWear', 'ClassicFit'],
    },
    'Handcrafts': {
      subcategories: ['All', 'Pottery', 'Textiles', 'Woodwork'],
      icon: '🖌️',
      colors: ['Brown', 'Blue', 'Red', 'Natural'],
      sizes: ['Small', 'Medium', 'Large'],
      brands: ['CraftWorks', 'ArtisanHub', 'HandmadeHaven'],
    },
    'Fashion and Jewellery': {
      subcategories: ['All', 'Necklaces', 'Rings', 'Bracelets', 'Clothing'],
      icon: '💍',
      colors: ['Gold', 'Silver', 'Rose Gold', 'Black'],
      sizes: ['One Size', 'Adjustable'],
      brands: ['GlamourGlow', 'ChicShine', 'ElegantCraft'],
    },
    'Beauty and Healthcare': {
      subcategories: ['All', 'Skincare', 'Haircare', 'Wellness'],
      icon: '💆‍♀️',
      colors: [],
      sizes: ['Standard', 'Travel'],
      brands: ['PureCare', 'GlowUp', 'WellnessPro'],
    },
    'Office Code': {
      subcategories: ['All', 'Stationery', 'Electronics', 'Furniture'],
      icon: '💼',
      colors: ['Black', 'White', 'Gray'],
      sizes: ['Standard', 'Compact'],
      brands: ['OfficePro', 'WorkSmart', 'ErgoDesign'],
    },
    'Organic Fruits and Vegetables': {
      subcategories: ['All', 'Fruits', 'Vegetables', 'Mixed Baskets'],
      icon: '🥕',
      colors: [],
      sizes: ['Small', 'Medium', 'Large'],
      brands: ['FarmFresh', 'GreenHarvest', 'OrganicFields'],
    },
    'Others': {
      subcategories: ['All', 'Miscellaneous'],
      icon: '📦',
      colors: [],
      sizes: [],
      brands: ['Generic', 'VarietyCo'],
    },
  };

  const availableFilters = useMemo(() => {
    return categoryStructure[selectedCategory] || { colors: [], sizes: [], brands: [] };
  }, [selectedCategory]);

  useEffect(() => {
    if (quickViewProduct || expandedImage) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [quickViewProduct, expandedImage]);

  let retryCount = 0;
  const maxRetries = 3;
  const fetchProducts = useCallback(async () => {
    if (retryCount >= maxRetries) {
      setError('Failed to load products after multiple attempts. Please check your connection.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://localhost:8081/products', { // Updated to 8081
        timeout: 5000,
        params: {
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          subcategory: selectedSubcategory !== 'All' ? selectedSubcategory : undefined,
        },
      });
      const enhancedProducts = response.data.map(product => ({
        ...product,
        rating: product.rating || Math.round(Math.random() * 20) / 4,
        stock: product.stock || Math.floor(Math.random() * 100),
        colors: product.colors || availableFilters.colors.slice(0, Math.floor(Math.random() * 3) + 1),
        sizes: product.sizes || availableFilters.sizes.slice(0, Math.floor(Math.random() * 3) + 1),
        brand: product.brand || availableFilters.brands[Math.floor(Math.random() * availableFilters.brands.length)] || 'Generic',
        discount: product.discount || (Math.random() > 0.7 ? Math.floor(Math.random() * 50) + 10 : 0),
        images: product.images && Array.isArray(product.images) ? product.images : ['/placeholder-product.jpg'],
      }));
      setProducts(enhancedProducts);
      ReactGA.event({ category: 'Category', action: 'View', label: selectedCategory });
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(`Failed to load products. Retrying in ${5000 * Math.pow(2, retryCount) / 1000}s...`);
      retryCount++;
      setTimeout(() => fetchProducts(), 5000 * Math.pow(2, retryCount)); // Exponential backoff
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedSubcategory, availableFilters]);

  useEffect(() => {
    fetchProducts();

    const viewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    setRecentlyViewed(viewed);

    const params = new URLSearchParams(location.search);
    if (params.get('category')) setSelectedCategory(params.get('category'));
    if (params.get('subcategory')) setSelectedSubcategory(params.get('subcategory'));
    if (params.get('search')) setSearchQuery(params.get('search'));
  }, [location.search, fetchProducts]);

  useEffect(() => {
    if (products.length > 0 && recentlyViewed.length > 0) {
      localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
    }
  }, [recentlyViewed, products]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setCart(storedCart);
    setWishlist(storedWishlist);
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [cart, wishlist]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== 'All') params.set('category', selectedCategory);
    if (selectedSubcategory !== 'All') params.set('subcategory', selectedSubcategory);
    if (searchQuery) params.set('search', searchQuery);
    navigate(`?${params.toString()}`, { replace: true });
  }, [selectedCategory, selectedSubcategory, searchQuery, navigate]);

  const applyFilters = useCallback(() => {
    let result = [...products];

    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
      if (selectedSubcategory !== 'All') {
        result = result.filter(p => p.subcategory === selectedSubcategory);
      }
    }

    result = result.filter(p => {
      const discountedPrice = p.price * (1 - p.discount / 100);
      return discountedPrice >= priceRange[0] && discountedPrice <= priceRange[1];
    });

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        (p.brand && p.brand.toLowerCase().includes(query))
      );
    }

    if (availabilityFilter === 'in-stock') {
      result = result.filter(p => p.stock > 0);
    } else if (availabilityFilter === 'out-of-stock') {
      result = result.filter(p => p.stock <= 0);
    }

    if (ratingFilter > 0) {
      result = result.filter(p => p.rating >= ratingFilter);
    }

    if (colorFilters.length > 0) {
      result = result.filter(p =>
        p.colors && p.colors.some(color => colorFilters.includes(color))
      );
    }

    if (sizeFilters.length > 0) {
      result = result.filter(p =>
        p.sizes && p.sizes.some(size => sizeFilters.includes(size))
      );
    }

    if (brandFilters.length > 0) {
      result = result.filter(p => brandFilters.includes(p.brand));
    }

    if (discountFilter) {
      result = result.filter(p => p.discount > 0);
    }

    switch (sortOption) {
      case 'price-low':
        result.sort((a, b) => (a.price * (1 - a.discount / 100)) - (b.price * (1 - b.discount / 100)));
        break;
      case 'price-high':
        result.sort((a, b) => (b.price * (1 - b.discount / 100)) - (a.price * (1 - a.discount / 100)));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'discount':
        result.sort((a, b) => b.discount - a.discount);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      default:
        result.sort((a, b) => (b.featured || 0) - (a.featured || 0));
    }

    return result;
  }, [
    products,
    selectedCategory,
    selectedSubcategory,
    priceRange,
    searchQuery,
    sortOption,
    availabilityFilter,
    ratingFilter,
    colorFilters,
    sizeFilters,
    brandFilters,
    discountFilter,
  ]);

  useEffect(() => {
    const debouncedFilter = debounce(() => {
      setFilteredProducts(applyFilters());
      setCurrentPage(1);
    }, 300);
    debouncedFilter();
    return () => debouncedFilter.cancel();
  }, [applyFilters]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const addToCart = (product, qty = 1) => {
    const existingItem = cart.find(item => item.id === product.id);
    let updatedCart;
    if (existingItem) {
      updatedCart = cart.map(item =>
        item.id === product.id ? { ...item, qty: item.qty + qty } : item
      );
    } else {
      updatedCart = [...cart, { ...product, qty }];
    }
    setCart(updatedCart);
    toast.success(`${qty} ${product.name} added to cart`);
    ReactGA.event({ category: 'Cart', action: 'Add', label: product.name, value: product.price });
  };

  const toggleWishlist = (product) => {
    const exists = wishlist.some(item => item.id === product.id);
    if (exists) {
      setWishlist(wishlist.filter(item => item.id !== product.id));
      toast.info(`${product.name} removed from wishlist`);
    } else {
      setWishlist([...wishlist, product]);
      toast.success(`${product.name} added to wishlist`);
      ReactGA.event({ category: 'Wishlist', action: 'Add', label: product.name });
    }
  };

  const openQuickView = (product) => {
    setQuickViewProduct(product);
    setSelectedImage(0);
    setQuantity(1);
    if (!recentlyViewed.some(item => item.id === product.id)) {
      setRecentlyViewed(prev => [product, ...prev].slice(0, 5));
    }
    ReactGA.event({ category: 'Product', action: 'Quick View', label: product.name });
  };

  const toggleCompare = (product) => {
    const exists = compareProducts.some(item => item.id === product.id);
    if (exists) {
      setCompareProducts(compareProducts.filter(item => item.id !== product.id));
      toast.info(`${product.name} removed from comparison`);
    } else {
      if (compareProducts.length >= 3) {
        toast.error('You can compare up to 3 products at a time');
        return;
      }
      setCompareProducts([...compareProducts, product]);
      toast.success(`${product.name} added to comparison`);
      setShowCompareBar(true);
    }
  };

  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = rating % 1 >= 0.5;
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    return (
      <div className="flex items-center">
        {stars}
        <span className="ml-1 text-sm text-gray-600">({(rating || 0).toFixed(1)})</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="bg-gray-200 h-48 w-full"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Error Loading Products</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              retryCount = 0;
              fetchProducts();
            }}
            className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {selectedCategory === 'All' ? 'All Products' : selectedCategory}
                  {selectedSubcategory !== 'All' && ` / ${selectedSubcategory}`}
                </h1>
                <p className="text-sm text-gray-500">
                  {filteredProducts.length} products found
                </p>
              </div>

              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <div className="relative flex-1 md:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <button
                  className="md:hidden p-2 text-gray-500 hover:text-pink-600"
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                >
                  <FaFilter size={20} />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <aside className="hidden md:block w-72 flex-shrink-0">
              <div className="bg-white p-6 rounded-lg shadow-sm sticky top-8 space-y-6">
                <h2 className="text-xl font-semibold mb-2">Filters</h2>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Categories</h3>
                  <ul className="space-y-2">
                    {Object.keys(categoryStructure).map((category) => (
                      <li key={category}>
                        <button
                          className={`w-full text-left px-3 py-2 rounded-md flex items-center ${selectedCategory === category ? 'bg-pink-100 text-pink-700' : 'hover:bg-gray-100'}`}
                          onClick={() => {
                            setSelectedCategory(category);
                            setSelectedSubcategory('All');
                            setColorFilters([]);
                            setSizeFilters([]);
                            setBrandFilters([]);
                          }}
                        >
                          <span className="mr-2">{categoryStructure[category].icon}</span>
                          {category}
                        </button>
                        {selectedCategory === category && (
                          <ul className="ml-8 mt-1 space-y-1">
                            {categoryStructure[category].subcategories.map((subcat) => (
                              <li key={subcat}>
                                <button
                                  className={`w-full text-left px-3 py-1 text-sm rounded-md ${selectedSubcategory === subcat ? 'text-pink-600 font-medium' : 'hover:text-gray-800'}`}
                                  onClick={() => setSelectedSubcategory(subcat)}
                                >
                                  {subcat}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Price Range</h3>
                  <div className="px-2">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">₹{priceRange[0]}</span>
                      <span className="text-sm">₹{priceRange[1]}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full accent-pink-500"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Availability</h3>
                  <div className="space-y-2">
                    {['all', 'in-stock', 'out-of-stock'].map((option) => (
                      <label key={option} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="availability"
                          checked={availabilityFilter === option}
                          onChange={() => setAvailabilityFilter(option)}
                          className="text-pink-600 focus:ring-pink-500"
                        />
                        <span className="capitalize">
                          {option === 'all' ? 'All Products' : option === 'in-stock' ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Customer Rating</h3>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map((stars) => (
                      <label key={stars} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="rating"
                          checked={ratingFilter === stars}
                          onChange={() => setRatingFilter(ratingFilter === stars ? 0 : stars)}
                          className="text-pink-600 focus:ring-pink-500"
                        />
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) =>
                            i < stars ? (
                              <FaStar key={i} className="text-yellow-400" />
                            ) : (
                              <FaRegStar key={i} className="text-yellow-400" />
                            )
                          )}
                          <span className="ml-1 text-sm">& Up</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {availableFilters.colors.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Colors</h3>
                    <div className="flex flex-wrap gap-2">
                      {availableFilters.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => {
                            setColorFilters(prev =>
                              prev.includes(color)
                                ? prev.filter(c => c !== color)
                                : [...prev, color]
                            );
                          }}
                          className={`flex items-center justify-center w-8 h-8 rounded-full border ${
                            colorFilters.includes(color) ? 'ring-2 ring-pink-500' : 'hover:ring-1 hover:ring-gray-300'
                          }`}
                          style={{ backgroundColor: color.toLowerCase() }}
                          title={color}
                        >
                          {colorFilters.includes(color) && <FaTimes className="text-white text-xs" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {availableFilters.sizes.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Sizes</h3>
                    <div className="flex flex-wrap gap-2">
                      {availableFilters.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => {
                            setSizeFilters(prev =>
                              prev.includes(size)
                                ? prev.filter(s => s !== size)
                                : [...prev, size]
                            );
                          }}
                          className={`px-3 py-1 text-sm rounded-md border ${
                            sizeFilters.includes(size) ? 'bg-pink-100 text-pink-700 border-pink-300' : 'hover:bg-gray-50'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {availableFilters.brands.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Brands</h3>
                    <div className="space-y-2">
                      {availableFilters.brands.map((brand) => (
                        <label key={brand} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={brandFilters.includes(brand)}
                            onChange={() => {
                              setBrandFilters(prev =>
                                prev.includes(brand)
                                  ? prev.filter(b => b !== brand)
                                  : [...prev, brand]
                              );
                            }}
                            className="text-pink-600 focus:ring-pink-500"
                          />
                          <span>{brand}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={discountFilter}
                      onChange={() => setDiscountFilter(!discountFilter)}
                      className="text-pink-600 focus:ring-pink-500"
                    />
                    <span className="font-medium">Discounted Items Only</span>
                  </label>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Sort By</h3>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="discount">Biggest Discount</option>
                    <option value="newest">Newest Arrivals</option>
                  </select>
                </div>

                {(selectedCategory !== 'All' || selectedSubcategory !== 'All' || searchQuery ||
                  priceRange[1] < 10000 || availabilityFilter !== 'all' || ratingFilter > 0 ||
                  colorFilters.length > 0 || sizeFilters.length > 0 || brandFilters.length > 0 ||
                  discountFilter) && (
                    <button
                      onClick={() => {
                        setSelectedCategory('All');
                        setSelectedSubcategory('All');
                        setSearchQuery('');
                        setPriceRange([0, 10000]);
                        setAvailabilityFilter('all');
                        setRatingFilter(0);
                        setColorFilters([]);
                        setSizeFilters([]);
                        setBrandFilters([]);
                        setDiscountFilter(false);
                        setSortOption('featured');
                      }}
                      className="w-full py-2 text-pink-600 border border-pink-600 rounded-md hover:bg-pink-50"
                    >
                      Clear All Filters
                    </button>
                  )}
              </div>
            </aside>

            <AnimatePresence>
              {showMobileFilters && (
                <>
                  <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setShowMobileFilters(false)}
                  />
                  <motion.aside
                    initial={{ x: -300 }}
                    animate={{ x: 0 }}
                    exit={{ x: -300 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed inset-y-0 left-0 w-80 bg-white z-50 shadow-xl p-6 overflow-y-auto md:hidden"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold">Filters</h2>
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => setShowMobileFilters(false)}
                      >
                        <FaTimes size={20} />
                      </button>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Categories</h3>
                        <ul className="space-y-2">
                          {Object.keys(categoryStructure).map((category) => (
                            <li key={category}>
                              <button
                                className={`w-full text-left px-3 py-2 rounded-md flex items-center ${selectedCategory === category ? 'bg-pink-100 text-pink-700' : 'hover:bg-gray-100'}`}
                                onClick={() => {
                                  setSelectedCategory(category);
                                  setSelectedSubcategory('All');
                                  setColorFilters([]);
                                  setSizeFilters([]);
                                  setBrandFilters([]);
                                }}
                              >
                                <span className="mr-2">{categoryStructure[category].icon}</span>
                                {category}
                              </button>
                              {selectedCategory === category && (
                                <ul className="ml-8 mt-1 space-y-1">
                                  {categoryStructure[category].subcategories.map((subcat) => (
                                    <li key={subcat}>
                                      <button
                                        className={`w-full text-left px-3 py-1 text-sm rounded-md ${selectedSubcategory === subcat ? 'text-pink-600 font-medium' : 'hover:text-gray-800'}`}
                                        onClick={() => setSelectedSubcategory(subcat)}
                                      >
                                        {subcat}
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">Price Range</h3>
                        <div className="px-2">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">₹{priceRange[0]}</span>
                            <span className="text-sm">₹{priceRange[1]}</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="10000"
                            step="100"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                            className="w-full accent-pink-500"
                          />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">Availability</h3>
                        <div className="space-y-2">
                          {['all', 'in-stock', 'out-of-stock'].map((option) => (
                            <label key={option} className="flex items-center space-x-2">
                              <input
                                type="radio"
                                name="availability"
                                checked={availabilityFilter === option}
                                onChange={() => setAvailabilityFilter(option)}
                                className="text-pink-600 focus:ring-pink-500"
                              />
                              <span className="capitalize">
                                {option === 'all' ? 'All Products' : option === 'in-stock' ? 'In Stock' : 'Out of Stock'}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">Customer Rating</h3>
                        <div className="space-y-2">
                          {[4, 3, 2, 1].map((stars) => (
                            <label key={stars} className="flex items-center space-x-2">
                              <input
                                type="radio"
                                name="rating"
                                checked={ratingFilter === stars}
                                onChange={() => setRatingFilter(ratingFilter === stars ? 0 : stars)}
                                className="text-pink-600 focus:ring-pink-500"
                              />
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) =>
                                  i < stars ? (
                                    <FaStar key={i} className="text-yellow-400" />
                                  ) : (
                                    <FaRegStar key={i} className="text-yellow-400" />
                                  )
                                )}
                                <span className="ml-1 text-sm">& Up</span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      {availableFilters.colors.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Colors</h3>
                          <div className="flex flex-wrap gap-2">
                            {availableFilters.colors.map((color) => (
                              <button
                                key={color}
                                onClick={() => {
                                  setColorFilters(prev =>
                                    prev.includes(color)
                                      ? prev.filter(c => c !== color)
                                      : [...prev, color]
                                  );
                                }}
                                className={`flex items-center justify-center w-8 h-8 rounded-full border ${
                                  colorFilters.includes(color) ? 'ring-2 ring-pink-500' : 'hover:ring-1 hover:ring-gray-300'
                                }`}
                                style={{ backgroundColor: color.toLowerCase() }}
                                title={color}
                              >
                                {colorFilters.includes(color) && <FaTimes className="text-white text-xs" />}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {availableFilters.sizes.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Sizes</h3>
                          <div className="flex flex-wrap gap-2">
                            {availableFilters.sizes.map((size) => (
                              <button
                                key={size}
                                onClick={() => {
                                  setSizeFilters(prev =>
                                    prev.includes(size)
                                      ? prev.filter(s => s !== size)
                                      : [...prev, size]
                                  );
                                }}
                                className={`px-3 py-1 text-sm rounded-md border ${
                                  sizeFilters.includes(size) ? 'bg-pink-100 text-pink-700 border-pink-300' : 'hover:bg-gray-50'
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {availableFilters.brands.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Brands</h3>
                          <div className="space-y-2">
                            {availableFilters.brands.map((brand) => (
                              <label key={brand} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={brandFilters.includes(brand)}
                                  onChange={() => {
                                    setBrandFilters(prev =>
                                      prev.includes(brand)
                                        ? prev.filter(b => b !== brand)
                                        : [...prev, brand]
                                    );
                                  }}
                                  className="text-pink-600 focus:ring-pink-500"
                                />
                                <span>{brand}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={discountFilter}
                            onChange={() => setDiscountFilter(!discountFilter)}
                            className="text-pink-600 focus:ring-pink-500"
                          />
                          <span className="font-medium">Discounted Items Only</span>
                        </label>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">Sort By</h3>
                        <select
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                          value={sortOption}
                          onChange={(e) => setSortOption(e.target.value)}
                        >
                          <option value="featured">Featured</option>
                          <option value="price-low">Price: Low to High</option>
                          <option value="price-high">Price: High to Low</option>
                          <option value="rating">Highest Rated</option>
                          <option value="discount">Biggest Discount</option>
                          <option value="newest">Newest Arrivals</option>
                        </select>
                      </div>

                      {(selectedCategory !== 'All' || selectedSubcategory !== 'All' || searchQuery ||
                        priceRange[1] < 10000 || availabilityFilter !== 'all' || ratingFilter > 0 ||
                        colorFilters.length > 0 || sizeFilters.length > 0 || brandFilters.length > 0 ||
                        discountFilter) && (
                          <button
                            onClick={() => {
                              setSelectedCategory('All');
                              setSelectedSubcategory('All');
                              setSearchQuery('');
                              setPriceRange([0, 10000]);
                              setAvailabilityFilter('all');
                              setRatingFilter(0);
                              setColorFilters([]);
                              setSizeFilters([]);
                              setBrandFilters([]);
                              setDiscountFilter(false);
                              setSortOption('featured');
                            }}
                            className="w-full py-2 text-pink-600 border border-pink-600 rounded-md hover:bg-pink-50"
                          >
                            Clear All Filters
                          </button>
                        )}
                    </div>
                  </motion.aside>
                </>
              )}
            </AnimatePresence>

            <main className="flex-1">
              {recentlyViewed.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Recently Viewed</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {recentlyViewed.map((product) => (
                      <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div
                          className="relative h-40 bg-gray-100 cursor-pointer"
                          onClick={() => openQuickView(product)}
                        >
                          <img
                            src={product.images?.[0] || '/placeholder-product.jpg'}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => { e.target.src = '/placeholder-product.jpg'; }}
                          />
                          <button
                            className={`absolute top-2 right-2 p-2 rounded-full ${wishlist.some(item => item.id === product.id) ? 'text-pink-600' : 'text-gray-400 hover:text-pink-600'}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWishlist(product);
                            }}
                          >
                            <FaHeart />
                          </button>
                        </div>
                        <div className="p-3">
                          <h3 className="font-medium text-sm mb-1 truncate">{product.name}</h3>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-pink-600">
                              ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
                            </span>
                            {product.discount > 0 && (
                              <span className="text-xs text-gray-500 line-through">
                                ₹{product.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    {selectedCategory === 'All' ? 'All Products' : selectedCategory}
                    {selectedSubcategory !== 'All' && ` / ${selectedSubcategory}`}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length}
                    </span>
                  </div>
                </div>

                {currentProducts.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {currentProducts.map((product) => (
                      <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        <div
                          className="relative h-48 bg-gray-100 cursor-pointer"
                          onClick={() => openQuickView(product)}
                        >
                          <img
                            src={product.images?.[0] || '/placeholder-product.jpg'}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => { e.target.src = '/placeholder-product.jpg'; }}
                          />
                          {product.discount > 0 && (
                            <span className="absolute top-2 left-2 bg-pink-600 text-white text-xs px-2 py-1 rounded">
                              {product.discount}% OFF
                            </span>
                          )}
                          <button
                            className={`absolute top-2 right-2 p-2 rounded-full ${wishlist.some(item => item.id === product.id) ? 'text-pink-600' : 'text-gray-400 hover:text-pink-600'}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWishlist(product);
                            }}
                          >
                            <FaHeart />
                          </button>
                          {product.stock <= 0 && (
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                              <span className="text-white font-bold bg-red-500 px-2 py-1 rounded text-sm">OUT OF STOCK</span>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-1">
                            <h3
                              className="font-medium text-sm hover:text-pink-600 cursor-pointer line-clamp-2"
                              onClick={() => openQuickView(product)}
                            >
                              {product.name}
                            </h3>
                            <button
                              className={`p-1 ${compareProducts.some(item => item.id === product.id) ? 'text-pink-600' : 'text-gray-400 hover:text-pink-600'}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleCompare(product);
                              }}
                              title={compareProducts.some(item => item.id === product.id) ? 'Remove from Compare' : 'Add to Compare'}
                            >
                              <FaCompress size={14} />
                            </button>
                          </div>
                          <div className="mb-2">
                            {renderRating(product.rating)}
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-bold text-pink-600">
                                ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
                              </span>
                              {product.discount > 0 && (
                                <span className="ml-1 text-xs text-gray-500 line-through">
                                  ₹{product.price.toFixed(2)}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(product);
                              }}
                              disabled={product.stock <= 0}
                              className={`p-2 rounded-full ${product.stock <= 0 ? 'bg-gray-200 text-gray-400' : 'bg-pink-100 text-pink-600 hover:bg-pink-200'}`}
                            >
                              <FaShoppingCart size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <h3 className="text-lg font-medium mb-2">No products found</h3>
                    <p className="text-gray-600 mb-4">Try adjusting your filters or search query</p>
                    <button
                      onClick={() => {
                        setSelectedCategory('All');
                        setSelectedSubcategory('All');
                        setSearchQuery('');
                        setPriceRange([0, 10000]);
                        setAvailabilityFilter('all');
                        setRatingFilter(0);
                        setColorFilters([]);
                        setSizeFilters([]);
                        setBrandFilters([]);
                        setDiscountFilter(false);
                      }}
                      className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
                    >
                      Reset Filters
                    </button>
                  </div>
                )}

                {filteredProducts.length > productsPerPage && (
                  <div className="flex justify-center mt-8">
                    <nav className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-full border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                      >
                        <FaChevronLeft />
                      </button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-10 h-10 rounded-full ${currentPage === pageNum ? 'bg-pink-600 text-white' : 'hover:bg-gray-100'}`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      {totalPages > 5 && currentPage < totalPages - 2 && <span className="px-2">...</span>}
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          className={`w-10 h-10 rounded-full ${currentPage === totalPages ? 'bg-pink-600 text-white' : 'hover:bg-gray-100'}`}
                        >
                          {totalPages}
                        </button>
                      )}
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-full border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                      >
                        <FaChevronRight />
                      </button>
                    </nav>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>

        <AnimatePresence>
          {quickViewProduct && (
            <>
              <div
                className="fixed inset-0 bg-transparent z-50"
                onClick={() => setQuickViewProduct(null)}
              />
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed inset-x-0 bottom-0 sm:inset-0 sm:m-auto max-w-4xl w-full max-h-[90vh] bg-white rounded-t-lg sm:rounded-lg shadow-xl z-50 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <button
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md z-10 hover:bg-gray-100"
                    onClick={() => setQuickViewProduct(null)}
                  >
                    <FaTimes />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                    <div className="space-y-4">
                      <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={quickViewProduct.images?.[selectedImage] || '/placeholder-product.jpg'}
                          alt={quickViewProduct.name}
                          className="w-full h-full object-contain"
                          loading="lazy"
                          onError={(e) => { e.target.src = '/placeholder-product.jpg'; }}
                        />
                        <button
                          className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                          onClick={() => setExpandedImage(quickViewProduct.images?.[selectedImage] || '/placeholder-product.jpg')}
                        >
                          <FaExpand />
                        </button>
                      </div>
                      {quickViewProduct.images?.length > 1 && (
                        <div className="grid grid-cols-4 gap-2">
                          {quickViewProduct.images.map((img, idx) => (
                            <button
                              key={idx}
                              className={`h-16 bg-gray-100 rounded overflow-hidden ${selectedImage === idx ? 'ring-2 ring-pink-500' : ''}`}
                              onClick={() => setSelectedImage(idx)}
                            >
                              <img
                                src={img}
                                alt={`${quickViewProduct.name} thumbnail ${idx + 1}`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                onError={(e) => { e.target.src = '/placeholder-product.jpg'; }}
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{quickViewProduct.name}</h2>
                      <div className="flex items-center mb-4">
                        {renderRating(quickViewProduct.rating)}
                        <span className="ml-2 text-sm text-gray-500">
                          ({quickViewProduct.reviews || 0} reviews)
                        </span>
                      </div>
                      <div className="mb-4">
                        <span className="text-2xl font-bold text-pink-600">
                          ₹{(quickViewProduct.price * (1 - quickViewProduct.discount / 100)).toFixed(2)}
                        </span>
                        {quickViewProduct.discount > 0 && (
                          <span className="ml-2 text-lg text-gray-500 line-through">
                            ₹{quickViewProduct.price.toFixed(2)}
                          </span>
                        )}
                        {quickViewProduct.discount > 0 && (
                          <span className="ml-2 bg-pink-100 text-pink-800 text-xs font-semibold px-2 py-1 rounded">
                            {quickViewProduct.discount}% OFF
                          </span>
                        )}
                      </div>
                      <div className="mb-4">
                        <p className="text-gray-600">{quickViewProduct.description}</p>
                      </div>
                      {quickViewProduct.colors?.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-sm font-medium mb-2">Color:</h3>
                          <div className="flex space-x-2">
                            {quickViewProduct.colors.map((color, idx) => (
                              <button
                                key={color}
                                className={`w-8 h-8 rounded-full border ${selectedImage === idx ? 'ring-2 ring-pink-500' : ''}`}
                                style={{ backgroundColor: color.toLowerCase() }}
                                title={color}
                                onClick={() => setSelectedImage(idx)}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      {quickViewProduct.sizes?.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-sm font-medium mb-2">Size:</h3>
                          <div className="flex flex-wrap gap-2">
                            {quickViewProduct.sizes.map((size) => (
                              <button
                                key={size}
                                className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="mb-6">
                        <h3 className="text-sm font-medium mb-2">Quantity:</h3>
                        <div className="flex items-center">
                          <button
                            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                            className="p-2 border rounded-l hover:bg-gray-100 disabled:opacity-50"
                            disabled={quantity <= 1}
                          >
                            <FaMinus />
                          </button>
                          <div className="px-4 py-2 border-t border-b text-center w-12">
                            {quantity}
                          </div>
                          <button
                            onClick={() => setQuantity(prev => Math.min(prev + 1, quickViewProduct.stock))}
                            className="p-2 border rounded-r hover:bg-gray-100 disabled:opacity-50"
                            disabled={quantity >= quickViewProduct.stock}
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </div>
                      <div className="flex space-x-4">
                        <button
                          onClick={() => {
                            addToCart(quickViewProduct, quantity);
                            setQuickViewProduct(null);
                          }}
                          disabled={quickViewProduct.stock <= 0}
                          className={`flex-1 py-3 px-6 rounded-md font-medium ${
                            quickViewProduct.stock <= 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-pink-600 text-white hover:bg-pink-700'
                          }`}
                        >
                          {quickViewProduct.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                        <button
                          onClick={() => toggleWishlist(quickViewProduct)}
                          className={`p-3 rounded-md border ${
                            wishlist.some(item => item.id === quickViewProduct.id) ? 'text-pink-600 border-pink-600' : 'text-gray-600 hover:text-pink-600 hover:border-pink-600'
                          }`}
                        >
                          <FaHeart />
                        </button>
                      </div>
                      {quickViewProduct.stock > 0 && (
                        <div className="mt-4 text-sm text-green-600">
                          {quickViewProduct.stock} items available
                        </div>
                      )}
                      <div className="mt-6 pt-6 border-t">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <h3 className="font-medium mb-1">Category:</h3>
                            <p className="text-gray-600 capitalize">{quickViewProduct.category}</p>
                          </div>
                          <div>
                            <h3 className="font-medium mb-1">Brand:</h3>
                            <p className="text-gray-600">{quickViewProduct.brand || 'N/A'}</p>
                          </div>
                          <div>
                            <h3 className="font-medium mb-1">SKU:</h3>
                            <p className="text-gray-600">{quickViewProduct.sku || 'N/A'}</p>
                          </div>
                          <div>
                            <h3 className="font-medium mb-1">Weight:</h3>
                            <p className="text-gray-600">{quickViewProduct.weight || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {expandedImage && (
            <>
              <div
                className="fixed inset-0 bg-transparent z-50 flex items-center justify-center p-4"
                onClick={() => setExpandedImage(null)}
              >
                <button
                  className="absolute top-4 right-4 p-2 text-white hover:text-pink-400"
                  onClick={() => setExpandedImage(null)}
                >
                  <FaTimes size={24} />
                </button>
                <img
                  src={expandedImage}
                  alt="Expanded view"
                  className="max-w-full max-h-full object-contain"
                  onClick={(e) => e.stopPropagation()}
                  loading="lazy"
                  onError={(e) => { e.target.src = '/placeholder-product.jpg'; }}
                />
              </div>
            </>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showCompareBar && compareProducts.length > 0 && (
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t z-40"
            >
              <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <h3 className="font-medium">Compare Products ({compareProducts.length}/3)</h3>
                    <div className="flex space-x-2">
                      {compareProducts.map((product) => (
                        <div key={product.id} className="flex items-center bg-gray-100 rounded px-2 py-1">
                          <img
                            src={product.images?.[0] || '/placeholder-product.jpg'}
                            alt={product.name}
                            className="w-8 h-8 object-cover rounded"
                            loading="lazy"
                            onError={(e) => { e.target.src = '/placeholder-product.jpg'; }}
                          />
                          <span className="ml-2 text-sm">{product.name}</span>
                          <button
                            className="ml-2 text-gray-500 hover:text-red-500"
                            onClick={() => toggleCompare(product)}
                          >
                            <FaTimes size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to="/compare"
                      state={{ products: compareProducts }}
                      className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
                    >
                      Compare Now
                    </Link>
                    <button
                      onClick={() => {
                        setCompareProducts([]);
                        setShowCompareBar(false);
                      }}
                      className="px-4 py-2 border rounded hover:bg-gray-100"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Categories;

