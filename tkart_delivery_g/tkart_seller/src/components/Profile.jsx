import React from 'react'
import { Link } from 'react-router-dom'


export const Navbar = () => {
  return (
    <nav style={navbarStyles.navbar}>
      <div style={navbarStyles.logoContainer}>
        <img src="https://via.placeholder.com/50" alt="Logo" style={navbarStyles.logoImage} />
        <span style={navbarStyles.logoText}>Thirumathi Kart</span>
      </div>
      <ul style={navbarStyles.navLinks}>
        <li><Link to="/home" style={navbarStyles.link}>Home</Link></li>
        <li><Link to="/upload" style={navbarStyles.link}>Upload Products</Link></li>
        <li><Link to="/orders" style={navbarStyles.link}>Orders</Link></li>
        <li><Link to="/profile" style={navbarStyles.link}>Profile</Link></li>
      </ul>
    </nav>
  );
};

const navbarStyles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    backgroundColor: '#282c34',
    color: 'white',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoImage: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
  },
  logoText: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  navLinks: {
    display: 'flex',
    gap: '20px',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500',
  },
};



const Profile = () => {
  return (
    <div>
      <Navbar/>
    </div>
  )
}

export default Profile
