import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  AiOutlineUser,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineMessage,
  AiOutlineCamera,
  AiOutlineLoading3Quarters,
  AiOutlineSave,
  AiOutlineHome,
} from "react-icons/ai";
import { FiMapPin, FiSettings, FiEdit3, FiChevronRight, FiLogOut } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";





const Bounce = null;
const toast = {
  success: (msg) => console.log(msg),
  error: (msg) => console.log(msg),
  info: (msg) => console.log(msg),
  warn: (msg) => console.log(msg)
};

const ProfileField = ({ icon, label, name, value, editable, onChange, type = "text", options = [] }) => {
  return (
    <div className="flex flex-col group">
      <label className="text-sm font-normal text-gray-500 mb-1.5 flex items-center gap-2 tracking-wide uppercase">
        <span className="text-hotpink-500">{icon}</span> {label}
      </label>
      <div className="relative">
        {editable ? (
          options.length > 0 ? (
            <select
              name={name}
              value={value || ""}
              onChange={onChange}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-hotpink-400 focus:ring-4 focus:ring-hotpink-50 transition-all font-normal text-gray-800 appearance-none cursor-pointer"
            >
              <option value="" disabled>Select {label}</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : type === "textarea" ? (
            <textarea
              name={name}
              value={value || ""}
              onChange={onChange}
              rows="3"
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-hotpink-400 focus:ring-4 focus:ring-hotpink-50 transition-all font-normal text-gray-800 resize-none"
              placeholder={`Enter ${label}`}
            />
          ) : (
            <input
              type={type}
              name={name}
              value={value || ""}
              onChange={onChange}
              maxLength={name === "mobile" || name === "pincode" ? (name === "mobile" ? 10 : 6) : undefined}
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-hotpink-400 focus:ring-4 focus:ring-hotpink-50 transition-all font-normal text-gray-800"
              placeholder={`Enter ${label}`}
            />
          )
        ) : (
          <div className="px-4 py-3 bg-hotpink-50/40 border-2 border-transparent rounded-xl flex items-center h-full min-h-[52px]">
            <span className="font-normal text-gray-900 truncate">
              {value || <span className="text-gray-400 font-normal italic">Not specified</span>}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const Profile = () => {
  const [profile, setProfile] = useState({
    username: "",
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    feedback: "",
    image: "",
  });
  
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [activeMenu, setActiveMenu] = useState("personal"); // personal, address, preferences
  const [addresses, setAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    tag: "Home", fullName: "", mobile: "", houseNo: "", street: "", area: "", landmark: "", city: "", state: "", pincode: "", country: "India"
  });

  const loadAddresses = async () => {
    try {
      const res = await axios.get("http://localhost:8081/addresses", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAddresses(res.data || []);
    } catch (err) {
      console.error("Failed to load addresses:", err);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:8081/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setProfile((prev) => ({ ...prev, ...res.data }));
      } catch (err) {
        void 0;
        console.error("Fetch error:", err);
      }
    };
    fetchProfile();
    loadAddresses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === "mobile" || name === "pincode") && /\D/.test(value)) return;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        void 0;
        return;
      }
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    if (!profile.firstName) return "First name is required";
    if (!profile.lastName) return "Last name is required";
    if (profile.email && !/\S+@\S+\.\S+/.test(profile.email)) return "Invalid email address";
    if (profile.mobile && !/^[0-9]{10}$/.test(profile.mobile)) return "Mobile must be 10 digits";
    if (profile.pincode && !/^[0-9]{6}$/.test(profile.pincode)) return "Pincode must be 6 digits";
    return null;
  };

  const handleSubmit = async () => {
    const errorMsg = validate();
    if (errorMsg) {
      void 0;
      return;
    }

    const formData = new FormData();
    Object.entries(profile).forEach(([key, value]) => {
      if (key !== 'image') formData.append(key, value);
    });
    
    if (profileImage) formData.append("profileImage", profileImage);

    try {
      setIsSaving(true);
      await axios.put("http://localhost:8081/profile/update", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      void 0;
      setEditMode(false);
    } catch (error) {
      void 0;
      console.error("Update error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    if ((name === "mobile" || name === "pincode") && /\D/.test(value)) return;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveAddresses = async (newAddresses) => {
    try {
      await axios.put("http://localhost:8081/addresses", newAddresses, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAddresses(newAddresses);
      setShowAddressModal(false);
      void 0;
    } catch (err) {
      void 0;
    }
  };

  const submitAddress = () => {
    if (!addressForm.fullName || !addressForm.mobile || !addressForm.houseNo || !addressForm.street || !addressForm.area || !addressForm.city || !addressForm.state || !addressForm.pincode) {
      void 0;
      return;
    }
    
    let newAddresses = [...addresses];
    if (editingAddressId) {
      newAddresses = newAddresses.map(a => a.id === editingAddressId ? { ...addressForm, id: editingAddressId } : a);
    } else {
      newAddresses.push({ ...addressForm, id: Date.now().toString() });
    }
    saveAddresses(newAddresses);
  };

  const deleteAddress = (id) => {
    if(window.confirm("Delete this address?")) {
      saveAddresses(addresses.filter(a => a.id !== id));
    }
  };

  const openAddressModal = (address = null) => {
    if (address) {
      setAddressForm(address);
      setEditingAddressId(address.id);
    } else {
      setAddressForm({ tag: "Home", fullName: "", mobile: "", houseNo: "", street: "", area: "", landmark: "", city: "", state: "", pincode: "", country: "India" });
      setEditingAddressId(null);
    }
    setShowAddressModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await axios.delete("http://localhost:8081/account", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        void 0;
        localStorage.removeItem("token");
        window.location.href = "/";
      } catch (error) {
        void 0;
        console.error("Delete error:", error);
      }
    }
  };

  const getProfileInitials = () => {
    if (profile.firstName || profile.lastName) {
      return `${(profile.firstName || "").charAt(0)}${(profile.lastName || "").charAt(0)}`.toUpperCase();
    }
    return (profile.username || "U").charAt(0).toUpperCase();
  };

  const menuItems = [
    { id: 'personal', label: 'Personal Info', icon: <AiOutlineUser /> },
    { id: 'address', label: 'Address Book', icon: <AiOutlineHome /> },
    { id: 'preferences', label: 'Settings', icon: <FiSettings /> },
  ];

  return (
    <div className="min-h-screen bg-white font-josefin py-12">
      
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT SIDEBAR */}
          <aside className="w-full lg:w-80 shrink-0 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden sticky top-24">
            
            {/* Sidebar Profile Card Header */}
            <div className="p-8 text-center border-b border-gray-100 bg-white">
              <div className="relative group inline-block mx-auto mb-4">
                <label htmlFor="profile-pic" className={`cursor-${editMode ? 'pointer' : 'default'} block`}>
                  <motion.div whileHover={editMode ? { scale: 1.05 } : {}} className="relative">
                    {imagePreview || profile.image ? (
                      <img
                        src={imagePreview || profile.image}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover relative z-10 border-4 border-white shadow-md mx-auto"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full flex items-center justify-center relative z-10 border-4 border-white shadow-md bg-gradient-to-br from-hotpink-300 to-rose-400 mx-auto">
                        <span className="text-4xl font-normal text-white tracking-widest">{getProfileInitials()}</span>
                      </div>
                    )}
                    <AnimatePresence>
                      {editMode && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-1 rounded-full bg-black/50 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mx-auto">
                          <AiOutlineCamera className="text-white text-3xl" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  {editMode && <input type="file" id="profile-pic" hidden onChange={handleImageChange} accept="image/*" />}
                </label>
              </div>

              <h1 className="text-2xl font-normal text-gray-900 tracking-tight mt-4">
                {profile.firstName || profile.lastName ? `${profile.firstName} ${profile.lastName}` : profile.username || "Buyer Profile"}
              </h1>
              <p className="text-gray-500 font-normal text-sm mt-1 flex items-center justify-center gap-1">
                <FiMapPin className="text-hotpink-400" />
                {profile.city || profile.state ? `${profile.city || ''}${profile.city && profile.state ? ', ' : ''}${profile.state || ''}` : "Location not set"}
              </p>
            </div>

            {/* Sidebar Navigation */}
            <nav className="p-4 flex flex-col gap-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-normal text-lg ${
                    activeMenu === item.id 
                      ? "bg-hotpink-50 text-hotpink-600" 
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Sidebar Footer Actions */}
            <div className="p-6 border-t border-gray-100 bg-white">
              <AnimatePresence mode="wait">
                {editMode ? (
                  <motion.div key="edit-actions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-3">
                    <button onClick={handleSubmit} disabled={isSaving} className="bg-hotpink-500 hover:bg-hotpink-600 text-white font-normal shadow-lg shadow-hotpink-500/20 w-full py-3.5 flex items-center justify-center gap-2 rounded-xl transition-all">
                      {isSaving ? <AiOutlineLoading3Quarters className="animate-spin text-xl" /> : <><AiOutlineSave className="text-xl" /> Save Changes</>}
                    </button>
                    <button onClick={() => setEditMode(false)} className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-normal rounded-xl w-full py-3.5 flex items-center justify-center transition-all">
                      Cancel
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="view-actions" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="w-full">
                    <button onClick={() => setEditMode(true)} className="bg-gray-900 hover:bg-black text-white shadow-lg w-full px-6 py-3.5 flex items-center justify-center gap-2 transition-all rounded-xl">
                      <FiEdit3 className="text-lg" />
                      <span className="font-normal">Edit Profile</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 w-full bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 p-6 md:p-10 min-h-[600px]">
            <AnimatePresence mode="wait">
              
              {/* Personal Info View */}
              {activeMenu === 'personal' && (
                <motion.div
                  key="personal"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-8 border-b border-gray-100 pb-4">
                    <h2 className="text-3xl font-normal text-gray-900">Personal Information</h2>
                    <p className="text-hotpink-600/80 mt-2 font-normal">Manage your basic profile details and identifiers.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
                    <ProfileField icon={<AiOutlineUser />} label="First Name" name="firstName" value={profile.firstName} editable={editMode} onChange={handleChange} />
                    <ProfileField icon={<AiOutlineUser />} label="Last Name" name="lastName" value={profile.lastName} editable={editMode} onChange={handleChange} />
                    <ProfileField icon={<AiOutlineUser />} label="Username" name="username" value={profile.username} editable={false} onChange={handleChange} />
                    <ProfileField icon={<AiOutlineUser />} label="Gender" name="gender" value={profile.gender} editable={editMode} onChange={handleChange} options={["Male", "Female", "Other"]} />
                    <ProfileField icon={<AiOutlinePhone />} label="Phone Number" name="mobile" value={profile.mobile} editable={editMode} onChange={handleChange} />
                    <ProfileField icon={<AiOutlineMail />} label="Email Address" name="email" value={profile.email} editable={editMode} onChange={handleChange} type="email" />
                  </div>
                </motion.div>
              )}

              {/* Address Book View */}
              {activeMenu === 'address' && (
                <motion.div
                  key="address"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-8 border-b border-gray-100 pb-4 flex justify-between items-end">
                    <div>
                      <h2 className="text-3xl font-normal text-gray-900">Address Book</h2>
                      <p className="text-hotpink-600/80 mt-2 font-normal">Manage your shipping details for deliveries.</p>
                    </div>
                    <button onClick={() => openAddressModal()} className="bg-hotpink-500 hover:bg-hotpink-600 text-white px-4 py-2 rounded-xl shadow font-normal">
                      + Add New
                    </button>
                  </div>
                  
                  {addresses.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                      <p className="text-gray-500 mb-4">No addresses saved yet.</p>
                      <button onClick={() => openAddressModal()} className="bg-white border border-gray-200 text-hotpink-600 px-6 py-2 rounded-xl shadow-sm font-normal hover:bg-gray-50">
                        Add Your First Address
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {addresses.map((addr) => (
                        <div key={addr.id} className="border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow relative bg-white">
                          <div className="flex justify-between items-start mb-3">
                            <span className="bg-hotpink-100 text-hotpink-700 text-xs font-normal px-3 py-1 rounded-full uppercase tracking-wider">
                              {addr.tag}
                            </span>
                            <div className="flex gap-2">
                              <button onClick={() => openAddressModal(addr)} className="text-gray-400 hover:text-blue-500"><FiEdit3 /></button>
                              <button onClick={() => deleteAddress(addr.id)} className="text-gray-400 hover:text-red-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                              </button>
                            </div>
                          </div>
                          <h4 className="font-normal text-gray-800 text-lg">{addr.fullName}</h4>
                          <p className="text-gray-600 text-sm mt-1">{addr.houseNo}, {addr.street}</p>
                          <p className="text-gray-600 text-sm">{addr.area}</p>
                          {addr.landmark && <p className="text-gray-600 text-sm">Landmark: {addr.landmark}</p>}
                          <p className="text-gray-600 text-sm">{addr.city}, {addr.state} - {addr.pincode}</p>
                          <p className="text-gray-800 font-normal text-sm mt-3 flex items-center gap-2"><AiOutlinePhone /> {addr.mobile}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Preferences View */}
              {activeMenu === 'preferences' && (
                <motion.div
                  key="preferences"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-8 border-b border-gray-100 pb-4">
                    <h2 className="text-3xl font-normal text-gray-900">Account Settings</h2>
                    <p className="text-hotpink-600/80 mt-2 font-normal">Submit feedback or configure your preferences.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-x-8 gap-y-8">
                    <ProfileField icon={<AiOutlineMessage />} label="Feedback & Suggestions" name="feedback" value={profile.feedback} editable={editMode} onChange={handleChange} type="textarea" />
                    
                    <div className="bg-gray-50/50 border-2 border-transparent rounded-2xl p-6 hover:bg-gray-50 transition-colors max-w-md">
                      <h3 className="text-xl font-normal text-gray-800 mb-4 flex items-center gap-2">
                        <FiSettings className="text-hotpink-500" /> Language Preferences
                      </h3>
                      <p className="text-sm text-gray-500 font-normal mb-4">
                        Choose the language you prefer for the application interface.
                      </p>
                      <div className="relative">
                        <select 
                          className="block w-full pl-4 pr-10 py-3 text-base font-normal text-gray-800 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-hotpink-400 appearance-none cursor-pointer hover:border-hotpink-200 transition-colors"
                          onChange={(e) => {
                            const lang = e.target.value;
                            if (lang === 'en') {
                              document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                              document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=" + document.domain + "; path=/;";
                              window.location.reload();
                            } else if (lang) {
                              const selectElement = document.querySelector('.goog-te-combo');
                              if (selectElement) {
                                selectElement.value = lang;
                                selectElement.dispatchEvent(new Event('change'));
                              }
                            }
                          }}
                        >
                          <option value="">Select Language / மொழி</option>
                          <option value="en">English</option>
                          <option value="ta">Tamil (தமிழ்)</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                          <FiChevronRight className="text-gray-400 rotate-90" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50/50 border-2 border-transparent rounded-2xl p-6 max-w-md mt-4">
                      <h3 className="text-xl font-normal text-gray-800 mb-4 flex items-center gap-2">
                        Account Actions
                      </h3>
                      <div className="flex flex-col gap-4">
                        <button 
                          onClick={handleLogout}
                          className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-normal px-6 py-3 rounded-xl transition-all"
                        >
                          <FiLogOut className="text-lg" />
                          Logout Session
                        </button>
                        
                        <button 
                          onClick={handleDeleteAccount}
                          className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-normal px-6 py-3 rounded-xl transition-all"
                        >
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </main>

        </div>
      </div>
      
      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-2xl font-normal text-gray-900 mb-6">
              {editingAddressId ? "Edit Address" : "Add New Address"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-normal text-gray-500 mb-1.5 tracking-wide uppercase">Tag</label>
                <select name="tag" value={addressForm.tag} onChange={handleAddressChange} className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-hotpink-400 focus:ring-4 focus:ring-hotpink-50 transition-all font-normal text-gray-800 cursor-pointer">
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Parents">Parents</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-normal text-gray-500 mb-1.5 tracking-wide uppercase">Full Name *</label>
                <input type="text" name="fullName" value={addressForm.fullName} onChange={handleAddressChange} className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-hotpink-400 focus:ring-4 focus:ring-hotpink-50 transition-all font-normal text-gray-800" placeholder="Enter full name" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-normal text-gray-500 mb-1.5 tracking-wide uppercase">Mobile *</label>
                <input type="text" name="mobile" maxLength={10} value={addressForm.mobile} onChange={handleAddressChange} className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-hotpink-400 focus:ring-4 focus:ring-hotpink-50 transition-all font-normal text-gray-800" placeholder="Enter mobile number" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-normal text-gray-500 mb-1.5 tracking-wide uppercase">Pincode *</label>
                <input type="text" name="pincode" maxLength={6} value={addressForm.pincode} onChange={handleAddressChange} className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-hotpink-400 focus:ring-4 focus:ring-hotpink-50 transition-all font-normal text-gray-800" placeholder="Enter pincode" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-normal text-gray-500 mb-1.5 tracking-wide uppercase">House No / Building *</label>
                <input type="text" name="houseNo" value={addressForm.houseNo} onChange={handleAddressChange} className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-hotpink-400 focus:ring-4 focus:ring-hotpink-50 transition-all font-normal text-gray-800" placeholder="Enter house no." />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-normal text-gray-500 mb-1.5 tracking-wide uppercase">Street / Colony *</label>
                <input type="text" name="street" value={addressForm.street} onChange={handleAddressChange} className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-hotpink-400 focus:ring-4 focus:ring-hotpink-50 transition-all font-normal text-gray-800" placeholder="Enter street" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-normal text-gray-500 mb-1.5 tracking-wide uppercase">Area *</label>
                <input type="text" name="area" value={addressForm.area} onChange={handleAddressChange} className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-hotpink-400 focus:ring-4 focus:ring-hotpink-50 transition-all font-normal text-gray-800" placeholder="Enter area" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-normal text-gray-500 mb-1.5 tracking-wide uppercase">Landmark</label>
                <input type="text" name="landmark" value={addressForm.landmark} onChange={handleAddressChange} className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-hotpink-400 focus:ring-4 focus:ring-hotpink-50 transition-all font-normal text-gray-800" placeholder="Enter landmark (optional)" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-normal text-gray-500 mb-1.5 tracking-wide uppercase">City *</label>
                <input type="text" name="city" value={addressForm.city} onChange={handleAddressChange} className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-hotpink-400 focus:ring-4 focus:ring-hotpink-50 transition-all font-normal text-gray-800" placeholder="Enter city" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-normal text-gray-500 mb-1.5 tracking-wide uppercase">State *</label>
                <input type="text" name="state" value={addressForm.state} onChange={handleAddressChange} className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-hotpink-400 focus:ring-4 focus:ring-hotpink-50 transition-all font-normal text-gray-800" placeholder="Enter state" />
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-4">
              <button onClick={() => setShowAddressModal(false)} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-normal transition-all">Cancel</button>
              <button onClick={submitAddress} className="px-6 py-3 bg-hotpink-500 hover:bg-hotpink-600 text-white rounded-xl shadow-lg shadow-hotpink-500/20 font-normal transition-all flex items-center gap-2">
                <AiOutlineSave className="text-lg" /> Save Address
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Profile;
