import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineMobile, AiOutlineLock } from "react-icons/ai";
import axios from 'axios';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import tklogo from "./assets/TKartD.png";


const Login = () => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8082/login', {
        mobile,
        password,
        rememberMe
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        showSuccess('Login successful!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      showError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 py-10 px-4 font-sans">
      <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">

        {/* Left Panel */}
        <div className="md:w-1/2 bg-gradient-to-br from-blue-500 to-blue-700 text-white flex flex-col justify-center items-center p-10 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
          <h2 className="text-4xl font-bold mb-4 z-10 drop-shadow-sm">New Here?</h2>
          <p className="text-center text-white/90 text-lg mb-8 z-10">
            To create a new account, please register first
          </p>
          <Link to="/register" className="z-10">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1">
              SIGN UP
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
            Login
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Mobile */}
            <div className="flex items-center border-2 border-gray-100 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-blue-500 focus-within:bg-white transition-colors">
              <AiOutlineMobile className="text-gray-400 mr-3 text-xl" />
              <input
                type="text"
                name="mobile"
                placeholder="Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full focus:outline-none bg-transparent text-gray-700 placeholder-gray-400 font-medium"
                required
              />
            </div>

            {/* Password */}
            <div className="flex items-center border-2 border-gray-100 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-blue-500 focus-within:bg-white transition-colors">
              <AiOutlineLock className="text-gray-400 mr-3 text-xl" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full focus:outline-none bg-transparent text-gray-700 placeholder-gray-400 font-medium"
                required
              />
            </div>

            <div className="flex justify-between items-center text-sm text-blue-600 font-medium">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-blue-600 w-4 h-4 rounded border-gray-300"
                />
                Remember Me
              </label>
              <Link to="#" className="hover:text-blue-800 hover:underline transition-colors">Forgot Password?</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 mt-4 text-lg font-bold rounded-full shadow-lg transition-all duration-300 transform ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-1'
                } text-white`}
            >
              {loading ? 'Logging in...' : 'Login to Dashboard'}
            </button>

            <div className="text-center mt-8">
              <span className="text-gray-500 font-medium">
                Don't have an account?{" "}
                <Link to="/register" className="font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                  Register Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;
