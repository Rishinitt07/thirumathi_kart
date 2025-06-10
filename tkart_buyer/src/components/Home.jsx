import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';



const SidebarItem = ({ to, label }) => {
  const [hover, setHover] = useState(false);
  return (
    <Link
      to={to}
      style={{
        ...styles.menuItem,
        backgroundColor: hover ? '#E5E7EB' : 'transparent',
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
      <SidebarItem to="/cart" label="My Cart" />
      <SidebarItem to="/orders" label="My Orders" />
      <SidebarItem to="/wishlist" label="Wishlist" />
      <SidebarItem to="/profile" label="Profile" />
    </div>

    {isOpen && window.innerWidth <= 768 && (
      <div style={styles.overlay} onClick={closeSidebar}></div>
    )}
  </>
);

const Navbar = ({ toggleSidebar }) => (
  <div style={styles.navbar}>
    {/* Logo */}
    <div style={styles.logoContainer}>
      <img
        src="https://thirumathikart.nitt.edu/assets/img/tklogo.png"
        alt="Logo"
        style={styles.logo}
        onError={e => {
          e.target.onerror = null;
          e.target.src = "https://via.placeholder.com/40";
        }}
      />
      <span style={styles.logoText}>Thirumathi Kart</span>
    </div>

    <div style={styles.searchContainer}>
      <input
        type="text"
        placeholder="Search products..."
        style={styles.searchInput}
      />
      <button style={styles.searchButton}>
        <img
          src="https://cdn-icons-png.flaticon.com/128/54/54481.png"
          alt="Search"
          style={{ width: '16px', height: '16px' }}
        />
      </button>
    </div>
    {/* Right Menu */}
    <div style={styles.rightMenu}>
      <span style={styles.adminText}>Hi! Buyer</span>
      <motion.img
        src="https://cdn-icons-png.flaticon.com/128/1828/1828859.png" // 🟢 Proper hamburger menu icon
        alt="Menu"
        onClick={toggleSidebar}
        style={styles.menuIcon}
        whileHover={{ scale: 1.2 }}
        transition={{ type: 'spring', stiffness: 300, damping: 12 }}
      />
    </div>
  </div>
);

const categoryData = [
  { name: 'Fashion', icon: '👗' },
  { name: 'Grocery', icon: '🛒' },
  { name: 'Home', icon: '🏠' },
  { name: 'Books', icon: '📚' },
  { name: 'Toys', icon: '🧸' },
  { name: 'Beauty', icon: '💄' }
];

const CategorySection = () => {
  return (
    <section className="px-4 md:px-12 lg:px-20 py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Categories</h2>
        <a href="/categories" className="text-blue-500 hover:underline text-sm">View More</a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mt-4">
        {categoryData.map((cat, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.08 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white shadow-lg 
               cursor-pointer text-center"
          >
            <motion.div
              whileHover={{ rotate: 10 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-24 h-24 bg-gray-100 rounded-full mb-4 flex items-center justify-center text-4xl"
            >
              {cat.icon}
            </motion.div>
            <p className="text-lg font-semibold text-gray-700">{cat.name}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    axios.get('http://localhost:8081/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        // Optional: handle success
        console.log('Dashboard access granted');
      })
      .catch((err) => {
        console.error('Access denied', err);
        localStorage.removeItem('token');
        navigate('/login');
      });
  }, [navigate]);

  const getIsDesktop = () => (typeof window !== 'undefined' ? window.innerWidth > 768 : true);
  const [isDesktop, setIsDesktop] = useState(getIsDesktop());

  useEffect(() => {
    const handleResize = () => setIsDesktop(getIsDesktop());
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <>

      

      <div
        style={{
          ...styles.container,

        }}
      >
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div style={styles.bodyWrapper}>
          <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
          <div
            style={{
              ...styles.contentArea,
              marginLeft: isDesktop && sidebarOpen ? '200px' : '0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 'calc(100vh - 80px)',
            }}
          >
            <div className="min-h-screen bg-white flex items-center justify-center px-6">
              <motion.div
                initial={{ x: -200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1 }}
                className="flex flex-col md:flex-row items-center gap-10"
              >
                {/* Left Text Section */}
                <div className="max-w-xl text-center md:text-left">
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                    The e-commerce platform for <span className="text-indigo-600">SHGs</span> to market their products
                  </h1>
                  <p className="mt-6 text-lg text-gray-600">
                    We provide Self-help groups a formal platform to showcase their products to a wider market,
                    and hence empower them by increasing their income.
                  </p>
                </div>

                {/* Right Image Section */}
                <div className="max-w-md">
                  <img src="https://thirumathikart.nitt.edu/assets/img/tklogo.png" alt="ThirumathiKart Illustration" className="w-full h-auto" />
                </div>
              </motion.div>
            </div>
            <div style={{ marginTop: '0px', width: '100%' }}>
              <CategorySection />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: '9999px',
    padding: '6px 10px',
    width: '100%',
    maxWidth: '350px',
    margin: '0 20px',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
  },

  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: '14px',
    fontFamily: "'Josefin Sans', sans-serif",
  },

  searchButton: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    color: '#555',
  },

  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },

  navbar: {
    fontFamily: 'Poppins',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    borderBottom: '1px solid lightgray',
    position: 'sticky',
    top: 0,
    zIndex: 1001,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',  // 🟡 Semi-transparent background
    backdropFilter: 'blur(25px)',                // 🟢 Optional extra glass blur effect
    WebkitBackdropFilter: 'blur(10px)',          // 🟢 For Safari support
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
    fontFamily: 'poppins',
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#333',
    fontFamily: "'Josefin Sans', sans-serif",
  },

  rightMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },

  adminText: {
    fontSize: '14px',
    color: 'gray',
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
    position: 'fixed',
    top: '60px',
    left: 0,
    width: '200px',
    height: '100%',
    backgroundColor: 'white',
    borderRight: '1px solid lightgray',
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '20px',
    zIndex: 1000,
    transition: 'left 0.3s ease',
    fontFamily: "'Josefin Sans', sans-serif",
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
    fontSize: '20px',
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

  adContainer: {
    height: '900px',
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
    marginTop: '0px',
    width: '350%',
    maxWidth: '1520px',
    alignItems: 'center',
  },

  adTopBanner: {

    width: '100%',
    height: '500px',
    backgroundColor: '#e5e7eb',
    borderRadius: '2px',
    overflow: 'hidden',
    display: 'flex',
    position: 'relative',
    bottom: '0px',
    paddingTop: '0px',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    marginTop: '0px',
  },

  adBottomContainer: {
    display: 'flex',
    width: '90%',
    justifyContent: 'space-between',
    gap: '15px',
  },

  adBottomBox: {
    width: '100%',
    flex: 1,
    height: '300px',
    backgroundColor: '#e5e7eb',
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontFamily: "'Josefin Sans', sans-serif",
    color: '#555',
  },

};

export default Home;
