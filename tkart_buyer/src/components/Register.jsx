import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiUser } from "react-icons/bi";
import { AiOutlineLock } from "react-icons/ai";
import axios from "axios";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import tklogo from "./tklogo.png";

const Register = () => {
  const [name, setName] = useState("");
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const notify = (msg) => {
    toast.warning(msg, {
      position: "top-right",
      autoClose: 4000,
      theme: "dark",
      transition: Bounce,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return notify("Enter your Name");
    if (!user) return notify("Enter the Username");
    if (!pass) return notify("Enter the Password");

    axios
      .post("http://localhost:8081/info", {
        name: name,
        username: user,
        password: pass,
      })
      .then((res) => {
        navigate("/login");
        toast.success("Registration successful!", {
          position: "top-right",
          autoClose: 4000,
          theme: "colored",
        });
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.message || "Registration failed",
          {
            position: "top-right",
            autoClose: 4000,
            theme: "dark",
          }
        );
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100">
      <div className="bg-white bg-opacity-80 border border-pink-200 backdrop-blur-md rounded-2xl shadow-xl px-8 py-10 w-[90%] max-w-md">
        <h1 className="text-4xl text-pink-700 font-bold text-center mb-2">
          Register
        </h1>
        <div className="flex justify-center mb-6">
          <img
            src={tklogo}
            alt="Thirumathi Kart Logo"
            className="w-20 h-20 object-contain"
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="relative mb-6">
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-md bg-transparent border border-pink-300 text-pink-800 focus:outline-none focus:border-pink-600"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <label className="absolute left-4 top-[-10px] text-sm px-1 bg-white text-pink-700">
              Name
            </label>
            <BiUser className="absolute right-4 top-3 text-pink-500" size={20} />
          </div>
          <div className="relative mb-6">
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-md bg-transparent border border-pink-300 text-pink-800 focus:outline-none focus:border-pink-600"
              onChange={(e) => setUser(e.target.value)}
              value={user}
              autoComplete="username"
            />
            <label className="absolute left-4 top-[-10px] text-sm px-1 bg-white text-pink-700">
              New Username
            </label>
            <BiUser className="absolute right-4 top-3 text-pink-500" size={20} />
          </div>
          <div className="relative mb-6">
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-md bg-transparent border border-pink-300 text-pink-800 focus:outline-none focus:border-pink-600"
              onChange={(e) => setPass(e.target.value)}
              value={pass}
              autoComplete="new-password"
            />
            <label className="absolute left-4 top-[-10px] text-sm px-1 bg-white text-pink-700">
              New Password
            </label>
            <AiOutlineLock className="absolute right-4 top-3 text-pink-500" size={20} />
          </div>
          <button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 rounded-md transition-all"
          >
            Register
          </button>
          <div className="text-center mt-6">
            <span className="text-pink-700 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-pink-600 hover:underline"
              >
                Login
              </Link>
            </span>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
