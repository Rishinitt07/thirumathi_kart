import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import tklogo from './tklogo.png';
import uploadIcon from './upload-icon.png'; // upload icon (70x70px)

const SidebarItem = ({ to, label }) => {
  const [hover, setHover] = useState(false);
  return (
    <Link
      to={to}
      style={{
        ...styles.menuItem,
        backgroundColor: hover ? '#ABD1F3' : 'transparent', // Replaced with a valid CSS color
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {label}
    </Link>
  );
};

const Sidebar = ({ isOpen, closeSidebar }) => (
  <>
    <div style={{ ...styles.sidebar, left: isOpen ? 0 : '-200px' }}>
      <SidebarItem to="/home" label="Home" />
      <SidebarItem to="/upload" label="Add Product" />
      <SidebarItem to="/myproducts" label="My Product" />
      <SidebarItem to="/orders" label="Orders" />
      <SidebarItem to="/profile" label="Profile" />
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
        src="https://cdn-icons-png.flaticon.com/128/9073/9073147.png"
        alt="Menu"
        onClick={toggleSidebar}
        style={styles.menuIcon}
      />
    </div>
  </div>
);

const Upload = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    subcategory: '',
    quantity: '',
    price: '',
    address: '',
    district: '',
    state: '',
    pincode: '',
  });

  const [images, setImages] = useState([null, null, null, null]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (index, file) => {
    const updated = [...images];
    updated[index] = file;
    setImages(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) =>
      formData.append(key, value)
    );
    images.forEach((img, i) => {
      if (img) formData.append(`image${i + 1}`, img);
    });

    try {
      await axios.post('http://localhost:8080/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Product uploaded successfully!');
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
  };

  const isDesktop = window.innerWidth > 768;

  return (
    <div style={styles.container}>
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div style={styles.bodyWrapper}>
        <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
        <div
          style={{
            ...styles.contentArea,
            marginLeft: isDesktop && sidebarOpen ? '200px' : '0',
          }}
        >
          <form onSubmit={handleSubmit} style={styles.form}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Upload Product</h2>

            <div style={styles.horizontalGroup}>
              {/* Upload Icons */}
              {images.map((_, i) => (
                <label key={i} style={styles.uploadBox}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(i, e.target.files[0])}
                    style={{ display: 'none' }}
                  />
                  <img src={uploadIcon} alt="Upload" style={styles.uploadIcon} />
                  <span style={styles.imageLabel}>Image {i + 1}</span>
                </label>
              ))}
            </div>

            {/* Horizontal Form Fields */}
            <div style={styles.horizontalGroup}>
              <input name="name" placeholder="Product Name" value={form.name} onChange={handleChange} style={styles.input} required />
              <input name="description" placeholder="Description" value={form.description} onChange={handleChange} style={styles.input} required />
            </div>
            <div style={styles.horizontalGroup}>
              <input name="category" placeholder="Category" value={form.category} onChange={handleChange} style={styles.input} required />
              <input name="subcategory" placeholder="Subcategory" value={form.subcategory} onChange={handleChange} style={styles.input} required />
            </div>
            <div style={styles.horizontalGroup}>
              <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} style={styles.input} required />
              <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} style={styles.input} required />
            </div>
            <div style={styles.horizontalGroup}>
              <input name="address" placeholder="Address" value={form.address} onChange={handleChange} style={styles.input} required />
            </div>
            <div style={styles.horizontalGroup}>
              <input name="district" placeholder="District" value={form.district} onChange={handleChange} style={styles.input} required />
              <input name="state" placeholder="State" value={form.state} onChange={handleChange} style={styles.input} required />
              <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} style={styles.input} required />
            </div>

            <button type="submit" style={styles.button}>Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f7fafc' },
  navbar: {
  borderBottom: '1px solid lightgray', boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px',
  position: 'sticky',
  top: 0,
  zIndex: 1001,
  background:'white',
  },
  logoContainer: { display: 'flex', alignItems: 'center', gap: '10px' },
  logo: { width: '40px', height: '40px' },
  logoText: { fontSize: '22px', fontWeight: 'bold', color: 'black', fontFamily: "'Josefin Sans', sans-serif" },
  rightMenu: { display: 'flex', alignItems: 'center', gap: '15px' },
  adminText: { fontSize: '14px', color: 'black', fontWeight: '500', fontFamily: "'Josefin Sans', sans-serif" },
  menuIcon: { width: '20px', height: '20px', cursor: 'pointer', filter: 'grayscale(100%)' },
  bodyWrapper: { display: 'flex', flex: 1 },
  sidebar: {
    position: 'fixed', top: '93px', bottom: '100px', left: 0, width: '200px', height: '85%',
    backgroundColor: 'white', borderRight: '1px solid lightgray', borderTop: '1px solid lightgray', borderBottom: '1px solid lightgray', display: 'flex', flexDirection: 'column',
    paddingTop: '20px', zIndex: 1000, transition: 'left 0.3s ease',borderRadius: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },
  menuItem: {
    fontFamily: "'Josefin Sans', sans-serif",
    padding: '12px 20px', textDecoration: 'none', color: '#333', fontWeight: '500',
    transition: 'background 0.3s ease', borderRadius: '4px',
  },
  contentArea: {
    flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center',
    padding: '20px', transition: 'margin-left 0.3s ease',
  },
  form: {
    fontFamily: "'Josefin Sans', sans-serif",
    display: 'flex', flexDirection: 'column', gap: '15px',backgroundColor: '#fff',
    padding: '30px', borderRadius: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    maxWidth: '900px', width: '100%',border: '1px solid lightgray',
  },
  input: {
    padding: '10px', fontSize: '16px', border: '1px solid #ccc',
    borderRadius: '5px', flex: 1,
  },
  horizontalGroup: {
    display: 'flex', gap: '10px', flexWrap: 'wrap',
  },
  uploadBox: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    width: '80px', cursor: 'pointer',
  },
  uploadIcon: {
    width: '70px',
    height: '70px',
    objectFit: 'cover',
    borderRadius: '5px',
    border: '1px dashed #ccc',
  },
  imageLabel: {
    fontSize: '12px',
    marginTop: '5px',
    color: '#555',
  },
  button: {
    color: '#fff', padding: '10px',
    borderRadius: '5px', border: 'none', cursor: 'pointer',
    backgroundColor:'#ABD1F3',
  },
  overlay: {
    position: 'fixed', top: '60px', left: 0, width: '100vw',
    height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.3)', zIndex: 900,
  },
};

export default Upload;
