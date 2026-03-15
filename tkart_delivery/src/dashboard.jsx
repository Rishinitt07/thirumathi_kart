import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdDashboard, MdMap, MdLogout, MdRefresh } from 'react-icons/md';
import { FaBoxOpen, FaTruck, FaCheckCircle, FaWarehouse, FaHome, FaClock, FaRoute } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    assigned: 0,
    inProgress: 0,
    completed: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8082/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setDeliveries(response.data || []);
      
      // Calculate stats
      const newStats = {
        assigned: 0,
        inProgress: 0,
        completed: 0
      };

      response.data?.forEach(delivery => {
        if (delivery.status === 'assigned') newStats.assigned++;
        else if (delivery.status === 'in_progress') newStats.inProgress++;
        else if (delivery.status === 'completed') newStats.completed++;
      });

      setStats(newStats);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        toast.error('Failed to fetch deliveries');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchDeliveries();
      toast.success('Dashboard refreshed!');
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const updateDeliveryStatus = async (deliveryId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:8082/delivery/${deliveryId}/status`,
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success('Delivery status updated');
      fetchDeliveries();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update delivery status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned': return 'bg-blue-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'assigned': return <FaBoxOpen className="text-white" />;
      case 'in_progress': return <FaTruck className="text-white" />;
      case 'completed': return <FaCheckCircle className="text-white" />;
      default: return <FaBoxOpen className="text-white" />;
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'assigned': return 'in_progress';
      case 'in_progress': return 'completed';
      default: return null;
    }
  };

  const getNextStatusLabel = (currentStatus) => {
    switch (currentStatus) {
      case 'assigned': return 'Start Pickup';
      case 'in_progress': return 'Mark Delivered';
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <MdDashboard className="text-2xl text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Delivery Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
              >
                <MdRefresh className={`mr-1 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              
              <Link
                to="/available"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaBoxOpen className="mr-2" />
                Browse Orders
              </Link>
              
              <Link
                to="/map"
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <MdMap className="mr-2" />
                View Map
              </Link>
              
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-red-600 hover:text-red-800 transition-colors"
              >
                <MdLogout className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                <FaBoxOpen className="text-white text-lg" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Assigned</p>
                <p className="text-2xl font-bold text-gray-900">{stats.assigned}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mr-4">
                <FaTruck className="text-white text-lg" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                <FaCheckCircle className="text-white text-lg" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Deliveries List */}
        {deliveries.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <FaBoxOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No deliveries assigned yet.</h3>
            <Link
              to="/available"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Available Orders
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {deliveries.map((delivery) => (
              <div key={delivery.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 ${getStatusColor(delivery.status)} rounded-lg flex items-center justify-center mr-4`}>
                      {getStatusIcon(delivery.status)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{delivery.order_id}
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center">
                        <FaClock className="mr-1" />
                        Assigned: {new Date(delivery.assigned_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      delivery.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                      delivery.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {delivery.status.replace('_', ' ').toUpperCase()}
                    </span>
                    
                    {getNextStatus(delivery.status) && (
                      <button
                        onClick={() => updateDeliveryStatus(delivery.id, getNextStatus(delivery.status))}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        {getNextStatusLabel(delivery.status)}
                      </button>
                    )}
                  </div>
                </div>

                {/* Delivery Route */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <FaRoute className="text-gray-600 mr-2" />
                    <h4 className="font-medium text-gray-900">Delivery Route</h4>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Pickup */}
                    <div className="bg-orange-50 rounded-lg p-3 border-l-4 border-orange-400">
                      <div className="flex items-start">
                        <FaWarehouse className="text-orange-600 mt-1 mr-3 flex-shrink-0" />
                        <div>
                          <h5 className="font-medium text-gray-900 mb-1">
                            <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2 py-1 rounded mr-2">
                              PICKUP
                            </span>
                            Warehouse
                          </h5>
                          <p className="text-gray-700 text-sm mb-1">{delivery.pickup_address}</p>
                          <p className="text-xs text-gray-500">Pincode: {delivery.pickup_pincode}</p>
                        </div>
                      </div>
                    </div>

                    {/* Drop */}
                    <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-400">
                      <div className="flex items-start">
                        <FaHome className="text-green-600 mt-1 mr-3 flex-shrink-0" />
                        <div>
                          <h5 className="font-medium text-gray-900 mb-1">
                            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded mr-2">
                              DELIVER
                            </span>
                            Customer
                          </h5>
                          <p className="text-gray-700 text-sm mb-1">{delivery.drop_address}</p>
                          <p className="text-xs text-gray-500">Pincode: {delivery.drop_pincode}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
