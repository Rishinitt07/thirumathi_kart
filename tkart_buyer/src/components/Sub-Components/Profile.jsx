import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Sidebar item
const SidebarItem = ({ to, label }) => (
    <Link
        to={to}
        className="block px-5 py-2 text-gray-800 font-medium hover:bg-gray-200 rounded"
    >
        {label}
    </Link>
);

// Sidebar
const Sidebar = ({ isOpen, closeSidebar }) => (
    <>
        <div
            className={`fixed top-[60px] left-0 w-48 h-full bg-white border-r transition-transform duration-300 z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
        >
            <SidebarItem to="/home" label="Home" />
            <SidebarItem to="/categories" label="Categories" />
            <SidebarItem to="/cart" label="My Cart" />
            <SidebarItem to="/orders" label="My Orders" />
            <SidebarItem to="/wishlist" label="Wishlist" />
            <SidebarItem to="/profile" label="Profile" />
        </div>
        {isOpen && (
            <div
                onClick={closeSidebar}
                className="fixed top-0 left-0 w-full h-full bg-transparent bg-opacity-30 z-40"
            />
        )}
    </>
);

// Navbar
const Navbar = ({ toggleSidebar }) => (
    <div className="flex items-center justify-between px-6 py-3 shadow-md sticky top-0 bg-white z-50">
        <div className="flex items-center gap-3">
            <img
                src="https://thirumathikart.nitt.edu/assets/img/tklogo.png"
                alt="Logo"
                className="w-10 h-10"
            />
            <Link to="/home" className="text-xl font-bold">
                Thirumathi Kart
            </Link>
        </div>
        <div className="flex items-center gap-4 cursor-pointer" onClick={toggleSidebar}>
            <span className="text-sm text-gray-600">Hi! Buyer</span>
            <motion.img
                src="https://cdn-icons-png.flaticon.com/128/1828/1828859.png"
                alt="Menu"
                className="w-5 h-5 cursor-pointer"
                whileHover={{ scale: 1.2 }}
                onClick={toggleSidebar}
            />
        </div>
    </div>
);

// Main Profile Component
const Profile = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profile, setProfile] = useState({
        username: '',
        firstName: '',
        lastName: '',
        gender: '',
        email: '',
        mobile: '',
        feedback: '',
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const res = await axios.get('http://localhost:8081/profile', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setProfile(prev => ({ ...prev, username: res.data.username }));
            } catch (err) {
                console.error('Failed to fetch username:', err);
            }
        };
        fetchUsername();
    }, []);

    const handleChange = e => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const temp = {
            firstName: profile.firstName ? '' : 'Required',
            lastName: profile.lastName ? '' : 'Required',
            email: /\S+@\S+\.\S+/.test(profile.email) ? '' : 'Invalid email',
            gender: profile.gender ? '' : 'Select gender',
            mobile: /^[0-9]{10}$/.test(profile.mobile) ? '' : 'Enter 10-digit number',
        };
        setErrors(temp);
        return Object.values(temp).every(x => x === '');
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        const formData = new FormData();
        Object.keys(profile).forEach(key => formData.append(key, profile[key]));

        try {
            await axios.put('http://localhost:8081/profile/update', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('✅ Profile updated successfully!');
            setProfile(prev => ({
                ...prev,
                firstName: '',
                lastName: '',
                gender: '',
                email: '',
                mobile: '',
                feedback: '',
            }));
        } catch (error) {
            toast.error('❌ Failed to update profile.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 font-josefin">
            <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />

            <div
                className={`pt-6 flex flex-col lg:flex-row max-w-7xl mx-auto px-4 gap-6 transition-[margin] duration-500 ease-in-out ${sidebarOpen ? 'lg:ml-48' : ''
                    }`}
            >
                {/* Left Panel */}
                <aside className="w-full lg:w-1/4 bg-white rounded-lg shadow p-4 space-y-6">
                    <div className="text-center">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                            alt="User Icon"
                            className="w-16 h-16 mx-auto rounded-full mb-2"
                        />
                        <p className="text-gray-700">Hello, <strong>user</strong></p>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold mb-2 text-gray-800">MY ORDERS</h3>
                        <button className="w-full text-left text-gray-600 hover:text-black">My Orders</button>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold mb-2 text-gray-800">ACCOUNT SETTINGS</h3>
                        <ul className="space-y-2 text-gray-600 text-sm">
                            <li><a href="#" className="hover:underline">Profile Information</a></li>
                            <li><a href="#" className="hover:underline">Manage Addresses</a></li>
                            <li><a href="#" className="hover:underline">PAN Card Information</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold mb-2 text-gray-800">PAYMENTS</h3>
                        <ul className="space-y-2 text-gray-600 text-sm">
                            <li><a href="#" className="hover:underline">Saved UPI</a></li>
                            <li><a href="#" className="hover:underline">Saved Cards</a></li>
                        </ul>
                    </div>

                    <div className="pt-4 border-t">
                        <button
                            onClick={() => {
                                if (window.confirm("Are you sure you want to log out?")) {
                                    localStorage.removeItem('token');
                                    window.location.href = '/';
                                }
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 mt-4 text-red-600 border border-red-300 rounded hover:bg-red-50 hover:text-red-700 transition duration-200"
                        >
                            <span className="text-lg">⎋</span>
                            <span className="font-medium text-sm">Logout</span>
                        </button>
                    </div>
                </aside>

                {/* Right Panel - Profile Form */}
                <main className="w-full lg:w-3/4 bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Profile</h2>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            value={profile.username}
                            disabled
                            className="mt-1 w-full border px-3 py-2 rounded bg-gray-100"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                            name="firstName"
                            placeholder="First Name"
                            value={profile.firstName}
                            onChange={handleChange}
                            className="border px-3 py-2 rounded"
                        />
                        <input
                            name="lastName"
                            placeholder="Last Name"
                            value={profile.lastName}
                            onChange={handleChange}
                            className="border px-3 py-2 rounded"
                        />
                    </div>

                    <div className="mb-4">
                        <select
                            name="gender"
                            value={profile.gender}
                            onChange={handleChange}
                            className="border px-3 py-2 rounded w-full"
                        >
                            <option value="">Select Gender</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={profile.email}
                            onChange={handleChange}
                            className="border px-3 py-2 rounded w-full"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>

                    <div className="mb-4">
                        <input
                            name="mobile"
                            placeholder="Mobile Number"
                            value={profile.mobile}
                            onChange={handleChange}
                            maxLength="10"
                            className="border px-3 py-2 rounded w-full"
                        />
                        {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
                    </div>

                    <div className="mb-4">
                        <textarea
                            name="feedback"
                            placeholder="Your feedback..."
                            value={profile.feedback}
                            onChange={handleChange}
                            className="border px-3 py-2 rounded w-full"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
                    >
                        Save Changes
                    </button>
                </main>
                
            </div>
             

            <ToastContainer position="top-center" autoClose={2000} />
           <footer className="mt-65 text-center text-sm py-3 text-gray-500 border-t">
        Copyright © 2025 Thirumathi Kart. All Rights Reserved.
      </footer>
        </div>
        
    );
};

export default Profile;
