import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Profile Picture Component
const ProfilePicture = ({ username }) => (
  <div className="relative group">
    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-300 to-rose-400 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
      {username ? (
        <span className="text-3xl font-bold text-white">
          {username.charAt(0).toUpperCase()}
        </span>
      ) : (
        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )}
    </div>
    <div className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
      <label className="cursor-pointer">
        <input type="file" className="hidden" />
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </label>
    </div>
  </div>
);


// ✅ Main Profile Component
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

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const res = await axios.get('http://localhost:8081/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setProfile(prev => ({ ...prev, username: res.data.username }));
      } catch (err) {
        toast.error('Failed to fetch profile data');
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
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white font-josefin">
      <div className="pt-6 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <main className="w-full bg-white rounded-lg shadow p-6 border border-pink-100">
            <h2 className="text-2xl font-bold mb-6 text-pink-700">Edit Profile</h2>
            <div className="flex flex-col items-center mb-6">
              <ProfilePicture username={profile.username} />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-pink-700">Username</label>
              <input
                type="text"
                value={profile.username}
                disabled
                className="mt-1 w-full border border-pink-200 px-3 py-2 rounded bg-pink-50"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <input
                  name="firstName"
                  placeholder="First Name"
                  value={profile.firstName}
                  onChange={handleChange}
                  className="border border-pink-200 px-3 py-2 rounded w-full"
                />
                {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
              </div>
              <div>
                <input
                  name="lastName"
                  placeholder="Last Name"
                  value={profile.lastName}
                  onChange={handleChange}
                  className="border border-pink-200 px-3 py-2 rounded w-full"
                />
                {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
              </div>
            </div>
            <div className="mb-4">
              <select
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                className="border border-pink-200 px-3 py-2 rounded w-full"
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
                className="border border-pink-200 px-3 py-2 rounded w-full"
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
                className="border border-pink-200 px-3 py-2 rounded w-full"
              />
              {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
            </div>
            <div className="mb-4">
              <textarea
                name="feedback"
                placeholder="Your feedback..."
                value={profile.feedback}
                onChange={handleChange}
                className="border border-pink-200 px-3 py-2 rounded w-full"
              />
            </div>
            <button
              onClick={handleSubmit}
              className="bg-pink-600 text-white px-5 py-2 rounded hover:bg-pink-700"
            >
              Save Changes
            </button>
          </main>
        </div>
      </div>
      <footer className="bg-white py-4 border-t border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-pink-600">
          © 2025 Thirumathi Kart. All Rights Reserved.
        </div>
      </footer>
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default Profile;
