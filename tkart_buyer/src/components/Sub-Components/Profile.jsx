import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Profile = () => {
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
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get('http://localhost:8081/profile', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setProfile(res.data); // ✅ Set username and all other fields at once
            } catch (err) {
                console.error('Failed to fetch profile:', err);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfile(prev => ({ ...prev, avatar: file }));
        }
    };

    const validate = () => {
        let temp = {};
        temp.firstName = profile.firstName ? '' : 'Required';
        temp.lastName = profile.lastName ? '' : 'Required';
        temp.email = /\S+@\S+\.\S+/.test(profile.email) ? '' : 'Invalid email';
        temp.gender = profile.gender ? '' : 'Select gender';
        temp.mobile = /^[0-9]{10}$/.test(profile.mobile) ? '' : 'Enter 10-digit number';
        setErrors(temp);
        return Object.values(temp).every(x => x === '');
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        const formData = new FormData();
        for (let key in profile) {
            formData.append(key, profile[key]);
        }
        try {
            await axios.put('http://localhost:8081/profile/update', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('✅ Profile updated successfully!');
        } catch (error) {
            toast.error('❌ Failed to update profile.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 font-josefin">
            <header className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-50">
                <a href="/home" className="flex items-center gap-1 hover:">
                    <img
                        src="https://thirumathikart.nitt.edu/assets/img/tklogo.png"
                        alt="Thirumathi Kart Logo"
                        className="w-10 h-10 object-contain"
                    />
                    <div className="text-xl font-bold">Thirumathi Kart</div>
                </a>

                <nav className="flex gap-6 text-sm">
                    <a href="/home" className="hover:underline">Home</a>
                    <a href="/categories" className="hover:underline">Categories</a>
                    <a href="/cart" className="hover:underline">🛒</a>
                </nav>
            </header>
            <main className="flex flex-col lg:flex-row gap-6 p-6 max-w-6xl mx-auto">
                {/* Sidebar */}
                <aside className="w-full lg:w-1/4 bg-white rounded-lg shadow p-4 space-y-6">
                    <div className="text-center">
                        {/* 👤 Profile Icon */}
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
                                const confirmed = window.confirm("Are you sure you want to log out?");
                                if (confirmed) {
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

                {/* Profile Info */}

                <section className="w-full lg:w-3/4 bg-white rounded-lg shadow p-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Personal Information</h2>
                        <button className="text-blue-500 hover:underline text-sm">Edit</button>
                    </div>
                    <div>
                        <label className="font-medium">Username</label>
                        <input
                            type="text"
                            value={profile.username}
                            disabled
                            className="border p-2 rounded w-full mt-1 bg-gray-100 text-gray-700"
                        />
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="firstName" value={profile.firstName} onChange={handleChange} placeholder="First Name" className="border p-2 rounded" />
                        <input type="text" name="lastName" value={profile.lastName} onChange={handleChange} placeholder="Last Name" className="border p-2 rounded" />
                    </div>

                    <select
                        name="gender"
                        value={profile.gender}
                        onChange={handleChange}
                        className="border p-2 rounded w-full"
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>


                    <div>
                        <div className="flex justify-between items-center">
                            <label className="font-medium">Email Address</label>
                            <button className="text-blue-500 text-sm hover:underline">Edit</button>
                        </div>
                        <input type="email" name="email" value={profile.email} onChange={handleChange} className="border p-2 rounded w-full mt-1" />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>

                    <div>
                        <div className="flex justify-between items-center">
                            <label className="font-medium">Mobile Number</label>
                            <button className="text-blue-500 text-sm hover:underline">Edit</button>
                        </div>
                        <input
                            type="tel"
                            name="mobile"
                            pattern="[0-9]{10}"
                            maxLength="10"
                            value={profile.mobile}
                            onChange={handleChange}
                            className="border p-2 rounded w-full mt-1"
                        />
                        {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
                    </div>

                    <div>
                        <label className="font-medium">Feedback</label>
                        <textarea name="feedback" value={profile.feedback} onChange={handleChange} className="border p-2 rounded w-full mt-1"></textarea>
                    </div>

                    <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Save Changes
                    </button>
                </section>
            </main>

            <footer className="text-center text-sm py-4 text-gray-500">
                Copyright © 2025 Thirumathi Kart All Right Reserved.
            </footer>
            <ToastContainer position="top-center" autoClose={2000} />

        </div>
    );
};

export default Profile;
