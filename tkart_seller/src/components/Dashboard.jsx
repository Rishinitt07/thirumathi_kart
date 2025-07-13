import React from 'react';
import { Link } from 'react-router-dom';
import { BsBoxArrowInRight, BsPersonPlus } from 'react-icons/bs';
import { motion } from 'framer-motion';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white font-josefin">
      <main className="container mx-auto px-4 py-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl overflow-hidden mb-10 p-8 bg-gradient-to-r from-pink-500 to-rose-500 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg"
        >
          <div className="flex-1 space-y-4">
            <h1 className="text-4xl font-bold leading-tight">Welcome to Thirumathi Kart Seller Service</h1>
            <p className="text-white/90 text-lg">Manage your products, track your earnings, and grow your store seamlessly.</p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 bg-white text-pink-600 px-6 py-3 rounded-full font-semibold hover:bg-pink-100 transition"
              >
                <BsBoxArrowInRight className="text-lg" />
                Login
              </Link>

              <Link
                to="/register"
                className="flex items-center justify-center gap-2 bg-white/20 border border-white px-6 py-3 rounded-full text-white font-semibold hover:bg-white/30 transition"
              >
                <BsPersonPlus className="text-lg" />
                Register
              </Link>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <img
              src="https://illustrations.popsy.co/gray/work-from-home.svg"
              alt="dashboard"
              className="w-full max-w-sm mx-auto drop-shadow-xl"
            />
          </motion.div>
        </motion.div>

        {/* Feature Highlights */}
<div className="grid md:grid-cols-3 gap-6">
  {[
    {
      title: 'Add Products',
      text: 'Upload your handmade, organic or crafted items and reach customers directly.'
    },
    {
      title: 'Track Earnings',
      text: 'Get full insight into your monthly and total earnings in your dashboard.'
    },
    {
      title: 'Manage Orders',
      text: 'Update stock, prices, or remove products as your inventory changes.'
    }
  ].map((item, i) => (
    <motion.div
      key={i}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: i * 0.15,
        ease: "easeOut"
      }}
      viewport={{ once: true, amount: 0.3 }}
      className="bg-white border border-pink-100 rounded-xl p-6 shadow hover:shadow-xl transition-shadow duration-300"
    >
      <h3 className="text-pink-600 text-lg font-bold mb-2">{item.title}</h3>
      <p className="text-gray-600 text-sm">{item.text}</p>
    </motion.div>
  ))}
</div>
        {/* Our Story */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-pink-700 mb-4">Our Story</h2>
            <div className="w-24 h-1 bg-pink-500 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Our Team"
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">From Humble Beginnings</h3>
              <p className="text-gray-600 mb-4">
                Founded in 2023, Thirumathi Kart began as a small initiative to support women entrepreneurs in rural Tamil Nadu.
                What started as a local marketplace has now grown into a thriving e-commerce platform connecting thousands of
                women artisans with customers nationwide.
              </p>
              <p className="text-gray-600 mb-6">
                Our mission is simple: to create economic opportunities for women while providing customers with authentic,
                high-quality products that tell a story.
              </p>
              <div className="flex flex-wrap gap-4">
                {[
                  { label: 'Women Sellers', value: '5000+' },
                  { label: 'Happy Customers', value: '100K+' },
                  { label: 'Categories', value: '50+' }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-pink-50 px-4 py-3 rounded-lg">
                    <h4 className="font-bold text-pink-700">{stat.value}</h4>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Our Values */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-pink-700 mb-4">Our Values</h2>
              <div className="w-24 h-1 bg-pink-500 mx-auto"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Empowerment',
                  desc: 'We believe in creating economic opportunities for women artisans and entrepreneurs across India.',
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4..." />
                  )
                },
                {
                  title: 'Authenticity',
                  desc: 'Every product on our platform is handcrafted with care, preserving traditional techniques.',
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7..." />
                  )
                },
                {
                  title: 'Sustainability',
                  desc: 'We promote eco-friendly practices and support artisans who use sustainable materials.',
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4..." />
                  )
                }
              ].map((value, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-pink-50 p-8 rounded-lg text-center hover:shadow-lg transition-shadow"
                >
                  <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {value.icon}
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-pink-700 mb-4">How It Works</h2>
            <div className="w-24 h-1 bg-pink-500 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Discover Authentic Products',
                desc: 'Browse handcrafted items from women artisans across India.',
                icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              },
              {
                step: '2',
                title: 'Secure Checkout',
                desc: 'Enjoy multiple payment options with secure transactions.',
                icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12...'
              },
              {
                step: '3',
                title: 'Fast Delivery & Support',
                desc: 'Get fast, reliable delivery with strong customer support.',
                icon: 'M20 7l-8-4-8 4m16 0l-8 4...'
              }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                viewport={{ once: true }}
                className="relative bg-white p-8 rounded-lg shadow-md border border-pink-100 hover:shadow-lg"
              >
                <div className="absolute -top-4 -left-4 bg-pink-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                  {step.step}
                </div>
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-pink-100 p-3 rounded-full">
                    <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={step.icon} />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-center">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
