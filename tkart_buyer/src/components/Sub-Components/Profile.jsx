import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Reusable Sidebar Component
const SidebarItem = ({ to, label, icon }) => (
    <Link
        to={to}
        className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
    >
        <span className="text-lg text-pink-500">{icon}</span>
        <span className="font-medium">{label}</span>
    </Link>
);

const Sidebar = ({ isOpen, closeSidebar }) => {
    const navigate = useNavigate();

    // Pink-themed SVG icons
    const icons = {
        home: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
        ),
        categories: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
        ),
        cart: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
        ),
        orders: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
        ),
        wishlist: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
        ),
        profile: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
        ),
        logout: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
        )
    };

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            localStorage.removeItem('token');
            toast.success("Logged out successfully");
            navigate('/');
        }
    };

    return (
        <>
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transition-all duration-300 z-40 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="h-16 flex items-center px-6 border-b">
                    <h2 className="text-xl font-bold">Menu</h2>
                </div>
                <div className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <SidebarItem to="/home" label="Home" icon={icons.home} />
                    <SidebarItem to="/categories" label="Categories" icon={icons.categories} />
                    <SidebarItem to="/cart" label="My Cart" icon={icons.cart} />
                    <SidebarItem to="/orders" label="My Orders" icon={icons.orders} />
                    <SidebarItem to="/wishlist" label="Wishlist" icon={icons.wishlist} />
                    <SidebarItem to="/profile" label="Profile" icon={icons.profile} />
                </div>

                {/* Logout Button at Bottom */}
                <div className="p-4 border-t">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-5 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <span className="text-lg text-red-600">{icons.logout}</span>
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>

            {isOpen && (
                <div
                    onClick={closeSidebar}
                    className="fixed inset-0 bg-transparent bg-opacity-30 z-30 md:hidden"
                />
            )}
        </>
    );
};

// Enhanced Navbar Component
const Navbar = ({ toggleSidebar }) => (
    <header className="sticky top-0 z-30 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
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
                    <motion.img
                        src="https://cdn-icons-png.flaticon.com/128/1828/1828859.png"
                        alt="Menu"
                        onClick={toggleSidebar}
                        className="w-5 h-5 cursor-pointer filter grayscale"
                        whileHover={{ scale: 1.2 }}
                        style={{ display: 'block' }} // ✅ force visibility
                    />
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

            <div className={`pt-6 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-[margin] duration-500 ease-in-out ${sidebarOpen ? 'lg:ml-64' : ''}`}>
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Profile Form - Takes full width on mobile, 2/3 on desktop */}
                    <main className="w-full lg:w-2/3 bg-white rounded-lg shadow p-6">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Profile</h2>

                        {/* Profile Picture Section */}
                        <div className="flex flex-col items-center mb-6">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-300 to-purple-400 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                                    {profile.username ? (
                                        <span className="text-3xl font-bold text-white">
                                            {profile.username.charAt(0).toUpperCase()}
                                        </span>
                                    ) : (
                                        <svg
                                            className="w-12 h-12 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                    )}
                                </div>
                                <div className="absolute inset-0 rounded-full bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <label className="cursor-pointer">
                                        <input type="file" className="hidden" />
                                        <svg
                                            className="w-8 h-8 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                    </label>
                                </div>
                            </div>
                            
                        </div>
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
                            <div>
                                <input
                                    name="firstName"
                                    placeholder="First Name"
                                    value={profile.firstName}
                                    onChange={handleChange}
                                    className="border px-3 py-2 rounded w-full"
                                />
                                {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                            </div>
                            <div>
                                <input
                                    name="lastName"
                                    placeholder="Last Name"
                                    value={profile.lastName}
                                    onChange={handleChange}
                                    className="border px-3 py-2 rounded w-full"
                                />
                                {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                            </div>
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
                            {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
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

                    {/* User Guide Panel - Hidden on mobile, 1/3 on desktop */}
                    <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-lg p-6 space-y-6 lg:sticky lg:top-6 lg:h-fit">
                        {/* Header Section */}
                        <div className="text-center border-b pb-6">
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Thirumathi Kart</h1>
                            <p className="text-gray-600">Your shopping companion</p>
                        </div>

                        {/* User Greeting */}
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                            <div className="bg-blue-100 p-2 rounded-full">
                                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <span className="font-medium">Hi Buyer</span>
                        </div>

                        {/* How to Shop Section */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                                Shopping Guide
                            </h3>
                            <ul className="space-y-2 text-gray-600 text-sm pl-10">
                                <li className="list-disc">Proceed to secure checkout process</li>
                                <li className="list-disc">Multiple payment options available</li>
                            </ul>
                        </div>

                        {/* Order Tracking Section */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                                Order Tracking
                            </h3>
                            <ul className="space-y-2 text-gray-600 text-sm pl-10">
                                <li className="list-disc">View real-time order status updates</li>
                                <li className="list-disc">Receive email/SMS delivery notifications</li>
                                <li className="list-disc">Directly contact seller for queries</li>
                                <li className="list-disc">Track shipment with provided link</li>
                            </ul>
                        </div>

                        {/* Returns & Support Section */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
                                Returns & Support
                            </h3>
                            <ul className="space-y-2 text-gray-600 text-sm pl-10">
                                <li className="list-disc">Easy return initiation from order details</li>
                                <li className="list-disc">7-day hassle-free return policy</li>
                                <li className="list-disc">Quality guarantee on all products</li>
                                <li className="list-disc">24/7 customer support available</li>
                            </ul>
                        </div>

                        {/* Support Section */}
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <h4 className="font-medium text-blue-800 mb-2">Need more help?</h4>
                            <p className="text-sm text-blue-600 mb-3">Our support team is available 24/7</p>
                            <div className="flex flex-col gap-2">
                                <button className="w-full bg-white text-blue-600 border border-blue-200 py-2 px-4 rounded text-sm font-medium hover:bg-blue-100 transition flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    Call Support
                                </button>
                                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded text-sm font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Email Us
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="bg-white py-4 border-t">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
                    Copyright © 2025 Thirumathi Kart. All Rights Reserved.
                </div>
            </footer>

            <ToastContainer position="top-center" autoClose={2000} />
        </div>
    );
}

export default Profile;