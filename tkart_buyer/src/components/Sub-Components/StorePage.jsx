import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StorePage = () => {
  const { id } = useParams(); // mobile number of seller
  const navigate = useNavigate();

  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoreData = async () => {
      setLoading(true);
      try {
        const [sellerRes, productsRes] = await Promise.all([
          axios.get(`http://localhost:8081/seller?mobile=${id}`),
          axios.get(`http://localhost:8081/products?seller_mobile=${id}`)
        ]);
        
        setSeller(sellerRes.data);
        
        // Mock some extra visual fields for products similar to categories.jsx
        const enhancedProducts = (productsRes.data || []).map(p => ({
          ...p,
          rating: p.rating || Math.round((4 + Math.random()) * 10) / 10,
          images: [p.image1, p.image2, p.image3, p.image4].some(Boolean)
            ? [p.image1, p.image2, p.image3, p.image4].filter(Boolean).map(img => `data:image/jpeg;base64,${img}`)
            : ['https://placehold.co/600x600/f472b6/ffffff?text=No+Image']
        }));
        
        setProducts(enhancedProducts);
      } catch (err) {
        console.error('Error fetching store data:', err);
        toast.error('Failed to load store data');
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p className="text-xl text-gray-500">Loading store...</p></div>;
  }

  if (!seller) {
    return <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <p className="text-xl text-gray-500 mb-4">Store not found.</p>
      <button onClick={() => navigate('/categories')} className="text-hotpink-600 hover:underline">Back to Categories</button>
    </div>;
  }

  return (
    <div className="min-h-screen font-josefin bg-gray-50 pb-12">
      <ToastContainer position="top-center" autoClose={2000} />
      {/* Store Header Banner */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-hotpink-100 rounded-full flex items-center justify-center text-4xl sm:text-5xl shadow-sm border-4 border-white shrink-0">
                🏪
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{seller.name}</h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1.5 bg-pink-50 text-hotpink-600 px-3 py-1 rounded-full font-medium">
                    🌸 Women-Owned Business
                  </span>
                  <span className="flex items-center gap-1 text-yellow-500 font-medium">
                    ⭐⭐⭐⭐⭐ <span className="text-gray-700 ml-1">4.8 (124 Reviews)</span>
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 mt-4">
                  <span className="flex items-center gap-1.5">📍 {seller.district ? `${seller.district}, ${seller.state}` : 'Location Unavailable'}</span>
                  <span className="flex items-center gap-1.5">📅 Joined {seller.joined || 'Recently'}</span>
                  <span className="flex items-center gap-1.5">🛍️ {seller.product_count || 0} Products</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar - About */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About Store</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              {seller.description ? seller.description : "No description provided."}
            </p>
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2 text-green-700 font-medium text-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                Verified Seller
              </div>
            </div>
          </div>
        </div>

        {/* Right Content - Products */}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.length === 0 ? (
              <p className="text-gray-500">No products available in this store.</p>
            ) : (
              products.map(product => (
                <div 
                  key={product.id} 
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-medium text-gray-900 mb-1 truncate">{product.name}</h3>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xl font-semibold text-gray-900">₹{product.price}</span>
                      <span className="flex items-center text-sm text-gray-500 gap-1">
                        <span className="text-yellow-400">⭐</span> {product.rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default StorePage;
