import { Link } from 'react-router-dom';
import { BsBoxArrowInRight, BsPersonPlus } from 'react-icons/bs';
import { motion } from 'framer-motion';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-hotpink-50 font-josefin">
      <main className="container mx-auto px-4 py-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden mb-12 p-10 bg-gradient-to-br from-hotpink-400 to-hotpink-600 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl"
        >
          <div className="flex-1 space-y-6 z-10">
            <h1 className="text-5xl font-extrabold leading-tight drop-shadow-sm">Welcome to Thirumathi Kart Seller Service</h1>
            <p className="text-white/95 text-xl font-medium">Manage your products, track your earnings, and grow your store seamlessly.</p>

            <div className="flex flex-col sm:flex-row gap-5 pt-6">
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 bg-white text-hotpink-600 px-8 py-4 rounded-full font-bold shadow-lg hover:bg-hotpink-50 transition-all duration-300 transform hover:-translate-y-1"
              >
                <BsBoxArrowInRight className="text-xl" />
                Login
              </Link>

              <Link
                to="/register"
                className="flex items-center justify-center gap-2 bg-black/20 backdrop-blur-sm border border-white/40 px-8 py-4 rounded-full text-white font-bold hover:bg-black/30 transition-all duration-300 transform hover:-translate-y-1"
              >
                <BsPersonPlus className="text-xl" />
                Register
              </Link>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex-1 relative z-10"
          >
            <img
              src="https://illustrations.popsy.co/gray/work-from-home.svg"
              alt="dashboard"
              className="w-full max-w-md mx-auto drop-shadow-2xl"
            />
          </motion.div>
          
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
        </motion.div>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-3 gap-8">
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
              transition={{ duration: 0.5, delay: i * 0.15, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
              className="glass-card p-8 hover-lift"
            >
              <div className="w-12 h-12 bg-hotpink-100 rounded-full flex items-center justify-center mb-6">
                 <div className="w-6 h-6 bg-hotpink-500 rounded-full"></div>
              </div>
              <h3 className="text-hotpink-600 text-xl font-extrabold mb-3">{item.title}</h3>
              <p className="text-gray-600 font-medium leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Our Story */}
        <div className="max-w-7xl mx-auto py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-hotpink-700 mb-4 tracking-tight">Our Story</h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-hotpink-400 to-hotpink-600 rounded-full mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-hotpink-400 rounded-2xl transform rotate-3 scale-105 opacity-20"></div>
              <img
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Our Team"
                className="relative rounded-2xl shadow-2xl w-full h-auto object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-3xl font-bold text-gray-800">From Humble Beginnings</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Founded in 2023, Thirumathi Kart began as a small initiative to support women entrepreneurs in rural Tamil Nadu.
                What started as a local marketplace has now grown into a thriving e-commerce platform connecting thousands of
                women artisans with customers nationwide.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Our mission is simple: to create economic opportunities for women while providing customers with authentic,
                high-quality products that tell a story.
              </p>
              <div className="flex flex-wrap gap-6 pt-4">
                {[
                  { label: 'Women Sellers', value: '5000+' },
                  { label: 'Happy Customers', value: '100K+' },
                  { label: 'Categories', value: '50+' }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white border-2 border-hotpink-100 px-6 py-4 rounded-2xl shadow-sm hover:border-hotpink-400 transition-colors">
                    <h4 className="text-3xl font-extrabold text-hotpink-600">{stat.value}</h4>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Our Values */}
        <div className="py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-hotpink-700 mb-4 tracking-tight">Our Values</h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-hotpink-400 to-hotpink-600 rounded-full mx-auto"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-10">
              {[
                {
                  title: 'Empowerment',
                  desc: 'We believe in creating economic opportunities for women artisans and entrepreneurs across India.',
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                },
                {
                  title: 'Authenticity',
                  desc: 'Every product on our platform is handcrafted with care, preserving traditional techniques.',
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                },
                {
                  title: 'Sustainability',
                  desc: 'We promote eco-friendly practices and support artisans who use sustainable materials.',
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                }
              ].map((value, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  viewport={{ once: true }}
                  className="glass-card p-10 text-center hover-lift border-t-4 border-t-hotpink-500"
                >
                  <div className="bg-hotpink-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                    <svg className="w-10 h-10 text-hotpink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {value.icon}
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{value.title}</h3>
                  <p className="text-gray-600 font-medium leading-relaxed">{value.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;
