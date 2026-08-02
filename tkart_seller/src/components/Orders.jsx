import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { ToastContainer, toast } from 'react-toastify';
import { 
  FiDownload, FiClock, FiCheckCircle, FiTruck, FiSearch,
  FiUser, FiPhone, FiMapPin, FiCalendar, FiPackage, FiHash
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';
import bag from './bag.jpeg';
import honey from './honey.jpeg';

const fakeOrders = [
  {
    orderId: 'TK43256546',
    productName: 'Handcrafted Bag',
    productImage: bag,
    quantity: 2,
    price: 500,
    customerName: 'Priya Mari',
    customerMobile: '9876543210',
    customerAddress: '123, MG Road, Chennai, Tamil Nadu',
    orderDate: '2025-06-12',
    status: 'Pending',
  },
  {
    orderId: 'TK43256547',
    productName: 'Organic Honey',
    productImage: honey,
    quantity: 1,
    price: 300,
    customerName: 'Dhanya Dharun',
    customerMobile: '9988776655',
    customerAddress: '45, Nehru Street, Coimbatore, Tamil Nadu',
    orderDate: '2025-06-13',
    status: 'Delivered',
  },
  {
    orderId: 'TK43256548',
    productName: 'Handwoven Silk Saree',
    productImage: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    quantity: 1,
    price: 1899,
    customerName: 'Anita Kumar',
    customerMobile: '9876500000',
    customerAddress: '78, Cross Cut Road, Madurai, Tamil Nadu',
    orderDate: '2025-06-14',
    status: 'Shipped',
  },
];

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

  const generateInvoice = (order) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('INVOICE', 105, 20, null, null, 'center');
    doc.setFontSize(12);
    doc.text(`ORDER ID: ${order.orderId}`, 20, 30);
    doc.text(`Order Date: ${order.orderDate}`, 20, 37);
    doc.text('BILL TO:', 20, 50);
    doc.text(order.customerName, 20, 57);
    doc.text(order.customerAddress, 20, 64);
    doc.text(`Mobile: ${order.customerMobile}`, 20, 71);
    doc.text('PRODUCT DETAILS:', 20, 85);
    doc.text(`Name: ${order.productName}`, 20, 92);
    doc.text(`Quantity: ${order.quantity}`, 20, 99);
    doc.text(`Price per unit: ₹${order.price}`, 20, 106);
    const subtotal = order.quantity * order.price;
    const gst = subtotal * 0.18;
    const total = subtotal + gst;
    doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 20, 120);
    doc.text(`GST (18%): ₹${gst.toFixed(2)}`, 20, 127);
    doc.text(`Total: ₹${total.toFixed(2)}`, 20, 134);
    doc.text('From: Thirumathi Kart, NIT-Trichy', 20, 150);
    doc.text('Email: hello@reallygreatsite.com', 20, 157);
    doc.save(`${order.orderId}_invoice.pdf`);
    toast.success("✅ Invoice downloaded");
  };

  const filteredOrders = fakeOrders.filter(order =>
    order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">Order Management</h1>
          <p className="text-sm md:text-base font-medium opacity-90 mt-1">Track, fulfill, and manage your customer orders</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-6 relative z-10 pb-12">
        {/* Search Bar */}
        <div className="w-full md:w-96 mb-8 relative group ml-auto">
          <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-lg transition-colors group-focus-within:text-hotpink-500" />
          <input
            type="text"
            placeholder="Search by ID, product or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-5 py-3.5 rounded-full border border-gray-100 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-hotpink-400/50 focus:border-hotpink-400 transition-all text-sm font-medium text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Orders', value: fakeOrders.length, color: 'text-hotpink-600', bg: 'bg-hotpink-50' },
            { label: 'Delivered', value: fakeOrders.filter(o => o.status === 'Delivered').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Pending', value: fakeOrders.filter(o => o.status === 'Pending').length, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`${stat.bg} rounded-2xl p-4 text-center shadow-sm border border-white`}
            >
              <p className={`text-3xl font-extrabold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Order Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-5"
        >
          <AnimatePresence>
            {filteredOrders.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
                <FiPackage className="text-5xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700">No orders found</h3>
                <p className="text-gray-400 text-sm mt-1">Try a different search term</p>
              </motion.div>
            ) : (
              filteredOrders.map((order) => {
                const total = order.quantity * order.price * 1.18;
                const statusConfig = getStatusConfig(order.status);

                return (
                  <motion.div
                    variants={itemVariants}
                    key={order.orderId}
                    className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100"
                  >
                    {/* Card Top Banner: Status color strip */}
                    <div className={`h-1.5 w-full ${statusConfig.badge}`} />

                    <div className="flex flex-col lg:flex-row">
                      {/* Left: Product Image */}
                      <div className="lg:w-52 flex-shrink-0 bg-gray-50 flex items-center justify-center p-4">
                        <img
                          src={order.productImage}
                          alt={order.productName}
                          className="w-full h-44 lg:h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500 shadow-sm"
                        />
                      </div>

                      {/* Right: Details */}
                      <div className="flex-1 p-6 flex flex-col justify-between">
                        {/* Top Row */}
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Product</p>
                            <h3 className="text-xl font-extrabold text-gray-800">{order.productName}</h3>
                          </div>
                          <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}>
                            {statusConfig.icon}
                            {order.status}
                          </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
                          <InfoChip icon={<FiHash />} label="Order ID" value={order.orderId} />
                          <InfoChip icon={<FiPackage />} label="Qty × Rate" value={`${order.quantity} × ₹${order.price}`} />
                          <InfoChip icon={<FiCalendar />} label="Order Date" value={order.orderDate} />
                          <InfoChip icon={<FiUser />} label="Customer" value={order.customerName} />
                          <InfoChip icon={<FiPhone />} label="Mobile" value={order.customerMobile} />
                          <InfoChip icon={<FiMapPin />} label="Address" value={order.customerAddress} truncate />
                        </div>

                        {/* Bottom Row: Total + Action */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
                          <div>
                            <p className="text-xs text-gray-400 font-medium">Total (incl. 18% GST)</p>
                            <p className="text-2xl font-extrabold text-hotpink-600">₹{total.toFixed(2)}</p>
                          </div>
                          <button
                            onClick={() => generateInvoice(order)}
                            className="flex items-center gap-2 bg-hotpink-500 text-white font-bold px-6 py-3 rounded-2xl hover:bg-hotpink-600 transition-all duration-300 shadow-md hover:shadow-hotpink-500/40 hover:-translate-y-0.5"
                          >
                            <FiDownload className="text-lg group-hover:-translate-y-1 transition-transform duration-300" />
                            Download Invoice
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

// Info Chip Component
const InfoChip = ({ icon, label, value, truncate }) => (
  <div className="flex items-start gap-2 bg-gray-50 rounded-2xl px-3 py-2.5">
    <span className="text-hotpink-500 mt-0.5 flex-shrink-0 text-sm">{icon}</span>
    <div className="min-w-0">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
      <p className={`text-sm font-bold text-gray-700 ${truncate ? 'truncate max-w-[140px]' : ''}`}>{value}</p>
    </div>
  </div>
);

export default Orders;