import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Sample categories
const categoriesData = [
  {
    category: "Beauty and Healthcare",
    subCategories: [
      { name: "Essential Oils" },
      { name: "Hair Care" },
      { name: "Makeup" },
      { name: "Organic Skincare" },
      { name: "Personal Hygiene" },
      { name: "Soaps & Body Wash" },
      { name: "Wellness Supplements" }
    ]
  },
  {
    category: "Clothing",
    subCategories: [
      { name: "Blouses" },
      { name: "Dresses" },
      { name: "Ethnic Wear" },
      { name: "Footwear" },
      { name: "Kids Wear" },
      { name: "Men’s Wear" },
      { name: "Sarees" },
      { name: "Shirts & Tops" },
      { name: "Women’s Wear" }
    ]
  },
  {
    category: "Fashion",
    subCategories: [
      { name: "Bags & Purses" },
      { name: "Caps & Hats" },
      { name: "Eyewear" },
      { name: "Footwear" },
      { name: "Scarves & Stoles" },
      { name: "Watches" }
    ]
  },
  {
    category: "Fashion and Jewellery",
    subCategories: [
      { name: "Anklets" },
      { name: "Bangles & Bracelets" },
      { name: "Earrings" },
      { name: "Necklaces" },
      { name: "Rings" },
      { name: "Traditional Sets" }
    ]
  },
  {
    category: "Food",
    subCategories: [
      { name: "Bakery" },
      { name: "Beverages" },
      { name: "Dry Fruits & Nuts" },
      { name: "Homemade Snacks" },
      { name: "Pickles & Chutneys" },
      { name: "Ready-to-Eat" },
      { name: "Spices & Masala" },
      { name: "Staples & Grains" }
    ]
  },
  {
    category: "Groceries",
    subCategories: [
      { name: "Atta & Flours" },
      { name: "Dals & Pulses" },
      { name: "Edible Oils" },
      { name: "Organic Products" },
      { name: "Rice & Grains" },
      { name: "Salt & Sugar" },
      { name: "Spices & Condiments" },
      { name: "Tea & Coffee" }
    ]
  },
  {
    category: "Handicraft",
    subCategories: [
      { name: "Bamboo Crafts" },
      { name: "Handmade Bags" },
      { name: "Handmade Home Decor" },
      { name: "Pottery" },
      { name: "Terracotta Items" },
      { name: "Wood Carvings" }
    ]
  },
  {
    category: "Office Code",
    subCategories: [
      { name: "Chairs" },
      { name: "Desks" },
      { name: "Filing Products" },
      { name: "Laptop Stands" },
      { name: "Lighting" },
      { name: "Stationery" },
      { name: "Storage Solutions" }
    ]
  },
  {
    category: "Organic Fruits and Vegetables",
    subCategories: [
      { name: "Fruits" },
      { name: "Leafy Greens" },
      { name: "Organic Juices" },
      { name: "Root Vegetables" },
      { name: "Seasonal Produce" },
      { name: "Vegetables" }
    ]
  },
  {
    category: "Others",
    subCategories: [
      { name: "Books" },
      { name: "DIY Kits" },
      { name: "Gift Items" },
      { name: "Home Cleaning" },
      { name: "Pet Supplies" },
      { name: "Toys & Games" }
    ]
  }
];


const Upload = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    subcategory: "",
    unit: "",
    quantity: "",
    price: "",
  });

  const [subCategories, setSubCategories] = useState([]);
  const [images, setImages] = useState([null, null, null, null]);

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "/login";
  }, []);

  // Update subcategories based on category
  useEffect(() => {
    const selected = categoriesData.find((c) => c.category === form.category);
    setSubCategories(selected ? selected.subCategories : []);
    setForm((prev) => ({ ...prev, subcategory: "" }));
  }, [form.category]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (index, file) => {
    const updated = [...images];
    updated[index] = file;
    setImages(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    images.forEach((img, i) => {
      if (img) formData.append(`image${i + 1}`, img);
    });

    try {
      await axios.post("http://localhost:8080/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("✅ Product uploaded successfully!");
      setForm({
        name: "",
        description: "",
        category: "",
        subcategory: "",
        unit: "",
        quantity: "",
        price: "",
      });
      setImages([null, null, null, null]);
    } catch (err) {
      console.error(err);
      toast.error("❌ Upload failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white px-4 py-12">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden font-josefin">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-pink-600 to-rose-500 h-32 flex items-center justify-center">
          <h2 className="text-white text-2xl font-bold">Upload Product</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Images */}
          <div className="sm:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((img, i) => (
              <label key={i} className="flex flex-col items-center justify-center border-2 border-dashed border-pink-300 p-4 rounded cursor-pointer  hover:border-pink-500 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(i, e.target.files[0])}
                  className="hidden"
                />
                {img ? (
                  <img src={URL.createObjectURL(img)} alt={`preview-${i}`} className="w-20 h-20 object-cover rounded" />
                ) : (
                  <span className="text-pink-400 text-sm">Click to Upload</span>
                )}
                <span className="text-xs text-gray-500 mt-1">Image {i + 1}</span>
              </label>
            ))}
          </div>

          {/* Fields */}
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="border border-pink-200 rounded px-4 py-2"
            required
          />
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            type="number"
            placeholder="Price"
            className="border border-pink-200 rounded px-4 py-2"
            required
          />
          <input
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            type="number"
            placeholder="Quantity"
            className="border border-pink-200 rounded px-4 py-2 "
            required
          />
          <input
            name="unit"
            value={form.unit}
            onChange={handleChange}
            placeholder="Unit (e.g., Kg, Piece)"
            className="border border-pink-200 rounded px-4 py-2"
            required
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border border-pink-200 rounded px-4 py-2"
            required
          >
            <option value="">Select Category</option>
            {categoriesData.map((cat, idx) => (
              <option key={idx} value={cat.category}>{cat.category}</option>
            ))}
          </select>
          <select
            name="subcategory"
            value={form.subcategory}
            onChange={handleChange}
            className="border border-pink-200 rounded px-4 py-2 "
            required
          >
            <option value="">Select Subcategory</option>
            {subCategories.map((sub, idx) => (
              <option key={idx} value={sub.name}>{sub.name}</option>
            ))}
          </select>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Product Description"
            className="col-span-1 sm:col-span-2 border border-pink-200 rounded px-4 py-2"
            required
          />

          <div className="col-span-1 sm:col-span-2 flex justify-end">
            <button type="submit" className="bg-gradient-to-br from-pink-600 to-rose-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition">
              Submit Product
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default Upload;
