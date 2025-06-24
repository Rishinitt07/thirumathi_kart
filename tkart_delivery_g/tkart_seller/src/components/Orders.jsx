import React, { useEffect, useState } from 'react';
import axios from 'axios';
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


const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch orders from Go backend
    axios.get('http://localhost:8000/api/orders')
      .then(res => setOrders(res.data))
      .catch(err => console.error("Error fetching orders:", err));
  }, []);

  return (
    <>
    <Navbar/>
    <div style={styles.container}>
      <h2 style={styles.heading}>Buyer Orders</h2>
      {orders.length === 0 ? (
        <p>No orders available.</p>
      ) : (
        orders.map(order => (
          <div key={order.id} style={styles.card}>
            <p><strong>Name:</strong> {order.name}</p>
            <p><strong>Address:</strong> {order.address}</p>
            <p><strong>Product:</strong> {order.product}</p>
            <p><strong>Quantity:</strong> {order.quantity}</p>
            <p><strong>Price:</strong> ₹{order.price}</p>
            <p><strong>Payment Status:</strong> {order.payment_status}</p>
          </div>
        ))
      )}
    </div>
    </>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: 'auto',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    padding: '15px',
    marginBottom: '15px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  }
};

export default Orders;
