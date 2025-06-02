


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
    toast.warning(msg, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
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
        console.log(res.data);
        navigate("/login");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Registration failed", {
          position: "top-right",
          autoClose: 5000,
          theme: "dark",
        });
      });
  };

  return (
    <div
      className="text-white h-[100vh] w-[100%] flex justify-center items-center bg-cover"
      style={{ backgroundImage: "url('../src/assets/blue.jpg')" }}
    >
      <div className="w-full h-screen backdrop-filter backdrop-blur-xl flex justify-center items-center">
        <div className="bg-transparent border border-slate-400 rounded-xl p-8 shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-20 relative">
          <h1 className="text-4xl text-white font-bold text-center mb-8">
            Register
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="relative my-4">
              <input
                type="text"
                className="block w-72 mb-7 py-2.3 px-0 text-l text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer"
                placeholder=""
                onChange={(e) => setName(e.target.value)}
              />
              <label
                className="absolute text-l text-white duration-300 transform -translate-y-8 scale-75 top-3 z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-8"
              >
                Name
              </label>
              <BiUser className="absolute right-8 top-1" />
            </div>

            <div className="relative my-4">
              <input
                type="text"
                className="block w-72 py-2.3 px-0 mb-6 text-l text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer"
                placeholder=""
                onChange={(e) => setUser(e.target.value)}
              />
              <label
                className="absolute text-l text-white duration-300 transform -translate-y-8 scale-75 top-3 z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-8"
              >
                New username
              </label>
              <BiUser className="absolute right-8 top-1" />
            </div>

            <div className="relative my-4">
              <input
                type="password"
                className="block w-72 py-2.3 px-0 text-l text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer"
                placeholder=""
                onChange={(e) => setPass(e.target.value)}
              />
              <label
                className="absolute text-l text-white duration-300 transform -translate-y-8 scale-75 top-3 z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-8"
              >
                New Password
              </label>
              <AiOutlineLock className="absolute right-8 top-1" />
            </div>

            <button
              type="submit"
              className="w-full mb-4 mt-3 text-[20px] rounded-full bg-white h-10 text-blue-950 hover:bg-emerald-500 hover:text-white py-1 transition-colors duration-300"
            >
              Register
            </button>

            <div>
              <span className="m-9">
                Already have an Account?
                <Link to="/login" className="text-blue-950">
                  {" "}
                  Login
                </Link>
              </span>
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

export default Register;
