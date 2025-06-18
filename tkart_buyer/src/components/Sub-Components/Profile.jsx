import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Reusable Sidebar Component
const SidebarItem = ({ to, label, icon }) => (
    <Link
        to={to}
        className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
    >
        <span className="text-lg">{icon}</span>
        <span className="font-medium">{label}</span>
    </Link>
);

const Sidebar = ({ isOpen, closeSidebar }) => (
    <>
        <div
            className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transition-all duration-300 z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
        >
            <div className="h-16 flex items-center px-6 border-b">
                <h2 className="text-xl font-bold">Menu</h2>
            </div>
            <div className="p-4 space-y-2 mt-4">
                <SidebarItem to="/home" label="Home" icon="🏠" />
                <SidebarItem to="/categories" label="Categories" icon="🗂️" />
                <SidebarItem to="/cart" label="My Cart" icon="🛒" />
                <SidebarItem to="/orders" label="My Orders" icon="📦" />
                <SidebarItem to="/wishlist" label="Wishlist" icon="❤️" />
                <SidebarItem to="/profile" label="Profile" icon="👤" />
            </div>
        </div>
        {isOpen && (
            <div
                onClick={closeSidebar}
                className="fixed inset-0 bg-transparent bg-opacity-50 z-30 md:hidden"
            />
        )}
    </>
);

// Enhanced Navbar Component
const Navbar = ({ toggleSidebar }) => (
    <header className="sticky top-0 z-30 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                    <button
                        onClick={toggleSidebar}
                        className="mr-4 text-gray-500 hover:text-gray-600 md:hidden"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <Link to="/home" className="flex items-center">
                        <img
                            src="https://thirumathikart.nitt.edu/assets/img/tklogo.png"
                            alt="Logo"
                            className="h-8 w-8"
                        />
                        <span className="ml-2 text-xl font-bold text-gray-800">Thirumathi Kart</span>
                    </Link>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600 hidden sm:inline">Hi! Buyer</span>
                    <Link to="/cart" className="p-1 text-gray-500 hover:text-gray-600">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    </header>
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
            {/* User Guide Panel */}
            <aside className="w-full lg:w-1/4 bg-white rounded-lg shadow p-6 space-y-6">
                <div className="text-center border-b pb-6">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/4785/4785428.png"
                        alt="Guide Icon"
                        className="w-16 h-16 mx-auto mb-4"
                    />
                    <h2 className="text-xl font-bold text-gray-800">User Guide</h2>
                    <p className="text-gray-600 text-sm mt-2">
                        Quick help for your shopping experience
                    </p>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="flex items-center gap-2 text-md font-semibold text-blue-600 mb-3">
                            <span className="bg-blue-100 p-2 rounded-full">1</span>
                            How to Place Orders
                        </h3>
                        <ul className="space-y-2 text-gray-600 text-sm pl-10">
                            <li className="list-disc">Browse products in categories</li>
                            <li className="list-disc">Add items to your cart</li>
                            <li className="list-disc">Proceed to secure checkout</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="flex items-center gap-2 text-md font-semibold text-blue-600 mb-3">
                            <span className="bg-blue-100 p-2 rounded-full">2</span>
                            Tracking Your Order
                        </h3>
                        <ul className="space-y-2 text-gray-600 text-sm pl-10">
                            <li className="list-disc">View order status in 'My Orders'</li>
                            <li className="list-disc">Receive email/SMS updates</li>
                            <li className="list-disc">Contact support for delays</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="flex items-center gap-2 text-md font-semibold text-blue-600 mb-3">
                            <span className="bg-blue-100 p-2 rounded-full">3</span>
                            Returns & Refunds
                        </h3>
                        <ul className="space-y-2 text-gray-600 text-sm pl-10">
                            <li className="list-disc">7-day return policy</li>
                            <li className="list-disc">Initiate returns from order details</li>
                            <li className="list-disc">Refunds processed in 3-5 business days</li>
                        </ul>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="font-medium text-blue-800 mb-2">Need more help?</h4>
                        <p className="text-sm text-blue-600 mb-3">
                            Contact our support team for any questions
                        </p>
                        <button className="w-full bg-white text-blue-600 border border-blue-200 py-2 px-4 rounded text-sm font-medium hover:bg-blue-100 transition">
                            Contact Support
                        </button>
                    </div>
                </div>
            </aside>


            <ToastContainer position="top-center" autoClose={2000} />
            <footer className="mt-65 text-center text-sm py-3 text-gray-500 border-t">
                Copyright © 2025 Thirumathi Kart. All Rights Reserved.
            </footer>
        </div>

    );
};

export default Profile;
