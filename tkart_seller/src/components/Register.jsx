import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineUser, AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import axios from "axios";

const Register = () => {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    password: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8080/info", form)
      .then(() => navigate("/login"))
      .catch(() => alert("Registration Failed"));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white py-10 px-4">
      <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
        
        {/* Left Panel */}
        <div className="md:w-1/2 bg-gradient-to-br from-pink-600 to-rose-500 text-white flex flex-col justify-center items-center p-10">
          <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
          <p className="text-center text-sm mb-6">
            To keep connected with us please login with your personal info
          </p>
          <Link to="/login">
            <button className="bg-white text-pink-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition">
              SIGN IN
            </button>
          </Link>
        </div>

        {/* Right Panel */}
        <div className="md:w-1/2 p-10 bg-white">
          <h2 className="text-2xl font-bold text-pink-600 text-center mb-4">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name */}
            <div className="flex items-center border border-gray-300 rounded px-3 py-2">
              <AiOutlineUser className="text-gray-400 mr-2" />
              <input
                type="text"
                name="firstname"
                placeholder="First Name"
                value={form.firstname}
                onChange={handleChange}
                className="w-full focus:outline-none"
              />
            </div>

            {/* Last Name */}
            <div className="flex items-center border border-gray-300 rounded px-3 py-2">
              <AiOutlineUser className="text-gray-400 mr-2" />
              <input
                type="text"
                name="lastname"
                placeholder="Last Name"
                value={form.lastname}
                onChange={handleChange}
                className="w-full focus:outline-none"
              />
            </div>

            {/* Phone */}
            <div className="flex items-center border border-gray-300 rounded px-3 py-2">
              <AiOutlineUser className="text-gray-400 mr-2" />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className="w-full focus:outline-none"
              />
            </div>

            {/* Email */}
            <div className="flex items-center border border-gray-300 rounded px-3 py-2">
              <AiOutlineMail className="text-gray-400 mr-2" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full focus:outline-none"
              />
            </div>

            {/* Password */}
            <div className="flex items-center border border-gray-300 rounded px-3 py-2">
              <AiOutlineLock className="text-gray-400 mr-2" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-br from-pink-600 to-rose-500 text-white font-semibold py-2 rounded-full mt-2 transition"
            >
              SIGN UP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
