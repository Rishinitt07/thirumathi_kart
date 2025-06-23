import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import tklogo from './tklogo.png';
import bgimg from './bgimg.png';

const Dashboard = () => {
  return (
    <div style={{ ...styles.container, backgroundImage: `url(${bgimg})` }}>
      {/* Content Layer */}
      <div style={styles.contentOverlay}>
        {/* Navbar with Glassmorphism */}
        <div style={styles.navbar}>
          <div style={styles.logoContainer}>
            <img src={tklogo} alt="Logo" style={styles.logo} />
            <span style={styles.logoText}>Thirumathi Kart</span>
          </div>
          <div style={styles.rightNav}>
            <Link to="/login" style={styles.navLink}>Login</Link>
            <Link to="/register" style={styles.navLink}>Sign Up</Link>
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.content}>
          <div style={styles.welcomeText}>
            <motion.h1
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              style={{ marginBottom: '20px' }}
            >
              Welcome to ThirumathiKart
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.5 }}
              style={styles.description}
            >
              Welcome to Thirumathi Kart – your trusted platform to grow and sell with confidence. <br />
              Reach thousands of customers looking for quality and affordability. <br />
              List your products easily, manage orders seamlessly, and track your sales in real-time. <br />
              Join our vibrant seller community and take your business to the next level.
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    fontFamily: "'Josefin Sans', sans-serif",
    display: 'flex',
    flexDirection: 'column',
  },
  contentOverlay: {
    width: '100%',
    minHeight: '100vh',
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // very light glass layer
    display: 'flex',
    flexDirection: 'column',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 30px',
    backgroundColor: 'rgba(255, 255, 255, 0.70)', // glassmorphism
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(192, 192, 192, 0.3)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    zIndex: 10,
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logo: {
    width: '40px',
    height: '40px',
  },
  logoText: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  },
  rightNav: {
    display: 'flex',
    gap: '20px',
  },
  navLink: {
    color: '#3170DE',
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: '16px',
  },
  content: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '20px',
  },
  welcomeText: {
    color: 'black',
    fontSize: '80px',
  },
  description: {
    fontSize: '18px',
    lineHeight: '1.6',
    color: 'black',
  },
};

export default Dashboard;
