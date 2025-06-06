import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
    <div style={styles.logo}>ThirumathiKart</div>
    <ul style={styles.navLinks}>
        <li><Link to="/home" className="hover:underline">Home</Link></li>
        <li><Link to="/upload" className="hover:underline">Upload Products</Link></li>
        <li><Link to="/orders" className="hover:underline">Orders</Link></li>
        <li><Link to="/profile" className="hover:underline">Profile</Link></li>
    </ul>
  </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    backgroundColor: '#282c34',
    color: 'white',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  navLinks: {
    display: 'flex',
    gap: '20px',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500',
  }
};

const Profile = () => {
  return (
    <div>
       <Navbar/>
    </div>
  )
}

export default Profile
