import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

// Reusable Sidebar Component
const SidebarItem = ({ to, label, icon }) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
  >
    <span className="text-lg text-pink-500">{icon}</span>
    <span className="font-medium">{label}</span>
  </Link>
);

const Sidebar = ({ isOpen, closeSidebar }) => {
  const navigate = useNavigate();

  // Pink-themed SVG icons
  const icons = {
    home: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>
    ),
    categories: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    cart: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
      </svg>
    ),
    orders: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
      </svg>
    ),
    wishlist: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
      </svg>
    ),
    profile: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    ),
    logout: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
      </svg>
    )
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem('token');
      toast.success("Logged out successfully");
      navigate('/');
    }
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transition-all duration-300 z-40 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="h-16 flex items-center px-6 border-b">
          <h2 className="text-xl font-bold">Menu</h2>
        </div>
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          <SidebarItem to="/home" label="Home" icon={icons.home} />
          <SidebarItem to="/categories" label="Categories" icon={icons.categories} />
          <SidebarItem to="/cart" label="My Cart" icon={icons.cart} />
          <SidebarItem to="/orders" label="My Orders" icon={icons.orders} />
          <SidebarItem to="/wishlist" label="Wishlist" icon={icons.wishlist} />
          <SidebarItem to="/profile" label="Profile" icon={icons.profile} />
        </div>

        {/* Logout Button at Bottom */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <span className="text-lg text-red-600">{icons.logout}</span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-transparent bg-opacity-30 z-30 md:hidden"
        />
      )}
    </>
  );
};

// Enhanced Navbar Component
const Navbar = ({ toggleSidebar }) => (
  <header className="sticky top-0 z-30 bg-white shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center">
          <Link to="/home" className="flex items-center">
            <img
              src="https://thirumathikart.nitt.edu/assets/img/tklogo.png"
              alt="Logo"
              className="h-8 w-8"
            />
            <span className="ml-2 text-xl font-bold text-gray-800">Thirumathi Kart</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600 hidden sm:inline">Hi! Buyer</span>
          <Link to="/cart" className="p-1 text-gray-500 hover:text-gray-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </Link>
          <motion.img
            src="https://cdn-icons-png.flaticon.com/128/1828/1828859.png"
            alt="Menu"
            onClick={toggleSidebar}
            className="w-5 h-5 cursor-pointer filter grayscale"
            whileHover={{ scale: 1.2 }}
            style={{ display: 'block' }} // ✅ force visibility
          />

        </div>
      </div>
    </div>
  </header>
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
    <section className="px-4 md:px-12 lg:px-20 pt-0 pb-2">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-2xl font-semibold text-gray-800">Categories</h2>
        <a href="/categories" className="text-blue-500 hover:underline text-sm">View More</a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mt-2">
        {categoryData.map((cat, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.08 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white shadow-lg cursor-pointer text-center"
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
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`http://localhost:8081/search?query=${query}`);
      setResults(res.data.hits.hits);
      console.log('Search results:', res.data.hits.hits);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) setCartItems(JSON.parse(storedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const updateQuantity = (itemName, change) => {
    const updatedCart = cartItems.map(item =>
      item.name === itemName
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    );
    setCartItems(updatedCart);
  };

  const removeFromCart = (itemName) => {
    setCartItems(cartItems.filter(item => item.name !== itemName));
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:8081/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
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
    <div style={styles.appContainer}>
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />

      <main style={{
        ...styles.mainContent,
        marginLeft: isDesktop && sidebarOpen ? '200px' : '0',
      }}>
        <div className="bg-white px-6 pt-12 pb-6">
          <motion.div
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex flex-col md:flex-row items-center gap-10"
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
              <img src="https://thirumathikart.nitt.edu/assets/img/tklogo.png" alt="ThirumathiKart Illustration" className="w-full h-auto" />
            </div>
          </motion.div>
        </div>

        <div style={{ width: '100%' }}>
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
              </p>
            </motion.div>
          </section>
          <CategorySection />
        </div>
      </main>

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
            </ul>
          </div>

          <div style={styles.footerColumn}>
            <h4 style={styles.footerSubheading}>Our Services</h4>
            <ul style={styles.footerList}>
              <li><a href="#">Fashion and Jewellery</a></li>
              <li><a href="#">Handicraft</a></li>
              <li><a href="#">Clothing</a></li>
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
    </div>
  );
};

const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    position: 'relative',
  },
  navbar: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(25px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderBottom: '1px solid lightgray',
    position: 'sticky',
    top: 0,
    zIndex: 1001,
  },
  navbarContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
  },
  mainContent: {
    flex: 1,
    transition: 'margin-left 0.3s ease',
    width: '100%',
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
  },
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
    marginTop: 'auto',
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
  sidebar: {
    position: 'fixed',
    top: '60px',
    left: 0,
    width: '200px',
    height: 'calc(100vh - 60px)',
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