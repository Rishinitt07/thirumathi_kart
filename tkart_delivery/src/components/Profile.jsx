import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiUser, FiPhone, FiCheckCircle, FiEdit2, FiHelpCircle, FiLogOut } from 'react-icons/fi';
import { FaMotorcycle, FaIdCard, FaCarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8082/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        toast.error('Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-24 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <FiUser className="text-3xl text-blue-600 mr-3" />
        My Profile
      </h1>

      <div className="space-y-6">
        
        {/* Personal Information */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 p-1 shrink-0 shadow-lg">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Delivery" alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
            <div className="flex items-center text-gray-500 mt-1">
              <FiPhone className="mr-2" /> {profile.phone || '+91 98765 43210'}
            </div>
            <span className="inline-flex items-center mt-2 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider">
              <FiCheckCircle className="mr-1" /> Active Partner
            </span>
          </div>
        </div>

        {/* Vehicle & License Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vehicle */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <FaMotorcycle className="text-blue-600 mr-2" /> Vehicle Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-500 text-sm">Vehicle Type</span>
                <span className="font-semibold text-gray-900 flex items-center"><FaMotorcycle className="mr-2 text-gray-400"/> Two Wheeler</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-500 text-sm">Vehicle Number</span>
                <span className="font-semibold text-gray-900 bg-yellow-100 px-2 py-0.5 rounded border border-yellow-300">TN 38 BX 4321</span>
              </div>
            </div>
          </div>

          {/* Verification */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <FaIdCard className="text-blue-600 mr-2" /> Verification
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-500 text-sm">Driving License</span>
                <span className="text-green-600 font-bold flex items-center"><FiCheckCircle className="mr-1"/> Verified</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-500 text-sm">ID Proof (Aadhar)</span>
                <span className="text-green-600 font-bold flex items-center"><FiCheckCircle className="mr-1"/> Verified</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-500 text-sm">Background Check</span>
                <span className="text-green-600 font-bold flex items-center"><FiCheckCircle className="mr-1"/> Cleared</span>
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100">
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center text-gray-700 font-semibold">
                <FiEdit2 className="mr-3 text-blue-600" size={20}/> Edit Profile
              </div>
              <span className="text-gray-400">›</span>
            </button>
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center text-gray-700 font-semibold">
                <FaCarAlt className="mr-3 text-blue-600" size={20}/> Update Vehicle Details
              </div>
              <span className="text-gray-400">›</span>
            </button>
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center text-gray-700 font-semibold">
                <FiHelpCircle className="mr-3 text-blue-600" size={20}/> Help & Support
              </div>
              <span className="text-gray-400">›</span>
            </button>
            <button onClick={handleLogout} className="w-full p-4 flex items-center justify-between hover:bg-red-50 transition-colors group">
              <div className="flex items-center text-red-600 font-semibold group-hover:text-red-700">
                <FiLogOut className="mr-3" size={20}/> Logout
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
