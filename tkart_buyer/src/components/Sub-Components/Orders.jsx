import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  FiShoppingBag,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiXCircle,
} from "react-icons/fi";

const ORDER_STATUS = {
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const StatusBadge = ({ status }) => {
  const statusConfig = {
    [ORDER_STATUS.PROCESSING]: {
      color: "bg-yellow-100 text-yellow-800",
      icon: <FiClock className="mr-1" />,
    },
    [ORDER_STATUS.SHIPPED]: {
      color: "bg-blue-100 text-blue-800",
      icon: <FiTruck className="mr-1" />,
    },
    [ORDER_STATUS.DELIVERED]: {
      color: "bg-green-100 text-green-800",
      icon: <FiCheckCircle className="mr-1" />,
    },
    [ORDER_STATUS.CANCELLED]: {
      color: "bg-red-100 text-red-800",
      icon: <FiXCircle className="mr-1" />,
    },
  };
  const config = statusConfig[status] || statusConfig[ORDER_STATUS.PROCESSING];
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}
    >
      {config.icon}
      {status}
    </span>
  );
};

const OrderCard = React.memo(
  ({ order, expanded, onToggle, onCancel }) => {
    const totalAmount = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const grandTotal =
      totalAmount + (order.shippingCost || 0) + (order.tax || 0);
    const canCancel = order.status === ORDER_STATUS.PROCESSING;

    return (
      <motion.div
        className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={onToggle}
        >
          <div className="flex items-center space-x-4">
            <div className="bg-pink-50 rounded-lg p-3 text-pink-600">
              <FiShoppingBag size={20} />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                Order #{String(order.id).padStart(8, "0")}
              </h3>
              <p className="text-sm text-gray-500">
                {new Date(order.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
          <div className="mt-3 sm:mt-0 flex items-center space-x-4">
            <StatusBadge status={order.status} />
            <span className="font-medium text-gray-900">
              ₹{grandTotal.toFixed(2)}
            </span>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="border-t border-gray-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Order Items ({order.items.length})
                    </h4>
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start space-x-4"
                        >
                          <img
                            src={item.image || "https://via.placeholder.com/80"}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded border"
                          />
                          <div className="flex-1">
                            <Link
                              to={`/product/${item.id}`}
                              className="font-medium hover:text-pink-600"
                            >
                              {item.name}
                            </Link>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity}
                            </p>
                            <p className="text-sm text-gray-600">
                              ₹{item.price.toFixed(2)} each
                            </p>
                          </div>
                          <div className="font-medium">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-1">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Order Summary
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span>₹{totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping:</span>
                        <span>₹{(order.shippingCost || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax:</span>
                        <span>₹{(order.tax || 0).toFixed(2)}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 flex justify-between font-medium">
                        <span>Total:</span>
                        <span className="text-pink-600">
                          ₹{grandTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                  {canCancel && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCancel(order.id);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel Order
                    </button>
                  )}
                  <button className="px-4 py-2 border border-pink-300 rounded-md text-sm font-medium text-pink-700 hover:bg-pink-50">
                    Track Order
                  </button>
                  <button className="px-4 py-2 bg-pink-600 rounded-md text-sm font-medium text-white hover:bg-pink-700">
                    Buy Again
                  </button>
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
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [filter, setFilter] = useState("all");

  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to view your orders");
        setLoading(false);
        toast.error("Please login to view your orders");
        return;
      }
      const response = await axios.get("http://localhost:8081/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data || []);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to load orders. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const toggleOrder = useCallback((orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  }, []);

  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to cancel orders");
        return;
      }
      await axios.patch(
        `http://localhost:8081/orders/${orderId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, status: ORDER_STATUS.CANCELLED }
            : order
        )
      );
      toast.success("Order cancelled successfully");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to cancel order"
      );
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    return order.status === filter;
  });

  const statusFilters = [
    { value: "all", label: "All Orders" },
    { value: ORDER_STATUS.PROCESSING, label: "Processing" },
    { value: ORDER_STATUS.SHIPPED, label: "Shipped" },
    { value: ORDER_STATUS.DELIVERED, label: "Delivered" },
    { value: ORDER_STATUS.CANCELLED, label: "Cancelled" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          My Orders
        </h1>
        <p className="text-gray-600 mb-4">
          View your order history and track shipments
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {statusFilters.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                filter === value
                  ? "bg-pink-600 text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
            <p className="text-sm text-red-700">{error}</p>
            <div className="mt-2">
              <Link
                to="/login"
                className="text-sm text-red-700 underline hover:text-red-600"
              >
                Login to view orders
              </Link>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <FiShoppingBag size={96} className="mx-auto opacity-50" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No orders found
            </h3>
            <p className="mt-2 text-gray-500">
              {filter === "all"
                ? "You haven't placed any orders yet."
                : `You don't have any ${filter.toLowerCase()} orders.`}
            </p>
            <div className="mt-6">
              <Link
                to="/categories"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700"
              >
                Browse Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                expanded={expandedOrderId === order.id}
                onToggle={() => toggleOrder(order.id)}
                onCancel={handleCancelOrder}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
