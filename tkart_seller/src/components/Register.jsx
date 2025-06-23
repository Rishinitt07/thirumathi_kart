import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BiUser } from 'react-icons/bi';
import { AiOutlineLock } from 'react-icons/ai';
import axios from 'axios';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import bgimg from './bgimg.png'; // ✅ Update path if needed

const Register = () => {
  const [name, setName] = useState('');
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();

  const notify = (msg) => {
    toast.error(msg, {
      position: 'top-right',
      autoClose: 5000,
      theme: 'light',
      transition: Bounce,
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!name) return notify('Enter your Full Name');
    if (!user) return notify('Enter the Username');
    if (!pass) return notify('Enter the Password');

    axios
      .post('http://localhost:8080/info', {
        name: name,
        username: user,
        password: pass,
      })
      .then((res) => {
        console.log(res.data);
        navigate('/login');
      })
      .catch((err) => {
        console.error(err);
        notify('Registration failed');
      });
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-none scale-105"
        style={{ backgroundImage: `url(${bgimg})` }}
      ></div>

      {/* Foreground Glass */}
      <div className="relative z-10 flex justify-center items-center h-full">
        <div className="w-full max-w-md p-8 rounded-xl border border-white/20 bg-white/20 backdrop-blur-lg shadow-[0_0_3px_rgba(0,0,0,0.2)]">
          <h1 className="text-3xl font-semibold text-center text-blue-900 mb-8">
            Create an Account
          </h1>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="relative">
              <input
                type="text"
                required
                className="w-full border border-gray-300/40 rounded-md py-2 px-4 pl-10 focus:outline-none focus:border-blue-500 bg-white/40 backdrop-blur-sm"
                placeholder="Full Name"
                onChange={(e) => setName(e.target.value)}
              />
              <BiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
            </div>

            <div className="relative">
              <input
                type="text"
                required
                className="w-full border border-gray-300/40 rounded-md py-2 px-4 pl-10 focus:outline-none focus:border-blue-500 bg-white/40 backdrop-blur-sm"
                placeholder="Username"
                onChange={(e) => setUser(e.target.value)}
              />
              <BiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
            </div>

            <div className="relative">
              <input
                type="password"
                required
                className="w-full border border-gray-300/40 rounded-md py-2 px-4 pl-10 focus:outline-none focus:border-blue-500 bg-white/40 backdrop-blur-sm"
                placeholder="Password"
                onChange={(e) => setPass(e.target.value)}
              />
              <AiOutlineLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Register
            </button>

            <p className="text-center text-gray-700">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
