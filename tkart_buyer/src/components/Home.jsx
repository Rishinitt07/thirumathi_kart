import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiChevronRight,
  FiStar,
  FiClock,
  FiTruck,
} from "react-icons/fi";
import {
  BsStarFill,
  BsLightningFill,
  BsGem,
  BsFlower1,
  BsBasket,
  BsShop,
  BsDroplet,
} from "react-icons/bs";
import { GiClothes, GiFruitBowl, GiOfficeChair } from "react-icons/gi";
import { BiLeaf } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

import ad1 from "../assects/ad1.png";
import ad2 from "../assects/ad2.png";
import ad3 from "../assects/ad3.png";

const ads = [ad1, ad2, ad3];
// Main Home Page Component
const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Ad carousel interval
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    }, 5000);
    
    // Fetch real products
    const fetchTrendingProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8081/products');
        if (response.data && response.data.length > 0) {
          const mappedProducts = response.data.map(product => ({
            ...product,
            images: [product.image1, product.image2, product.image3, product.image4].some(Boolean)
              ? [product.image1, product.image2, product.image3, product.image4].filter(Boolean).map(img => `data:image/jpeg;base64,${img}`)
              : ['https://placehold.co/500x500/f472b6/ffffff?text=No+Image'],
          }));
          // Take the first 4 products for the trending section
          setTrendingProducts(mappedProducts.slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to fetch trending products", err);
      }
    };
    fetchTrendingProducts();

    return () => clearInterval(interval);
  }, []);

  // Popular categories with icons
  const categories = [
    {
      name: "Food",
      icon: <GiFruitBowl className="text-2xl text-hotpink-600" />,
      featured: true,
    },
    {
      name: "Clothing",
      icon: <GiClothes className="text-2xl text-hotpink-600" />,
      featured: true,
    },
    {
      name: "Handicraft",
      icon: <BsGem className="text-2xl text-hotpink-600" />,
      featured: true,
    },
    {
      name: "Groceries",
      icon: <BsBasket className="text-2xl text-hotpink-600" />,
      featured: true,
    },
    {
      name: "Fashion",
      icon: <BsShop className="text-2xl text-hotpink-600" />,
    },
    {
      name: "Fashion and Jewellery",
      icon: <BsGem className="text-2xl text-hotpink-600" />,
    },
    {
      name: "Beauty and Healthcare",
      icon: <BsDroplet className="text-2xl text-hotpink-600" />,
      featured: true,
    },
    {
      name: "Office Code",
      icon: <GiOfficeChair className="text-2xl text-hotpink-600" />,
    },
    {
      name: "Organic Fruits and Vegetables",
      icon: <BiLeaf className="text-2xl text-hotpink-600" />,
      featured: true,
    },
    {
      name: "Others",
      icon: <BsFlower1 className="text-2xl text-hotpink-600" />,
    },
  ];

  // Key deals
  const featuredDeals = [
    {
      title: "Organic Summer Fruits",
      subtitle: "From ₹199",
      tagline: "Mangoes, Berries & more",
      bgColor: "bg-hotpink-100",
      icon: <BiLeaf className="text-3xl text-hotpink-600" />,
    },
    {
      title: "Handcrafted Jewellery",
      subtitle: "50% OFF",
      tagline: "Traditional & Modern Designs",
      bgColor: "bg-purple-100",
      icon: <BsGem className="text-3xl text-purple-600" />,
    },
    {
      title: "Beauty Essentials",
      subtitle: "Shop Now!",
      tagline: "Premium skincare products",
      bgColor: "bg-rose-100",
      icon: <BsDroplet className="text-3xl text-rose-600" />,
    },
  ];

  // Trending product suggestions (Now dynamically fetched)

  return (
    <div className="min-h-screen bg-white">
      {/* Main Container */}
      <main className="container mx-auto px-4 py-6">
        {/* Hero Banner Carousel */}
        <div className="relative rounded-2xl overflow-hidden mb-8 h-48 sm:h-64 md:h-80 lg:h-96 bg-gray-100 flex items-center justify-center">
          <AnimatePresence initial={false}>
            <motion.img
              key={currentAdIndex}
              src={ads[currentAdIndex]}
              alt={`Advertisement ${currentAdIndex + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", ease: "easeInOut", duration: 1.0 }}
            />
          </AnimatePresence>
          
          {/* Carousel Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {ads.map((_, idx) => (
              <div 
                key={idx} 
                className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentAdIndex ? 'bg-hotpink-500 w-6' : 'bg-white/70'}`}
              />
            ))}
          </div>
        </div>

        {/* Search Bar for mobile */}
        <div className="mb-6 md:hidden">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full pl-4 pr-10 py-2 border border-hotpink-200 rounded-full focus:ring-2 focus:ring-hotpink-300 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search"
            />
            <button
              className="absolute right-3 top-2 text-hotpink-500"
              aria-label="Search"
              tabIndex={-1}
              type="button"
            >
              <FiSearch className="text-xl" />
            </button>
          </div>
        </div>

        {/* Featured Deals */}
        <section className="mb-10">
          <h2 className="text-xl font-normal text-gray-800 mb-4">
            Featured Deals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredDeals.map((deal, idx) => (
              <div
                key={deal.title}
                className={`${deal.bgColor} rounded-xl p-6 flex items-center justify-between`}
              >
                <div>
                  <h3 className="text-lg font-normal text-gray-800">
                    {deal.title}
                  </h3>
                  <p className="text-hotpink-600 font-medium mb-1">{deal.subtitle}</p>
                  <p className="text-sm text-gray-600">{deal.tagline}</p>
                </div>
                <div className="bg-white/50 p-3 rounded-full">{deal.icon}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-normal text-gray-800">Shop by Categories</h2>
            <Link
              to="/categories"
              className="text-hotpink-600 flex items-center text-sm"
            >
              View All <FiChevronRight className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.map((cat, idx) => (
              <Link
                to={`/categories?category=${encodeURIComponent(cat.name)}`}
                key={cat.name}
                className="bg-white rounded-xl p-4 border border-hotpink-100 hover:shadow-md transition-shadow flex flex-col items-center text-center"
              >
                <div className="bg-hotpink-50 p-3 rounded-full mb-3">
                  {cat.icon}
                </div>
                <h3 className="font-medium text-gray-800">{cat.name}</h3>
                {cat.featured && (
                  <span className="mt-1 text-xs bg-hotpink-100 text-hotpink-700 px-2 py-0.5 rounded-full">
                    Popular
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>

        {/* Trending Products */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-normal text-gray-800">
              Trending Products
            </h2>
            <Link
              to="/trending"
              className="text-hotpink-600 flex items-center text-sm"
            >
              View All <FiChevronRight className="ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {trendingProducts.map((product) => (
              <div
                key={product._id || product.id}
                className="bg-white rounded-xl overflow-hidden border border-hotpink-100 hover:shadow-md transition-shadow cursor-pointer flex flex-col"
                onClick={() => navigate('/categories')}
              >
                <div className="relative h-48 bg-gray-50 overflow-hidden shrink-0 border-b border-gray-100">
                  <img
                    src={product.images && product.images.length > 0 ? product.images[0] : product.image || 'https://placehold.co/500x500/f472b6/ffffff?text=No+Image'}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  {product.discount && (
                    <div className="absolute top-2 left-2 bg-hotpink-500 text-white text-xs px-2 py-1 rounded">
                      {product.discount}% OFF
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <span className="text-xs text-hotpink-500">{product.category}</span>
                    <h3 className="font-medium text-gray-800 line-clamp-2 my-1 min-h-[40px]">
                      {product.name}
                    </h3>
                    <div className="flex items-center mb-3">
                      <div className="flex items-center text-yellow-400">
                        <BsStarFill className="text-xs" />
                        <span className="text-xs ml-1 text-gray-600">
                          {product.rating || "4.5"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-end">
                    <span className="text-lg font-normal text-gray-900">
                      ₹{product.price ? product.price.toLocaleString() : '0'}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-500 line-through ml-2">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <button className="w-full mt-3 py-2 bg-hotpink-100 text-hotpink-600 rounded-lg font-medium hover:bg-hotpink-200 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Value Propositions */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white p-4 rounded-xl border border-hotpink-100 text-center">
            <div className="bg-hotpink-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiTruck className="text-xl text-hotpink-600" />
            </div>
            <h3 className="font-medium text-gray-800">Free Delivery</h3>
            <p className="text-xs text-gray-500">On orders above ₹499</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-hotpink-100 text-center">
            <div className="bg-hotpink-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiClock className="text-xl text-hotpink-600" />
            </div>
            <h3 className="font-medium text-gray-800">Easy Returns</h3>
            <p className="text-xs text-gray-500">15-day return policy</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-hotpink-100 text-center">
            <div className="bg-hotpink-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiStar className="text-xl text-hotpink-600" />
            </div>
            <h3 className="font-medium text-gray-800">Authentic Products</h3>
            <p className="text-xs text-gray-500">Direct from artisans</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-hotpink-100 text-center">
            <div className="bg-hotpink-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <BsLightningFill className="text-xl text-hotpink-600" />
            </div>
            <h3 className="font-medium text-gray-800">Express Delivery</h3>
            <p className="text-xs text-gray-500">In select cities</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
