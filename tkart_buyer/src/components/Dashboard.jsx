import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      {/* Logo + Brand */}
      <div className="flex items-center gap-3">
        <img
          src="https://thirumathikart.nitt.edu/assets/img/tklogo.png"
          alt="Logo"
          className="w-10 h-10 object-contain"
        />
        <div className="text-2xl font-bold text-black">Thirumathi Kart</div>
      </div>

      {/* Navigation Links */}
      <ul className="flex space-x-6 text-gray-700 font-medium">
        <li>
          <Link to="/Login" className="hover:text-green-600 transition-colors">
            Sign in
          </Link>
        </li>
        <li>
          <Link to="/Register" className="hover:text-green-600 transition-colors">
            Sign up
          </Link>
        </li>
      </ul>
    </nav>
  );
};

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <div className="relative h-[100vh] w-full flex justify-center items-center bg-gradient-to-br from-white via-gray-100 to-gray-200">
        <motion.h1
          initial={{ opacity: 0, x: -150 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 1.2,
            ease: 'easeOut',
            type: 'tween'
          }}
          className="text-6xl md:text-7xl lg:text-8xl text-black font-bold tracking-wide drop-shadow-xl text-center px-4"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          Welcome to Buyer Service
        </motion.h1>
      </div>

    </>
  );
};

export default Dashboard;
