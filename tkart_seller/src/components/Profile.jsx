// Profile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import tklogo from './tklogo.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SidebarItem = ({ to, label }) => {
  const [hover, setHover] = useState(false);
  return (
    <Link
      to={to}
      style={{
        ...styles.menuItem,
        backgroundColor: hover ? '#ABD1F3' : 'transparent',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {label}
    </Link>
  );
};

const Sidebar = ({ isOpen, closeSidebar, handleLogout }) => (
  <>
    <div style={{ ...styles.sidebar, left: isOpen ? 0 : '-200px' }}>
      <SidebarItem to="/home" label="Home" />
      <SidebarItem to="/upload" label="Add Product" />
      <SidebarItem to="/myproducts" label="My Product" />
      <SidebarItem to="/orders" label="Orders" />
      <SidebarItem to="/profile" label="Profile" />
      <div style={styles.logoutContainer}>
        <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
      </div>
    </div>
    {isOpen && window.innerWidth <= 768 && (
      <div style={styles.overlay} onClick={closeSidebar}></div>
    )}
  </>
);

const Navbar = ({ toggleSidebar }) => (
  <div style={styles.navbar}>
    <div style={styles.logoContainer}>
      <img src={tklogo} alt="Logo" style={styles.logo} />
      <span style={styles.logoText}>Thirumathi Kart</span>
    </div>
    <div style={styles.rightMenu}>
      <span style={styles.adminText}>Hi! Admin</span>
      <img
        src="https://cdn-icons-png.flaticon.com/128/3917/3917065.png"
        alt="Menu"
        onClick={toggleSidebar}
        style={styles.menuIcon}
      />
    </div>
  </div>
);

const Profile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isDesktop = window.innerWidth > 768;
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    name: '', username: '', mobile: '', email: '', address: '',
    district: '', state: '', country: '', pincode: '', image: '',
  });

  const [editMode, setEditMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        data.image = data.profile_image
          ? `data:image/png;base64,${data.profile_image}`
          : 'https://cdn-icons-png.flaticon.com/128/3177/3177440.png';

        setProfileData({
          name: data.name || '', username: data.username || '', mobile: data.mobile || '',
          email: data.email || '', address: data.address || '', district: data.district || '',
          state: data.state || '', country: data.country || '', pincode: data.pincode || '',
          image: data.image,
        });
        setLoading(false);
      } catch (err) {
        console.error('Failed to load profile:', err);
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [token]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setProfileData(prev => ({ ...prev, image: URL.createObjectURL(file) }));
    }
  };

  const saveProfile = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(profileData).forEach(([key, value]) => {
        if (key !== 'username' && key !== 'image') formData.append(key, value);
      });
      if (selectedImage) formData.append('image', selectedImage);

      await axios.post('http://localhost:8080/profile/update', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });

      const response = await axios.get('http://localhost:8080/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updated = response.data;
      updated.image = updated.profile_image
        ? `data:image/png;base64,${updated.profile_image}`
        : profileData.image;

      setProfileData(prev => ({ ...prev, ...updated }));
      setEditMode(false);
      setSelectedImage(null);
      setError(null);
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
      toast.error('Profile update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={styles.container}>
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div style={styles.bodyWrapper}>
        <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} handleLogout={handleLogout} />
        <div style={{ ...styles.contentArea, marginLeft: isDesktop && sidebarOpen ? '200px' : '0' }}>
          {error && (
            <div style={styles.errorMessage}>
              {error}
              <button onClick={() => setError(null)} style={styles.closeError}>&times;</button>
            </div>
          )}

          <div style={styles.profileCard}>
            <div style={styles.imageSection}>
              <img src={profileData.image} alt="Profile" style={styles.profileImage} />
              {editMode && (
                <label htmlFor="profile-image-upload" style={styles.cameraIcon}>
                  <img src="https://cdn-icons-png.flaticon.com/128/3597/3597075.png" alt="Edit" />
                  <input type="file" id="profile-image-upload" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                </label>
              )}
            </div>

            <div style={styles.infoSection}>
              <div style={styles.row}>
                <input name="name" value={profileData.name} disabled={!editMode} onChange={handleInputChange} placeholder="Full Name" style={styles.input} />
                <input value={profileData.username} disabled placeholder="Username" style={{ ...styles.input, backgroundColor: '#eee' }} />
              </div>
              <div style={styles.row}>
                <input name="mobile" value={profileData.mobile} disabled={!editMode} onChange={handleInputChange} placeholder="Mobile Number" style={styles.input} />
              </div>
              <div style={styles.row}>
                <input name="email" value={profileData.email} disabled={!editMode} onChange={handleInputChange} placeholder="Email Address" style={styles.input} />
              </div>
              <div style={styles.addressBlock}>
                <textarea name="address" value={profileData.address} disabled={!editMode} onChange={handleInputChange} placeholder="Address" style={{ ...styles.input, height: '60px' }} />
                <div style={styles.row}>
                  <input name="district" value={profileData.district} disabled={!editMode} onChange={handleInputChange} placeholder="District" style={styles.input} />
                  <input name="state" value={profileData.state} disabled={!editMode} onChange={handleInputChange} placeholder="State" style={styles.input} />
                </div>
                <div style={styles.row}>
                  <input name="country" value={profileData.country} disabled={!editMode} onChange={handleInputChange} placeholder="Country" style={styles.input} />
                  <input name="pincode" value={profileData.pincode} disabled={!editMode} onChange={handleInputChange} placeholder="Pincode" style={styles.input} />
                </div>
              </div>
              <div style={styles.buttonRow}>
                {!editMode ? (
                  <button onClick={() => setEditMode(true)} style={styles.editBtn}>{loading ? 'Loading...' : 'Edit'}</button>
                ) : (
                  <>
                    <button onClick={() => { setEditMode(false); setSelectedImage(null); }} style={styles.cancelBtn} disabled={loading}>Cancel</button>
                    <button onClick={saveProfile} style={styles.saveBtn} disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
                  </>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};


const styles = {
  container: { minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f7fafc' },
  navbar: {
    borderBottom: '1px solid lightgray',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    position: 'sticky',
    top: 0,
    zIndex: 1001,
    background: 'white',
  },
  logoContainer: { display: 'flex', alignItems: 'center', gap: '10px' },
  logo: { width: '40px', height: '40px' },
  logoText: { fontSize: '22px', fontWeight: 'bold', color: 'black', fontFamily: "'Josefin Sans', sans-serif" },
  rightMenu: { display: 'flex', alignItems: 'center', gap: '15px' },
  adminText: { fontSize: '14px', color: 'black', fontWeight: '500', fontFamily: "'Josefin Sans', sans-serif" },
  menuIcon: { width: '20px', height: '20px', cursor: 'pointer', filter: 'grayscale(100%)' },
  bodyWrapper: { display: 'flex', flex: 1 },
  sidebar: {
    position: 'fixed',
    top: '93px',
    bottom: '0',
    left: 0,
    width: '200px',
    backgroundColor: 'white',
    borderRight: '1px solid lightgray',
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '20px',
    zIndex: 1000,
    transition: 'left 0.3s ease',
    borderRadius: '0 20px 20px 0',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },
  menuItem: {
    fontFamily: "'Josefin Sans', sans-serif",
    padding: '12px 20px',
    textDecoration: 'none',
    color: '#333',
    fontWeight: '500',
    transition: 'background 0.3s ease',
    borderRadius: '4px',
  },
  logoutContainer: {
    marginTop: 'auto',
    padding: '20px',
  },
  logoutButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#e53e3e',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: '14px',
  },
  contentArea: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    transition: 'margin-left 0.3s ease',
  },
  profileCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    width: '100%',
    maxWidth: '800px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },
  imageSection: {
    textAlign: 'center',
    marginBottom: '20px',
    position: 'relative',
  },
  profileImage: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    border: '2px solid #ccc',
    objectFit: 'cover',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: '10px',
    right: 'calc(50% - 60px)',
    background: 'white',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
  infoSection: { display: 'flex', flexDirection: 'column', gap: '15px' },
  row: { display: 'flex', gap: '10px' },
  input: {
    padding: '10px', border: '1px solid #ccc', borderRadius: '5px', flex: 1,
    fontFamily: "'Josefin Sans', sans-serif", fontSize: '14px',
  },
  addressBlock: { display: 'flex', flexDirection: 'column', gap: '10px' },
  buttonRow: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' },
  editBtn: {
    backgroundColor: '#3170DE', color: 'white', border: 'none',
    padding: '10px 16px', borderRadius: '6px', cursor: 'pointer',
    fontFamily: "'Josefin Sans', sans-serif", fontSize: '14px'
  },
  cancelBtn: {
    backgroundColor: '#edf2f7', border: '1px solid #ccc',
    padding: '10px 16px', borderRadius: '6px', cursor: 'pointer',
    fontFamily: "'Josefin Sans', sans-serif", fontSize: '14px'
  },
  saveBtn: {
    backgroundColor: '#38a169', color: 'white', border: 'none',
    padding: '10px 16px', borderRadius: '6px', cursor: 'pointer',
    fontFamily: "'Josefin Sans', sans-serif", fontSize: '14px'
  },
  errorMessage: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    padding: '10px 15px',
    borderRadius: '5px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  closeError: {
    background: 'none',
    border: 'none',
    color: '#b91c1c',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '0 5px'
  }
};

export default Profile;
