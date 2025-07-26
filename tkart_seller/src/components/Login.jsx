import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineUser, AiOutlineLock } from "react-icons/ai";
import axios from 'axios';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import tklogo from './tklogo.png';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
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
    axios.post('http://localhost:8080/login', {
      identifier: identifier,
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white py-10 px-4">
      <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
        
        {/* Left Panel */}
        <div className="md:w-1/2 bg-gradient-to-br from-pink-600 to-rose-500 text-white flex flex-col justify-center items-center p-10">
          <h2 className="text-3xl font-bold mb-4">New Here?</h2>
          <p className="text-center text-sm mb-6">
            To create a new account, please register first
          </p>
          <Link to="/register">
            <button className="bg-white text-pink-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition">
              SIGN UP
            </button>
          </Link>
        </div>

        {/* Right Panel */}
        <div className="md:w-1/2 p-10 bg-white">
          {/* Logo */}
           <div className="flex justify-center mb-4">
           <img src={tklogo} alt="Thirumathi Kart Logo" className="h-20 w-20" />
           </div>
          <h2 className="text-2xl font-bold text-pink-600 text-center mb-4">
            Login
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Identifier */}
            <div className="flex items-center border border-gray-300 rounded px-3 py-2">
              <AiOutlineUser className="text-gray-400 mr-2" />
              <input
                type="text"
                name="identifier"
                placeholder="Email or Phone"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full focus:outline-none"
                required
              />
            </div>

            {/* Password */}
            <div className="flex items-center border border-gray-300 rounded px-3 py-2">
              <AiOutlineLock className="text-gray-400 mr-2" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full focus:outline-none"
                required
              />
            </div>

            <div className="flex justify-between items-center text-sm text-pink-600">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-pink-500" />
                Remember Me
              </label>
              <Link to="#" className="hover:underline">Forgot Password?</Link>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-br from-pink-600 to-rose-500 text-white font-semibold py-2 rounded-full mt-2 transition"
            >
              Login
            </button>

            <div className="text-center mt-6">
              <span className="text-pink-700 text-sm">
                Don't have an account?{" "}
                <Link to="/register" className="font-medium text-pink-600 hover:underline">
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
