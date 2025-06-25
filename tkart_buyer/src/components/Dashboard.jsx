import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaSearch, FaHeart, FaShoppingCart, FaUser,
  FaTruck, FaBox, FaShieldAlt, FaStar, FaShoppingBag,
  FaGithub, FaLinkedin, FaHome, FaInfoCircle
} from 'react-icons/fa';
import heroImage from './tklogo.png'; // Ensure this path is correct

// ✅ Navbar Component (unchanged)
const Navbar = () => (
  <nav className="bg-white shadow-md px-4 py-3 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <Link to="/" className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
          <span className="text-pink-600 text-xl font-bold">TK</span>
        </div>
        <h1 className="text-xl font-bold text-pink-700 hidden sm:block">TKart</h1>
      </Link>

      <div className="flex items-center space-x-4">
        <Link to="/login">
          <button className="flex bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-full text-sm items-center">
            <FaUser className="mr-2" />
            Login
          </button>
        </Link>
      </div>
    </div>
  </nav>
);

// ✅ Enhanced Hero Section with Image
const HeroSection = () => (
  <section className="relative bg-gradient-to-r from-pink-50 to-pink-100 py-12 px-4 overflow-hidden">
    <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-8">

      {/* Left Content */}
      <div className="text-center lg:text-left flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-pink-800 mb-4 leading-tight">
            Empowering Women Through <br className="hidden md:block" />
            <span className="text-pink-600">Smart Shopping</span>
          </h1>
          <p className="text-lg text-pink-700 mb-8 max-w-xl">
            Curated products, exceptional quality, and seamless delivery — just for you.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Link to="/Login">
              <button className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-full font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center">
                <FaShoppingBag className="mr-2" />
                Shop Now
              </button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Right Image */}
      <div className="flex-1">
        <img
          src={heroImage}
          alt="Thirumathi Kart Illustration"
          className="w-full h-auto max-h-[450px] object-contain"
        />
      </div>
    </div>
  </section>
);

// ✅ Features Section (unchanged)
const FeaturesSection = () => {
  const features = [
    { icon: <FaTruck />, title: 'Fast Delivery', desc: '24-48 hour delivery across Tamil Nadu' },
    { icon: <FaBox />, title: 'Quality Products', desc: 'Verified sellers and authentic goods' },
    { icon: <FaShieldAlt />, title: 'Secure Payments', desc: '100% secure payment gateway' },
    { icon: <FaStar />, title: 'Women-Centric', desc: 'By women, for everyone' }
  ];

  return (
    <section className="py-12 bg-white px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-pink-800 mb-12">Why Choose Us</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="bg-pink-50 rounded-xl p-6 text-center"
            >
              <div className="mb-4 text-3xl text-pink-600">{f.icon}</div>
              <h3 className="text-xl font-semibold text-pink-700 mb-2">{f.title}</h3>
              <p className="text-pink-600">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ✅ Enhanced About Section
const AboutSection = () => (
  <section className="py-16 bg-gray-50 px-4 relative">
    {/* Decorative elements */}
    <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-pink-50 to-transparent"></div>

    <div className="max-w-5xl mx-auto relative z-10">
      <motion.div
        className="bg-white rounded-xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="p-8 md:p-12">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-pink-800 mb-6 text-center"
          >
            About <span className="text-pink-600">Thirumathi Kart</span>
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <p className="text-lg text-pink-700 mb-6 leading-relaxed">
                <strong>Thirumathi Kart</strong> is an initiative by <strong>NIT Trichy</strong>, aimed at empowering rural entrepreneurs, artisans, and self-help groups (SHGs) by providing them with a digital platform to showcase and sell their products.
              </p>
              <p className="text-lg text-pink-700 leading-relaxed">
                <strong>The e-commerce platform for SHGs</strong> enables self-help groups to reach a wider audience, increase their income, and achieve financial independence. We are committed to promoting local craftsmanship and sustainable livelihoods.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="bg-pink-100 rounded-lg p-6 h-full flex items-center justify-center"
            >
              <div className="text-center">
                <div className="text-5xl mb-4 text-pink-600">👩‍🌾</div>
                <h3 className="text-xl font-semibold text-pink-800">Supporting Women Entrepreneurs</h3>
                <p className="text-pink-700 mt-2">Connecting artisans with customers nationwide</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>

    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-pink-50 to-transparent"></div>
  </section>
);

// ✅ Footer (unchanged)
const Footer = () => (
  <footer className="bg-pink-800 text-white pt-8 pb-4 px-4">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
      <div>
        <h4 className="font-bold text-lg mb-2">Thirumathi Kart</h4>
        <p className="text-sm mb-4">
          Empowering rural artisans, women entrepreneurs, and SHGs.
        </p>
        <div className="flex space-x-4">
          <a href="#"><FaGithub className="text-xl" /></a>
          <a href="#"><FaLinkedin className="text-xl" /></a>
        </div>
      </div>

      <div>
        <h4 className="font-bold text-lg mb-2">Quick Links</h4>
        <ul className="space-y-1">
          <li><Link to="/" className="hover:text-pink-300 flex items-center"><FaHome className="mr-2" /> Home</Link></li>
          <li><Link to="/about" className="hover:text-pink-300 flex items-center"><FaInfoCircle className="mr-2" /> About</Link></li>
          <li><Link to="/products" className="hover:text-pink-300 flex items-center"><FaShoppingBag className="mr-2" /> Products</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="font-bold text-lg mb-2">Contact</h4>
        <p className="text-sm">NIT-Trichy Campus, Tamil Nadu</p>
        <p className="text-sm">📞 +91 12345 67890</p>
        <p className="text-sm">📧 contact@thirumathikart.com</p>
      </div>

      <div>
        <h4 className="font-bold text-lg mb-2">Stay Updated</h4>
        <p className="text-sm mb-2">Subscribe for offers</p>
        <div className="flex">
          <input type="email" placeholder="Email" className="px-3 py-2 rounded-l text-black text-sm" />
          <button className="bg-pink-600 hover:bg-pink-700 px-3 py-2 rounded-r text-sm">Subscribe</button>
        </div>
      </div>
    </div>
    <div className="border-t border-pink-700 mt-4 pt-4 text-center text-sm text-pink-200">
      © {new Date().getFullYear()} Thirumathi Kart. All rights reserved.
    </div>
  </footer>
);

// ✅ Main Dashboard
const Dashboard = () => (
  <div className="min-h-screen flex flex-col font-sans">
    <Navbar />
    <main className="flex-grow">
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
    </main>
    <Footer />
  </div>
);

export default Dashboard;