// Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BiUser } from "react-icons/bi";
import { AiOutlineLock } from "react-icons/ai";
import axios from 'axios';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();

  const show2 = () => {
    toast.error('Invalid Credentials', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      transition: Bounce,
    });
  };

  axios.defaults.withCredentials = true;

  const handleLogin = (e) => {
    e.preventDefault();

    axios.post('http://localhost:8080/login', { username: user, password: pass })
      .then(res => {
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
          navigate('/home');
        } else {
          show2();
        }
      })
      .catch(err => {
        console.log(err);
        show2();
      });
  };

  return (
    <div className='flex justify-center items-center h-screen bg-white'>
      <div className='w-full max-w-md p-8 rounded-lg shadow-lg border border-gray-200 bg-white'>
        <h1 className='text-3xl font-semibold text-center text-blue-900 mb-8'>Login to Your Account</h1>
        <form onSubmit={handleLogin} className='space-y-6'>
          <div className='relative'>
            <input
              type='text'
              required
              className='w-full border border-gray-300 rounded-md py-2 px-4 pl-10 focus:outline-none focus:border-blue-500'
              placeholder='Username'
              onChange={(e) => setUser(e.target.value)}
            />
            <BiUser className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500' />
          </div>

          <div className='relative'>
            <input
              type='password'
              required
              className='w-full border border-gray-300 rounded-md py-2 px-4 pl-10 focus:outline-none focus:border-blue-500'
              placeholder='Password'
              onChange={(e) => setPass(e.target.value)}
            />
            <AiOutlineLock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500' />
          </div>

          <div className='flex justify-between items-center text-sm text-gray-600'>
            <label className='flex items-center gap-2'>
              <input type='checkbox' />
              Remember Me
            </label>
            <Link to="#" className='text-blue-500 hover:underline'>Forgot Password?</Link>
          </div>

          <button
            type='submit'
            className='w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300'
          >
            Login
          </button>

          <p className='text-center text-gray-600'>
            New Here? <Link to="/register" className='text-blue-600 hover:underline'>Create an account</Link>
          </p>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
