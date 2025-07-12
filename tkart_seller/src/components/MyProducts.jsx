import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BsStarFill } from 'react-icons/bs';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyProducts = () => {
  const [products, setProducts] = useState([]);
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
        toast.error('❌ Failed to load products');
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
          toast.success('✅ Product deleted');
          fetchProducts();
        })
        .catch((err) => {
          console.error('Failed to delete product', err);
          toast.error('❌ Delete failed');
        });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white font-josefin pb-10">
      <div className="max-w-7xl mx-auto px-4 pt-10">
        <h2 className="text-3xl font-bold text-center text-pink-700 mb-8">
          My Products
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-64 bg-white rounded-xl shadow-md border border-pink-100"></div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-600">No products uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-pink-100 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition"
              >
                <div className="relative h-48 bg-pink-50">
                  <img
                    src={product.image1 ? `data:image/jpeg;base64,${product.image1}` : '/placeholder.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <span className={`absolute top-2 left-2 text-xs px-2 py-1 rounded text-white ${product.in_stock ? 'bg-green-500' : 'bg-red-500'}`}>
                    {product.in_stock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <span className="text-xs text-pink-500">{product.category} / {product.subcategory}</span>
                  <h3 className="font-medium text-gray-800 line-clamp-1">
                    {product.name}
                  </h3>

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Qty: {product.quantity} {product.unit}</span>
                    <span className="flex items-center gap-1 text-yellow-500">
                      <BsStarFill className="text-xs" /> 4.5
                    </span>
                  </div>

                  <p className="text-pink-700 font-bold text-lg">₹{product.price}</p>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => navigate(`/edit-product/${product.id}`)}
                      className="flex-1 bg-pink-100 text-pink-600 py-1 rounded hover:bg-pink-200 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 bg-red-100 text-red-600 py-1 rounded hover:bg-red-200 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default MyProducts;
