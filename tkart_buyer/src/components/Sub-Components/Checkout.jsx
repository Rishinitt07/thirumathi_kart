import React, { useEffect, useState, useMemo } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ToastifyCSS = () => (
  <style>{`
    .Toastify__toast-container {
      z-index: 9999; position: fixed; padding: 4px; width: 320px; box-sizing: border-box; color: #fff;
    }
    .Toastify__toast-container--top-center { top: 1em; left: 50%; transform: translateX(-50%); }
    .Toastify__toast {
      position: relative; min-height: 64px; box-sizing: border-box; margin-bottom: 1rem; padding: 8px;
      border-radius: 8px; box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.1), 0 2px 15px 0 rgba(0, 0, 0, 0.05);
      display: flex; justify-content: space-between; max-height: 800px; overflow: hidden;
      font-family: sans-serif; cursor: pointer; direction: ltr; background: #fff; color: #333;
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

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(32); // Default fallback

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; 
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const buyerLat = pos.coords.latitude;
          const buyerLng = pos.coords.longitude;
          const sellerLat = 10.8745; 
          const sellerLng = 78.7066;
          
          let dist = calculateDistance(sellerLat, sellerLng, buyerLat, buyerLng);
          if (!dist || dist === 0) dist = 2.5; 
          else if (dist < 1.0) dist = 1.2;
          
          setDeliveryFee(Math.round(20 + (dist * 10)));
        },
        () => setDeliveryFee(32),
        { timeout: 5000 }
      );
    }
  }, []);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check for old cart format missing seller details and clear if needed
    if (storedCart.length > 0 && !storedCart[0].seller_name) {
      void 0;
      localStorage.removeItem('cart');
      setCart([]);
      setTimeout(() => navigate('/cart'), 2000);
      return;
    }

    if (storedCart.length === 0) {
      void 0;
      setTimeout(() => navigate('/cart'), 2000);
    }
    setCart(storedCart);
  }, [navigate]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await axios.get("http://localhost:8081/addresses", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const fetchedAddresses = res.data || [];
        setAddresses(fetchedAddresses);
        if (fetchedAddresses.length > 0 && !selectedAddressId) {
          setSelectedAddressId(fetchedAddresses[0].id);
        }
      } catch (err) {
        console.error("Failed to load addresses:", err);
      }
    };
    if (addresses.length === 0) {
      fetchAddresses();
    }
  }, [addresses.length, selectedAddressId]);

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
  }, [cart]);

  const finalTotal = useMemo(() => total + deliveryFee, [total, deliveryFee]);

  const handleConfirmOrder = async () => {
    const selectedAddress = addresses.find(a => a.id === selectedAddressId);
    if (!selectedAddress) {
      void 0;
      return;
    }

    let lat = 0;
    let lng = 0;

    const getPosition = () => {
      return new Promise((resolve) => {
        if (!navigator.geolocation) {
          resolve(null);
          return;
        }
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(pos.coords),
          (err) => resolve(null),
          { timeout: 5000 } // wait up to 5 seconds for user to allow
        );
      });
    };

    try {
      const coords = await getPosition();
      if (coords) {
        lat = coords.latitude;
        lng = coords.longitude;
      }

      await axios.post('http://localhost:8081/orders/place', {
        items: cart,
        phone: selectedAddress.mobile,
        address: `${selectedAddress.houseNo}, ${selectedAddress.street}, ${selectedAddress.area}`,
        city: selectedAddress.city,
        pincode: selectedAddress.pincode,
        state: selectedAddress.state,
        paymentMethod: 'cod',
        latitude: lat,
        longitude: lng
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      void 0;
      localStorage.removeItem('cart');
      setTimeout(() => navigate('/orders'), 2000);
    } catch (err) {
      void 0;
    }
  };

  return (
    <div className="min-h-[80vh] font-josefin bg-gray-50 flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      <ToastifyCSS />
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

      <div className="w-full max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-normal text-gray-900">Checkout</h1>
          <button onClick={() => navigate('/cart')} className="text-hotpink-600 hover:underline font-normal">Return to Cart</button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* LEFT COLUMN: Delivery Address & Payment */}
          <div className="flex-1 w-full flex flex-col gap-8">
            
            <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-normal mb-2 text-gray-900">Delivery Address</h2>
              <p className="text-gray-500 mb-8 text-base">Where should we deliver your order?</p>

              <div className="flex flex-col gap-5">
                {addresses.length === 0 ? (
                  <div className="p-8 border-2 border-dashed border-gray-300 rounded-2xl text-center text-gray-500">
                    <p className="mb-4 text-lg">No addresses found.</p>
                    <button onClick={() => window.location.href = '/profile'} className="px-6 py-2 bg-hotpink-50 text-hotpink-600 rounded-xl font-normal">Go to Profile to Add Address</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {addresses.map(addr => (
                      <label key={addr.id} className={`border-2 p-5 rounded-2xl cursor-pointer flex gap-4 transition-all ${selectedAddressId === addr.id ? 'border-hotpink-500 bg-hotpink-50/20' : 'border-gray-200 hover:border-hotpink-300'}`}>
                        <input type="radio" name="address" checked={selectedAddressId === addr.id} onChange={() => setSelectedAddressId(addr.id)} className="mt-1 w-5 h-5 text-hotpink-600 focus:ring-hotpink-500 accent-hotpink-500 cursor-pointer" />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-normal text-gray-900 flex items-center gap-2 text-lg">
                              {addr.tag}
                            </span>
                            <span className="text-sm text-hotpink-600 font-normal cursor-pointer hover:underline" onClick={(e) => { e.preventDefault(); navigate('/profile'); }}>Edit</span>
                          </div>
                          <p className="font-normal text-gray-800 text-base mb-1">{addr.fullName} <span className="text-gray-500 ml-2">{addr.mobile}</span></p>
                          <p className="text-base text-gray-600 leading-relaxed">
                            {addr.houseNo}, {addr.street}, {addr.area}<br/>
                            {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
                
                <button className="flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-300 rounded-2xl text-hotpink-600 font-normal hover:bg-gray-50 hover:border-hotpink-300 transition-colors mt-2 text-lg" onClick={() => window.location.href = '/profile'}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  Add New Address
                </button>
              </div>

              <div className="mt-8 bg-green-50 p-5 rounded-2xl flex items-center justify-between border border-green-100">
                <div>
                  <p className="text-base text-green-800 font-normal flex items-center gap-2">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3z" /><path d="M14 5h-3v8h3.05a2.5 2.5 0 014.5.9V10l-2-5h-2.5z" /></svg>
                    Estimated Delivery: Tomorrow
                  </p>
                  <p className="text-sm text-green-600 mt-1 ml-8">Delivery Charge: ₹{deliveryFee}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-2xl font-normal text-gray-900 flex items-center gap-2 mb-6">
                💵 Payment Method
              </h3>
              <div className="flex items-center gap-4 bg-gray-50 p-5 rounded-2xl border border-gray-200">
                <input type="radio" checked readOnly className="w-6 h-6 text-hotpink-600 accent-hotpink-500" />
                <div>
                  <p className="text-lg font-normal text-gray-900">Cash on Delivery</p>
                  <p className="text-base text-gray-500 mt-1">Pay ₹{finalTotal.toLocaleString()} at delivery</p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Sidebar (Summary & Price Details) */}
          <aside className="w-full lg:w-[450px] shrink-0 flex flex-col gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-normal text-gray-900 flex items-center gap-2 mb-6">
                📦 Order Summary <span className="text-base font-normal text-gray-500">({cart.reduce((sum, item) => sum + item.qty, 0)} Items)</span>
              </h3>
              
              <div className="flex flex-col gap-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4 p-3 bg-white border border-gray-200 rounded-xl shadow-sm items-center hover:shadow-md transition-shadow">
                    <img
                      src={item.images?.[0] || 'https://placehold.co/400x400/f472b6/ffffff?text=No+Image'}
                      alt={item.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg bg-gray-50 border border-gray-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-normal text-gray-900 truncate">{item.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">Qty: {item.qty}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-normal text-gray-900">₹{(item.price * item.qty).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-normal text-gray-900 mb-4 text-lg">Price Details</h3>
                <div className="flex flex-col gap-3 text-base text-gray-600 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST</span>
                    <span>Included</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className="text-green-600 font-normal">₹{deliveryFee}</span>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between font-normal text-2xl text-gray-900 mb-8">
                  <span>Total</span>
                  <span>₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={handleConfirmOrder} 
                disabled={!selectedAddressId}
                className="w-full py-4 bg-hotpink-500 text-white font-normal rounded-xl hover:bg-hotpink-600 transition-colors shadow-md text-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Place Order
              </button>
            </div>

            {/* Seller Info */}
            <div className="bg-orange-50/50 p-6 rounded-2xl shadow-sm border border-orange-100">
              <h3 className="text-sm text-gray-500 mb-2 uppercase tracking-wide font-normal">Seller</h3>
              <div className="flex flex-col gap-1">
                <span className="font-normal text-gray-900 text-lg flex items-center gap-2">
                  🏪 {cart[0]?.seller_name || 'Seller'}
                </span>
                <span className="text-gray-600 text-sm flex items-center gap-1.5">
                  📍 {cart[0]?.seller_district ? `${cart[0]?.seller_district}, ${cart[0]?.seller_state}` : 'Location Unavailable'}
                </span>
              </div>
            </div>
            
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
