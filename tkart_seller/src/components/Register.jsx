import React, { useState } from "react";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineUser, AiOutlineMobile, AiOutlineMail, AiOutlineLock, AiOutlineCheckCircle } from "react-icons/ai";
import axios from "axios";
import tklogo from '../assets/tklogo.png';








const Register = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    password: ""
  });
  
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSendOtp = () => {
    if (!form.email || !form.email.includes("@")) {
      toast.error("Please enter a valid email address", { theme: "dark", transition: Bounce });
      return;
    }
    axios.post("http://localhost:8080/send-otp", { email: form.email, mobile: form.mobile })
      .then((res) => {
        setOtpSent(true);
        toast.success(
          "OTP Sent to your email!",
          { theme: "dark", autoClose: 5000, position: "top-center" }
        );
      })
      .catch(() => {
        toast.error("Failed to send OTP. Try again.", { theme: "dark", transition: Bounce });
      });
  };

  const handleVerifyOtp = () => {
    if (!otp) return;
    axios.post("http://localhost:8080/verify-otp", { email: form.email, mobile: form.mobile, otp: otp })
      .then(() => {
        setOtpVerified(true);
        toast.success("Email Verified!", { theme: "dark", transition: Bounce });
      })
      .catch(() => {
        toast.error("Invalid OTP. Please try again.", { theme: "dark", transition: Bounce });
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!otpVerified) {
      toast.error("Please verify your email first", { theme: "dark", transition: Bounce });
      return;
    }
    axios
      .post("http://localhost:8080/info", form)
      .then(() => {
        toast.success("Registration successful!");
        navigate("/login");
      })
      .catch((err) => {
        const errorMsg = err.response?.data || "Registration Failed";
        toast.error(errorMsg, { theme: "dark", transition: Bounce });
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-hotpink-50 py-10 px-4 font-josefin">
      <ToastContainer />
      
      <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
        
        {/* Left Panel */}
        <div className="md:w-1/2 bg-gradient-to-br from-hotpink-400 to-hotpink-600 text-white flex flex-col justify-center items-center p-10 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
          <h2 className="text-4xl font-bold mb-4 z-10 drop-shadow-sm">Welcome Back!</h2>
          <p className="text-center text-white/90 text-lg mb-8 z-10">
            To keep connected with us please login with your personal info
          </p>
          <Link to="/login" className="z-10">
            <button className="bg-white text-hotpink-600 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-hotpink-50 transition-all duration-300 transform hover:-translate-y-1">
              SIGN IN
            </button>
          </Link>
        </div>

        {/* Right Panel */}
        <div className="md:w-1/2 p-10 bg-white flex flex-col justify-center">
           {/* Logo */}
            <div className="flex justify-center mb-6">
            <img src={tklogo} alt="Thirumathi Kart Logo" className="h-24 w-24 drop-shadow-md" />
            </div>

          <h2 className="text-3xl font-extrabold text-hotpink-600 text-center mb-8">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First & Last Name */}
            <div className="flex space-x-4">
              <div className="flex-1 flex items-center border-2 border-gray-100 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-hotpink-400 focus-within:bg-white transition-colors">
                <AiOutlineUser className="text-gray-400 mr-3 text-xl" />
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full focus:outline-none bg-transparent text-gray-700 placeholder-gray-400 font-medium"
                  required
                />
              </div>
              <div className="flex-1 flex items-center border-2 border-gray-100 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-hotpink-400 focus-within:bg-white transition-colors">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full focus:outline-none bg-transparent text-gray-700 placeholder-gray-400 font-medium"
                  required
                />
              </div>
            </div>

            
            {/* Mobile Number */}
            <div className="flex items-center border-2 border-gray-100 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-hotpink-400 focus-within:bg-white transition-colors">
              <AiOutlineMobile className="text-gray-400 mr-3 text-xl" />
              <input
                type="text"
                name="mobile"
                placeholder="Mobile Number"
                value={form.mobile}
                onChange={handleChange}
                className="w-full focus:outline-none bg-transparent text-gray-700 placeholder-gray-400 font-medium"
                required
              />
            </div>

            {/* Email & OTP Trigger */}
            <div className="flex items-center border-2 border-gray-100 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-hotpink-400 focus-within:bg-white transition-colors relative">
              <AiOutlineMail className="text-gray-400 mr-3 text-xl" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                disabled={otpVerified}
                className="w-full focus:outline-none bg-transparent text-gray-700 placeholder-gray-400 font-medium disabled:opacity-50"
                required
              />
              {otpVerified ? (
                <AiOutlineCheckCircle className="text-green-500 text-2xl absolute right-4" />
              ) : (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="absolute right-2 bg-hotpink-100 text-hotpink-600 px-3 py-1 rounded-lg text-sm font-semibold hover:bg-hotpink-200 transition-colors"
                >
                  {otpSent ? "Resend" : "Send OTP"}
                </button>
              )}
            </div>

            {/* OTP Input (Conditionally Rendered) */}
            {otpSent && !otpVerified && (
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center border-2 border-hotpink-200 rounded-xl px-4 py-3 bg-hotpink-50 focus-within:border-hotpink-400 focus-within:bg-white transition-colors">
                  <input
                    type="text"
                    name="otp"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full focus:outline-none bg-transparent text-gray-700 placeholder-gray-400 font-medium tracking-widest"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="bg-hotpink-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-hotpink-600 transition-colors shadow-md"
                >
                  Verify
                </button>
              </div>
            )}

            {/* Password */}
            <div className="flex items-center border-2 border-gray-100 rounded-xl px-4 py-3 bg-gray-50 focus-within:border-hotpink-400 focus-within:bg-white transition-colors">
              <AiOutlineLock className="text-gray-400 mr-3 text-xl" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full focus:outline-none bg-transparent text-gray-700 placeholder-gray-400 font-medium"
                required
              />
            </div>

            <div id="recaptcha-container"></div>
            <button
              type="submit"
              disabled={!otpVerified}
              className={`w-full py-3 mt-6 text-lg font-bold rounded-full shadow-lg transition-all duration-300 transform ${
                otpVerified 
                  ? 'bg-hotpink-600 text-white hover:bg-hotpink-500 hover:-translate-y-1' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
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
