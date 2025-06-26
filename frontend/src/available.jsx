import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdArrowBack, MdLocationOn, MdRefresh } from 'react-icons/md';
import { FaBoxOpen, FaPlus, FaWarehouse, FaHome, FaPhone, FaRoute } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const Available = () => {
  const [availableOrders, setAvailableOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [takingOrder, setTakingOrder] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAvailableOrders();
  }, []);

  const fetchAvailableOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8082/available', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setAvailableOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching available orders:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        toast.error('Failed to fetch available orders');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleManualRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchAvailableOrders();
      toast.success('Orders refreshed successfully!');
    } catch (error) {
      console.error('Manual refresh failed:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const takeDelivery = async (orderId) => {
    setTakingOrder(orderId);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8082/available/take', 
        { order_id: orderId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success('Delivery assigned successfully!');
      fetchAvailableOrders();
    } catch (error) {
      console.error('Error taking delivery:', error);
      if (error.response?.status === 400) {
        toast.error(error.response.data || 'Cannot take this delivery');
      } else if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        toast.error('Failed to take delivery');
      }
    } finally {
      setTakingOrder(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading available orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with Manual Refresh Button */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Link
                to="/dashboard"
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <MdArrowBack className="text-xl" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Available Orders</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {availableOrders.length} orders available
              </div>
              
              <button
                onClick={handleManualRefresh}
                disabled={refreshing}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MdRefresh 
                  className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} 
                />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {availableOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <FaBoxOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Available Orders</h3>
            <p className="text-gray-500 mb-4">
              There are currently no orders available for delivery. Check back later!
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {availableOrders.map((order) => (
              <div
                key={order.order_id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {/* Order Header */}
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <FaBoxOpen className="text-blue-600 text-lg" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.order_id}
                        </h3>
                        <div className="flex items-center space-x-4">
                          <p className="text-sm text-gray-600">
                            Customer: {order.buyer}
                          </p>
                          {order.phone && order.phone !== 'No Phone' && (
                            <div className="flex items-center text-sm text-gray-600">
                              <FaPhone className="mr-1 text-xs" />
                              {order.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Pickup and Drop Route */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center mb-3">
                        <FaRoute className="text-gray-600 mr-2" />
                        <h4 className="font-medium text-gray-900">Delivery Route</h4>
                      </div>
                      
                      {/* Step 1: Pickup */}
                      <div className="flex items-start mb-4">
                        <div className="flex-shrink-0 mr-4">
                          <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                            1
                          </div>
                        </div>
                        <div className="flex-1 bg-orange-50 rounded-lg p-3 border-l-4 border-orange-400">
                          <div className="flex items-start">
                            <FaWarehouse className="text-orange-600 mt-1 mr-3 flex-shrink-0" />
                            <div>
                              <h5 className="font-medium text-gray-900 mb-1">
                                <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2 py-1 rounded mr-2">
                                  PICKUP
                                </span>
                                Warehouse Location
                              </h5>
                              <p className="text-gray-700 text-sm mb-1">{order.pickup_address}</p>
                              <p className="text-xs text-gray-500">Pincode: {order.pickup_pincode}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Arrow/Connector */}
                      <div className="flex justify-center mb-4">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <MdLocationOn className="text-gray-600" />
                        </div>
                      </div>

                      {/* Step 2: Drop */}
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-4">
                          <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                            2
                          </div>
                        </div>
                        <div className="flex-1 bg-green-50 rounded-lg p-3 border-l-4 border-green-400">
                          <div className="flex items-start">
                            <FaHome className="text-green-600 mt-1 mr-3 flex-shrink-0" />
                            <div>
                              <h5 className="font-medium text-gray-900 mb-1">
                                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded mr-2">
                                  DELIVER
                                </span>
                                Customer Address
                              </h5>
                              <p className="text-gray-700 text-sm mb-1">{order.drop_address}</p>
                              <p className="text-xs text-gray-500">Pincode: {order.drop_pincode}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Status */}
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Available
                      </span>
                    </div>
                  </div>

                  {/* Take Delivery Button */}
                  <div className="ml-6 flex-shrink-0">
                    <button
                      onClick={() => takeDelivery(order.order_id)}
                      disabled={takingOrder === order.order_id}
                      className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {takingOrder === order.order_id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Taking...
                        </>
                      ) : (
                        <>
                          <FaPlus className="mr-2" />
                          Take This Delivery
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Info Card */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">💡</span>
              </div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Delivery Process
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>You can have a maximum of 3 active deliveries at a time</li>
                  <li><strong>Step 1:</strong> Go to the warehouse (orange box) to pickup packages</li>
                  <li><strong>Step 2:</strong> Deliver to customer address (green box)</li>
                  <li>Update delivery status as you progress through each step</li>
                  <li>Use the map feature to get optimized routes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Available;
