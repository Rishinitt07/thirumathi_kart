import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="text-2xl font-bold text-black">Thirumathi Kart</div>
      <ul className="flex space-x-6 text-gray-700 font-medium">
        <li>
          <Link to="/Home" className="hover:text-green-600 transition-colors">
            Home
          </Link>
        </li>
        <li>
          <Link to="/Login" className="hover:text-green-600 transition-colors">
            Login
          </Link>
        </li>
        <li>
          <Link to="/Orders" className="hover:text-green-600 transition-colors">
            Orders
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
      <div
        className="text-white h-[100vh] w-full flex justify-center items-center bg-cover bg-center"
        style={{ backgroundImage: "url('../src/assets/bluee.jpg')" }}
      >
        <motion.h1
          initial={{ opacity: 0, x: -150 }}    // Start far to the left
          animate={{ opacity: 1, x: 0 }}       // Move to center
          transition={{
            duration: 1.2,
            ease: 'easeOut',
            type: 'tween'
          }}
          className="text-6xl md:text-7xl lg:text-8xl text-white font-bold tracking-wide drop-shadow-xl text-center px-4"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          Welcome to Thirumathi Kart Service
        </motion.h1>
      </div>
    </>
  );
};

export default Dashboard;
