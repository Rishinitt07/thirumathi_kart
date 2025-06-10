import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
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

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:8080/products', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setProducts(res.data))
      .catch(err => console.error('Failed to fetch products', err));
  }, []);

  const updateStock = (id, inStock) => {
    axios.put(`http://localhost:8080/products/${id}/stock`, {
      in_stock: inStock
    }, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => {
      setProducts(prev =>
        prev.map(p => (p.id === id ? { ...p, in_stock: inStock } : p))
      );
    }).catch(err => console.error('Failed to update stock', err));
  };

  const updatePrice = (id, price) => {
    axios.put(`http://localhost:8080/products/${id}/price`, {
      price: parseFloat(price)
    }, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => {
      setProducts(prev =>
        prev.map(p => (p.id === id ? { ...p, price } : p))
      );
    }).catch(err => console.error('Failed to update price', err));
  };

  return (
    <div style={styles.container}>
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
      <div
        style={{
          ...styles.contentArea,
          marginLeft: sidebarOpen ? '200px' : '0px',
        }}
      >
        <div style={styles.cardsWrapper}>
          {products.map(product => (
            <div key={product.id} style={styles.card}>
              <img
                src={`data:image/jpeg;base64,${product.image1}`}
                alt="Product"
                style={styles.image}
              />
              <div style={styles.details}>
                <h3 style={styles.name}>{product.name}</h3>
                <p style={styles.category}>Category: {product.category}</p>
                <p style={styles.quantity}>Quantity: {product.quantity}</p>
                <input
                  type="number"
                  value={product.price}
                  onChange={e => updatePrice(product.id, e.target.value)}
                  style={styles.input}
                />
                <div style={styles.toggleContainer}>
                  <label className="custom-switch">
                    <input
                      type="checkbox"
                      checked={product.in_stock}
                      onChange={(e) => updateStock(product.id, e.target.checked)}
                    />
                    <span className="slider-round"></span>
                  </label>
                  <span>{product.in_stock ? "In Stock" : "Out of Stock"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Josefin Sans', sans-serif",
    backgroundColor: '#f7fafc',
    minHeight: '100vh',
  },
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
  logoText: { fontSize: '22px', fontWeight: 'bold' },
  rightMenu: { display: 'flex', alignItems: 'center', gap: '15px' },
  adminText: { fontSize: '14px', fontWeight: '500' },
  menuIcon: { width: '20px', height: '20px', cursor: 'pointer' },
  sidebar: {
    position: 'fixed', top: '93px', bottom: '100px', left: 0, width: '200px', height: '85%',
    backgroundColor: 'white', borderRight: '1px solid lightgray', borderTop: '1px solid lightgray', borderBottom: '1px solid lightgray', display: 'flex', flexDirection: 'column',
    paddingTop: '20px', zIndex: 1000, transition: 'left 0.3s ease',borderRadius: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },
  menuItem: {
    padding: '12px 20px', textDecoration: 'none', color: '#333',
    fontWeight: '500', borderRadius: '4px', transition: 'background 0.3s ease',
  },
  overlay: {
    position: 'fixed', top: '60px', left: 0, width: '100vw',
    height: '100vh', backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 900,
  },
  contentArea: {
    transition: 'margin-left 0.3s ease',
    padding: '30px',
  },
  cardsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  card: {
    display: 'flex',
    width: '90%',
    maxWidth: '900px',
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    alignItems: 'center',
    gap: '20px',
    transition: 'transform 0.3s, box-shadow 0.3s',border: '1px solid lightgray',
  },
  image: {
    width: '120px',
    height: '120px',
    objectFit: 'cover',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    flex: 1,
  },
  name: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 'bold',
  },
  category: {
    margin: 0,
    fontSize: '14px',
    color: '#555',
  },
  quantity: {
    fontSize: '14px',
    color: '#444',
  },
  input: {
    padding: '8px',
    width: '100px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  toggleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
};

// Inject custom slider CSS
const style = document.createElement("style");
style.textContent = `
.custom-switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
}
.custom-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider-round {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 24px;
}
.slider-round:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 4px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}
.custom-switch input:checked + .slider-round {
  background-color: #4BD865;
}
.custom-switch input:checked + .slider-round:before {
  transform: translateX(24px);
}
`;
document.head.appendChild(style);

export default MyProducts;
