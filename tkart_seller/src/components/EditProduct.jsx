import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const categoriesData = [
  { category: "Clothing", subCategories: [{ name: "Men" }, { name: "Women" }] },
  { category: "Accessories", subCategories: [{ name: "Jewellery" }] },
];

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "", description: "", category: "", subcategory: "", unit: "",
    quantity: "", price: "", in_stock: true
  });

  const [subCategories, setSubCategories] = useState([]);
  const [images, setImages] = useState([null, null, null, null]);
  const [previews, setPreviews] = useState([null, null, null, null]);
  const [loading, setLoading] = useState(true);

  // 🔽 Fetch product data
  useEffect(() => {
    axios.get("http://localhost:8080/products", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      const product = res.data.find(p => p.id === parseInt(id));
      if (product) {
        setForm({
          name: product.name,
          description: product.description || "",
          category: product.category || "",
          subcategory: product.subcategory || "",
          unit: product.unit || "",
          quantity: product.quantity,
          price: product.price,
          in_stock: product.in_stock,
        });

        const imgKeys = ["image1", "image2", "image3", "image4"];
        setPreviews(imgKeys.map(key => product[key] ? `data:image/jpeg;base64,${product[key]}` : null));
      } else {
        toast.error("❌ Product not found");
        navigate("/my-products");
      }
    }).catch(() => toast.error("❌ Failed to load product"))
      .finally(() => setLoading(false));
  }, [id]);

  // 🔽 Set subcategories when category changes
  useEffect(() => {
    const selected = categoriesData.find(c => c.category === form.category);
    if (selected) {
      setSubCategories(selected.subCategories);
    } else {
      setSubCategories([]);
    }
  }, [form.category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (i, file) => {
    const updated = [...images];
    updated[i] = file;
    setImages(updated);

    const previewUpdated = [...previews];
    previewUpdated[i] = file ? URL.createObjectURL(file) : null;
    setPreviews(previewUpdated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    images.forEach((img, i) => {
      if (img) formData.append(`image${i + 1}`, img);
    });

    try {
      await axios.put(`http://localhost:8080/products/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      toast.success("✅ Product updated!");
      setTimeout(() => navigate("/my-products"), 1500);
    } catch (err) {
      console.error(err);
      toast.error("❌ Update failed");
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-500 font-josefin">Loading product...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white px-4 py-12 font-josefin">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-br from-pink-600 to-rose-500 h-32 flex items-center justify-center">
          <h2 className="text-white text-2xl font-bold">Edit Product</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Images */}
          <div className="sm:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {previews.map((img, i) => (
              <label key={i} className="flex flex-col items-center justify-center border-2 border-dashed border-pink-300 p-4 rounded cursor-pointer hover:border-pink-500 transition">
                <input type="file" accept="image/*" onChange={e => handleImageChange(i, e.target.files[0])} className="hidden" />
                {img ? (
                  <img src={img} alt={`preview-${i}`} className="w-20 h-20 object-cover rounded" />
                ) : (
                  <span className="text-pink-400 text-sm">Click to Upload</span>
                )}
                <span className="text-xs text-gray-500 mt-1">Image {i + 1}</span>
              </label>
            ))}
          </div>

          {/* Text Inputs */}
          <input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" className="border border-pink-200 rounded px-4 py-2" required />
          <input name="price" value={form.price} onChange={handleChange} type="number" placeholder="Price" className="border border-pink-200 rounded px-4 py-2" required />
          <input name="quantity" value={form.quantity} onChange={handleChange} type="number" placeholder="Quantity" className="border border-pink-200 rounded px-4 py-2" required />
          <input name="unit" value={form.unit} onChange={handleChange} placeholder="Unit (e.g., Kg, Piece)" className="border border-pink-200 rounded px-4 py-2" required />

          <select name="category" value={form.category} onChange={handleChange} className="border border-pink-200 rounded px-4 py-2" required>
            <option value="">Select Category</option>
            {categoriesData.map((cat, idx) => (
              <option key={idx} value={cat.category}>{cat.category}</option>
            ))}
          </select>

          <select name="subcategory" value={form.subcategory} onChange={handleChange} className="border border-pink-200 rounded px-4 py-2" required>
            <option value="">Select Subcategory</option>
            {subCategories.map((sub, idx) => (
              <option key={idx} value={sub.name}>{sub.name}</option>
            ))}
          </select>

          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Product Description" className="col-span-1 sm:col-span-2 border border-pink-200 rounded px-4 py-2" required />

          <label className="col-span-1 sm:col-span-2 flex items-center gap-2">
            <input type="checkbox" checked={form.in_stock} onChange={e => setForm({ ...form, in_stock: e.target.checked })} className="accent-pink-600" />
            <span className="text-sm">In Stock</span>
          </label>

          <div className="col-span-1 sm:col-span-2 flex justify-end">
            <button type="submit" className="bg-gradient-to-br from-pink-600 to-rose-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition">
              Update Product
            </button>
          </div>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default EditProduct;
