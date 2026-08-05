import React, { useState } from 'react';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineUser, AiOutlineLock } from "react-icons/ai";
import axios from 'axios';


import tklogo from '../assets/tklogo.png';






const Login = () => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const showErrorToast = () => {
    void 0;
  };

  axios.defaults.withCredentials = true;

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8081/login', {
      mobile: mobile,
      password: password,
    })
      .then(res => {
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
          navigate('/home');
        } else {
          showErrorToast();
        }
      })
      .catch(err => {
        console.log(err);
        showErrorToast();
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-hotpink-50 py-10 px-4 font-josefin">
      <ToastContainer />
      <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
        
        {/* Left Panel */}
        <div className="md:w-1/2 bg-gradient-to-br from-hotpink-400 to-hotpink-600 text-white flex flex-col justify-center items-center p-10 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
          <h2 className="text-4xl font-normal mb-4 z-10 drop-shadow-sm">New Here?</h2>
          <p className="text-center text-white/90 text-lg mb-8 z-10">
            To create a new account, please register first
          </p>
          <Link to="/register" className="z-10">
            <button className="bg-white text-hotpink-600 px-8 py-3 rounded-full font-normal shadow-lg hover:bg-hotpink-50 transition-all duration-300 transform hover:-translate-y-1">
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
          <h2 className="text-3xl font-normal text-hotpink-600 text-center mb-8">
            Login
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Mobile */}
            <div className="flex items-center border-2 border-gray-100 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-hotpink-400 focus-within:bg-white transition-colors">
              <AiOutlineUser className="text-gray-400 mr-3 text-xl" />
              <input
                type="text"
                name="mobile"
                placeholder="Mobile Number or Email"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full focus:outline-none bg-transparent text-gray-700 placeholder-gray-400 font-normal"
                required
              />
            </div>

            {/* Password */}
            <div className="flex items-center border-2 border-gray-100 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-hotpink-400 focus-within:bg-white transition-colors">
              <AiOutlineLock className="text-gray-400 mr-3 text-xl" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full focus:outline-none bg-transparent text-gray-700 placeholder-gray-400 font-normal"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-hotpink-500 text-white font-normal py-3 px-4 rounded-xl shadow-lg hover:bg-hotpink-600 transition-all duration-300 hover:shadow-hotpink-500/30 transform hover:-translate-y-0.5"
            >
              SIGN IN
            </button>
          </form>

          {/* Social Logins */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center px-4 py-2 border border-gray-200 rounded-xl shadow-sm bg-white hover:bg-gray-50 transition-colors">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5 mr-2" />
                <span className="text-sm font-normal text-gray-700">Google</span>
              </button>
              <button className="flex items-center justify-center px-4 py-2 border border-gray-200 rounded-xl shadow-sm bg-white hover:bg-gray-50 transition-colors">
                <img src="https://www.svgrepo.com/show/448224/facebook.svg" alt="Facebook" className="h-5 w-5 mr-2" />
                <span className="text-sm font-normal text-gray-700">Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Login;
