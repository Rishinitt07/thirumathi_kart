import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BsStarFill, BsBoxSeam } from 'react-icons/bs';
import { FiSearch, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';






const Bounce = null;
const toast = {
  success: (msg) => console.log(msg),
  error: (msg) => console.log(msg),
  info: (msg) => console.log(msg),
  warn: (msg) => console.log(msg)
};

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios
      .get('http://localhost:8080/products', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProducts(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching products', err);
        void 0;
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      axios
        .delete(`http://localhost:8080/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          void 0;
          fetchProducts();
        })
        .catch((err) => {
          console.error('Failed to delete product', err);
          void 0;
        });
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-white font-josefin pb-20">
      <div className="max-w-7xl mx-auto px-4 pt-10">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-normal text-gray-800 tracking-tight drop-shadow-sm">
              My Products
            </h2>
            <p className="text-gray-500 font-normal mt-2">Manage your inventory and product listings</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80 group">
              <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-lg transition-colors group-focus-within:text-hotpink-500" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-5 py-3 rounded-full border border-gray-100 bg-white/70 backdrop-blur-md shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-hotpink-400/50 focus:border-hotpink-400 transition-all text-sm font-normal text-gray-700 placeholder-gray-400"
              />
            </div>
            <button 
              onClick={() => navigate('/upload')}
              className="btn-hotpink flex items-center justify-center gap-2 px-6 py-3 shrink-0 shadow-lg hover:shadow-xl"
            >
              <FiPlus className="text-xl" />
              <span className="hidden sm:inline">Add Product</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-[350px] bg-white/60 rounded-2xl shadow-sm border border-hotpink-100/50"></div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} className="flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm border border-hotpink-100 rounded-3xl p-16 text-center shadow-sm">
            <div className="w-24 h-24 bg-hotpink-100 rounded-full flex items-center justify-center mb-6 text-hotpink-500 text-4xl">
              <BsBoxSeam />
            </div>
            <h3 className="text-2xl font-normal text-gray-800 mb-2">No products found</h3>
            <p className="text-gray-500 max-w-md">You haven't added any products that match your search. Start building your inventory to see it here.</p>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div
                variants={itemVariants}
                key={product.id}
                className="group bg-white rounded-2xl border border-hotpink-100/60 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col relative"
              >
                {/* Image & Quick Actions */}
                <div className="relative h-56 bg-gray-50 overflow-hidden">
                  <img
                    src={product.image1 ? `data:image/jpeg;base64,${product.image1}` : '/placeholder.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-normal shadow-sm backdrop-blur-md bg-white/90 ${product.in_stock ? 'text-emerald-600' : 'text-rose-600'}`}>
                      <span className={`w-2 h-2 rounded-full ${product.in_stock ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                      {product.in_stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  {/* Hover Overlay Actions */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 z-20">
                    <button
                      onClick={() => navigate(`/edit-product/${product.id}`)}
                      className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-hotpink-600 hover:bg-hotpink-600 hover:text-white transition-colors shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300"
                      title="Edit Product"
                    >
                      <FiEdit2 className="text-xl" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-rose-600 hover:bg-rose-600 hover:text-white transition-colors shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
                      title="Delete Product"
                    >
                      <FiTrash2 className="text-xl" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col space-y-3 bg-white">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-hotpink-500 font-normal uppercase tracking-widest bg-hotpink-50 px-2.5 py-1 rounded-md">{product.category}</span>
                    <span className="flex items-center gap-1.5 text-yellow-500 text-sm font-normal bg-yellow-50 px-2 py-0.5 rounded-md">
                      <BsStarFill className="text-xs" /> 4.5
                    </span>
                  </div>
                  
                  <h3 className="font-normal text-gray-800 text-xl line-clamp-1 group-hover:text-hotpink-600 transition-colors">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-2 text-sm font-normal text-gray-500">
                    <span className="bg-gray-100 px-2.5 py-1 rounded-md">Qty: {product.quantity} {product.unit}</span>
                    <span className="bg-gray-100 px-2.5 py-1 rounded-md line-clamp-1">{product.subcategory}</span>
                  </div>

                  <div className="pt-4 mt-auto border-t border-gray-100 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-gray-400 font-normal mb-1">Selling Price</p>
                      <p className="text-hotpink-600 font-normal text-2xl">₹{product.price}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
      
    </div>
  );
};

export default MyProducts;
