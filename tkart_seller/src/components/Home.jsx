import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FiSearch, FiChevronRight } from 'react-icons/fi';
import { BsStarFill, BsGem, BsFlower1, BsBasket, BsShop, BsDroplet } from 'react-icons/bs';
import { GiClothes, GiFruitBowl, GiOfficeChair } from 'react-icons/gi';
import { BiLeaf } from 'react-icons/bi';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { motion } from 'framer-motion';

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
    { name: 'Food', icon: <GiFruitBowl className="text-2xl text-hotpink-500" />, featured: true },
    { name: 'Clothing', icon: <GiClothes className="text-2xl text-hotpink-500" />, featured: true },
    { name: 'Handicraft', icon: <BsGem className="text-2xl text-hotpink-500" />, featured: true },
    { name: 'Groceries', icon: <BsBasket className="text-2xl text-hotpink-500" />, featured: true },
    { name: 'Fashion & Jewellery', icon: <BsShop className="text-2xl text-hotpink-500" /> },
    { name: 'Beauty & Healthcare', icon: <BsDroplet className="text-2xl text-hotpink-500" />, featured: true },
    { name: 'Office', icon: <GiOfficeChair className="text-2xl text-hotpink-500" /> },
    { name: 'Organic Fruits & Vegetables', icon: <BiLeaf className="text-2xl text-hotpink-500" />, featured: true },
    { name: 'Others', icon: <BsFlower1 className="text-2xl text-hotpink-500" /> }
  ];

  const featuredDeals = [
    {
      title: 'Organic Summer Fruits',
      subtitle: 'From ₹199',
      tagline: 'Mangoes, Berries & more',
      bgColor: 'bg-hotpink-100',
      icon: <BiLeaf className="text-3xl text-hotpink-600" />
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

  const [timeRange, setTimeRange] = useState('monthly');

  const analyticsData = {
    weekly: [
      { name: 'Mon', sales: 4000, orders: 24 },
      { name: 'Tue', sales: 3000, orders: 13 },
      { name: 'Wed', sales: 5000, orders: 48 },
      { name: 'Thu', sales: 2780, orders: 39 },
      { name: 'Fri', sales: 6890, orders: 68 },
      { name: 'Sat', sales: 8390, orders: 88 },
      { name: 'Sun', sales: 9490, orders: 93 },
    ],
    monthly: [
      { name: 'Jan', sales: 24000, orders: 150 },
      { name: 'Feb', sales: 21000, orders: 130 },
      { name: 'Mar', sales: 36000, orders: 270 },
      { name: 'Apr', sales: 29000, orders: 220 },
      { name: 'May', sales: 49000, orders: 390 },
      { name: 'Jun', sales: 51000, orders: 400 },
    ],
    yearly: [
      { name: '2021', sales: 150000, orders: 800 },
      { name: '2022', sales: 230000, orders: 1200 },
      { name: '2023', sales: 340000, orders: 1800 },
      { name: '2024', sales: 290000, orders: 1500 },
      { name: '2025', sales: 420000, orders: 2200 },
    ]
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-xl border border-hotpink-100">
          <p className="font-normal text-gray-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm font-normal" style={{ color: entry.color }}>
              {entry.name === 'sales' ? 'Earnings: ₹' : 'Orders: '}{entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-white font-josefin">
      <main className="container mx-auto px-4 py-8">
        {/* Analytics Dashboard */}
        <section className="mb-12">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="bg-gradient-to-br from-hotpink-400 to-hotpink-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-xl -translate-y-1/2 translate-x-1/3"></div>
              <h3 className="text-white/80 font-normal text-sm uppercase tracking-wider mb-2">Total Earnings</h3>
              <p className="text-4xl font-normal drop-shadow-sm">₹1,28,450</p>
              <div className="mt-4 text-sm font-normal bg-white/20 inline-block px-3 py-1 rounded-full">+14.5% from last month</div>
            </motion.div>

            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.1}} className="glass-card rounded-3xl p-6 shadow-sm border border-hotpink-100">
              <h3 className="text-gray-500 font-normal text-sm uppercase tracking-wider mb-2">Total Orders</h3>
              <p className="text-4xl font-normal text-gray-800">438</p>
              <div className="mt-4 text-sm font-normal text-hotpink-500 bg-hotpink-50 inline-block px-3 py-1 rounded-full">+22 new today</div>
            </motion.div>
            
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.2}} className="glass-card rounded-3xl p-6 shadow-sm border border-hotpink-100 flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 font-normal text-sm uppercase tracking-wider mb-2">Delivered</h3>
                <p className="text-4xl font-normal text-gray-800">328</p>
              </div>
              <CircularProgressbar value={75} text={`75%`} strokeWidth={12} styles={buildStyles({textColor: '#ff69b4', pathColor: '#ff69b4', trailColor: '#ffe4e6'})} className="w-20 h-20 font-normal" />
            </motion.div>

            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.3}} className="glass-card rounded-3xl p-6 shadow-sm border border-hotpink-100 flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 font-normal text-sm uppercase tracking-wider mb-2">Pending</h3>
                <p className="text-4xl font-normal text-gray-800">110</p>
              </div>
              <CircularProgressbar value={25} text={`25%`} strokeWidth={12} styles={buildStyles({textColor: '#f59e0b', pathColor: '#f59e0b', trailColor: '#fef3c7'})} className="w-20 h-20 font-normal" />
            </motion.div>
          </div>

          {/* Interactive Charts */}
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.4}} className="glass-card rounded-3xl p-6 md:p-8 shadow-sm border border-hotpink-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-normal text-gray-800 drop-shadow-sm">Sales & Orders Overview</h2>
                <p className="text-gray-500 font-normal mt-1">Interactive tracking of your store's performance</p>
              </div>
              
              <div className="flex bg-hotpink-50 p-1 rounded-xl w-fit border border-hotpink-100 shadow-inner">
                {['weekly', 'monthly', 'yearly'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-6 py-2 rounded-lg text-sm font-normal capitalize transition-all duration-300 ${timeRange === range ? 'bg-white text-hotpink-600 shadow-sm' : 'text-gray-500 hover:text-hotpink-500'}`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData[timeRange]} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff69b4" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ff69b4" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffe4e6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 600}} dy={10} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 600}} dx={-10} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 600}} dx={10} />
                  <Tooltip content={<CustomTooltip />} cursor={{stroke: '#ffb6c1', strokeWidth: 2, strokeDasharray: '5 5'}} />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{fontWeight: 'bold', fontSize: '14px', color: '#4b5563'}} />
                  <Area yAxisId="left" type="monotone" dataKey="sales" name="Sales (₹)" stroke="#ff69b4" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" activeDot={{r: 8, strokeWidth: 0, fill: '#ff69b4'}} />
                  <Area yAxisId="right" type="monotone" dataKey="orders" name="Orders" stroke="#f59e0b" strokeWidth={4} fillOpacity={1} fill="url(#colorOrders)" activeDot={{r: 8, strokeWidth: 0, fill: '#f59e0b'}} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </section>
         {/* Featured Deals */}
        <section className="mb-12">
          <h2 className="text-2xl font-normal text-gray-800 mb-6 drop-shadow-sm">Featured Deals</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredDeals.map((deal, index) => (
              <div key={index} className={`${deal.bgColor} rounded-2xl p-6 flex items-center justify-between hover-lift shadow-sm`}>
                <div>
                  <h3 className="text-xl font-normal text-gray-800">{deal.title}</h3>
                  <p className="text-hotpink-600 font-normal mb-1">{deal.subtitle}</p>
                  <p className="text-sm font-normal text-gray-600">{deal.tagline}</p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm p-4 rounded-full shadow-inner">{deal.icon}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-normal text-gray-800 drop-shadow-sm">Sell in these Categories</h2>
            
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {categories.map((cat, i) => (
              <Link
                to={`/category/${cat.name.toLowerCase().replace(/ /g, '-')}`}
                key={i}
                className="glass-card p-5 hover-lift flex flex-col items-center text-center"
              >
                <div className="bg-hotpink-100 p-4 rounded-2xl mb-4 shadow-inner">{cat.icon}</div>
                <h3 className="font-normal text-gray-800">{cat.name}</h3>
                {cat.featured && (
                  <span className="mt-2 text-xs font-normal bg-hotpink-100 text-hotpink-700 px-3 py-1 rounded-full border border-hotpink-200">
                    Popular
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>

        

     
        {/* My Products */}
<section className="mb-12">
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-2xl font-normal text-gray-800 drop-shadow-sm">My Products</h2>
    <Link to="/myproducts" className="text-hotpink-600 font-normal hover:text-hotpink-700 flex items-center text-sm transition-colors">
      View All <FiChevronRight className="ml-1" />
    </Link>
  </div>

  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {(Array.isArray(myProducts) && myProducts.length > 0) ? (
      myProducts.slice(0, 4).map((product) => (
        <div key={product.id} className="glass-card overflow-hidden hover-lift flex flex-col">
          <div className="relative h-48 bg-hotpink-50 overflow-hidden">
            {product.image1 ? (
              <img
                src={`data:image/jpeg;base64,${product.image1}`}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 font-normal bg-gray-100">No Image</div>
            )}
            <div className="absolute top-3 left-3 bg-hotpink-500 text-white text-xs font-normal px-3 py-1.5 rounded-full shadow-md">
              {product.quantity} in stock
            </div>
          </div>
          <div className="p-5 flex-1 flex flex-col">
            <span className="text-xs font-normal text-hotpink-500 uppercase tracking-wider">{product.category}</span>
            <h3 className="font-normal text-gray-800 line-clamp-1 my-2 text-lg">{product.name}</h3>
            <div className="flex items-end mt-auto">
              <span className="text-xl font-normal text-hotpink-600">₹{product.price}</span>
            </div>
            <Link
              to="/myproducts"
              className="w-full mt-4 block text-center py-2.5 bg-hotpink-100 text-hotpink-700 rounded-xl font-normal hover:bg-hotpink-500 hover:text-white transition-all duration-300"
            >
              View Details
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
