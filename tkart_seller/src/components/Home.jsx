// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Home = () => {
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem('token');

//     if (!token) {
//       navigate('/login');
//       return;
//     }

//     axios.get('http://localhost:8080/dashboard', {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//     .then(res => {
//       setMessage(res.data);
//     })
//     .catch(err => {
//       console.error('Access denied', err);
//       localStorage.removeItem('token');
//       navigate('/login');
//     });
//   }, [navigate]);

//   return (
//     <div className='text-white h-screen flex justify-center items-center bg-green-900'>
//       <div className='text-center'>
//         <h1 className='text-4xl font-bold'>Welcome to the Home Page 🎉</h1>
//         <p className='mt-4'>{message}</p>
//       </div>
//     </div>
//   );
// };

// export default Home;


//------------------------

/*
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';


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




const Home = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    axios.get('http://localhost:8080/dashboard', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        setMessage(res.data);
      })
      .catch(err => {
        console.error('Access denied', err);
        localStorage.removeItem('token');
        navigate('/login');
      });
  }, [navigate]);

  return (
    <>
    <Navbar></Navbar>
    </>
  );
};

export default Home;
*/


import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import tklogo from './tklogo.png';

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
        left: isOpen ? 0 : '-200px',
      }}
    >
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

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
         <center>
         <h1>The e-commerce platform for SHGs to market their products</h1>
         <h3>We provide Self-help groups a formal platform to showcase their products to a wider market, and hence empower them by increasing their income.</h3>
         </center>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
   
  },
  navbar: {
    borderBottom: '1px solid lightgray', boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px',
    position: 'sticky',
    top: 0,
    zIndex: 1001,
    background:'white',
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
    fontSize: '22px',
    fontWeight: 'bold',
    color: 'black',
    fontFamily: "'Josefin Sans', sans-serif",
  },
  rightMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  adminText: {
    fontSize: '14px',
    color: 'black',
    fontWeight: '500',
    fontFamily: "'Josefin Sans', sans-serif",
  },
  menuIcon: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    filter: 'grayscale(100%)',
  },
  bodyWrapper: {
    display: 'flex',
    flex: 1,
  },
  sidebar: {
    position: 'fixed', top: '93px', bottom: '100px', left: 0, width: '200px', height: '85%',
    backgroundColor: 'white', borderRight: '1px solid lightgray', borderTop: '1px solid lightgray', borderBottom: '1px solid lightgray', display: 'flex', flexDirection: 'column',
    paddingTop: '20px', zIndex: 1000, transition: 'left 0.3s ease',borderRadius: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
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
    padding: '40px 20px',
    transition: 'margin-left 0.3s ease',
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
};

export default Home;