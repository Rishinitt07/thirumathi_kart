import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BsStarFill } from 'react-icons/bs';

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios.get('http://localhost:8080/products', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        setProducts(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch products', err);
        setError('Failed to load your products.');
        setLoading(false);
      });
  };

  const updateStock = (id, inStock) => {
    axios.put(`http://localhost:8080/products/${id}/stock`, {
      in_stock: inStock
    }, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(fetchProducts)
      .catch(err => console.error('Failed to update stock', err));
  };

  const updatePrice = (id, price) => {
    axios.put(`http://localhost:8080/products/${id}/price`, {
      price: parseFloat(price)
    }, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(fetchProducts)
      .catch(err => console.error('Failed to update price', err));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    try {
      const formData = new FormData();
      for (const [key, value] of Object.entries(editingProduct)) {
        formData.append(key, value);
      }

      await axios.post("http://localhost:8080/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error("Edit failed", err);
      alert("Failed to update product");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-6 font-josefin">
      <h2 className="text-2xl font-bold text-pink-700 mb-6 text-center">My Products</h2>

      {loading ? (
        <div className="text-center text-gray-500">Loading products...</div>
      ) : error ? (
        <div className="text-center text-red-500 mb-4">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-600 text-lg">You haven't uploaded any products yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-xl overflow-hidden border border-pink-100 hover:shadow-md transition-shadow">
              <div className="relative h-48 bg-pink-50 overflow-hidden">
                <img
                  src={`data:image/jpeg;base64,${product.image1}`}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 bg-pink-500 text-white text-xs px-2 py-1 rounded">
                  {product.in_stock ? "In Stock" : "Out of Stock"}
                </div>
              </div>

              <div className="p-4 space-y-2">
                <span className="text-xs text-pink-500">{product.category}</span>
                <h3 className="font-medium text-gray-800 line-clamp-1">{product.name}</h3>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Qty: {product.quantity}</span>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <BsStarFill className="text-xs" />
                    <span className="text-xs text-gray-500">4.5</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">₹</span>
                  <input
                    type="number"
                    value={product.price}
                    onChange={e => updatePrice(product.id, e.target.value)}
                    className="border px-2 py-1 rounded w-24 text-sm"
                  />
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={product.in_stock}
                    onChange={e => updateStock(product.id, e.target.checked)}
                    className="accent-pink-600"
                  />
                  <span className="text-sm text-gray-700">
                    {product.in_stock ? 'In Stock' : 'Mark Out of Stock'}
                  </span>
                </div>

                <button
                  className="w-full mt-3 py-2 bg-pink-100 text-pink-600 rounded-lg font-medium hover:bg-pink-200 transition-colors"
                  onClick={() => setEditingProduct({ ...product })}
                >
                  Edit Product
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✨ Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg relative">
            <h3 className="text-lg font-semibold mb-4 text-pink-700">Edit Product</h3>

            <input name="name" value={editingProduct.name} onChange={handleEditChange} placeholder="Name" className="w-full border mb-2 px-4 py-2 rounded" />
            <input name="category" value={editingProduct.category} onChange={handleEditChange} placeholder="Category" className="w-full border mb-2 px-4 py-2 rounded" />
            <input name="subcategory" value={editingProduct.subcategory} onChange={handleEditChange} placeholder="Subcategory" className="w-full border mb-2 px-4 py-2 rounded" />
            <input name="price" value={editingProduct.price} onChange={handleEditChange} placeholder="Price" className="w-full border mb-2 px-4 py-2 rounded" />
            <input name="quantity" value={editingProduct.quantity} onChange={handleEditChange} placeholder="Quantity" className="w-full border mb-2 px-4 py-2 rounded" />
            <textarea name="description" value={editingProduct.description} onChange={handleEditChange} placeholder="Description" className="w-full border mb-4 px-4 py-2 rounded" />

            <div className="flex justify-end gap-4">
              <button onClick={() => setEditingProduct(null)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">Cancel</button>
              <button onClick={handleEditSubmit} className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700">Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProducts;
