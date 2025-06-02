

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
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  };

  axios.defaults.withCredentials = true;

  const handleLogin = (e) => {
    e.preventDefault();

    axios.post('http://localhost:8080/login', { username: user, password: pass })
      .then(res => {
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);  // Store JWT token
          navigate('/home');  // Navigate to protected home page
        } else {
          show2();  // Show error toast on failure
        }
      })
      .catch(err => {
        console.log(err);
        show2();  // Show error toast on error
      });
  };

  return (
    <div className='text-white h-[100vh] w-[100%] flex justify-center items-center bg-cover' style={{ backgroundImage: "url('../src/assets/green.jpg')" }}>
      <div className='w-full h-screen backdrop-filter backdrop-blur-xl flex justify-center items-center'>
        <div className='bg-transparent border border-slate-400 rounded-xl p-8 shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-20 relative'>
          <h1 className='text-4xl text-white font-bold text-center mb-8'>Login</h1>
          <form onSubmit={handleLogin}>
            <div className='relative my-4'>
              <input
                type='text'
                className='block w-72 mb-7 py-2.3 px-0 text-l text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer'
                placeholder=''
                onChange={(e) => setUser(e.target.value)}
              />
              <label className='absolute text-l text-white duration-300 transform -translate-y-8 scale-75 top-3 z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-8'>
                Your Username
              </label>
              <BiUser className='absolute right-6 top-1' />
            </div>
            <div className='relative my-4'>
              <input
                type='password'
                className='block w-72 py-2.3 px-0 text-l text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer'
                placeholder=''
                onChange={(e) => setPass(e.target.value)}
              />
              <label className='absolute text-l text-white duration-300 transform -translate-y-8 scale-75 top-3 z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-8'>
                Your Password
              </label>
              <AiOutlineLock className='absolute right-6 top-1' />
            </div>
            <div className='flex justify-between items-center'>
              <div className='flex gap-2 items-center '>
                <input type='checkbox' />
                <label>Remember Me</label>
              </div>
              <Link to="" className='text-blue-300 hover:cursor-pointer'>
                Forget Password?
              </Link>
            </div>
            <button
              type='submit'
              className='w-full mb-4 mt-3 text-[20px] rounded-full bg-white h-10 text-blue-950 hover:bg-emerald-500 hover:text-white py-1 transition-colors duration-300'
            >
              Login
            </button>
            <div>
              <span className='m-9'>New Here? <Link to="/register" className='text-blue-950'>Create an account</Link></span>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default Login;
