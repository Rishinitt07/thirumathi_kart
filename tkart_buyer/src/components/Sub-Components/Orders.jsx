import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";


import {



  FiShoppingBag,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiXCircle,
  FiMapPin,
  FiCreditCard,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

// Toast CSS Override
const Bounce = null;
const toast = {
  success: (msg) => console.log(msg),
  error: (msg) => console.log(msg),
  info: (msg) => console.log(msg),
  warn: (msg) => console.log(msg)
};

const ToastifyCSS = () => (
  <style>{`
    .Toastify__toast {
      position: relative; min-height: 64px; box-sizing: border-box; margin-bottom: 1rem; padding: 8px;
      border-radius: 8px; box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.1), 0 2px 15px 0 rgba(0, 0, 0, 0.05);
      display: flex; justify-content: space-between; max-height: 800px; overflow: hidden;
      font-family: 'Josefin Sans', sans-serif; cursor: pointer; direction: ltr; background: #fff; color: #333;
    }
    .Toastify__toast-body { margin: auto 0; flex: 1 1 auto; padding: 6px; }
    .Toastify__close-button {
      color: #333; background: transparent; outline: none; border: none; padding: 0; cursor: pointer;
      opacity: 0.7; transition: 0.3s ease; align-self: flex-start;
    }
    .Toastify__toast--success { background-color: #4caf50; color: white; }
    .Toastify__toast--warning { background-color: #f1c40f; color: white; }
    .Toastify__toast--error { background-color: #e74c3c; color: white; }
  `}</style>
);

const ORDER_STATUS = {
  PROCESSING: "Processing",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for delivery",
  NEAR_DOORSTEP: "Near your doorstep",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

// Tracking Steps Configuration
const TRACKING_STEPS = [
  { id: 'placed', label: 'Order placed', statusMatch: [ORDER_STATUS.PROCESSING, ORDER_STATUS.CONFIRMED, ORDER_STATUS.SHIPPED, ORDER_STATUS.OUT_FOR_DELIVERY, ORDER_STATUS.NEAR_DOORSTEP, ORDER_STATUS.DELIVERED] },
  { id: 'confirmed', label: 'Seller confirmed', statusMatch: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.SHIPPED, ORDER_STATUS.OUT_FOR_DELIVERY, ORDER_STATUS.NEAR_DOORSTEP, ORDER_STATUS.DELIVERED] },
  { id: 'shipped', label: 'Order Packed', statusMatch: [ORDER_STATUS.SHIPPED, ORDER_STATUS.OUT_FOR_DELIVERY, ORDER_STATUS.NEAR_DOORSTEP, ORDER_STATUS.DELIVERED] },
  { id: 'out_delivery', label: 'Order Picked', statusMatch: [ORDER_STATUS.OUT_FOR_DELIVERY, ORDER_STATUS.NEAR_DOORSTEP, ORDER_STATUS.DELIVERED] },
  { id: 'doorstep', label: 'Delivered', statusMatch: [ORDER_STATUS.NEAR_DOORSTEP, ORDER_STATUS.DELIVERED] },
];

const StatusBadge = ({ status }) => {
  const isCancelled = status === ORDER_STATUS.CANCELLED;
  const isDelivered = status === ORDER_STATUS.DELIVERED;
  const isProcessing = status === ORDER_STATUS.PROCESSING || status === ORDER_STATUS.CONFIRMED;
  const isShipping = status === ORDER_STATUS.SHIPPED || status === ORDER_STATUS.OUT_FOR_DELIVERY || status === ORDER_STATUS.NEAR_DOORSTEP;

  let color = "bg-gray-100 text-gray-700 border-gray-200";
  let icon = <FiClock className="mr-1.5" />;

  if (isCancelled) {
    color = "bg-red-100 text-red-700 border-red-200";
    icon = <FiXCircle className="mr-1.5" />;
  } else if (isDelivered) {
    color = "bg-green-100 text-green-700 border-green-200";
    icon = <FiCheckCircle className="mr-1.5" />;
  } else if (isProcessing) {
    color = "bg-orange-100 text-orange-700 border-orange-200";
  } else if (isShipping) {
    color = "bg-blue-100 text-blue-700 border-blue-200";
    icon = <FiTruck className="mr-1.5" />;
  }

  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-normal uppercase tracking-wider border shadow-sm ${color}`}>
      {icon}
      {status}
    </span>
  );
};

const OrderCard = React.memo(
  ({ order, onCancelClick }) => {
    const [expanded, setExpanded] = useState(false);
    const [trackingVisible, setTrackingVisible] = useState(false);
    const itemsTotal = order.items.reduce((sum, item) => sum + item.price * (item.qty || item.quantity || 1), 0);
    const deliveryCharge = order.deliveryCharge || 0;
    const grandTotal = itemsTotal + deliveryCharge;
    
    // Check if cancellation is allowed
    const canCancel = ![
      ORDER_STATUS.OUT_FOR_DELIVERY, 
      ORDER_STATUS.NEAR_DOORSTEP, 
      ORDER_STATUS.DELIVERED, 
      ORDER_STATUS.CANCELLED
    ].includes(order.status);

    const formattedOrderId = `#TK${String(order.id).padStart(5, "0")}`;

    // Compute tracking progress
    const activeSteps = TRACKING_STEPS.filter(step => step.statusMatch.includes(order.status)).length;
    const isCancelled = order.status === ORDER_STATUS.CANCELLED;

    return (
      <motion.div
        className={`bg-white rounded-2xl shadow-sm overflow-hidden border transition-all duration-300 mb-6 ${expanded ? 'border-hotpink-300 ring-2 ring-hotpink-50' : 'border-gray-200 hover:border-hotpink-200 hover:shadow-md'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Order Header / Summary */}
        <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-normal text-gray-900 tracking-tight flex items-center gap-3">
              Order {formattedOrderId}
              <StatusBadge status={order.status} />
            </h3>
            <p className="text-sm text-gray-500 mt-1 font-normal">
              Placed on {new Date(order.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <div className="flex flex-row items-center justify-between w-full sm:w-auto gap-4">
            <div className="text-left sm:text-right">
              <span className="block text-xs text-gray-500 font-normal uppercase tracking-wider mb-0.5">Order Total</span>
              <span className="font-normal text-gray-900 text-lg">
                ₹{grandTotal.toLocaleString()}
              </span>
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-gray-500 hover:text-hotpink-600 transition-colors p-2 bg-white rounded-full border border-gray-200 shadow-sm"
            >
              {expanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
            </button>
          </div>
        </div>

        {/* Main Items Display (MyCart style) */}
        <div className="p-4 sm:p-6 flex flex-col gap-6">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row gap-4 sm:gap-6 border-b border-gray-100 last:border-0 pb-6 last:pb-0">
              <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                <img
                  src={item.images?.[0] || item.image1 || item.image || "https://via.placeholder.com/150"}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <Link to={`/product/${item.id}`} className="font-normal text-lg text-gray-900 hover:text-hotpink-600 transition-colors block mb-1">
                    {item.name}
                  </Link>
                  <p className="text-xs text-green-600 font-normal tracking-wide uppercase mb-1">In stock</p>
                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    <span className="bg-gray-100 px-2.5 py-1 rounded-md font-normal text-gray-700">Qty: {item.qty || item.quantity || 1}</span>
                  </div>
                </div>
              </div>
              <div className="text-left sm:text-right mt-2 sm:mt-0">
                <p className="text-2xl font-normal text-gray-900">₹{(item.price * (item.qty || item.quantity || 1)).toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">₹{item.price.toLocaleString()} each</p>
              </div>
            </div>
          ))}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 mt-2 pt-4 border-t border-gray-100">
            {canCancel && (
              <button
                onClick={() => onCancelClick(order.id)}
                className="text-sm font-normal text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50 bg-white shadow-sm"
              >
                <FiXCircle size={16} />
                Cancel Order
              </button>
            )}
            <div className="h-4 w-px bg-gray-300 hidden sm:block"></div>
            <button 
              onClick={() => setTrackingVisible(!trackingVisible)}
              className="text-sm font-normal text-hotpink-600 hover:text-hotpink-700 transition-colors flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-hotpink-200 bg-hotpink-50 hover:bg-hotpink-100 shadow-sm"
            >
              <FiTruck size={16} />
              {trackingVisible ? "Hide Tracking" : "Track Order"}
            </button>
          </div>
        </div>

        {/* Tracking Vertical Timeline */}
        <AnimatePresence>
          {trackingVisible && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden bg-gray-50/50 border-t border-gray-100"
            >
              <div className="p-6 sm:p-8 max-w-2xl mx-auto">
                <h4 className="font-normal text-gray-900 mb-6 text-lg">Tracking Progress</h4>
                
                {isCancelled ? (
                  <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center">
                    <FiXCircle className="mx-auto text-red-500 mb-3" size={40} />
                    <h5 className="text-red-700 font-normal text-lg">Order Cancelled</h5>
                    <p className="text-red-600 text-sm mt-1">This order has been cancelled and will not be delivered.</p>
                  </div>
                ) : (
                  <div className="relative pl-4 sm:pl-8">
                    {/* Vertical Line */}
                    <div className="absolute top-2 bottom-2 left-6 sm:left-10 w-0.5 bg-gray-200"></div>
                    
                    <div className="space-y-8 relative">
                      {TRACKING_STEPS.map((step, index) => {
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
        </AnimatePresence>

        {/* Expanded Order Details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden bg-white border-t border-gray-100"
            >
              <div className="p-5 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Delivery Address */}
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h4 className="font-normal text-gray-900 mb-4 flex items-center text-lg">
                      <FiMapPin className="mr-2 text-hotpink-500" /> Delivery Address
                    </h4>
                    <div className="text-gray-600 text-sm space-y-1.5">
                      <p className="font-normal text-gray-900 text-base mb-1">{order.username}</p>
                      <p className="leading-relaxed">{order.address}</p>
                      <p>{order.city}, {order.state} - {order.pincode}</p>
                      <p className="mt-3 pt-3 border-t border-gray-200 font-normal flex items-center gap-2">
                        <span className="text-gray-500">Phone:</span> 
                        <span className="text-gray-900">{order.phone}</span>
                      </p>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h4 className="font-normal text-gray-900 mb-4 flex items-center text-lg">
                      <FiCreditCard className="mr-2 text-hotpink-500" /> Payment Summary
                    </h4>
                    <div className="text-gray-600 text-sm space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Payment Method</span>
                        <span className="font-normal text-gray-800 uppercase bg-white border border-gray-200 px-3 py-1 rounded-md shadow-sm">{order.payment_method || 'COD'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Items Subtotal</span>
                        <span className="font-normal text-gray-800">₹{itemsTotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Delivery Fee</span>
                        <span className="font-normal text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs">{deliveryCharge > 0 ? `₹${deliveryCharge}` : 'FREE'}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-3 mt-1 flex justify-between font-normal text-lg text-gray-900">
                        <span>Grand Total</span>
                        <span className="text-hotpink-600">
                          ₹{grandTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }
);

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  // Cancel Modal State
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to view your orders");
        setLoading(false);
        void 0;
        return;
      }
      const response = await axios.get("http://localhost:8081/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data || []);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to load orders. Please try again.";
      setError(errorMessage);
      void 0;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const initiateCancel = (orderId) => {
    setCancellingOrderId(orderId);
    setCancelReason("");
    setCancelModalVisible(true);
  };

  const confirmCancelOrder = async () => {
    if (!cancelReason) {
      void 0;
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:8081/orders/cancel?id=${cancellingOrderId}&reason=${encodeURIComponent(cancelReason)}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders((prev) =>
        prev.map((order) =>
          order.id === cancellingOrderId
            ? { ...order, status: ORDER_STATUS.CANCELLED }
            : order
        )
      );
      void 0;
      setCancelModalVisible(false);
    } catch (err) {
      void 0;
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    if (filter === "Active") return order.status !== ORDER_STATUS.CANCELLED && order.status !== ORDER_STATUS.DELIVERED;
    return order.status === filter;
  });

  const statusFilters = [
    { value: "all", label: "All Orders" },
    { value: "Active", label: "Active" },
    { value: ORDER_STATUS.DELIVERED, label: "Delivered" },
    { value: ORDER_STATUS.CANCELLED, label: "Cancelled" },
  ];

  return (
    <div className="min-h-screen font-josefin bg-[#fafafa] relative overflow-hidden">
      <ToastifyCSS />
      
      
      <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-4xl font-normal text-gray-900 mb-3 tracking-tight">
            Your Orders
          </h1>
          <p className="text-lg text-gray-500 font-normal">
            Manage your purchases, track deliveries, and view details.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center sm:justify-start">
          {statusFilters.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-6 py-2.5 rounded-xl text-sm font-normal transition-all duration-300 ${
                filter === value
                  ? "bg-gray-900 text-white shadow-md scale-105"
                  : "bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-hotpink-500"></div>
          </div>
        ) : error ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border border-red-100 p-8 rounded-3xl text-center shadow-sm my-12">
            <FiXCircle className="mx-auto text-red-400 mb-4" size={48} />
            <p className="text-xl font-normal text-red-800">{error}</p>
            <Link to="/login" className="mt-6 inline-block font-normal text-white bg-red-600 px-6 py-3 rounded-xl hover:bg-red-700 transition-colors shadow-sm">
              Login to continue
            </Link>
          </motion.div>
        ) : filteredOrders.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24 bg-white rounded-[2rem] shadow-sm border border-gray-100">
            <div className="w-28 h-28 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100 shadow-sm">
              <FiShoppingBag size={56} className="text-gray-300" />
            </div>
            <h3 className="text-3xl font-normal text-gray-900 tracking-tight mb-3">
              No orders found
            </h3>
            <p className="text-lg text-gray-500 max-w-md mx-auto">
              {filter === "all"
                ? "You haven't placed any orders yet. Discover something amazing today!"
                : `You don't have any ${filter.toLowerCase()} orders at the moment.`}
            </p>
            <div className="mt-10">
              <Link
                to="/categories"
                className="inline-flex items-center px-8 py-4 border border-transparent rounded-2xl shadow-md text-lg font-normal text-white bg-hotpink-600 hover:bg-hotpink-700 hover:shadow-lg transition-all transform hover:-translate-y-1"
              >
                Browse Products
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onCancelClick={initiateCancel}
              />
            ))}
          </div>
        )}
      </div>

      {/* Cancel Reason Modal */}
      <AnimatePresence>
        {cancelModalVisible && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40"
              onClick={() => setCancelModalVisible(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-[2rem] shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-8">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiXCircle size={32} />
                </div>
                <h3 className="text-2xl font-normal text-center text-gray-900 mb-2">Cancel Order</h3>
                <p className="text-center text-gray-500 mb-8">Please tell us why you are cancelling this order.</p>

                <div className="space-y-4">
                  <label className="block text-sm font-normal text-gray-700 mb-2">Reason for Cancellation</label>
                  <select 
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-hotpink-500 focus:border-transparent transition-all font-normal appearance-none"
                  >
                    <option value="" disabled>Select a reason...</option>
                    <option value="Ordered by mistake">Ordered by mistake</option>
                    <option value="Found a better price elsewhere">Found a better price elsewhere</option>
                    <option value="Shipping time is too long">Shipping time is too long</option>
                    <option value="Changed my mind">Changed my mind</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="mt-10 flex gap-4">
                  <button
                    onClick={() => setCancelModalVisible(false)}
                    className="flex-1 py-3.5 px-4 bg-gray-100 text-gray-700 font-normal rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Keep Order
                  </button>
                  <button
                    onClick={confirmCancelOrder}
                    className="flex-1 py-3.5 px-4 bg-red-600 text-white font-normal rounded-xl hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
                  >
                    Confirm Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;
