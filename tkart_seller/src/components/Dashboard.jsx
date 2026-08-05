import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BsBagHeart, BsShop, BsTruck, 
  BsShieldCheck, BsStarFill, BsPeople, BsLightningCharge, BsArrowRight, BsGraphUp
} from 'react-icons/bs';
import { FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import tkLogo from '../assets/tklogo.png';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-josefin selection:bg-hotpink-500 selection:text-white overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative min-h-[90vh] flex items-center pt-20 pb-16 overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-hotpink-300 to-rose-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-[pulse_8s_ease-in-out_infinite] pointer-events-none"></div>
        <div className="absolute top-40 -left-20 w-[500px] h-[500px] bg-gradient-to-tr from-purple-300 to-hotpink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-[pulse_10s_ease-in-out_infinite] pointer-events-none delay-1000"></div>
        <div className="absolute -bottom-20 left-1/3 w-[500px] h-[500px] bg-gradient-to-bl from-rose-300 to-hotpink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-[pulse_9s_ease-in-out_infinite] pointer-events-none delay-2000"></div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left pt-10 lg:pt-0"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1] mb-6 tracking-tight">
                Grow Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-hotpink-500 to-rose-500">Business</span><br/>
                With Thirumathi Kart
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                Showcase your handcrafted and organic products to millions of buyers nationwide. Manage your store, track earnings, and achieve financial independence.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/login">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-hotpink-500 to-rose-500 text-white rounded-2xl font-medium text-lg shadow-xl shadow-hotpink-500/30 flex items-center justify-center gap-2"
                  >
                    <BsShop className="text-xl" /> Start Selling
                  </motion.button>
                </Link>
                <Link to="/register">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto px-8 py-4 bg-white text-gray-800 border-2 border-gray-100 hover:border-hotpink-200 rounded-2xl font-medium text-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    Register as Seller
                  </motion.button>
                </Link>
              </div>
            </motion.div>
            
            {/* Right Illustration */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-hotpink-500/20 to-transparent rounded-full blur-3xl"></div>
              <img 
                src={tkLogo} 
                alt="Thirumathi Kart Logo" 
                className="w-full h-auto max-w-lg mx-auto relative z-10 drop-shadow-2xl hover:-translate-y-2 transition-transform duration-500 object-contain aspect-square"
              />
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Why Sell on Thirumathi Kart?</h2>
            <div className="w-20 h-1.5 bg-hotpink-500 rounded-full mx-auto mb-6"></div>
            <p className="text-gray-600 text-lg">We provide an ecosystem that ensures quality for buyers while supporting rural women entrepreneurs.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <BsShop/>, title: 'Manage Inventory', desc: 'Easily upload, edit, and track your handcrafted items and stock.' },
              { icon: <BsGraphUp/>, title: 'Track Earnings', desc: 'Detailed analytics and insights into your daily and monthly sales.' },
              { icon: <BsTruck/>, title: 'Seamless Fulfillment', desc: 'Integrated delivery partners take the hassle out of shipping.' },
              { icon: <BsLightningCharge/>, title: 'Quick Payouts', desc: 'Get your earnings transferred directly and securely to your account.' }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-slate-50 border border-slate-100 hover:border-hotpink-200 rounded-3xl p-8 hover:shadow-xl hover:shadow-hotpink-100/50 transition-all group"
              >
                <div className="w-14 h-14 bg-white shadow-sm rounded-2xl flex items-center justify-center text-hotpink-500 text-2xl mb-6 group-hover:scale-110 group-hover:bg-hotpink-500 group-hover:text-white transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed font-light">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-hotpink-900/40 to-transparent pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Mission & Vision</h2>
              <p className="text-slate-300 text-lg mb-6 leading-relaxed font-light">
                Thirumathi Kart is an initiative designed to bridge the gap between talented rural artisans (Self-Help Groups) and conscientious buyers. We believe in creating a sustainable ecosystem where women achieve financial independence through their skills.
              </p>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed font-light">
                Every product on our platform tells a story of hard work, tradition, and empowerment. By joining us as a seller, you aren't just opening a store; you are building your future.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-700/50">
                <div>
                  <h4 className="text-4xl font-bold text-hotpink-400 mb-1">5000+</h4>
                  <p className="text-slate-400 font-medium uppercase tracking-wider text-xs">Women Sellers</p>
                </div>
                <div>
                  <h4 className="text-4xl font-bold text-hotpink-400 mb-1">100K+</h4>
                  <p className="text-slate-400 font-medium uppercase tracking-wider text-xs">Happy Buyers</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50"
            >
              <div className="absolute inset-0 bg-hotpink-500/20 mix-blend-overlay"></div>
              <img 
                src="https://images.unsplash.com/photo-1573164574572-cb89e39749b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Women empowerment" 
                className="w-full h-[500px] object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-hotpink-50 to-rose-100 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden border border-hotpink-200"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-hotpink-300/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 relative z-10 tracking-tight">Ready to launch your store?</h2>
            <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto relative z-10 font-light">Join thousands of women artisans who are successfully running their businesses online with Thirumathi Kart.</p>
            <Link to="/register">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-hotpink-600 hover:bg-hotpink-700 text-white rounded-full font-bold text-lg shadow-xl shadow-hotpink-500/30 transition-all relative z-10 inline-flex items-center gap-3"
              >
                Create Seller Account <BsArrowRight />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 pt-16 pb-8 border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-hotpink-500 to-rose-500 mb-4 tracking-tight">TKart Seller</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Empowering rural women entrepreneurs by connecting them with conscientious buyers nationwide.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-hotpink-500 hover:border-hotpink-500 transition-colors shadow-sm"><FaTwitter/></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-hotpink-500 hover:border-hotpink-500 transition-colors shadow-sm"><FaInstagram/></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-hotpink-500 hover:border-hotpink-500 transition-colors shadow-sm"><FaLinkedin/></a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link to="/login" className="text-gray-500 hover:text-hotpink-500 transition-colors text-sm">Seller Login</Link></li>
                <li><Link to="/about" className="text-gray-500 hover:text-hotpink-500 transition-colors text-sm">About Us</Link></li>
                <li><Link to="/register" className="text-gray-500 hover:text-hotpink-500 transition-colors text-sm">Register Store</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-500 hover:text-hotpink-500 transition-colors text-sm">Seller Policy</a></li>
                <li><a href="#" className="text-gray-500 hover:text-hotpink-500 transition-colors text-sm">Terms of Service</a></li>
                <li><a href="#" className="text-gray-500 hover:text-hotpink-500 transition-colors text-sm">Payout Terms</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm">Contact Support</h4>
              <ul className="space-y-3">
                <li className="text-gray-500 text-sm">NIT-Trichy Campus, Tamil Nadu</li>
                <li className="text-gray-500 text-sm">+91 98765 43210</li>
                <li className="text-gray-500 text-sm">sellersupport@thirumathikart.com</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm"> {new Date().getFullYear()} Thirumathi Kart. All rights reserved.</p>
            <p className="text-gray-400 text-sm">Made with  for Rural Empowerment</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
