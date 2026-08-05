import React, { useEffect, useState, useCallback, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { syncCartToDB } from '../../utils/sync';
import ProductDetailModal from './ProductDetailModal';




const Bounce = null;
const toast = {
  success: (msg) => console.log(msg),
  error: (msg) => console.log(msg),
  info: (msg) => console.log(msg),
  warn: (msg) => console.log(msg)
};

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

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const MyCart = () => {
  const [cart, setCart] = useState(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check for old cart format missing seller details and clear if needed
    if (storedCart.length > 0 && !storedCart[0].seller_name) {
      localStorage.removeItem('cart');
      return [];
    }

    return storedCart.map(item => ({
      ...item,
      qty: item.qty > 0 ? item.qty : 1,
    }));
  });
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    syncCartToDB(cart);
  }, [cart]);


  const updateQty = useCallback((id, delta) => {
    setCart(currentCart =>
      currentCart.map(item =>
        item.id === id
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item
      )
    );
  }, []);

  const removeItem = useCallback(id => {
    setCart(currentCart => currentCart.filter(item => item.id !== id));
  }, []);

  const filteredCart = useMemo(() => {
    if (!searchTerm) return cart;
    return cart.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cart, searchTerm]);

  const total = useMemo(() => {
    return filteredCart.reduce(
      (sum, item) => sum + item.price * (item.qty || 1),
      0
    );
  }, [filteredCart]);

  const handleCheckout = () => {
    if (cart.length === 0) {
      void 0;
      return;
    }
    navigate('/checkout');
  };
  const CartItem = ({ item, onSelectProduct }) => (
    <div className="flex flex-col sm:flex-row items-stretch bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in group overflow-hidden mb-4">
      
      {/* Image Section */}
      <div 
        className="w-full sm:w-48 md:w-56 shrink-0 bg-gray-50 relative cursor-pointer overflow-hidden border-b sm:border-b-0 sm:border-r border-gray-100"
        onClick={() => onSelectProduct(item)}
      >
        <img
          src={item.images?.[0] || 'https://placehold.co/400x400/f472b6/ffffff?text=No+Image'}
          alt={item.name}
          className="w-full h-48 sm:h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col justify-between flex-1">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h3 
              className="text-lg sm:text-xl font-normal text-gray-900 group-hover:text-hotpink-600 transition-colors cursor-pointer leading-tight mb-2"
              onClick={() => onSelectProduct(item)}
            >
              {item.name}
            </h3>
            <p className="text-xs text-green-600 font-normal tracking-wide uppercase mb-1">In stock</p>
            <p className="text-xs text-gray-500">Eligible for FREE Delivery</p>
          </div>
          
          <div className="text-left sm:text-right">
            <p className="text-2xl font-normal text-gray-900">₹{item.price.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl h-10 overflow-hidden shadow-sm">
            <button onClick={() => updateQty(item.id, -1)} className="px-4 h-full hover:bg-white text-gray-600 font-normal transition-colors border-r border-gray-200"> − </button>
            <span className="w-12 text-center font-normal text-gray-900">{item.qty}</span>
            <button onClick={() => updateQty(item.id, 1)} className="px-4 h-full hover:bg-white text-gray-600 font-normal transition-colors border-l border-gray-200"> + </button>
          </div>
          <button onClick={() => removeItem(item.id)} className="text-sm font-normal text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-red-50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            Delete
          </button>
          <div className="h-4 w-px bg-gray-300 hidden sm:block"></div>
          <button className="text-sm font-normal text-gray-500 hover:text-hotpink-600 transition-colors px-3 py-2 rounded-lg hover:bg-hotpink-50">
            Save for later
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen font-josefin bg-gray-50">
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <ToastifyCSS />
        
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Column - Cart Items */}
          <main className="flex-1 w-full flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-3xl font-normal text-gray-900">Shopping Cart</h1>
              
              <div className="relative group w-full sm:max-w-xs md:max-w-sm">
                <input
                  type="text"
                  placeholder="Search cart items..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full px-5 py-2.5 rounded-full border border-gray-200 bg-white shadow-sm focus:outline-none focus:border-hotpink-300 focus:ring-2 focus:ring-hotpink-100 transition-all text-sm text-gray-700 pl-11 placeholder-gray-400"
                />
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-hotpink-400 transition-colors h-4 w-4" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
            </div>

            <div className="flex flex-col mt-2">
              {filteredCart.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-gray-500 text-lg">
                    {searchTerm ? `No items matched your search for "${searchTerm}".` : "Your Cart is empty."}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {filteredCart.map(item => <CartItem key={item.id} item={item} onSelectProduct={setSelectedProduct} />)}
                </div>
              )}
            </div>
            
            {filteredCart.length > 0 && (
              <div className="text-right pt-2 border-t border-gray-200 mt-2">
                <p className="text-xl text-gray-900">
                  Subtotal ({filteredCart.reduce((sum, item) => sum + item.qty, 0)} items): <span className="font-normal">₹{total.toLocaleString()}</span>
                </p>
              </div>
            )}
          </main>

          {/* Right Column - Price Details & Checkout */}
          {cart.length > 0 && (
            <aside className="w-full lg:w-96 shrink-0 sticky top-24">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-green-700 mb-4">
                    <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                    <span className="text-sm font-normal">Your order is eligible for FREE Delivery.</span>
                  </div>
                  
                  <h2 className="text-xl text-gray-900 mb-2">
                    Subtotal ({cart.reduce((sum, item) => sum + item.qty, 0)} items): <span className="font-normal">₹{total.toLocaleString()}</span>
                  </h2>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-3 px-4 bg-hotpink-500 hover:bg-hotpink-600 text-white rounded-full font-normal text-[15px] shadow-md transition-all hover:-translate-y-0.5"
                >
                  Proceed to Buy
                </button>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                    <p className="text-xs text-gray-500 leading-tight">
                      Safe and secure payments. Easy returns. 100% Authentic products.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          )}
          
        </div>


        

        <ProductDetailModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      </div>
    </div>
  );
};

export default MyCart;
