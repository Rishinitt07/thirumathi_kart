import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BiUser } from "react-icons/bi";
import { AiOutlineLock } from "react-icons/ai";
import axios from 'axios';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import tklogo from './tklogo.png';  // Make sure the path matches your project

const Login = () => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();

  const showErrorToast = () => {
    toast.error('Invalid Credentials', {
      position: "top-right",
      autoClose: 4000,
      theme: "dark",
      transition: Bounce,
    });
  };

  axios.defaults.withCredentials = true;

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8081/login', { username: user, password: pass })
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100">
      <div className="bg-white bg-opacity-80 border border-pink-200 backdrop-blur-md rounded-2xl shadow-xl px-8 py-10 w-[90%] max-w-md">
        
        <h1 className="text-4xl text-pink-700 font-bold text-center mb-2">Login</h1>
        
        {/* 🔥 Logo under Login */}
        <div className="flex justify-center mb-6">
          <img src={tklogo} alt="Thirumathi Kart Logo" className="w-20 h-20 object-contain" />
        </div>

        <form onSubmit={handleLogin}>
          <div className="relative mb-6">
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-md bg-transparent border border-pink-300 text-pink-800 focus:outline-none focus:border-pink-600"
              onChange={(e) => setUser(e.target.value)}
            />
            <label className="absolute left-4 top-[-10px] text-sm px-1 bg-white text-pink-700">
              Username
            </label>
            <BiUser className="absolute right-4 top-3 text-pink-500" size={20} />
          </div>

          <div className="relative mb-6">
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-md bg-transparent border border-pink-300 text-pink-800 focus:outline-none focus:border-pink-600"
              onChange={(e) => setPass(e.target.value)}
            />
            <label className="absolute left-4 top-[-10px] text-sm px-1 bg-white text-pink-700">
              Password
            </label>
            <AiOutlineLock className="absolute right-4 top-3 text-pink-500" size={20} />
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="accent-pink-500"/>
              <label htmlFor="remember" className="text-pink-700 text-sm">Remember Me</label>
            </div>
            <Link to="#" className="text-sm text-pink-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 rounded-md transition-all"
          >
            Login
          </button>

          <div className="text-center mt-6">
            <span className="text-pink-700 text-sm">
              New here?{" "}
              <Link to="/register" className="font-medium text-pink-600 hover:underline">
                Create an account
              </Link>
            </span>
          </div>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;
