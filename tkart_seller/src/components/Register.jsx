// Register.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiUser } from "react-icons/bi";
import { AiOutlineLock } from "react-icons/ai";
import axios from "axios";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [name, setName] = useState("");
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const notify = (msg) => {
    toast.error(msg, {
      position: "top-right",
      autoClose: 5000,
      theme: "light",
      transition: Bounce,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return notify("Enter your Name");
    if (!user) return notify("Enter the Username");
    if (!pass) return notify("Enter the Password");

    axios
      .post("http://localhost:8080/info", {
        name: name,
        username: user,
        password: pass,
      })
      .then((res) => {
        console.log(res.data);
        navigate("/login");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Registration failed", {
          position: "top-right",
          autoClose: 5000,
          theme: "light",
        });
      });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg border border-gray-200 bg-white">
        <h1 className="text-3xl font-semibold text-center text-blue-900 mb-8">Create an Account</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded-md py-2 px-4 pl-10 focus:outline-none focus:border-blue-500"
              placeholder="Full Name"
              onChange={(e) => setName(e.target.value)}
            />
            <BiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>

          <div className="relative">
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded-md py-2 px-4 pl-10 focus:outline-none focus:border-blue-500"
              placeholder="Username"
              onChange={(e) => setUser(e.target.value)}
            />
            <BiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>

          <div className="relative">
            <input
              type="password"
              required
              className="w-full border border-gray-300 rounded-md py-2 px-4 pl-10 focus:outline-none focus:border-blue-500"
              placeholder="Password"
              onChange={(e) => setPass(e.target.value)}
            />
            <AiOutlineLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Register
          </button>

          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
          </p>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
