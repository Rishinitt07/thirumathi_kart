import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const UserGuidePanel = () => (
  <div className="w-full bg-white rounded-xl shadow-lg p-6 space-y-6 border border-hotpink-100 font-sans">
    <div className="text-center border-b border-hotpink-100 pb-6 relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-hotpink-400 to-rose-400 rounded-full"></div>
      <h1 className="text-2xl font-normal text-hotpink-700 mb-2 font-serif tracking-tight">
        Shopping Guide
      </h1>
      <p className="text-hotpink-600 font-medium">Your complete shopping companion</p>
    </div>
    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-hotpink-50 to-rose-50 rounded-lg border border-hotpink-100">
      <div className="bg-white p-2 rounded-full shadow-sm">
        <svg className="w-5 h-5 text-hotpink-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <div>
        <span className="font-medium text-gray-800">Quick Help Guide</span>
        <p className="text-xs text-hotpink-600">Find answers to common questions</p>
      </div>
    </div>
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-3">
          <span className="bg-hotpink-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-normal">
            1
          </span>
          Shopping Process
        </h3>
        <ul className="space-y-3 text-gray-600 text-sm pl-12">
          <li className="relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-hotpink-500 before:rounded-full">
            Browse products by category or search
          </li>
          <li className="relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-hotpink-500 before:rounded-full">
            Add items to your cart or wishlist
          </li>
          <li className="relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-hotpink-500 before:rounded-full">
            Proceed to secure checkout
          </li>
          <li className="relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-hotpink-500 before:rounded-full">
            Multiple payment options available
          </li>
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-3">
          <span className="bg-hotpink-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-normal">
            2
          </span>
          Order Tracking
        </h3>
        <ul className="space-y-3 text-gray-600 text-sm pl-12">
          <li className="relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-hotpink-500 before:rounded-full">
            Real-time order status updates
          </li>
          <li className="relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-hotpink-500 before:rounded-full">
            Email/SMS delivery notifications
          </li>
          <li className="relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-hotpink-500 before:rounded-full">
            Direct seller communication
          </li>
          <li className="relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-hotpink-500 before:rounded-full">
            Track shipment with provided link
          </li>
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-3">
          <span className="bg-hotpink-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-normal">
            3
          </span>
          Returns & Support
        </h3>
        <ul className="space-y-3 text-gray-600 text-sm pl-12">
          <li className="relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-hotpink-500 before:rounded-full">
            Easy return initiation from order details
          </li>
          <li className="relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-hotpink-500 before:rounded-full">
            7-day hassle-free return policy
          </li>
          <li className="relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-hotpink-500 before:rounded-full">
            Quality guarantee on all products
          </li>
          <li className="relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-hotpink-500 before:rounded-full">
            24/7 customer support available
          </li>
        </ul>
      </div>
    </div>
    <div className="bg-gradient-to-br from-hotpink-50 to-rose-50 p-5 rounded-xl border border-hotpink-100">
      <h4 className="font-semibold text-gray-800 mb-2 text-center">Need more help?</h4>
      <p className="text-sm text-gray-600 mb-4 text-center">Our support team is available 24/7</p>
      <div className="flex flex-col gap-3">
        <button className="w-full bg-white text-hotpink-600 border border-hotpink-200 py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-hotpink-50 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Call Support
        </button>
        <button className="w-full bg-gradient-to-r from-hotpink-600 to-rose-500 text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:from-hotpink-700 hover:to-rose-600 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Email Us
        </button>
      </div>
    </div>
  </div>
);

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="relative bg-gradient-to-r from-hotpink-600 to-rose-500 py-20 px-4 sm:px-6 lg:px-8 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-normal mb-4"
          >
            About Thirumathi Kart
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl max-w-3xl mx-auto"
          >
            Empowering women through seamless shopping experiences
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8"
          >
            <Link
              to="/Home"
              className="inline-block bg-white text-hotpink-600 px-8 py-3 rounded-full font-medium hover:bg-hotpink-50 transition duration-300"
            >
              Start Shopping
            </Link>
          </motion.div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white to-transparent"></div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-normal text-hotpink-700 mb-4">Our Story</h2>
          <div className="w-24 h-1 bg-hotpink-500 mx-auto"></div>
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
              Founded in 2023, Thirumathi Kart began as a small initiative to support women entrepreneurs in rural Tamil Nadu. What started as a local marketplace has now grown into a thriving e-commerce platform connecting thousands of women artisans with customers nationwide.
            </p>
            <p className="text-gray-600 mb-6">
              Our mission is simple: to create economic opportunities for women while providing customers with authentic, high-quality products that tell a story.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-hotpink-50 px-4 py-3 rounded-lg">
                <h4 className="font-normal text-hotpink-700">5000+</h4>
                <p className="text-sm text-gray-600">Women Sellers</p>
              </div>
              <div className="bg-hotpink-50 px-4 py-3 rounded-lg">
                <h4 className="font-normal text-hotpink-700">100K+</h4>
                <p className="text-sm text-gray-600">Happy Customers</p>
              </div>
              <div className="bg-hotpink-50 px-4 py-3 rounded-lg">
                <h4 className="font-normal text-hotpink-700">50+</h4>
                <p className="text-sm text-gray-600">Categories</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-normal text-hotpink-700 mb-4">Our Values</h2>
            <div className="w-24 h-1 bg-hotpink-500 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-10 h-10 text-hotpink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "Empowerment",
                description: "We believe in creating economic opportunities for women artisans and entrepreneurs across India."
              },
              {
                icon: (
                  <svg className="w-10 h-10 text-hotpink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Authenticity",
                description: "Every product on our platform is handcrafted with care, preserving traditional techniques."
              },
              {
                icon: (
                  <svg className="w-10 h-10 text-hotpink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                ),
                title: "Sustainability",
                description: "We promote eco-friendly practices and support artisans who use sustainable materials."
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-hotpink-50 p-8 rounded-lg text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="bg-hotpink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-normal text-hotpink-700 mb-4">How It Works</h2>
          <div className="w-24 h-1 bg-hotpink-500 mx-auto"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Discover Authentic Products",
              description: "Browse through thousands of handcrafted items from women artisans across India.",
              icon: (
                <svg className="w-8 h-8 text-hotpink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )
            },
            {
              step: "2",
              title: "Secure Checkout",
              description: "Enjoy multiple payment options with our 100% secure payment gateway.",
              icon: (
                <svg className="w-8 h-8 text-hotpink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              )
            },
            {
              step: "3",
              title: "Fast Delivery & Support",
              description: "Get your order delivered quickly with our reliable logistics partners.",
              icon: (
                <svg className="w-8 h-8 text-hotpink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              )
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative bg-white p-8 rounded-lg shadow-md border border-hotpink-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="absolute -top-4 -left-4 bg-hotpink-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-normal">
                {item.step}
              </div>
              <div className="flex items-center justify-center mb-4">
                <div className="bg-hotpink-100 p-3 rounded-full">{item.icon}</div>
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-center">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="bg-hotpink-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-normal text-hotpink-700 mb-4">
              What Our Customers Say
            </h2>
            <div className="w-24 h-1 bg-hotpink-500 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "The quality of products on Thirumathi Kart is unmatched. I love knowing my purchases support women artisans directly.",
                author: "Priya M.",
                role: "Loyal Customer"
              },
              {
                quote:
                  "As a seller, this platform has transformed my business. I've been able to reach customers across India!",
                author: "Lakshmi R.",
                role: "Artisan Partner"
              },
              {
                quote:
                  "Excellent customer service and fast delivery. The stories behind each product make shopping here special.",
                author: "Ananya K.",
                role: "New Customer"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="mb-4 text-hotpink-500">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 inline-block" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 italic mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="bg-hotpink-200 w-10 h-10 rounded-full flex items-center justify-center text-hotpink-700 font-normal">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-800">{testimonial.author}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <UserGuidePanel />
      </div>
      <div className="bg-gradient-to-r from-hotpink-600 to-rose-500 py-16 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-normal mb-4">
            Ready to Experience Thirumathi Kart?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of customers supporting women artisans across India
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/Login"
              className="bg-white text-hotpink-600 px-8 py-3 rounded-full font-medium hover:bg-hotpink-50 transition duration-300"
            >
              Shop Now
            </Link>
            <Link
              to="/Register"
              className="bg-transparent border-2 border-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-hotpink-600 transition duration-300"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
