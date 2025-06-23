// Orders.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import tklogo from './tklogo.png';
import { jsPDF } from 'jspdf';

const fakeOrders = [
  {
    orderId: 'TK43256546',
    productName: 'Handcrafted Bag',
    productImage: 'https://via.placeholder.com/100',
    quantity: 2,
    price: 500,
    customerName: 'Priya mari',
    customerMobile: '9876543210',
    customerAddress: '123, MG Road, Chennai, Tamil Nadu',
    orderDate: '2025-06-12',
  },
  {
    orderId: 'TK43256547',
    productName: 'Organic Honey',
    productImage: 'https://via.placeholder.com/100',
    quantity: 1,
    price: 300,
    customerName: 'Dhanya Dharun',
    customerMobile: '9988776655',
    customerAddress: '45, Nehru Street, Coimbatore, Tamil Nadu',
    orderDate: '2025-06-13',
  },
];

const SidebarItem = ({ to, label }) => (
  <Link to={to} style={styles.menuItem}>
    {label}
  </Link>
);

const Sidebar = () => (
  <div style={styles.sidebar}>
    <SidebarItem to="/home" label="Home" />
    <SidebarItem to="/upload" label="Add Product" />
    <SidebarItem to="/myproducts" label="My Product" />
    <SidebarItem to="/orders" label="Orders" />
    <SidebarItem to="/profile" label="Profile" />
  </div>
);

const Navbar = ({ toggleSidebar }) => (
  <div style={styles.navbar}>
    <div style={styles.logoContainer}>
      <img
        src="https://cdn-icons-png.flaticon.com/128/3917/3917065.png"
        alt="Menu"
        onClick={toggleSidebar}
        style={styles.menuIconLeft}
      />
      <img src={tklogo} alt="Logo" style={styles.logo} />
      <span style={styles.logoText}>Thirumathi Kart</span>
    </div>
    <div style={styles.rightMenu}>
      <span style={styles.adminText}>Hi! Admin</span>
    </div>
  </div>
);


const Orders = () => {
  const generateInvoice = (order) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('INVOICE', 105, 20, null, null, 'center');

    doc.setFontSize(12);
    doc.text(`ORDER ID: ${order.orderId}`, 20, 30);
    doc.text(`Order Date: ${order.orderDate}`, 20, 37);

    doc.text('BILL TO:', 20, 50);
    doc.text(`${order.customerName}`, 20, 57);
    doc.text(`${order.customerAddress}`, 20, 64);
    doc.text(`Mobile: ${order.customerMobile}`, 20, 71);

    doc.text('PRODUCT DETAILS:', 20, 85);
    doc.text(`Name: ${order.productName}`, 20, 92);
    doc.text(`Quantity: ${order.quantity}`, 20, 99);
    doc.text(`Price per unit: ₹${order.price}`, 20, 106);
    const total = order.quantity * order.price;
    const gst = total * 0.18;
    const grandTotal = total + gst;

    doc.text(`Subtotal: ₹${total.toFixed(2)}`, 20, 120);
    doc.text(`GST (18%): ₹${gst.toFixed(2)}`, 20, 127);
    doc.text(`Total: ₹${grandTotal.toFixed(2)}`, 20, 134);

    doc.text('From: Thirumathi Kart, NIT-Trichy', 20, 150);
    doc.text('Email: hello@reallygreatsite.com', 20, 157);

    doc.save(`${order.orderId}_invoice.pdf`);
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.bodyWrapper}>
        <Sidebar />
        <div style={styles.contentArea}>
          <h2 style={styles.title}>Orders</h2>
          <div style={styles.orderList}>
            {fakeOrders.map((order, index) => (
              <div key={index} style={styles.orderCard}>
                <img src={order.productImage} alt={order.productName} style={styles.productImage} />
                <div>
                  <p><strong>Order ID:</strong> {order.orderId}</p>
                  <p><strong>Product:</strong> {order.productName}</p>
                  <p><strong>Quantity:</strong> {order.quantity}</p>
                  <p><strong>Price:</strong> ₹{order.price}</p>
                  <p><strong>Customer:</strong> {order.customerName}</p>
                  <p><strong>Mobile:</strong> {order.customerMobile}</p>
                  <p><strong>Address:</strong> {order.customerAddress}</p>
                  <p><strong>Date:</strong> {order.orderDate}</p>
                  <button onClick={() => generateInvoice(order)} style={styles.printButton}>Print Invoice</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f7fafc' },
  navbar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '10px 20px', backgroundColor: 'white', borderBottom: '1px solid #ddd',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  
  menuIconLeft: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    filter: 'grayscale(100%)',
    marginRight: '10px',
  },
  
  logo: { width: '40px', height: '40px' },
  logoText: { fontSize: '22px', fontWeight: 'bold', fontFamily: "'Josefin Sans', sans-serif" },
  adminText: { fontSize: '14px', fontFamily: "'Josefin Sans', sans-serif" },
  bodyWrapper: { display: 'flex' },
  sidebar: {
    width: '200px', backgroundColor: '#fff', borderRight: '1px solid #ddd',
    padding: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)', height: 'calc(100vh - 60px)',
  },
  menuItem: {
    display: 'block', padding: '10px 0', textDecoration: 'none',
    color: '#333', fontFamily: "'Josefin Sans', sans-serif",
  },
  contentArea: {
    flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center',
  },
  title: { fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' },
  orderList: { display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '800px' },
  orderCard: {
    backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    display: 'flex', gap: '20px',
  },
  productImage: { width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10px' },
  printButton: {
    marginTop: '10px', backgroundColor: '#3182ce', color: 'white',
    padding: '8px 12px', border: 'none', borderRadius: '5px', cursor: 'pointer'
  },
};

export default Orders;
