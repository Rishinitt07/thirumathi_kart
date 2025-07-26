import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import {
  AiOutlineUser,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineEdit,
  AiOutlineHome,
} from "react-icons/ai";
import "react-toastify/dist/ReactToastify.css";
import profileIcon from "./profileIcon.png"; // ✅ Adjust path if needed

const Profile = () => {
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    email: "",
    district: "",
    state: "",
    country: "",
    pincode: "",
    address: "",
    image: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:8080/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const d = res.data;
        setProfileData({
          first_name: d.name?.split(" ")[0] || "",
          last_name: d.name?.split(" ")[1] || "",
          mobile: d.mobile || "",
          email: d.email || "",
          district: d.district || "",
          state: d.state || "",
          country: d.country || "",
          pincode: d.pincode || "",
          address: d.address || "",
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
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.set("name", `${profileData.first_name} ${profileData.last_name}`);
    formData.set("email", profileData.email);
    formData.set("district", profileData.district);
    formData.set("state", profileData.state);
    formData.set("country", profileData.country);
    formData.set("pincode", profileData.pincode);
    formData.set("address", profileData.address);
    if (selectedImage) {
      formData.set("image", selectedImage);
    }
  
    try {
      await axios.post("http://localhost:8080/profile/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Profile Updated");
      setEditMode(false);
    } catch (err) {
      toast.error("Update Failed");
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-lg">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white px-4 py-12">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl overflow-hidden font-josefin">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-pink-600 to-rose-500 h-30 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-white text-2xl font-bold -mt-9">My Profile</h2>
        </div>


        {/* Avatar + Upload */}
        <div className="relative flex justify-center -mt-14">
          <label htmlFor="profile-pic" className="cursor-pointer">
            <img
              src={profileData.image || profileIcon}
              onError={(e) => (e.target.src = profileIcon)}
              alt={`${profileData.first_name} ${profileData.last_name}`}
              className="w-28 h-28 rounded-full border-4 border-white object-cover shadow"
            />
            {editMode && (
              <input
                type="file"
                id="profile-pic"
                hidden
                onChange={handleImageChange}
                accept="image/*"
              />
            )}
          </label>
        </div>

        {/* Profile Fields */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ProfileField icon={<AiOutlineUser />} label="First Name" name="first_name" value={profileData.first_name} editable={editMode} onChange={handleChange} />
          <ProfileField icon={<AiOutlineUser />} label="Last Name" name="last_name" value={profileData.last_name} editable={editMode} onChange={handleChange} />
          <ProfileField icon={<AiOutlinePhone />} label="Phone" name="mobile" value={profileData.mobile} editable={false} onChange={handleChange} />
          <ProfileField icon={<AiOutlineMail />} label="Email" name="email" value={profileData.email} editable={editMode} onChange={handleChange} />
          <ProfileField icon={<AiOutlineHome />} label="District" name="district" value={profileData.district} editable={editMode} onChange={handleChange} />
          <ProfileField icon={<AiOutlineHome />} label="State" name="state" value={profileData.state} editable={editMode} onChange={handleChange} />
          <ProfileField icon={<AiOutlineHome />} label="Country" name="country" value={profileData.country} editable={editMode} onChange={handleChange} />
          <ProfileField icon={<AiOutlineHome />} label="Pincode" name="pincode" value={profileData.pincode} editable={editMode} onChange={handleChange} />
          <div className="sm:col-span-2">
            <ProfileField icon={<AiOutlineHome />} label="Address" name="address" value={profileData.address} editable={editMode} onChange={handleChange} />
          </div>
        </div>

        {/* Buttons */}
        <div className="px-6 pb-6">
          {editMode ? (
            <div className="flex gap-4">
              <button onClick={() => setEditMode(false)} className="w-1/2 bg-gray-200 text-gray-700 py-2 rounded-full hover:bg-gray-300">
                Cancel
              </button>
              <button onClick={handleSubmit} className="w-1/2 bg-gradient-to-br from-pink-600 to-rose-500 text-white py-2 rounded-full">
                Save
              </button>
            </div>
          ) : (
            <button onClick={() => setEditMode(true)} className="w-full bg-gradient-to-br from-pink-600 to-rose-500 text-white py-2 rounded-full flex items-center justify-center gap-2">
              <AiOutlineEdit /> Edit Profile
            </button>
          )}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

// Reusable Profile Field Component
const ProfileField = ({ icon, label, value, name, editable, onChange }) => (
  <div className="flex items-center gap-3 border border-pink-100 rounded-lg px-3 py-2">
    <span className="text-pink-500 text-lg">{icon}</span>
    {editable ? (
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="flex-1 text-sm text-gray-700 bg-transparent focus:outline-none"
        placeholder={label}
      />
    ) : (
      <div className="flex-1 text-sm text-gray-700">{value || label}</div>
    )}
  </div>
);

export default Profile;
