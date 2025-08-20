import React, { useState } from "react";
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
import { Link } from "react-router-dom";

// Main Home Page Component
const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Popular categories with icons
  const categories = [
    {
      name: "Food",
      icon: <GiFruitBowl className="text-2xl text-pink-600" />,
      featured: true,
    },
    {
      name: "Clothing",
      icon: <GiClothes className="text-2xl text-pink-600" />,
      featured: true,
    },
    {
      name: "Handicraft",
      icon: <BsGem className="text-2xl text-pink-600" />,
      featured: true,
    },
    {
      name: "Groceries",
      icon: <BsBasket className="text-2xl text-pink-600" />,
      featured: true,
    },
    {
      name: "Fashion & Jewellery",
      icon: <BsShop className="text-2xl text-pink-600" />,
    },
    {
      name: "Beauty & Healthcare",
      icon: <BsDroplet className="text-2xl text-pink-600" />,
      featured: true,
    },
    {
      name: "Office",
      icon: <GiOfficeChair className="text-2xl text-pink-600" />,
    },
    {
      name: "Organic Fruits & Vegetables",
      icon: <BiLeaf className="text-2xl text-pink-600" />,
      featured: true,
    },
    {
      name: "Others",
      icon: <BsFlower1 className="text-2xl text-pink-600" />,
    },
  ];

  // Key deals
  const featuredDeals = [
    {
      title: "Organic Summer Fruits",
      subtitle: "From ₹199",
      tagline: "Mangoes, Berries & more",
      bgColor: "bg-pink-100",
      icon: <BiLeaf className="text-3xl text-pink-600" />,
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

  // Trending product suggestions
  const trendingProducts = [
    {
      id: 1,
      name: "Organic Mangoes (1kg)",
      price: "₹249",
      originalPrice: "₹399",
      discount: "38% off",
      rating: 4.5,
      category: "Organic Fruits",
      image:
        "https://images.unsplash.com/photo-1559181567-c3190ca9959b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 2,
      name: "Handwoven Silk Saree",
      price: "₹1,899",
      originalPrice: "₹3,500",
      discount: "46% off",
      rating: 4.7,
      category: "Clothing",
      image:
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 3,
      name: "Ayurvedic Face Cream",
      price: "₹349",
      originalPrice: "₹599",
      discount: "42% off",
      rating: 4.3,
      category: "Beauty",
      image:
        "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 4,
      name: "Handmade Clay Pottery Set",
      price: "₹1,299",
      originalPrice: "₹2,199",
      discount: "41% off",
      rating: 4.6,
      category: "Handicraft",
      image:
        "https://images.unsplash.com/photo-1586771107445-d3ca888129ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Main Container */}
      <main className="container mx-auto px-4 py-6">
        {/* Hero Banner */}
        <div className="relative rounded-2xl overflow-hidden mb-8 h-64 md:h-80 bg-gradient-to-r from-pink-400 to-rose-400 flex items-center">
          <div className="absolute inset-0 bg-black/10" aria-hidden="true"></div>
          <div className="relative z-10 px-8 text-white max-w-lg">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Premium Handpicked Products
            </h1>
            <p className="text-lg mb-4">
              Discover authentic goods from local artisans and trusted brands
            </p>
            <button className="bg-white text-pink-600 px-6 py-2 rounded-full font-medium hover:bg-pink-50 transition-colors">
              Shop Now
            </button>
          </div>
        </div>

        {/* Search Bar for mobile */}
        <div className="mb-6 md:hidden">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full pl-4 pr-10 py-2 border border-pink-200 rounded-full focus:ring-2 focus:ring-pink-300 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search"
            />
            <button
              className="absolute right-3 top-2 text-pink-500"
              aria-label="Search"
              tabIndex={-1}
              type="button"
            >
              <FiSearch className="text-xl" />
            </button>
          </div>
        </div>

        {/* Categories */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Shop by Categories</h2>
            <Link
              to="/categories"
              className="text-pink-600 flex items-center text-sm"
            >
              View All <FiChevronRight className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.map((cat, idx) => (
              <Link
                to={`/category/${cat.name.toLowerCase().replace(/ /g, "-")}`}
                key={cat.name}
                className="bg-white rounded-xl p-4 border border-pink-100 hover:shadow-md transition-shadow flex flex-col items-center text-center"
              >
                <div className="bg-pink-50 p-3 rounded-full mb-3">
                  {cat.icon}
                </div>
                <h3 className="font-medium text-gray-800">{cat.name}</h3>
                {cat.featured && (
                  <span className="mt-1 text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">
                    Popular
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Deals */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Featured Deals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredDeals.map((deal, idx) => (
              <div
                key={deal.title}
                className={`${deal.bgColor} rounded-xl p-6 flex items-center justify-between`}
              >
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {deal.title}
                  </h3>
                  <p className="text-pink-600 font-medium mb-1">{deal.subtitle}</p>
                  <p className="text-sm text-gray-600">{deal.tagline}</p>
                </div>
                <div className="bg-white/50 p-3 rounded-full">{deal.icon}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Trending Products */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Trending Products
            </h2>
            <Link
              to="/trending"
              className="text-pink-600 flex items-center text-sm"
            >
              View All <FiChevronRight className="ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {trendingProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl overflow-hidden border border-pink-100 hover:shadow-md transition-shadow"
              >
                <div className="relative h-48 bg-pink-50 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-pink-500 text-white text-xs px-2 py-1 rounded">
                    {product.discount}
                  </div>
                </div>
                <div className="p-4">
                  <span className="text-xs text-pink-500">{product.category}</span>
                  <h3 className="font-medium text-gray-800 line-clamp-1 my-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center text-yellow-400">
                      <BsStarFill className="text-xs" />
                      <span className="text-xs ml-1 text-gray-600">
                        {product.rating}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-end">
                    <span className="text-lg font-bold text-pink-600">
                      {product.price}
                    </span>
                    <span className="text-xs text-gray-500 line-through ml-2">
                      {product.originalPrice}
                    </span>
                  </div>
                  <button className="w-full mt-3 py-2 bg-pink-100 text-pink-600 rounded-lg font-medium hover:bg-pink-200 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Value Propositions */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white p-4 rounded-xl border border-pink-100 text-center">
            <div className="bg-pink-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiTruck className="text-xl text-pink-600" />
            </div>
            <h3 className="font-medium text-gray-800">Free Delivery</h3>
            <p className="text-xs text-gray-500">On orders above ₹499</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-pink-100 text-center">
            <div className="bg-pink-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiClock className="text-xl text-pink-600" />
            </div>
            <h3 className="font-medium text-gray-800">Easy Returns</h3>
            <p className="text-xs text-gray-500">15-day return policy</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-pink-100 text-center">
            <div className="bg-pink-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiStar className="text-xl text-pink-600" />
            </div>
            <h3 className="font-medium text-gray-800">Authentic Products</h3>
            <p className="text-xs text-gray-500">Direct from artisans</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-pink-100 text-center">
            <div className="bg-pink-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <BsLightningFill className="text-xl text-pink-600" />
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
