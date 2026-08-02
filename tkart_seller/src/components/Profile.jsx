import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import {
  AiOutlineUser,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineHome,
  AiOutlineCamera,
  AiOutlineLoading3Quarters,
  AiOutlineSave
} from "react-icons/ai";
import { FiMapPin, FiSettings, FiEdit3, FiChevronRight, FiLogOut } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import profileIcon from "./profileIcon.png";

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
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-hotpink-400 focus:ring-4 focus:ring-hotpink-50 transition-all font-medium text-gray-800 appearance-none cursor-pointer"
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
              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-hotpink-400 focus:ring-4 focus:ring-hotpink-50 transition-all font-medium text-gray-800 resize-none"
              placeholder={`Enter ${label}`}
            />
          ) : (
            <input
              type={type}
              name={name}
              value={value || ""}
              onChange={onChange}
              maxLength={name === "mobile" || name === "pincode" ? (name === "mobile" ? 10 : 6) : undefined}
              className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:outline-none focus:ring-4 transition-all font-medium text-gray-800 ${name === 'mobile' ? 'border-gray-100 text-gray-500 cursor-not-allowed bg-gray-50/50' : 'border-gray-200 focus:border-hotpink-400 focus:ring-hotpink-50'}`}
              placeholder={`Enter ${label}`}
              disabled={name === 'mobile'}
            />
          )
        ) : (
          <div className="px-4 py-3 bg-hotpink-50/40 border-2 border-transparent rounded-xl flex items-center h-full min-h-[52px]">
            <span className="font-semibold text-gray-900 truncate">
              {value || <span className="text-gray-400 font-normal italic">Not specified</span>}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const Profile = () => {
  const [profileData, setProfileData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    gender: "",
    mobile: "",
    email: "",
    store_name: "",
    address_line_1: "",
    address_line_2: "",
    area: "",
    landmark: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    image: "",
    about_store: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeMenu, setActiveMenu] = useState("personal");
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:8080/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const d = res.data;
        setProfileData({
          username: d.mobile || "",
          first_name: d.first_name || d.name?.split(" ")[0] || "",
          last_name: d.last_name || d.name?.split(" ").slice(1).join(" ") || "",
          gender: d.gender || "",
          mobile: d.mobile || "",
          email: d.email || "",
          store_name: d.store_name || "",
          address_line_1: d.address_line_1 || "",
          address_line_2: d.address_line_2 || "",
          area: d.area || "",
          landmark: d.landmark || "",
          city: d.city || "",
          state: d.state || "",
          country: d.country || "India",
          pincode: d.pincode || "",
          about_store: d.about_store || "",
          image: d.profile_image
            ? `data:image/png;base64,${d.profile_image}`
            : profileIcon,
        });
      })
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, [token]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image");
        return;
      }
      setSelectedImage(file);
      setProfileData((prev) => ({
        ...prev,
        image: URL.createObjectURL(file),
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === "mobile" || name === "pincode") && /\D/.test(value)) return;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!profileData.first_name) {
      toast.error("First name is required");
      return;
    }

    const formData = new FormData();
    formData.set("first_name", profileData.first_name);
    formData.set("last_name", profileData.last_name);
    formData.set("name", `${profileData.first_name} ${profileData.last_name}`.trim());
    formData.set("gender", profileData.gender);
    formData.set("email", profileData.email);
    formData.set("store_name", profileData.store_name);
    formData.set("address_line_1", profileData.address_line_1);
    formData.set("address_line_2", profileData.address_line_2);
    formData.set("area", profileData.area);
    formData.set("landmark", profileData.landmark);
    formData.set("city", profileData.city);
    formData.set("state", profileData.state);
    formData.set("country", profileData.country);
    formData.set("pincode", profileData.pincode);
    formData.set("about_store", profileData.about_store);
    if (selectedImage) formData.set("image", selectedImage);
  
    setIsSaving(true);
    try {
      await axios.post("http://localhost:8080/profile/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Profile Updated Successfully! 🎉");
      setEditMode(false);
    } catch (err) {
      toast.error("Update Failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone and will delete all your products.")) {
      try {
        await axios.delete("http://localhost:8080/account", {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Account deleted successfully!");
        localStorage.removeItem("token");
        window.location.href = "/";
      } catch (err) {
        toast.error("Failed to delete account");
      }
    }
  };

  const getProfileInitials = () => {
    if (profileData.first_name || profileData.last_name) {
      return `${(profileData.first_name || "").charAt(0)}${(profileData.last_name || "").charAt(0)}`.toUpperCase();
    }
    return (profileData.username || "U").charAt(0).toUpperCase();
  };

  const menuItems = [
    { id: 'personal', label: 'Personal Info', icon: <AiOutlineUser /> },
    { id: 'address', label: 'Address Book', icon: <AiOutlineHome /> },
    { id: 'preferences', label: 'Settings', icon: <FiSettings /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 text-lg font-josefin flex items-center gap-2">
          <AiOutlineLoading3Quarters className="animate-spin text-hotpink-500" />
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-josefin py-12">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT SIDEBAR */}
          <aside className="w-full lg:w-80 shrink-0 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden sticky top-24">
            
            {/* Sidebar Profile Card Header */}
            <div className="p-8 text-center border-b border-gray-100 bg-white">
              <div className="relative group inline-block mx-auto mb-4">
                <label htmlFor="profile-pic" className={`cursor-${editMode ? 'pointer' : 'default'} block`}>
                  <motion.div whileHover={editMode ? { scale: 1.05 } : {}} className="relative">
                    {profileData.image ? (
                      <img
                        src={profileData.image}
                        onError={(e) => (e.target.src = profileIcon)}
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
                {profileData.first_name || profileData.last_name ? `${profileData.first_name} ${profileData.last_name}` : "Seller Profile"}
              </h1>
              <p className="text-gray-500 font-medium text-sm mt-1 flex items-center justify-center gap-1">
                <FiMapPin className="text-hotpink-400" />
                {profileData.district || profileData.state ? `${profileData.district || ''}${profileData.district && profileData.state ? ', ' : ''}${profileData.state || ''}` : "Location not set"}
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
                    <button onClick={() => {
                      setEditMode(false);
                      // Reset selected image locally on cancel
                      if (selectedImage) {
                         setSelectedImage(null);
                         // A simple reload is best to fetch old state since we modified profileData locally directly
                         window.location.reload(); 
                      }
                    }} className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-normal rounded-xl w-full py-3.5 flex items-center justify-center transition-all">
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
                    <p className="text-hotpink-600/80 mt-2 font-medium">Manage your basic profile details and identifiers.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
                    <ProfileField icon={<AiOutlineUser />} label="First Name" name="first_name" value={profileData.first_name} editable={editMode} onChange={handleChange} />
                    <ProfileField icon={<AiOutlineUser />} label="Last Name" name="last_name" value={profileData.last_name} editable={editMode} onChange={handleChange} />
                    <ProfileField icon={<AiOutlineUser />} label="Username" name="username" value={profileData.username} editable={false} onChange={handleChange} />
                    <ProfileField icon={<AiOutlineUser />} label="Gender" name="gender" value={profileData.gender} editable={editMode} onChange={handleChange} options={["Male", "Female", "Other"]} />
                    <ProfileField icon={<AiOutlinePhone />} label="Phone Number" name="mobile" value={profileData.mobile} editable={false} onChange={handleChange} />
                    <ProfileField icon={<AiOutlineMail />} label="Email Address" name="email" value={profileData.email} editable={editMode} onChange={handleChange} type="email" />
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
                  <div className="mb-8 border-b border-gray-100 pb-4">
                    <h2 className="text-3xl font-normal text-gray-900">Address Book</h2>
                    <p className="text-hotpink-600/80 mt-2 font-medium">Manage your location and delivery hub details.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
                    <ProfileField icon={<AiOutlineHome />} label="Store Name *" name="store_name" value={profileData.store_name} editable={editMode} onChange={handleChange} />
                    <ProfileField icon={<AiOutlinePhone />} label="Mobile Number *" name="mobile" value={profileData.mobile} editable={false} onChange={handleChange} />
                    
                    <div className="sm:col-span-2">
                      <ProfileField icon={<FiMapPin />} label="Address Line 1 *" name="address_line_1" value={profileData.address_line_1} editable={editMode} onChange={handleChange} />
                    </div>
                    
                    <div className="sm:col-span-2">
                      <ProfileField icon={<FiMapPin />} label="Address Line 2 (Optional)" name="address_line_2" value={profileData.address_line_2} editable={editMode} onChange={handleChange} />
                    </div>

                    <ProfileField icon={<FiMapPin />} label="Area / Locality *" name="area" value={profileData.area} editable={editMode} onChange={handleChange} />
                    <ProfileField icon={<FiMapPin />} label="Landmark (Optional)" name="landmark" value={profileData.landmark} editable={editMode} onChange={handleChange} />
                    <ProfileField icon={<FiMapPin />} label="City *" name="city" value={profileData.city} editable={editMode} onChange={handleChange} />
                    <ProfileField icon={<FiMapPin />} label="State *" name="state" value={profileData.state} editable={editMode} onChange={handleChange} />
                    <ProfileField icon={<FiMapPin />} label="Pincode *" name="pincode" value={profileData.pincode} editable={editMode} onChange={handleChange} />
                    <ProfileField icon={<FiMapPin />} label="Country *" name="country" value={profileData.country} editable={editMode} onChange={handleChange} />
                    <div className="sm:col-span-2">
                      <ProfileField icon={<AiOutlineHome />} label="About Store (Description)" name="about_store" value={profileData.about_store} editable={editMode} onChange={handleChange} />
                    </div>
                  </div>
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
                    <p className="text-hotpink-600/80 mt-2 font-medium">Configure your seller account preferences.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-x-8 gap-y-8">
                    
                    <div className="bg-gray-50/50 border-2 border-transparent rounded-2xl p-6 hover:bg-gray-50 transition-colors max-w-md">
                      <h3 className="text-xl font-normal text-gray-800 mb-4 flex items-center gap-2">
                        <FiSettings className="text-hotpink-500" /> Language Preferences
                      </h3>
                      <p className="text-sm text-gray-500 font-medium mb-4">
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
                          className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-medium px-6 py-3 rounded-xl transition-all"
                        >
                          <FiLogOut className="text-lg" />
                          Logout Session
                        </button>
                        
                        <button 
                          onClick={handleDeleteAccount}
                          className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium px-6 py-3 rounded-xl transition-all"
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
    </div>
  );
};

export default Profile;
