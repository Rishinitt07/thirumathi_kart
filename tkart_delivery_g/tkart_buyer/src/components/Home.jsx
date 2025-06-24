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
    <section className="px-4 md:px-12 lg:px-20 pt-0 pb-2"> {/* Reduced pt-2 to pt-0 */}
      <div className="flex items-center justify-between mb-3"> {/* mb-4 to mb-3 (optional) */}
        <h2 className="text-2xl font-semibold text-gray-800">Categories</h2>
        <a href="/categories" className="text-blue-500 hover:underline text-sm">View More</a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mt-2"> {/* mt-4 to mt-2 */}
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
  const [query, setQuery] = useState('');
const [results, setResults] = useState([]);

const handleSearch = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.get(`http://localhost:8081/search?query=${query}`);
    setResults(res.data.hits.hits); // Adjust based on your API response
    console.log('Search results:', res.data.hits.hits);
  } catch (err) {
    console.error('Search error:', err);
  }
};

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
              justifyContent: 'flex-start', // 🟢 change this
              minHeight: 'calc(100vh - 80px)',
              paddingTop: '10px', // 🟢 reduce padding if needed
            }}
          >
            
            <div className="bg-white px-6 pt-12 pb-6">
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
             <div  style={{ marginTop: '0px', width: '100%' }}> 
              <section className="w-full px-6 py-12 md:px-20 bg-white">
                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  viewport={{ once: true }}
                  className="max-w-5xl mx-auto text-center md:text-left"
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                    About Thirumathi Kart
                  </h2>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Thirumathi Kart is an initiative by NIT Trichy, aimed at empowering rural entrepreneurs,
                    artisans, and self-help groups by giving them a digital platform to sell their products.
                    With a mission to foster inclusive development, we provide a curated marketplace for
                    handmade goods, groceries, clothing, and more.
                  </p>
                  <p className="text-gray-600 text-lg mt-4 leading-relaxed">
                    Our goal is to create a sustainable digital ecosystem where tradition meets technology,
                    connecting passionate creators with socially-conscious consumers across India.
                  </p>
                </motion.div>
              </section>
              <CategorySection />
              </div>
              


            
            </div>
          </div>
        </div>
      </div>

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
              <li><a href="#">Home</a></li>
              <li><a href="#">About us</a></li>
              <li><a href="#">Services</a></li>
              <li><a href="#">Terms of service</a></li>
              <li><a href="#">Privacy policy</a></li>
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
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={styles.backToTop}
        aria-label="Back to top"
      >
        ⬆️
      </button>
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
  footer: {
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
  backToTop: {
    position: 'fixed',
    bottom: '30px',
    right: '30px',

    color: '#848482',
    border: 'none',
    borderRadius: '6px',
    width: '40px',
    height: '40px',
    fontSize: '20px',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(164, 142, 131, 0.3)',
    zIndex: 1000,
    transition: 'background-color 0.3s ease',
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
