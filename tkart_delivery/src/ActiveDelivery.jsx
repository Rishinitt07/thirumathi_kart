import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaPhoneAlt, FaDirections, FaStore, FaUser, FaBox, FaQrcode } from 'react-icons/fa';
import { MdOutlineLocalShipping, MdCheckCircle } from 'react-icons/md';

const ActiveDelivery = () => {
  const [activeDelivery, setActiveDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // UI State for OTP and QR flow
  const [deliveryStage, setDeliveryStage] = useState('assigned'); // assigned -> in_progress -> otp -> qr -> completed
  const [otpInput, setOtpInput] = useState('');
  const [routeInfo, setRouteInfo] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  const navigate = useNavigate();

  const fetchActiveDelivery = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8082/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const deliveries = response.data || [];
      // Find the first assigned or in_progress delivery
      const active = deliveries.find(d => ['assigned', 'in_progress'].includes(d.status));
      
      if (active) {
        setActiveDelivery(active);
        setDeliveryStage(active.status); // 'assigned' or 'in_progress'
      } else {
        setActiveDelivery(null);
      }
    } catch (error) {
      console.error('Error fetching active delivery:', error);
      toast.error('Failed to load active delivery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveDelivery();
    const interval = setInterval(fetchActiveDelivery, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let intervalId;
    
    const updateRoute = async () => {
      if (!activeDelivery) return;
      
      let targetLat, targetLng;
      if (deliveryStage === 'assigned' && activeDelivery.seller_lat && activeDelivery.seller_lng) {
        targetLat = activeDelivery.seller_lat;
        targetLng = activeDelivery.seller_lng;
      } else if (deliveryStage === 'in_progress' && activeDelivery.buyer_lat && activeDelivery.buyer_lng) {
        targetLat = activeDelivery.buyer_lat;
        targetLng = activeDelivery.buyer_lng;
      } else {
        setRouteInfo(null);
        return;
      }

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
          const { latitude, longitude } = pos.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          try {
            const res = await axios.get(`https://router.project-osrm.org/route/v1/driving/${longitude},${latitude};${targetLng},${targetLat}?overview=false`);
            if (res.data && res.data.routes && res.data.routes.length > 0) {
              const distKm = (res.data.routes[0].distance / 1000).toFixed(1);
              const durationMins = Math.round(res.data.routes[0].duration / 60);
              setRouteInfo({ distance: `${distKm} km`, duration: `${durationMins} mins` });
            }
          } catch (error) {
            console.error("Route fetching failed", error);
          }
        }, () => {}, { timeout: 10000 });
      }
    };

    updateRoute();
    intervalId = setInterval(updateRoute, 15000); // update every 15 seconds

    return () => clearInterval(intervalId);
  }, [activeDelivery, deliveryStage]);

  const updateStatus = async (newStatus) => {
    if (!activeDelivery) return;
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:8082/delivery/${activeDelivery.id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      fetchActiveDelivery();
    } catch (error) {
      console.error('Status update error:', error.response?.data || error.message);
      toast.error('Failed to update status: ' + (error.response?.data || 'Server error'));
    }
  };

  const handlePickedUp = () => {
    setDeliveryStage('in_progress');
    updateStatus('in_progress');
    toast.success('Order picked up! Navigate to buyer.');
  };

  const handleVerifyOTP = () => {
    if (otpInput === '1234' || otpInput.length >= 4) { // Mock validation
      setDeliveryStage('qr');
      toast.success('OTP Verified!');
    } else {
      toast.error('Invalid OTP. (Hint: enter any 4 digits)');
    }
  };

  const handlePaymentSuccess = () => {
    setDeliveryStage('completed');
    updateStatus('completed');
    toast.success('Delivery Completed! ₹156 added to earnings.');
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  const getMapsLink = (address, pincode, lat, lng) => {
    if (lat && lng) {
      return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    }
    const query = encodeURIComponent(`${address} ${pincode}`);
    return `https://www.google.com/maps/dir/?api=1&destination=${query}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getMapEmbedUrl = () => {
    let targetLat, targetLng;
    if (deliveryStage === 'assigned') {
      targetLat = activeDelivery.seller_lat;
      targetLng = activeDelivery.seller_lng;
    } else {
      targetLat = activeDelivery.buyer_lat;
      targetLng = activeDelivery.buyer_lng;
    }
    
    // If we have both current location and target location, plot the route!
    if (currentLocation && targetLat && targetLng) {
      return `https://maps.google.com/maps?saddr=${currentLocation.lat},${currentLocation.lng}&daddr=${targetLat},${targetLng}&output=embed`;
    }
    
    // Fallback: Just show the target pin if we don't have driver's location yet
    if (targetLat && targetLng) {
      return `https://maps.google.com/maps?q=${targetLat},${targetLng}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }
    
    // Fallback: Show text address
    const address = deliveryStage === 'assigned' 
      ? `${activeDelivery.pickup_address} ${activeDelivery.pickup_pincode}`
      : `${activeDelivery.drop_address} ${activeDelivery.drop_pincode}`;
      
    return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  };

  if (!activeDelivery) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
          <MdOutlineLocalShipping size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Active Deliveries</h2>
        <p className="text-gray-500 mb-6">You don't have any orders in progress right now.</p>
        <button 
          onClick={() => navigate('/notifications')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-colors"
        >
          Check Available Orders
        </button>
      </div>
    );
  }

  // Progress Bar Steps
  const steps = [
    { key: 'assigned', label: 'Assigned' },
    { key: 'in_progress', label: 'Picked Up' },
    { key: 'otp', label: 'Verifying' },
    { key: 'qr', label: 'Payment' },
    { key: 'completed', label: 'Delivered' }
  ];

  const currentStepIndex = steps.findIndex(s => s.key === deliveryStage);

  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-24 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <MdOutlineLocalShipping className="text-blue-600 mr-3 text-3xl" />
            Active Delivery
          </h1>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-gray-500 font-semibold">Order #TK{String(activeDelivery.order_id).padStart(6, '0')}</p>
            {routeInfo && (
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                {routeInfo.distance} • ~{routeInfo.duration}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column (Order Details & Actions) */}
        <div className="xl:col-span-2 flex flex-col gap-6">

          {/* Progress Bar */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-wider">Order Progress</h3>
            <div className="relative flex justify-between items-center">
              {/* Background Line */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full"></div>
              {/* Active Line */}
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
              ></div>
              
              {/* Dots */}
              {steps.map((step, index) => {
                const isActive = index <= currentStepIndex;
                return (
                  <div key={step.key} className="relative z-10 flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full border-4 ${isActive ? 'bg-blue-600 border-blue-100' : 'bg-gray-200 border-white'} transition-colors duration-500`}></div>
                    <span className={`absolute top-8 text-xs font-bold whitespace-nowrap ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pickup Details */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -z-0"></div>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center relative z-10">
            <FaStore className="mr-2 text-orange-500" /> Pickup Details
          </h3>
          <div className="relative z-10">
            <p className="font-bold text-gray-900 text-lg mb-1">{activeDelivery.seller_name || 'Thirumathi Seller'}</p>
            <p className="text-gray-600 text-sm mb-6 h-10">{activeDelivery.pickup_address}, {activeDelivery.pickup_pincode}</p>
            
            <div className="flex gap-3 mt-auto">
              <a href={`tel:+91${activeDelivery.seller_mobile || '9876543210'}`} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-colors">
                <FaPhoneAlt className="mr-2" /> Call
              </a>
              <a 
                href={getMapsLink(activeDelivery.pickup_address, activeDelivery.pickup_pincode, activeDelivery.seller_lat, activeDelivery.seller_lng)} 
                target="_blank" 
                rel="noreferrer"
                className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-colors"
              >
                <FaDirections className="mr-2" /> Navigate
              </a>
            </div>
          </div>
        </div>

        {/* Buyer Details */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -z-0"></div>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center relative z-10">
            <FaUser className="mr-2 text-green-500" /> Buyer Details
          </h3>
          <div className="relative z-10">
            <p className="font-bold text-gray-900 text-lg mb-1">{activeDelivery.buyer_name || 'Buyer'}</p>
            <p className="text-gray-600 text-sm mb-6 h-10">{activeDelivery.drop_address}, {activeDelivery.drop_pincode}</p>
            
            <div className="flex gap-3 mt-auto">
              <a href={`tel:+91${activeDelivery.buyer_mobile || '9876543211'}`} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-colors">
                <FaPhoneAlt className="mr-2" /> Call
              </a>
              <a 
                href={getMapsLink(activeDelivery.drop_address, activeDelivery.drop_pincode, activeDelivery.buyer_lat, activeDelivery.buyer_lng)} 
                target="_blank" 
                rel="noreferrer"
                className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-colors"
              >
                <FaDirections className="mr-2" /> Navigate
              </a>
            </div>
          </div>
        </div>
          </div>

          {/* Delivery Action Area */}
          <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-blue-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <FaBox className="text-blue-600 mr-2" /> Order Actions
        </h3>
        
        {deliveryStage === 'assigned' && (
          <div className="text-center py-4">
            <p className="text-gray-600 mb-6">Navigate to the seller and click 'Picked Up' once you have the package.</p>
            <button 
              onClick={handlePickedUp}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-2xl text-lg transition-transform hover:scale-105 shadow-lg shadow-blue-200"
            >
              Confirm Package Picked Up
            </button>
          </div>
        )}

        {deliveryStage === 'in_progress' && (
          <div className="text-center py-4">
            <p className="text-gray-600 mb-6">Navigate to the buyer. Ask for the 4-digit OTP to verify delivery.</p>
            <div className="flex justify-center mb-6">
              <input 
                type="text" 
                maxLength="4" 
                placeholder="Enter OTP"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                className="text-center text-3xl font-bold tracking-[0.5em] w-48 border-2 border-gray-200 rounded-xl py-3 focus:border-blue-500 focus:ring-0 outline-none"
              />
            </div>
            <button 
              onClick={handleVerifyOTP}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-2xl text-lg transition-transform hover:scale-105 shadow-lg shadow-blue-200"
            >
              Verify OTP
            </button>
          </div>
        )}

        {deliveryStage === 'otp' && (
          <div className="text-center py-4 animate-fade-in">
            <p className="text-gray-600 mb-6">Generating payment QR code for the buyer...</p>
            <div className="flex justify-center mb-6">
              <div className="animate-pulse">
                <FaQrcode className="text-8xl text-gray-800" />
              </div>
            </div>
            <button 
              onClick={() => setDeliveryStage('qr')}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-2xl text-lg transition-transform hover:scale-105 shadow-lg shadow-blue-200"
            >
              Show QR Code
            </button>
          </div>
        )}

        {deliveryStage === 'qr' && (
          <div className="text-center py-4 animate-fade-in">
            <p className="text-gray-900 font-bold text-xl mb-2">Collect ₹156</p>
            <p className="text-gray-500 mb-6">Buyer can scan this to pay.</p>
            <div className="flex justify-center mb-6">
              <div className="bg-white p-4 rounded-2xl border-4 border-gray-100 shadow-sm">
                <FaQrcode className="text-8xl text-gray-900" />
              </div>
            </div>
            <button 
              onClick={handlePaymentSuccess}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-12 rounded-2xl text-lg transition-transform hover:scale-105 shadow-lg shadow-green-200 flex items-center justify-center mx-auto"
            >
              <MdCheckCircle className="mr-2 text-2xl" /> Payment Received & Deliver
            </button>
          </div>
        )}
          </div>
        </div>

        {/* Right Column (Map) */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 h-full min-h-[400px] xl:min-h-[600px] overflow-hidden sticky top-6">
            <iframe 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              style={{ border: 0, minHeight: '400px', height: '100%' }}
              src={getMapEmbedUrl()} 
              allowFullScreen
              title="Delivery Map"
            ></iframe>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ActiveDelivery;
