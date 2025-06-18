// Home.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import tklogo from './tklogo.png';
import { motion } from 'framer-motion';

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

const Sidebar = ({ isOpen, closeSidebar }) => (
  <>
    <div
      style={{
        ...styles.sidebar,
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
      }}
    >
      <SidebarItem to="/home" label="Home" />
      <SidebarItem to="/upload" label="Add Product" />
      <SidebarItem to="/myproducts" label="My Product" />
      <SidebarItem to="/orders" label="Orders" />
      <SidebarItem to="/profile" label="Profile" />
    </div>

    {isOpen && (
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

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Removed unused screenWidth state
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    axios
      .get('http://localhost:8080/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .catch(err => {
        console.error('Access denied', err);
        localStorage.removeItem('token');
        navigate('/login');
      });
  }, [navigate]);

  // Removed unused useEffect for screenWidth

  return (
    <div style={styles.container}>
      <Navbar toggleSidebar={() => setSidebarOpen(prev => !prev)} />
      <div style={styles.bodyWrapper}>
        <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
        <div style={styles.contentArea}>
          {/* Hero Section */}
          <div className="bg-white px-6 pt-12 pb-6">
            <motion.div
              initial={{ x: -200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              className="flex flex-col md:flex-row items-center gap-10"
              style={styles.hero}
            >
              <div className="max-w-xl text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                  The e-commerce platform for <span className="text-indigo-600">SHGs</span> to market their products
                </h1>
                <p className="mt-6 text-lg text-gray-600">
                  We provide Self-help groups a formal platform to showcase their products to a wider market,
                  and hence empower them by increasing their income.
                </p>
              </div>
              <div className="max-w-md">
                <img
                  src="https://thirumathikart.nitt.edu/assets/img/tklogo.png"
                  alt="ThirumathiKart Illustration"
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <footer style={styles.footer}>
            <div style={styles.footerContainer}>
              <div style={styles.footerColumn}>
                <h3 style={styles.footerHeading}>Thirumathikart</h3>
                <p>NIT-Trichy,<br />Tiruchirappalli, Tamil Nadu</p>
                <p><strong>Phone:</strong> +91 1234567890</p>
                <p><strong>Email:</strong> abc@gmail.com</p>
                <div style={styles.socialIcons}>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                    <img src="https://cdn-icons-png.flaticon.com/128/733/733553.png" alt="GitHub" style={styles.socialIcon} />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                    <img src="https://cdn-icons-png.flaticon.com/128/174/174857.png" alt="LinkedIn" style={styles.socialIcon} />
                  </a>
                </div>
              </div>

              <div style={styles.footerColumn}>
                <h4 style={styles.footerSubheading}>Useful Links</h4>
                <ul style={styles.footerList}>
                  <li><a href="/home">Home</a></li>
                  <li><a href="/upload">Add Products</a></li>
                  <li><a href="/myproducts">My Products</a></li>
                  <li><a href="/orders">Orders</a></li>
                  <li><a href="/profile">My Profile</a></li>
                </ul>
              </div>

              <div style={styles.footerColumn}>
                <h4 style={styles.footerSubheading}>Our Services</h4>
                <ul style={styles.footerList}>
                  <li><a href="#">Fashion and Jewellery</a></li>
                  <li><a href="#">Handicraft</a></li>
                  <li><a href="#">Clothing</a></li>
                  <li><a href="#">Beauty and Healthcare</a></li>
                  <li><a href="#">Food</a></li>
                </ul>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
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
    backgroundColor: 'white',
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
    top: '94px',
    bottom: '35px',
    left: 0,
    width: '200px',
    backgroundColor: 'white',
    borderRight: '1px solid lightgray',
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '20px',
    zIndex: 1000,
    transition: 'transform 0.3s ease',
    borderRadius: '0 20px 20px 0',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    borderTop: '1px solid lightgray',
    borderBottom: '1px solid lightgray',
  },
  menuItem: {
    padding: '12px 20px',
    textDecoration: 'none',
    color: '#333',
    fontWeight: '500',
    transition: 'background 0.3s ease',
    borderRadius: '4px',
    fontFamily: "'Josefin Sans', sans-serif",
  },
  contentArea: {
    flex: 1,
    padding: '20px',
    marginLeft: '0',
    width: '100%',
  },
  overlay: {
    position: 'fixed',
    top: '60px',
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 900,
  },
  footer: {
    marginTop: '250px',
    backgroundColor: '#f8f9fa',
    padding: '40px 20px',
    borderTop: '1px solid #e0e0e0',
    fontFamily: "'Josefin Sans', sans-serif",
  },
  footerContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '30px',
  },
  footerColumn: {
    flex: '1',
    minWidth: '200px',
  },
  footerHeading: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  footerSubheading: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '10px',
  },
  footerList: {
    listStyle: 'none',
    padding: 0,
    lineHeight: '28px',
  },
  socialIcons: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  socialIcon: {
    width: '28px',
    height: '28px',
    filter: 'grayscale(100%)',
    transition: 'filter 0.3s ease',
  },
  hero: {
    marginTop: '140px',
    marginLeft:'140px'
  },

};

export default Home;
