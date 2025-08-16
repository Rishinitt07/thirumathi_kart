import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FiSearch, FiChevronRight } from 'react-icons/fi';
import { BsStarFill, BsGem, BsFlower1, BsBasket, BsShop, BsDroplet } from 'react-icons/bs';
import { GiClothes, GiFruitBowl, GiOfficeChair } from 'react-icons/gi';
import { BiLeaf } from 'react-icons/bi';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [myProducts, setMyProducts] = useState([]);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    axios
      .get('http://localhost:8080/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .catch(err => {
        console.error('Access denied', err);
        localStorage.removeItem('token');
        navigate('/login');
      });

      axios.get('http://localhost:8080/products', {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => {
        setMyProducts(res.data);
      }).catch(err => {
        console.error('Failed to fetch products', err);
      });

  }, [navigate]);
  

  const categories = [
    { name: 'Food', icon: <GiFruitBowl className="text-2xl text-pink-600" />, featured: true },
    { name: 'Clothing', icon: <GiClothes className="text-2xl text-pink-600" />, featured: true },
    { name: 'Handicraft', icon: <BsGem className="text-2xl text-pink-600" />, featured: true },
    { name: 'Groceries', icon: <BsBasket className="text-2xl text-pink-600" />, featured: true },
    { name: 'Fashion & Jewellery', icon: <BsShop className="text-2xl text-pink-600" /> },
    { name: 'Beauty & Healthcare', icon: <BsDroplet className="text-2xl text-pink-600" />, featured: true },
    { name: 'Office', icon: <GiOfficeChair className="text-2xl text-pink-600" /> },
    { name: 'Organic Fruits & Vegetables', icon: <BiLeaf className="text-2xl text-pink-600" />, featured: true },
    { name: 'Others', icon: <BsFlower1 className="text-2xl text-pink-600" /> }
  ];

  const featuredDeals = [
    {
      title: 'Organic Summer Fruits',
      subtitle: 'From ₹199',
      tagline: 'Mangoes, Berries & more',
      bgColor: 'bg-pink-100',
      icon: <BiLeaf className="text-3xl text-pink-600" />
    },
    {
      title: 'Handcrafted Jewellery',
      subtitle: '50% OFF',
      tagline: 'Traditional & Modern Designs',
      bgColor: 'bg-purple-100',
      icon: <BsGem className="text-3xl text-purple-600" />
    },
    {
      title: 'Beauty Essentials',
      subtitle: 'Shop Now!',
      tagline: 'Premium skincare products',
      bgColor: 'bg-rose-100',
      icon: <BsDroplet className="text-3xl text-rose-600" />
    }
  ];

  const trendingProducts = [
    {
      id: 1,
      name: 'Organic Mangoes (1kg)',
      price: '₹249',
      originalPrice: '₹399',
      discount: '38% off',
      rating: 4.5,
      category: 'Organic Fruits',
      image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 2,
      name: 'Handwoven Silk Saree',
      price: '₹1,899',
      originalPrice: '₹3,500',
      discount: '46% off',
      rating: 4.7,
      category: 'Clothing',
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 3,
      name: 'Ayurvedic Face Cream',
      price: '₹349',
      originalPrice: '₹599',
      discount: '42% off',
      rating: 4.3,
      category: 'Beauty',
      image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 4,
      name: 'Handmade Clay Pottery Set',
      price: '₹1,299',
      originalPrice: '₹2,199',
      discount: '41% off',
      rating: 4.6,
      category: 'Handicraft',
      image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    }
  ];

  const ordersData = [
    { month: 'Jan', earnings: 24000 },
    { month: 'Feb', earnings: 21000 },
    { month: 'Mar', earnings: 26000 },
    { month: 'Apr', earnings: 19000 },
    { month: 'May', earnings: 29000 },
    { month: 'Jun', earnings: 31000 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <main className="container mx-auto px-4 py-6">
        {/* Hero + Stats */}
        <div className="relative rounded-2xl overflow-hidden mb-8 p-6 h-auto bg-gradient-to-r from-pink-500 to-rose-500 text-white grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2 space-y-4">
            <h1 className="text-2xl font-bold">Seller Dashboard</h1>
            <p className="text-white/90">Monitor your products, sales and earnings from one place.</p>
          </div>

          <div className="flex flex-col items-center">
            <CircularProgressbar
              value={75}
              text={`75%`}
              strokeWidth={20}
              styles={buildStyles({
                textColor: '#fff',
                pathColor: '#fff',
                trailColor: '#f9a8d4'
              })}
              className="w-24 h-24"
            />
            <p className="mt-2 text-sm">Delivered Orders</p>
          </div>

          <div className="flex flex-col items-center">
            <CircularProgressbar
              value={25}
              text={`25%`}
              strokeWidth={20}
              styles={buildStyles({
                textColor: '#fff',
                pathColor: '#fff',
                trailColor: '#fca5a5'
              })}
              className="w-24 h-24"
            />
            <p className="mt-2 text-sm">Cancelled Orders</p>
          </div>

          <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white/20 p-4 rounded-xl">
              <h3 className="text-lg font-semibold mb-2">Monthly Earnings</h3>
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={ordersData}>
                  <XAxis dataKey="month" stroke="#fff" fontSize={12} />
                  <YAxis stroke="#fff" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="earnings" fill="#fff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white/20 p-4 rounded-xl text-center">
              <h3 className="text-lg font-semibold">Total Orders</h3>
              <p className="text-3xl font-bold mt-2">438</p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl text-center">
              <h3 className="text-lg font-semibold">Earnings</h3>
              <p className="text-3xl font-bold mt-2">₹1.28L</p>
            </div>
          </div>
        </div>
         {/* Featured Deals */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Featured Deals</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredDeals.map((deal, index) => (
              <div key={index} className={`${deal.bgColor} rounded-xl p-6 flex items-center justify-between`}>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{deal.title}</h3>
                  <p className="text-pink-600 font-medium mb-1">{deal.subtitle}</p>
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
            <h2 className="text-xl font-bold text-gray-800">Sell this Categories</h2>
            
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.map((cat, i) => (
              <Link
                to={`/category/${cat.name.toLowerCase().replace(/ /g, '-')}`}
                key={i}
                className="bg-white rounded-xl p-4 border border-pink-100 hover:shadow-md transition-shadow flex flex-col items-center text-center"
              >
                <div className="bg-pink-50 p-3 rounded-full mb-3">{cat.icon}</div>
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

        

     
        {/* My Products */}
<section className="mb-10">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-bold text-gray-800">My Products</h2>
    <Link to="/myproducts" className="text-pink-600 flex items-center text-sm">
      View All <FiChevronRight className="ml-1" />
    </Link>
  </div>

  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {(Array.isArray(myProducts) && myProducts.length > 0) ? (
      myProducts.slice(0, 4).map((product) => (
        <div key={product.id} className="bg-white rounded-xl overflow-hidden border border-pink-100 hover:shadow-md transition-shadow">
          <div className="relative h-48 bg-pink-50 overflow-hidden">
            {product.image1 ? (
              <img
                src={`data:image/jpeg;base64,${product.image1}`}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
            )}
            <div className="absolute top-2 left-2 bg-pink-500 text-white text-xs px-2 py-1 rounded">
              {product.quantity} in stock
            </div>
          </div>
          <div className="p-4">
            <span className="text-xs text-pink-500">{product.category}</span>
            <h3 className="font-medium text-gray-800 line-clamp-1 my-1">{product.name}</h3>
            <div className="flex items-end">
              <span className="text-lg font-bold text-pink-600">₹{product.price}</span>
            </div>
            <Link
              to="/myproducts"
              className="w-full mt-3 block text-center py-2 bg-pink-100 text-pink-600 rounded-lg font-medium hover:bg-pink-200 transition-colors"
            >
              View
            </Link>
          </div>
        </div>
      ))
    ) : (
      <p className="col-span-full text-center text-gray-500">No products available</p>
    )}
  </div>
</section>

        

      </main>
    </div>
  );
};

export default Home;
