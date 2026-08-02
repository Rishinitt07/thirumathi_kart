import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { syncCartToDB } from '../../utils/sync';

const ProductCard = ({ item, onClick }) => (
  <div 
    onClick={() => onClick(item.id)}
    className="group cursor-pointer bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300"
  >
    <div className="w-full aspect-square bg-gray-50 rounded-xl overflow-hidden mb-4 relative border-b border-gray-50">
      <img src={item.images?.[0] || 'https://placehold.co/400x400'} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
    </div>
    <h3 className="font-semibold text-gray-800 line-clamp-2 text-sm min-h-[40px] group-hover:text-hotpink-600 transition-colors">{item.name}</h3>
    <p className="font-normal text-gray-900 mt-2">
      ₹{((item.price || 0) * (1 - (item.discount || 0) / 100)).toLocaleString()}
    </p>
  </div>
);

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  
  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8081/products');
        
        // Enhance products with mock data similar to categories.jsx
        const allProducts = response.data.map(p => ({
          ...p,
          rating: p.rating || Math.round(Math.random() * 20) / 4,
          stock: p.stock || Math.floor(Math.random() * 100),
          discount: p.discount || (Math.random() > 0.7 ? Math.floor(Math.random() * 50) + 10 : 0),
          images: [p.image1, p.image2, p.image3, p.image4].some(Boolean)
            ? [p.image1, p.image2, p.image3, p.image4].filter(Boolean).map(img => `data:image/jpeg;base64,${img}`)
            : ['https://placehold.co/600x600/f472b6/ffffff?text=No+Image'],
        }));
        
        // Find the specific product
        const foundProduct = allProducts.find(p => p.id.toString() === id);
        
        if (foundProduct) {
          setProduct(foundProduct);
          setSelectedImage(0);
          setQuantity(1);
          
          // Set Related Products (same category, exclude current)
          const related = allProducts.filter(p => p.category === foundProduct.category && p.id.toString() !== id).slice(0, 5);
          setRelatedProducts(related);
          
          // Update Recently Viewed in localStorage
          const storedViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
          
          // Remove if it exists to put it at the front
          const updatedViewed = [
            foundProduct,
            ...storedViewed.filter(p => p.id.toString() !== foundProduct.id.toString())
          ].slice(0, 10); // Keep last 10
          
          localStorage.setItem('recentlyViewed', JSON.stringify(updatedViewed));
          
          // Read it back (excluding current product for display)
          setRecentlyViewed(updatedViewed.filter(p => p.id.toString() !== foundProduct.id.toString()).slice(0, 5));
        } else {
          toast.error("Product not found");
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        toast.error("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };
    
    // Scroll to top when ID changes
    window.scrollTo(0, 0);
    fetchProductData();
  }, [id]);

  const addToCart = () => {
    if (!product) return;
    try {
      const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
      
      // Enforce single seller rule
      if (storedCart.length > 0 && storedCart[0].seller_mobile !== product.seller_mobile) {
        toast.error("You can only add items from one seller at a time.");
        return;
      }

      const existing = storedCart.find(item => item.id === product.id);
      
      let updatedCart;
      if (existing) {
        updatedCart = storedCart.map(item => 
          item.id === product.id ? { ...item, qty: item.qty + quantity } : item
        );
      } else {
        updatedCart = [...storedCart, { ...product, qty: quantity }];
      }
      
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      syncCartToDB(updatedCart);
      window.dispatchEvent(new Event('storage'));
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add to cart.');
    }
  };

  const renderRating = (rating = 5) => {
    return (
      <div className="flex text-yellow-400 text-sm">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i}>{i < Math.round(rating) ? '★' : '☆'}</span>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p className="text-xl text-gray-500">Loading product...</p></div>;
  }

  if (!product) {
    return <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <p className="text-xl text-gray-500 mb-4">Product not found.</p>
      <button onClick={() => navigate('/categories')} className="text-hotpink-600 hover:underline">Back to Categories</button>
    </div>;
  }

  const discountedPrice = (product.price || 0) * (1 - (product.discount || 0) / 100);

  return (
    <div className="min-h-screen bg-gray-50 font-josefin pb-16">
      <ToastContainer position="top-center" autoClose={2000} />
      
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-hotpink-600 flex items-center gap-2 font-medium transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back
          </button>
          <div className="h-6 w-px bg-gray-300"></div>
          <span className="text-sm text-gray-500 capitalize">{product.category || 'Product Details'}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Main Product Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row overflow-hidden mb-16">
          
          {/* Image Gallery */}
          <div className="w-full md:w-1/2 bg-gray-100 flex flex-col relative h-[400px] md:h-[600px] shrink-0 border-b md:border-b-0 md:border-r border-gray-100">
            <img
              src={product.images?.[selectedImage]}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {product.images?.length > 1 && (
              <div className="absolute bottom-6 left-0 right-0 flex gap-3 overflow-x-auto px-6 w-full justify-center">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-16 shrink-0 rounded-xl border-2 p-0.5 bg-white shadow-lg transition-all ${selectedImage === idx ? 'border-hotpink-500 scale-110' : 'border-transparent hover:scale-105'}`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover rounded-lg" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col">
            <div className="mb-4">
              <span className="text-xs font-normal text-hotpink-600 bg-hotpink-50 border border-hotpink-100 px-3 py-1 rounded-full capitalize uppercase tracking-wide">
                {product.category || 'Product'}
              </span>
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-normal text-gray-900 mb-4 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-8">
              {renderRating(product.rating)}
              <span className="text-sm text-blue-600 hover:underline cursor-pointer">{product.reviews || 0} customer reviews</span>
            </div>

            <div className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-end gap-3 mb-2">
                <span className="text-4xl font-normal text-gray-900">
                  ₹{discountedPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                {(product.discount || 0) > 0 && (
                  <>
                    <span className="text-xl text-gray-500 line-through mb-1">
                      ₹{(product.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-sm font-normal text-white bg-green-500 px-2 py-0.5 rounded mb-2 shadow-sm">
                      {product.discount}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-500 font-medium">Inclusive of all taxes</p>
            </div>

            <div className="prose prose-sm text-gray-600 mb-8 max-w-none">
              <h4 className="text-gray-900 font-normal mb-3 text-lg">About this item</h4>
              <p className="leading-relaxed">{product.description || 'No description available for this product.'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-8 border-t border-b border-gray-100 py-6">
              <div>
                <p className="text-gray-500 mb-1 font-medium">Brand</p>
                <p className="font-normal text-gray-900">{product.brand || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1 font-medium">SKU</p>
                <p className="font-normal text-gray-900">{product.sku || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1 font-medium">Weight</p>
                <p className="font-normal text-gray-900">{product.weight || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1 font-medium">Availability</p>
                <p className={`font-normal ${(product.stock || 0) > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {(product.stock || 0) > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                </p>
              </div>
            </div>

            {/* Seller Info Section */}
            <div className="mb-10 bg-orange-50/50 p-6 rounded-2xl border border-orange-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm text-gray-500 mb-2 uppercase tracking-wide font-semibold flex items-center gap-2">
                  🏪 Sold by
                </h3>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900 text-lg">{product.seller_name || 'Seller'}</span>
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded-md flex items-center gap-1 font-medium">
                      ⭐ 4.8
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 flex items-center gap-1.5 mt-1">
                    📍 {product.seller_district ? `${product.seller_district}, ${product.seller_state}` : 'Location Unavailable'}
                  </span>
                  <span className="text-sm text-hotpink-600 font-medium flex items-center gap-1.5 mt-1">
                    ✔ Women Entrepreneur
                  </span>
                </div>
              </div>
              <button 
                onClick={() => navigate(`/store/${product.seller_mobile}`)} 
                className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-sm whitespace-nowrap"
              >
                Visit Store
              </button>
            </div>

            <div className="mt-auto pt-4 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center border-2 border-gray-200 rounded-full bg-white h-14 w-full sm:w-32 shadow-sm">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 h-full text-gray-500 hover:text-hotpink-600 font-normal text-xl rounded-l-full hover:bg-gray-50 transition-colors"
                >−</button>
                <span className="flex-1 text-center font-normal text-lg">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))}
                  className="px-4 h-full text-gray-500 hover:text-hotpink-600 font-normal text-xl rounded-r-full hover:bg-gray-50 transition-colors"
                >+</button>
              </div>
              
              <button
                onClick={addToCart}
                disabled={(product.stock || 0) <= 0}
                className={`flex-1 h-14 rounded-full font-normal text-lg shadow-lg flex items-center justify-center gap-3 transition-all ${
                  (product.stock || 0) <= 0 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                    : 'bg-hotpink-500 hover:bg-hotpink-600 text-white hover:shadow-hotpink-500/30 hover:-translate-y-0.5'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                {(product.stock || 0) <= 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
            
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-normal text-gray-900 mb-6 flex items-center gap-3">
              Related Products
              <span className="text-sm font-normal text-hotpink-600 bg-hotpink-50 border border-hotpink-100 px-3 py-1 rounded-full uppercase tracking-wider">{product.category}</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {relatedProducts.map(item => (
                <ProductCard key={item.id} item={item} onClick={(id) => navigate(`/product/${id}`)} />
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed Section */}
        {recentlyViewed.length > 0 && (
          <div>
            <h2 className="text-2xl font-normal text-gray-900 mb-6 flex items-center gap-2">
              Recently Viewed
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {recentlyViewed.map(item => (
                <ProductCard key={item.id} item={item} onClick={(id) => navigate(`/product/${id}`)} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductPage;
