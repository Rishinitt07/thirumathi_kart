import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { FaBoxOpen, FaStore, FaUser, FaMapMarkerAlt, FaMoneyBillWave } from 'react-icons/fa';
import { MdNotificationsActive, MdCheckCircle, MdCancel } from 'react-icons/md';




const Bounce = null;
const toast = {
  success: (msg) => console.log(msg),
  error: (msg) => console.log(msg),
  info: (msg) => console.log(msg),
  warn: (msg) => console.log(msg)
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
};

const Notifications = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'notifications'
  const [availableOrders, setAvailableOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dynamic Notifications based on available orders
  const notificationsList = availableOrders.map(order => ({
    id: order.order_id,
    title: `New Order Available: #TK${String(order.order_id).padStart(6, '0')}`,
    description: `Pickup from ${order.pickup_address || 'Seller Warehouse'} and deliver to ${order.drop_address || 'Buyer'}`,
    time: 'Just now',
    type: 'new'
  }));

  const fetchAvailableOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }
      const response = await axios.get('http://localhost:8082/available', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAvailableOrders(response.data || []);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        console.error('Error fetching available orders:', error);
        toast.error('Failed to load available orders');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableOrders();
    const interval = setInterval(fetchAvailableOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAcceptOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8082/available/take',
        { order_id: orderId },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      toast.success('Order accepted! Head to Active Delivery.');
      fetchAvailableOrders();
    } catch (error) {
      toast.error(error.response?.data || 'Failed to accept order');
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-24 max-w-5xl mx-auto">
      
      {/* Page Title & Tabs */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <MdNotificationsActive className="text-3xl text-blue-600 mr-3" />
          Alerts & Orders
        </h1>
        
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-2xl overflow-hidden">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 px-4 text-sm font-bold rounded-xl transition-all ${
              activeTab === 'orders' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
            }`}
          >
            New Orders {availableOrders.length > 0 && <span className="ml-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">{availableOrders.length}</span>}
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 py-3 px-4 text-sm font-bold rounded-xl transition-all ${
              activeTab === 'notifications' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
            }`}
          >
            Notifications <span className="ml-2 bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">{notificationsList.length}</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        
        {/* Orders Tab */}
        {activeTab === 'orders' && (
          availableOrders.length > 0 ? (
            availableOrders.map((order) => {
              // Calculate actual straight-line distance
              let distance = calculateDistance(order.seller_lat, order.seller_lng, order.buyer_lat, order.buyer_lng);
              
              // Fallback if coordinates are 0 or missing (e.g. old orders)
              if (!distance || distance === 0) {
                distance = (order.order_id % 15) + 2.5; 
              } else if (distance < 1.0) {
                // If they are less than 1km apart (e.g. testing from same room), set a minimum distance for the UI
                distance = 1.2;
              }
              
              const distanceFormatted = distance.toFixed(1);
              // Base charge ₹20, plus ₹10 per km. Use backend charge if available.
              const deliveryFee = order.delivery_charge ? Number(order.delivery_charge) : Math.round(20 + (distance * 10));
              
              return (
                <div key={order.order_id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
                    <div>
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-2 inline-block uppercase tracking-wider">
                        New Request
                      </span>
                      <h3 className="text-lg font-bold text-gray-900">#TK{String(order.order_id).padStart(6, '0')}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600 flex items-center justify-end">
                        <FaMoneyBillWave className="mr-2 text-xl" /> ₹{deliveryFee}
                      </p>
                      <p className="text-sm font-medium text-gray-500 flex items-center justify-end mt-1">
                        <FaMapMarkerAlt className="mr-1" /> {distanceFormatted} km
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="bg-orange-100 p-2 rounded-lg text-orange-600 mt-1 shrink-0"><FaStore /></div>
                      <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Pickup From</p>
                        <p className="text-sm text-gray-600 line-clamp-2">{order.pickup_address || 'Seller Warehouse'}</p>
                        {order.pickup_pincode && <p className="text-xs text-gray-400">PIN: {order.pickup_pincode}</p>}
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mt-1 shrink-0"><FaUser /></div>
                      <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Deliver To</p>
                        <p className="font-semibold text-gray-900">{order.buyer}</p>
                        <p className="text-sm text-gray-600 line-clamp-2">{order.drop_address}, {order.drop_pincode}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button 
                      onClick={() => handleAcceptOrder(order.order_id)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center"
                    >
                      <MdCheckCircle className="mr-2 text-xl" /> Accept Order
                    </button>
                    <button 
                      className="flex-1 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center"
                    >
                      <MdCancel className="mr-2 text-xl" /> Reject
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
              <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBoxOpen className="text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No New Orders</h3>
              <p className="text-gray-500">You're all caught up! Wait for new delivery requests to appear here.</p>
            </div>
          )
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {notificationsList.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {notificationsList.map((notif) => (
                  <div key={notif.id} className="p-5 flex items-start gap-4 hover:bg-gray-50 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      notif.type === 'new' ? 'bg-blue-100 text-blue-600' :
                      notif.type === 'update' ? 'bg-orange-100 text-orange-600' :
                      notif.type === 'danger' ? 'bg-red-100 text-red-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      <MdNotificationsActive size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{notif.title}</p>
                      <p className="text-sm text-gray-700 mt-1">{notif.description}</p>
                      <p className="text-xs text-gray-500 mt-2">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500">
                <p>No new notifications right now.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Notifications;
