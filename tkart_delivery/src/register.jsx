import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BiUser } from "react-icons/bi";
import { AiOutlineLock, AiOutlineMail, AiOutlinePhone } from "react-icons/ai";
import { MdOutlinePerson } from "react-icons/md";
import axios from 'axios';
import { Bounce, toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
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

    // Validation
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
        username: formData.username,
        name: formData.name,
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
    <div className='text-white min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 py-8'>
      <div className='bg-slate-800 border border-slate-400 rounded-md p-8 shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-30 relative max-w-md w-full mx-4'>
        <h1 className='text-4xl text-white font-bold text-center mb-6'>
          Delivery Partner Registration
        </h1>

        <form onSubmit={handleRegister}>
          <div className='relative my-4'>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className='block w-full py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer'
              placeholder=""
              required
            />
            <label className='absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>
              Username
            </label>
            <BiUser className='absolute top-4 right-4 text-white' />
          </div>

          <div className='relative my-4'>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className='block w-full py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer'
              placeholder=""
              required
            />
            <label className='absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>
              Full Name
            </label>
            <MdOutlinePerson className='absolute top-4 right-4 text-white' />
          </div>

          <div className='relative my-4'>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className='block w-full py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer'
              placeholder=""
              required
            />
            <label className='absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>
              Email
            </label>
            <AiOutlineMail className='absolute top-4 right-4 text-white' />
          </div>

          <div className='relative my-4'>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className='block w-full py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer'
              placeholder=""
            />
            <label className='absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>
              Phone Number
            </label>
            <AiOutlinePhone className='absolute top-4 right-4 text-white' />
          </div>

          <div className='relative my-4'>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className='block w-full py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer'
              placeholder=""
              required
            />
            <label className='absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>
              Password
            </label>
            <AiOutlineLock className='absolute top-4 right-4 text-white' />
          </div>

          <div className='relative my-4'>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className='block w-full py-2.5 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer'
              placeholder=""
              required
            />
            <label className='absolute text-sm text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>
              Confirm Password
            </label>
            <AiOutlineLock className='absolute top-4 right-4 text-white' />
          </div>

          <button
            type="submit"
            disabled={loading}
            className='w-full mb-4 text-[18px] mt-6 rounded-full bg-white text-emerald-800 hover:bg-emerald-600 hover:text-white py-2 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>

          <div className='text-center'>
            <span className='text-white text-sm'>
              Already have an account?{' '}
              <Link to="/login" className='text-blue-500 hover:underline'>
                Login here
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
