import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BiUser } from "react-icons/bi";
import { AiOutlineLock, AiOutlineMail, AiOutlinePhone } from "react-icons/ai";
import { MdOutlinePerson } from "react-icons/md";
import axios from 'axios';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import tklogo from "./assets/TKartD.png";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const showError = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  };

  const showSuccess = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      showError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8082/register', {
        username: formData.phone,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });

      showSuccess('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.data) {
        showError(error.response.data);
      } else {
        showError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 py-10 px-4 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">

        {/* Left Panel */}
        <div className="md:w-1/2 bg-gradient-to-br from-blue-500 to-blue-700 text-white flex flex-col justify-center items-center p-10 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
          <h2 className="text-4xl font-bold mb-4 z-10 drop-shadow-sm">Welcome Back!</h2>
          <p className="text-center text-white/90 text-lg mb-8 z-10">
            To keep connected with us please login with your personal info
          </p>
          <Link to="/login" className="z-10">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1">
              SIGN IN
            </button>
          </Link>
        </div>

        {/* Right Panel */}
        <div className="md:w-1/2 p-10 bg-white flex flex-col justify-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src={tklogo} alt="Thirumathi Kart Logo" className="h-24 w-24 drop-shadow-md" />
          </div>

          <h2 className="text-3xl font-extrabold text-blue-600 text-center mb-8">
            Create Account
          </h2>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* First Name & Last Name */}
            <div className="flex space-x-4">
              <div className="flex-1 flex items-center border-2 border-gray-100 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-blue-500 focus-within:bg-white transition-colors">
                <BiUser className="text-gray-400 mr-3 text-xl" />
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full focus:outline-none bg-transparent text-gray-700 placeholder-gray-400 font-medium"
                  required
                />
              </div>
              <div className="flex-1 flex items-center border-2 border-gray-100 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-blue-500 focus-within:bg-white transition-colors">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full focus:outline-none bg-transparent text-gray-700 placeholder-gray-400 font-medium"
                  required
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="flex space-x-4">
              <div className="flex-1 flex items-center border-2 border-gray-100 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-blue-500 focus-within:bg-white transition-colors">
                <AiOutlineMail className="text-gray-400 mr-3 text-xl" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full focus:outline-none bg-transparent text-gray-700 placeholder-gray-400 font-medium"
                  required
                />
              </div>
              <div className="flex-1 flex items-center border-2 border-gray-100 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-blue-500 focus-within:bg-white transition-colors">
                <AiOutlinePhone className="text-gray-400 mr-3 text-xl" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full focus:outline-none bg-transparent text-gray-700 placeholder-gray-400 font-medium"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex items-center border-2 border-gray-100 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-blue-500 focus-within:bg-white transition-colors">
              <AiOutlineLock className="text-gray-400 mr-3 text-xl" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full focus:outline-none bg-transparent text-gray-700 placeholder-gray-400 font-medium"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="flex items-center border-2 border-gray-100 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-blue-500 focus-within:bg-white transition-colors">
              <AiOutlineLock className="text-gray-400 mr-3 text-xl" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full focus:outline-none bg-transparent text-gray-700 placeholder-gray-400 font-medium"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 mt-6 text-lg font-bold rounded-full shadow-lg transition-all duration-300 transform ${loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-1'
                }`}
            >
              {loading ? 'Creating Account...' : 'SIGN UP'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
