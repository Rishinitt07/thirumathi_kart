import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import {
  FiDownload, FiClock, FiCheckCircle, FiTruck, FiSearch,
  FiUser, FiPhone, FiMapPin, FiCalendar, FiPackage, FiHash
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';




// Removed fakeOrders

const ORDER_STATUS = {
  PROCESSING: "Processing",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for delivery",
  NEAR_DOORSTEP: "Near your doorstep",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const TRACKING_STEPS = [
  { id: 'placed', label: 'Order placed', statusMatch: [ORDER_STATUS.PROCESSING, ORDER_STATUS.CONFIRMED, ORDER_STATUS.SHIPPED, ORDER_STATUS.OUT_FOR_DELIVERY, ORDER_STATUS.NEAR_DOORSTEP, ORDER_STATUS.DELIVERED] },
  { id: 'confirmed', label: 'Seller confirmed', statusMatch: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.SHIPPED, ORDER_STATUS.OUT_FOR_DELIVERY, ORDER_STATUS.NEAR_DOORSTEP, ORDER_STATUS.DELIVERED] },
  { id: 'shipped', label: 'Order Packed', statusMatch: [ORDER_STATUS.SHIPPED, ORDER_STATUS.OUT_FOR_DELIVERY, ORDER_STATUS.NEAR_DOORSTEP, ORDER_STATUS.DELIVERED] },
  { id: 'out_delivery', label: 'Order Picked', statusMatch: [ORDER_STATUS.OUT_FOR_DELIVERY, ORDER_STATUS.NEAR_DOORSTEP, ORDER_STATUS.DELIVERED] },
  { id: 'doorstep', label: 'Delivered', statusMatch: [ORDER_STATUS.NEAR_DOORSTEP, ORDER_STATUS.DELIVERED] },
];

const Bounce = null;
const toast = {
  success: (msg) => console.log(msg),
  error: (msg) => console.log(msg),
  info: (msg) => console.log(msg),
  warn: (msg) => console.log(msg)
};

const getStatusConfig = (status) => {
  switch (status) {
    case 'Delivered': return {
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      badge: 'bg-emerald-500',
      icon: <FiCheckCircle className="text-base" />,
    };
    case 'Shipped': return {
      color: 'text-blue-700',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      badge: 'bg-blue-500',
      icon: <FiTruck className="text-base" />,
    };
    default: return {
      color: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      badge: 'bg-amber-500',
      icon: <FiClock className="text-base" />,
    };
  }
};

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedDeliveryCard, setExpandedDeliveryCard] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [previewInvoiceOrder, setPreviewInvoiceOrder] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = () => {
    axios
      .get('http://localhost:8080/orders', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const groupedOrders = [];
        const data = Array.isArray(res.data) ? res.data : [];
        data.forEach((order, orderIdx) => {
           if (order.items && Array.isArray(order.items) && order.items.length > 0) {
             const parsedItems = order.items.map((item, itemIdx) => ({
                 uniqueKey: `${order.orderId || orderIdx}-${item.id || itemIdx}`,
                 productName: item.name || 'Unknown Product',
                 productImage: item.image1 ? (item.image1.startsWith('data:') ? item.image1 : `data:image/jpeg;base64,${item.image1}`) : (item.image || 'https://via.placeholder.com/150'),
                 quantity: item.qty || item.quantity || 1,
                 price: item.price || 0,
             }));

             groupedOrders.push({
                 id: order.id,
                 orderId: order.orderId ? String(order.orderId) : `TK-UNK`,
                 customerName: order.buyer_name || 'Customer',
                 customerMobile: order.phone || 'N/A',
                 customerAddress: `${order.address || ''}, ${order.city || ''}, ${order.state || ''}`,
                 orderDate: order.date ? new Date(order.date).toLocaleDateString() : 'N/A',
                 status: order.status || 'Pending',
                 deliveryName: order.delivery_name || '',
                 deliveryPhone: order.delivery_phone || '',
                 deliveryStatus: order.delivery_status || '',
                 items: parsedItems,
                 total: parsedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
             });
           }
        });
        setOrders(groupedOrders);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching orders', err);
        void 0;
        setLoading(false);
      });
  };

  const updateOrderStatus = async (id, newStatus) => {
    let lat = 0;
    let lng = 0;
    
    if (newStatus === 'Shipped') {
      const getPosition = () => {
        return new Promise((resolve) => {
          if (!navigator.geolocation) {
            resolve(null);
            return;
          }
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve(pos.coords),
            (err) => resolve(null),
            { timeout: 5000 }
          );
        });
      };
      
      const coords = await getPosition();
      if (coords) {
        lat = coords.latitude;
        lng = coords.longitude;
      }
    }

    axios
      .put(`http://localhost:8080/orders/${id}/status`, { status: newStatus, latitude: lat, longitude: lng }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        void 0;
        fetchOrders(); // Reload orders to get fresh data
      })
      .catch((err) => {
        console.error('Error updating order status', err);
        void 0;
      });
  };

  const generateInvoice = (order) => {
    setInvoiceOrder(order);
    
    // Give React time to render the hidden invoice template, then capture it
    setTimeout(async () => {
      const element = document.getElementById('invoice-template');
      if (!element) {
        setInvoiceOrder(null);
        void 0;
        return;
      }
      
      try {
        const canvas = await html2canvas(element, { scale: 2, useCORS: true, logging: false });
        const imgData = canvas.toDataURL('image/png');
        
        // A4 proportions
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${order.orderId}_invoice.pdf`);
        void 0;
      } catch (err) {
        console.error('Error generating invoice PDF', err);
        void 0;
      } finally {
        setInvoiceOrder(null);
      }
    }, 500);
  };

  const filteredOrders = orders.filter(order => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = (
      (order.orderId && order.orderId.toLowerCase().includes(search)) ||
      (order.productName && order.productName.toLowerCase().includes(search)) ||
      (order.customerName && order.customerName.toLowerCase().includes(search))
    );
    
    if (!matchesSearch) return false;

    if (filterStatus === 'All') return true;
    if (filterStatus === 'Pending') return order.status === 'Pending' || order.status === 'Processing';
    if (filterStatus === 'Confirmed') return order.status === 'Confirmed';
    if (filterStatus === 'Order Packed') return order.status === 'Shipped';
    if (filterStatus === 'Order Picked') return order.deliveryStatus === 'in_progress';
    if (filterStatus === 'Delivered') return order.status === 'Delivered';

    return true;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-josefin">
      {/* Hero Header */}
      <div className="relative h-36 bg-gradient-to-br from-hotpink-400 via-hotpink-500 to-hotpink-600 w-full overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-hotpink-200 rounded-full mix-blend-overlay filter blur-3xl"></div>
        </div>
        <div className="absolute inset-0 flex flex-col justify-start pt-6 items-center text-white px-4">
          <h1 className="text-2xl md:text-3xl font-normal text-white tracking-tight drop-shadow-sm">Order Management</h1>
          <p className="text-sm md:text-base font-normal opacity-90 mt-1">Track, fulfill, and manage your customer orders</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6 relative z-10 pb-12">
        {/* Controls Row */}
        <div className="flex justify-end mb-8">
          <div className="flex flex-col sm:flex-row items-center bg-white rounded-full shadow-md border border-gray-100 overflow-hidden w-full md:w-auto">
            
            {/* Filter Dropdown */}
            <div className="relative border-b sm:border-b-0 sm:border-r border-gray-100 bg-gray-50/50 w-full sm:w-auto hover:bg-gray-100 transition-colors">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full sm:w-40 pl-6 pr-10 py-3.5 bg-transparent focus:outline-none text-sm font-normal text-gray-700 appearance-none cursor-pointer"
              >
                <option value="All">All Orders</option>
                <option value="Pending">Pending / Processing</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Order Packed">Order Packed</option>
                <option value="Order Picked">Order Picked</option>
                <option value="Delivered">Delivered</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative group w-full md:w-64 flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg transition-colors group-focus-within:text-hotpink-500" />
              <input
                type="text"
                placeholder="Search by ID, product or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-6 py-3.5 bg-transparent focus:outline-none text-sm font-normal text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap gap-4 mb-8 justify-between">
          {[
            { label: 'Total', value: orders.length, color: 'text-hotpink-600', bg: 'bg-hotpink-50' },
            { label: 'Pending', value: orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Confirmed', value: orders.filter(o => o.status === 'Confirmed').length, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Packed', value: orders.filter(o => o.status === 'Shipped' && o.deliveryStatus !== 'in_progress' && o.deliveryStatus !== 'assigned').length, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Picked', value: orders.filter(o => o.deliveryStatus === 'in_progress' || o.deliveryStatus === 'assigned').length, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Delivered', value: orders.filter(o => o.status === 'Delivered').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Cancelled', value: orders.filter(o => o.status === 'Cancelled').length, color: 'text-red-600', bg: 'bg-red-50' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`${stat.bg} flex-1 min-w-[120px] rounded-2xl p-4 text-center shadow-sm border border-white`}
            >
              <p className={`text-3xl font-normal ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] font-normal text-gray-500 uppercase tracking-wider mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Order Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 xl:grid-cols-2 gap-6"
        >
          <AnimatePresence>
            {loading ? (
              <div className="col-span-1 xl:col-span-2 flex justify-center items-center py-20">
                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-hotpink-500"></div>
              </div>
            ) : filteredOrders.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-1 xl:col-span-2 bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
                <FiPackage className="text-5xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-normal text-gray-700">No orders found</h3>
                <p className="text-gray-400 text-sm mt-1">Wait for a buyer to place an order</p>
              </motion.div>
            ) : (
              filteredOrders.map((order) => {
                const total = order.total || 0;
                const statusConfig = getStatusConfig(order.status);

                return (
                  <motion.div
                    variants={itemVariants}
                    key={order.id}
                    className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 p-6 md:p-8"
                  >
                    {/* Header: Status and Customer Info */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-5 mb-5">
                      <div>
                        <h3 className="text-2xl font-normal text-gray-800">Order {order.orderId}</h3>
                        <p className="text-sm text-gray-400 mt-1 font-normal flex items-center gap-1"><FiCalendar /> Placed on {order.orderDate}</p>
                      </div>
                      <div className="mt-4 md:mt-0 flex gap-3 items-center">
                          {order.deliveryStatus ? (
                            <button
                              onClick={() => setExpandedDeliveryCard(expandedDeliveryCard === order.id ? null : order.id)}
                              className="flex items-center gap-2 px-4 py-2 rounded-full font-normal text-sm border bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 transition-colors shadow-sm"
                            >
                              <FiTruck className="text-base" />
                              Accepted (Track)
                            </button>
                          ) : (
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-normal text-sm border shadow-sm ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}>
                              {statusConfig.icon}
                              {order.status === 'Shipped' ? 'Waiting for Delivery person' : order.status}
                            </div>
                          )}
                      </div>
                    </div>

                    {/* Customer Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      <InfoChip icon={<FiUser />} label="Customer" value={order.customerName} />
                      <InfoChip icon={<FiPhone />} label="Mobile" value={order.customerMobile} />
                      <InfoChip icon={<FiMapPin />} label="Address" value={order.customerAddress} truncate />
                    </div>

                    {/* Items List */}
                    <div className="flex flex-col gap-3 mb-6">
                      <h4 className="font-normal text-gray-400 uppercase tracking-wider text-[10px]">Purchased Items ({order.items.length})</h4>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row gap-4 items-center bg-gray-50 rounded-2xl p-4 border border-gray-100 transition-colors hover:bg-gray-100">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-16 h-16 object-cover rounded-xl shadow-sm border border-gray-200"
                          />
                          <div className="flex-1 text-center sm:text-left">
                            <h5 className="font-normal text-gray-800 text-lg leading-tight mb-1">{item.productName}</h5>
                            <p className="text-xs text-gray-500 font-normal">Qty: {item.quantity} × ₹{Number(item.price).toFixed(2)}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-lg font-normal text-gray-900">₹{(item.quantity * item.price).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer: Total + Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-400 font-normal uppercase tracking-wider mt-2">Order Total</p>
                        <p className="text-3xl font-normal text-hotpink-600 drop-shadow-sm">₹{total.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {(order.status === 'Processing' || order.status === 'Pending') && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'Confirmed')}
                            className="flex items-center gap-2 bg-emerald-500 text-white font-normal px-6 py-3 rounded-full hover:bg-emerald-600 transition-all duration-300 shadow-md hover:-translate-y-0.5"
                          >
                            Confirm Order
                          </button>
                        )}
                        {order.status === 'Confirmed' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'Shipped')}
                            className="flex items-center gap-2 bg-yellow-500 text-white font-normal px-6 py-3 rounded-full hover:bg-yellow-600 transition-all duration-300 shadow-md hover:-translate-y-0.5"
                          >
                            Order Packed
                          </button>
                        )}
                        {['Shipped', 'Out for delivery', 'Near your doorstep', 'Delivered'].includes(order.status) && (
                          <button
                            onClick={() => setExpandedDeliveryCard(expandedDeliveryCard === order.id ? null : order.id)}
                            className="flex items-center gap-2 bg-indigo-500 text-white font-normal px-6 py-3 rounded-full hover:bg-indigo-600 transition-all duration-300 shadow-md hover:-translate-y-0.5"
                          >
                            <FiTruck /> {expandedDeliveryCard === order.id ? 'Hide Tracking' : 'Track Order'}
                          </button>
                        )}
                        <button
                          onClick={() => generateInvoice(order)}
                          onMouseEnter={() => setPreviewInvoiceOrder(order)}
                          onMouseLeave={() => setPreviewInvoiceOrder(null)}
                          title="Download Invoice"
                          className="flex items-center justify-center w-12 h-12 bg-hotpink-500 text-white rounded-full hover:bg-hotpink-600 transition-all duration-300 shadow-md hover:shadow-hotpink-500/40 hover:-translate-y-0.5 group"
                        >
                          <FiDownload className="text-xl group-hover:-translate-y-1 transition-transform duration-300" />
                        </button>
                      </div>
                    </div>

                    {/* Tracking Vertical Timeline */}
                    {expandedDeliveryCard === order.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden bg-gray-50/50 border-t border-gray-100 rounded-b-3xl mt-4"
                      >
                        <div className="p-6 sm:p-8 max-w-2xl mx-auto">
                          <h4 className="font-normal text-gray-900 mb-6 text-lg flex items-center gap-2">
                            <FiTruck className="text-hotpink-500" /> Tracking Progress
                          </h4>
                          
                          {order.status === ORDER_STATUS.CANCELLED ? (
                            <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center">
                              <h5 className="text-red-700 font-normal text-lg">Order Cancelled</h5>
                              <p className="text-red-600 text-sm mt-1">This order has been cancelled.</p>
                            </div>
                          ) : (
                            <div className="relative pl-4 sm:pl-8">
                              {/* Vertical Line */}
                              <div className="absolute top-2 bottom-2 left-6 sm:left-10 w-0.5 bg-gray-200"></div>
                              
                              <div className="space-y-8 relative">
                                {TRACKING_STEPS.map((step, index) => {
                                  const activeSteps = TRACKING_STEPS.filter(s => s.statusMatch.includes(order.status)).length;
                                  const isActive = index < activeSteps;
                                  const isCurrent = index === activeSteps - 1;
                                  
                                  return (
                                    <div key={step.id} className="flex items-center">
                                      <div className={`relative z-10 w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-500 ${isActive ? 'bg-hotpink-500 border-4 border-hotpink-100' : 'bg-gray-300 border-4 border-white'}`}>
                                      </div>
                                      <div className="ml-6 sm:ml-8">
                                        <p className={`font-normal text-base ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                                          {step.label}
                                        </p>
                                        {isCurrent && (
                                          <p className="text-xs text-hotpink-600 font-normal mt-0.5">Current Status</p>
                                        )}
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      

      {/* Hidden Professional Invoice Template (Hex Colors Only for html2canvas compatibility) */}
      {invoiceOrder && (
        <div style={{ position: 'absolute', top: '-10000px', left: '-10000px' }}>
          <div id="invoice-template" className="p-12 w-[800px]" style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: '#ffffff', color: '#1f2937' }}>
            {/* Header */}
            <div className="flex justify-between items-end border-b-2 pb-6 mb-8" style={{ borderColor: '#e5e7eb' }}>
              <div>
                <h1 className="text-4xl font-normal tracking-tight" style={{ color: '#4338ca' }}>TKart</h1>
                <p className="text-sm font-normal mt-1" style={{ color: '#6b7280' }}>Thirumathi Kart, NIT-Trichy</p>
                <p className="text-sm font-normal" style={{ color: '#6b7280' }}>hello@reallygreatsite.com</p>
              </div>
              <div className="text-right">
                <h2 className="text-3xl font-normal uppercase tracking-widest mb-2" style={{ color: '#d1d5db' }}>Invoice</h2>
                <p className="text-sm font-normal" style={{ color: '#4b5563' }}><span style={{ color: '#9ca3af' }}>Order ID:</span> {invoiceOrder.orderId}</p>
                <p className="text-sm font-normal" style={{ color: '#4b5563' }}><span style={{ color: '#9ca3af' }}>Date:</span> {invoiceOrder.orderDate}</p>
              </div>
            </div>

            {/* Bill To */}
            <div className="mb-10">
              <h3 className="text-xs font-normal uppercase tracking-widest mb-3" style={{ color: '#9ca3af' }}>Bill To</h3>
              <p className="text-lg font-normal" style={{ color: '#1f2937' }}>{invoiceOrder.customerName}</p>
              <p className="text-sm font-normal w-2/3 leading-relaxed mt-1" style={{ color: '#4b5563' }}>{invoiceOrder.customerAddress}</p>
              <p className="text-sm font-normal mt-1" style={{ color: '#4b5563' }}>Mobile: {invoiceOrder.customerMobile}</p>
            </div>

            {/* Table */}
            <table className="w-full mb-10 text-left border-collapse">
              <thead>
                <tr className="border-b-2" style={{ backgroundColor: '#eef2ff', borderColor: '#c7d2fe' }}>
                  <th className="py-3 px-4 text-xs font-normal uppercase tracking-widest rounded-tl-lg" style={{ color: '#3730a3' }}>Product Description</th>
                  <th className="py-3 px-4 text-xs font-normal uppercase tracking-widest text-center" style={{ color: '#3730a3' }}>Qty</th>
                  <th className="py-3 px-4 text-xs font-normal uppercase tracking-widest text-right" style={{ color: '#3730a3' }}>Unit Price</th>
                  <th className="py-3 px-4 text-xs font-normal uppercase tracking-widest text-right rounded-tr-lg" style={{ color: '#3730a3' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {invoiceOrder.items && invoiceOrder.items.map((item, idx) => (
                  <tr key={idx} className="border-b" style={{ borderColor: '#f3f4f6' }}>
                    <td className="py-5 px-4 text-sm font-normal" style={{ color: '#1f2937' }}>{item.productName}</td>
                    <td className="py-5 px-4 text-sm font-normal text-center" style={{ color: '#4b5563' }}>{item.quantity}</td>
                    <td className="py-5 px-4 text-sm font-normal text-right" style={{ color: '#4b5563' }}>₹{Number(item.price).toFixed(2)}</td>
                    <td className="py-5 px-4 text-sm font-normal text-right" style={{ color: '#1f2937' }}>₹{(Number(item.quantity) * Number(item.price)).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summary */}
            <div className="flex justify-end">
              <div className="w-1/2">
                <div className="flex justify-between py-2 border-b" style={{ borderColor: '#f3f4f6' }}>
                  <span className="text-sm font-normal" style={{ color: '#6b7280' }}>Subtotal</span>
                  <span className="text-sm font-normal" style={{ color: '#1f2937' }}>₹{invoiceOrder.total ? Number(invoiceOrder.total).toFixed(2) : '0.00'}</span>
                </div>
                <div className="flex justify-between py-4 mt-2 px-4 rounded-lg" style={{ backgroundColor: '#eef2ff' }}>
                  <span className="text-lg font-normal" style={{ color: '#312e81' }}>Total</span>
                  <span className="text-lg font-normal" style={{ color: '#4338ca' }}>₹{invoiceOrder.total ? Number(invoiceOrder.total).toFixed(2) : '0.00'}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-16 pt-6 border-t text-center" style={{ borderColor: '#e5e7eb' }}>
              <p className="text-xs font-normal" style={{ color: '#9ca3af' }}>Thank you for shopping with TKart!</p>
            </div>
          </div>
        </div>
      )}

      {/* Hover Invoice Preview Modal */}
      <AnimatePresence>
        {previewInvoiceOrder && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/30 backdrop-blur-sm pointer-events-none"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-2xl text-gray-800 font-sans border border-gray-100 pointer-events-auto">
              <div className="flex justify-between items-end border-b-2 border-gray-100 pb-5 mb-6">
                <div>
                  <h1 className="text-3xl font-normal text-indigo-700 tracking-tight">TKart</h1>
                  <p className="text-xs font-normal text-gray-500 mt-1">Thirumathi Kart, NIT-Trichy</p>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-normal text-gray-300 uppercase tracking-widest mb-1">Preview</h2>
                  <p className="text-xs font-normal text-gray-600">ID: {previewInvoiceOrder.orderId}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-[10px] font-normal uppercase tracking-widest text-gray-400 mb-2">Bill To</h3>
                <p className="text-base font-normal text-gray-800">{previewInvoiceOrder.customerName}</p>
                <p className="text-xs font-normal text-gray-600 w-2/3 leading-relaxed mt-1">{previewInvoiceOrder.customerAddress}</p>
              </div>

              <table className="w-full mb-6 text-left border-collapse">
                <thead>
                  <tr className="bg-indigo-50/50 border-b-2 border-indigo-100">
                    <th className="py-2 px-3 text-[10px] font-normal uppercase tracking-widest text-indigo-800 rounded-tl-lg">Product</th>
                    <th className="py-2 px-3 text-[10px] font-normal uppercase tracking-widest text-indigo-800 text-center">Qty</th>
                    <th className="py-2 px-3 text-[10px] font-normal uppercase tracking-widest text-indigo-800 text-right">Price</th>
                    <th className="py-2 px-3 text-[10px] font-normal uppercase tracking-widest text-indigo-800 text-right rounded-tr-lg">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {previewInvoiceOrder.items && previewInvoiceOrder.items.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-50">
                      <td className="py-3 px-3 text-sm font-normal text-gray-800">{item.productName}</td>
                      <td className="py-3 px-3 text-sm font-normal text-gray-600 text-center">{item.quantity}</td>
                      <td className="py-3 px-3 text-sm font-normal text-gray-600 text-right">₹{Number(item.price).toFixed(2)}</td>
                      <td className="py-3 px-3 text-sm font-normal text-gray-800 text-right">₹{(Number(item.quantity) * Number(item.price)).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end">
                <div className="w-2/3 md:w-1/2">
                  <div className="flex justify-between py-1.5 border-b border-gray-50">
                    <span className="text-xs font-normal text-gray-500">Subtotal</span>
                    <span className="text-xs font-normal text-gray-800">₹{previewInvoiceOrder.total ? Number(previewInvoiceOrder.total).toFixed(2) : '0.00'}</span>
                  </div>
                  <div className="flex justify-between py-3 mt-2 bg-indigo-50/80 px-3 rounded-xl">
                    <span className="text-base font-normal text-indigo-900">Total</span>
                    <span className="text-base font-normal text-indigo-700">₹{previewInvoiceOrder.total ? Number(previewInvoiceOrder.total).toFixed(2) : '0.00'}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Info Chip Component
const InfoChip = ({ icon, label, value, truncate }) => (
  <div className="flex items-start gap-2 bg-gray-50 rounded-2xl px-3 py-2.5">
    <span className="text-hotpink-500 mt-0.5 flex-shrink-0 text-sm">{icon}</span>
    <div className="min-w-0">
      <p className="text-[10px] font-normal text-gray-400 uppercase tracking-wider">{label}</p>
      <p className={`text-sm font-normal text-gray-700 ${truncate ? 'truncate max-w-[140px]' : ''}`}>{value}</p>
    </div>
  </div>
);

export default Orders;