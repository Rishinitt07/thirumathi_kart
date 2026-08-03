import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MdDashboard, MdRefresh, MdDirectionsBike, MdAttachMoney, MdMap, MdCheckCircle } from 'react-icons/md';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const Dashboard = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Goal and Confetti states
  const [goalTarget, setGoalTarget] = useState(
    parseInt(localStorage.getItem('deliveryGoalTarget') || '10', 10)
  );
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(goalTarget);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8082/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDeliveries(response.data || []);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const saveGoal = () => {
    const newGoal = Math.max(1, parseInt(goalInput, 10) || 10);
    setGoalTarget(newGoal);
    setGoalInput(newGoal);
    localStorage.setItem('deliveryGoalTarget', newGoal.toString());
    setIsEditingGoal(false);
    toast.success('Daily goal updated!');
  };

  // Calculate metrics
  const completed = deliveries.filter(d => d.status === 'completed').length;
  const pending = deliveries.filter(d => ['assigned', 'in_progress'].includes(d.status)).length;
  const total = completed + pending;
  
  // Check for goal completion
  useEffect(() => {
    if (completed > 0 && completed >= goalTarget) {
      // Check if we already celebrated this goal today
      const celebratedDate = localStorage.getItem('celebratedGoalDate');
      const todayDate = new Date().toDateString();
      if (celebratedDate !== todayDate) {
        setShowConfetti(true);
        localStorage.setItem('celebratedGoalDate', todayDate);
        setTimeout(() => setShowConfetti(false), 8000); // Stop confetti after 8 seconds
      }
    }
  }, [completed, goalTarget]);

  // Mock calculations for missing backend data
  const mockEarnings = completed * 156;
  const mockDistance = completed * 6.5;
  const progressPercent = Math.min(100, Math.round((completed / goalTarget) * 100));

  // Get last 5 completed
  const recentHistory = deliveries
    .filter(d => d.status === 'completed')
    .sort((a, b) => new Date(b.assigned_at) - new Date(a.assigned_at))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-24">
      {showConfetti && <Confetti width={width} height={height} numberOfPieces={500} recycle={false} />}

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div whileHover={{ y: -5 }} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <MdDirectionsBike className="text-6xl text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">Today's Deliveries</p>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">{total}</h3>
            <div className="flex justify-between text-sm">
              <span className="text-green-600 font-medium">Completed: {completed}</span>
              <span className="text-orange-500 font-medium">Pending: {pending}</span>
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <MdAttachMoney className="text-6xl text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">Today's Earnings</p>
            <h3 className="text-3xl font-bold text-green-600 mb-4">₹{mockEarnings}</h3>
            <div className="text-sm text-gray-500">
              +₹{completed > 0 ? 156 : 0} from last order
            </div>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <MdMap className="text-6xl text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Distance</p>
            <h3 className="text-3xl font-bold text-blue-600 mb-4">{mockDistance.toFixed(1)} km</h3>
            <div className="text-sm text-gray-500">
              Across {completed} trips
            </div>
          </motion.div>

          {/* Goal Progress */}
          <motion.div whileHover={{ y: -5 }} className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 shadow-md text-white relative overflow-hidden">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium text-blue-100">Today's Goal</p>
              {isEditingGoal ? (
                <button onClick={saveGoal} className="text-xs bg-white text-blue-600 px-3 py-1 rounded-lg font-bold shadow-sm hover:bg-gray-100 transition-colors">
                  Save
                </button>
              ) : (
                <button onClick={() => setIsEditingGoal(true)} className="text-xs bg-blue-500/30 hover:bg-blue-500/50 text-white px-3 py-1 rounded-lg font-bold transition-colors">
                  Edit Goal
                </button>
              )}
            </div>
            <h3 className="text-3xl font-bold mb-4 flex items-center">
              {completed} / 
              {isEditingGoal ? (
                <input 
                  type="number" 
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  className="mx-2 w-16 bg-white border border-blue-400 text-black text-2xl font-bold rounded-lg p-1 outline-none text-center hide-arrows shadow-inner"
                  autoFocus
                />
              ) : (
                <span className="mx-2">{goalTarget}</span>
              )}
              <span className="text-lg font-normal text-blue-200">Deliveries</span>
            </h3>
            
            <div className="w-full bg-blue-900/50 rounded-full h-3 mb-2">
              <div 
                className="bg-white h-3 rounded-full transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="text-right text-sm font-medium text-blue-100">{progressPercent}%</div>
          </motion.div>
        </div>

        {/* Recent History & Quick Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Quick Actions */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4 px-2">⚡ Quick Actions</h2>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl shadow-sm transition-colors flex items-center justify-center text-lg">
              <MdDirectionsBike className="mr-2 text-2xl" />
              Start Today's Route
            </button>
            <button onClick={handleRefresh} className="w-full bg-white hover:bg-gray-50 text-blue-600 font-bold py-4 px-6 rounded-2xl shadow-sm border border-blue-100 transition-colors flex items-center justify-center text-lg">
              <MdRefresh className={`mr-2 text-2xl ${refreshing ? 'animate-spin' : ''}`} />
              Refresh Orders
            </button>
          </div>

          {/* Recent History */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold text-gray-900 mb-4 px-2">📜 Recent History</h2>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              {recentHistory.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {recentHistory.map((order, i) => (
                    <div key={i} className="p-4 sm:p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                          <MdCheckCircle size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">#TK{String(order.order_id).padStart(6, '0')}</p>
                          <p className="text-xs text-gray-500">{new Date(order.assigned_at).toLocaleTimeString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">₹156</p>
                        <span className="inline-block mt-1 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">
                          Delivered
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <p>No completed deliveries yet today.</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;

