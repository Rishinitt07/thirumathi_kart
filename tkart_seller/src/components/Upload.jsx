import React, { useState, useEffect } from "react";
import axios from "axios";

import { motion, AnimatePresence } from "framer-motion";
import { 

  FiUploadCloud, FiImage, FiInfo, FiTag, FiBox, FiCheckCircle,
  FiType, FiFileText, FiList, FiDollarSign, FiPackage, FiHash
} from "react-icons/fi";


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

const Bounce = null;
const toast = {
  success: (msg) => console.log(msg),
  error: (msg) => console.log(msg),
  info: (msg) => console.log(msg),
  warn: (msg) => console.log(msg)
};

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
  const [activeTab, setActiveTab] = useState("basic");
  const [isPublishing, setIsPublishing] = useState(false);

  // Track progress
  const isBasicComplete = form.name && form.description && form.category && form.subcategory;
  const isPricingComplete = form.price && form.quantity && form.unit;
  const isMediaComplete = images[0] !== null;

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
    setIsPublishing(true);
    const token = localStorage.getItem("token");

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    images.forEach((img, i) => {
      if (img) formData.append(`image${i + 1}`, img);
    });

    const minDelay = new Promise(res => setTimeout(res, 1500));

    try {
      await Promise.all([
        axios.post("http://localhost:8080/upload", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }),
        minDelay
      ]);
      void 0;
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
      setActiveTab("basic");
      setIsPublishing(false);
    } catch (err) {
      console.error(err);
      await minDelay;
      void 0;
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-josefin pb-12">
      {/* Hero Cover Area */}
      <div className="relative h-32 md:h-48 bg-gradient-to-br from-hotpink-400 via-hotpink-500 to-hotpink-600 w-full overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-hotpink-200 rounded-full mix-blend-overlay filter blur-3xl"></div>
        </div>
        
        <div className="absolute inset-0 flex flex-col justify-start pt-6 md:pt-10 items-center text-white px-4">
          <h1 className="text-2xl md:text-3xl font-normal text-white tracking-tight drop-shadow-sm mb-1 md:mb-2">Create New Product</h1>
          <p className="text-sm md:text-lg font-normal opacity-90 text-center max-w-2xl">Bring your products to life with rich descriptions and media.</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-6 lg:gap-8 items-start -mt-8 md:-mt-12 px-4 sm:px-6 relative z-10"
      >
        {/* Left Sidebar Tabs (Step Tracker) */}
        <div className="md:w-72 bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-6 flex flex-col gap-3 sticky top-24 border border-white/50">
          <div className="mb-4">
            <h2 className="text-xl font-normal text-gray-800 tracking-tight">Progress Tracker</h2>
            <div className="w-full bg-gray-100 rounded-full h-2 mt-4 overflow-hidden">
              <div 
                className="bg-hotpink-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${((isBasicComplete ? 1 : 0) + (isPricingComplete ? 1 : 0) + (isMediaComplete ? 1 : 0)) / 3 * 100}%` }}
              ></div>
            </div>
          </div>

          <TabButton 
            active={activeTab === 'basic'} 
            onClick={() => setActiveTab('basic')} 
            icon={<FiInfo />} 
            label="Basic Details" 
            completed={isBasicComplete}
          />
          <TabButton 
            active={activeTab === 'pricing'} 
            onClick={() => setActiveTab('pricing')} 
            icon={<FiTag />} 
            label="Pricing & Inventory"
            completed={isPricingComplete} 
          />
          <TabButton 
            active={activeTab === 'media'} 
            onClick={() => setActiveTab('media')} 
            icon={<FiImage />} 
            label="Media Assets" 
            completed={isMediaComplete}
          />
        </div>

        {/* Right Content Area */}
        <div className="flex-1 bg-white rounded-3xl shadow-xl p-8 sm:p-10 flex flex-col min-h-[500px] w-full border border-gray-50">
          <form onSubmit={handleSubmit} className="flex flex-col h-full relative">
            
            <AnimatePresence mode="wait">
              {activeTab === 'basic' && (
                <motion.div 
                  key="basic"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 space-y-8"
                >
                  <div className="border-b border-gray-100 pb-4 mb-2">
                    <h3 className="text-2xl font-normal text-gray-800">Basic Details</h3>
                    <p className="text-gray-500 text-sm mt-1">Provide the fundamental information about your product.</p>
                  </div>
                  
                  <div className="relative group">
                    <div className="absolute top-5 left-4 text-hotpink-400 z-10">
                      <FiType className="text-xl" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder=" "
                      className="block w-full pl-12 pr-4 pt-7 pb-2 text-base font-normal text-gray-800 bg-gray-50/50 border-2 border-transparent rounded-2xl appearance-none focus:outline-none focus:ring-0 focus:bg-white focus:border-hotpink-400 hover:border-hotpink-200 transition-all peer"
                      required
                    />
                    <label htmlFor="name" className="absolute text-sm text-gray-400 duration-300 transform -translate-y-3 scale-75 top-5 z-10 origin-[0] left-12 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 font-normal uppercase tracking-wider cursor-text">
                      Product Name
                    </label>
                  </div>

                  <div className="relative group">
                    <div className="absolute top-5 left-4 text-hotpink-400 z-10">
                      <FiFileText className="text-xl" />
                    </div>
                    <textarea
                      id="description"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder=" "
                      rows="4"
                      className="block w-full pl-12 pr-4 pt-7 pb-2 text-base font-normal text-gray-800 bg-gray-50/50 border-2 border-transparent rounded-2xl appearance-none focus:outline-none focus:ring-0 focus:bg-white focus:border-hotpink-400 hover:border-hotpink-200 transition-all peer resize-none"
                      required
                    />
                    <label htmlFor="description" className="absolute text-sm text-gray-400 duration-300 transform -translate-y-3 scale-75 top-5 z-10 origin-[0] left-12 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 font-normal uppercase tracking-wider cursor-text">
                      Detailed Product Description
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative group">
                      <div className="absolute top-5 left-4 text-hotpink-400 z-10">
                        <FiList className="text-xl" />
                      </div>
                      <select
                        id="category"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="block w-full pl-12 pr-4 pt-7 pb-2 text-base font-normal text-gray-800 bg-gray-50/50 border-2 border-transparent rounded-2xl appearance-none focus:outline-none focus:ring-0 focus:bg-white focus:border-hotpink-400 hover:border-hotpink-200 transition-all peer"
                        required
                      >
                        <option value=""></option>
                        {categoriesData.map((cat, idx) => (
                          <option key={idx} value={cat.category}>{cat.category}</option>
                        ))}
                      </select>
                      <label htmlFor="category" className="absolute text-[10px] font-normal text-gray-400 uppercase tracking-wider top-2 left-12 z-10">
                        Category
                      </label>
                      {!form.category && <span className="absolute left-12 top-6 text-gray-400 font-normal pointer-events-none">Select Category</span>}
                    </div>

                    <div className="relative group">
                      <div className="absolute top-5 left-4 text-hotpink-400 z-10">
                        <FiBox className="text-xl" />
                      </div>
                      <select
                        id="subcategory"
                        name="subcategory"
                        value={form.subcategory}
                        onChange={handleChange}
                        className="block w-full pl-12 pr-4 pt-7 pb-2 text-base font-normal text-gray-800 bg-gray-50/50 border-2 border-transparent rounded-2xl appearance-none focus:outline-none focus:ring-0 focus:bg-white focus:border-hotpink-400 hover:border-hotpink-200 transition-all peer"
                        required
                      >
                        <option value=""></option>
                        {subCategories.map((sub, idx) => (
                          <option key={idx} value={sub.name}>{sub.name}</option>
                        ))}
                      </select>
                      <label htmlFor="subcategory" className="absolute text-[10px] font-normal text-gray-400 uppercase tracking-wider top-2 left-12 z-10">
                        Subcategory
                      </label>
                      {!form.subcategory && <span className="absolute left-12 top-6 text-gray-400 font-normal pointer-events-none">Select Subcategory</span>}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'pricing' && (
                <motion.div 
                  key="pricing"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 space-y-8"
                >
                  <div className="border-b border-gray-100 pb-4 mb-2">
                    <h3 className="text-2xl font-normal text-gray-800">Pricing & Inventory</h3>
                    <p className="text-gray-500 text-sm mt-1">Set your price and available stock quantities.</p>
                  </div>
                  
                  <div className="relative group">
                    <div className="absolute top-5 left-4 text-hotpink-400 z-10">
                      <FiDollarSign className="text-xl" />
                    </div>
                    <input
                      id="price"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      type="number"
                      placeholder=" "
                      className="block w-full pl-12 pr-4 pt-7 pb-2 text-base font-normal text-gray-800 bg-gray-50/50 border-2 border-transparent rounded-2xl appearance-none focus:outline-none focus:ring-0 focus:bg-white focus:border-hotpink-400 hover:border-hotpink-200 transition-all peer"
                      required
                    />
                    <label htmlFor="price" className="absolute text-sm text-gray-400 duration-300 transform -translate-y-3 scale-75 top-5 z-10 origin-[0] left-12 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 font-normal uppercase tracking-wider cursor-text">
                      Price (₹)
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative group">
                      <div className="absolute top-5 left-4 text-hotpink-400 z-10">
                        <FiHash className="text-xl" />
                      </div>
                      <input
                        id="quantity"
                        name="quantity"
                        value={form.quantity}
                        onChange={handleChange}
                        type="number"
                        placeholder=" "
                        className="block w-full pl-12 pr-4 pt-7 pb-2 text-base font-normal text-gray-800 bg-gray-50/50 border-2 border-transparent rounded-2xl appearance-none focus:outline-none focus:ring-0 focus:bg-white focus:border-hotpink-400 hover:border-hotpink-200 transition-all peer"
                        required
                      />
                      <label htmlFor="quantity" className="absolute text-sm text-gray-400 duration-300 transform -translate-y-3 scale-75 top-5 z-10 origin-[0] left-12 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 font-normal uppercase tracking-wider cursor-text">
                        Qty Available
                      </label>
                    </div>
                    <div className="relative group">
                      <div className="absolute top-5 left-4 text-hotpink-400 z-10">
                        <FiPackage className="text-xl" />
                      </div>
                      <input
                        id="unit"
                        name="unit"
                        value={form.unit}
                        onChange={handleChange}
                        placeholder=" "
                        className="block w-full pl-12 pr-4 pt-7 pb-2 text-base font-normal text-gray-800 bg-gray-50/50 border-2 border-transparent rounded-2xl appearance-none focus:outline-none focus:ring-0 focus:bg-white focus:border-hotpink-400 hover:border-hotpink-200 transition-all peer"
                        required
                      />
                      <label htmlFor="unit" className="absolute text-sm text-gray-400 duration-300 transform -translate-y-3 scale-75 top-5 z-10 origin-[0] left-12 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 font-normal uppercase tracking-wider cursor-text">
                        Unit (e.g. kg, pcs)
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'media' && (
                <motion.div 
                  key="media"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 space-y-8"
                >
                  <div className="border-b border-gray-100 pb-4 mb-2">
                    <h3 className="text-2xl font-normal text-gray-800">Media Assets</h3>
                    <p className="text-gray-500 text-sm mt-1">Upload high-quality images to showcase your product.</p>
                  </div>
                  
                  <div className="flex flex-col gap-6">
                    {/* Main Cover Image (Index 0) */}
                    <label className="group flex flex-col items-center justify-center h-56 border-2 border-dashed border-hotpink-300 bg-hotpink-50/30 rounded-3xl cursor-pointer hover:bg-hotpink-50 hover:border-hotpink-500 transition-all duration-300 hover:shadow-lg relative overflow-hidden">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(0, e.target.files[0])}
                        className="hidden"
                      />
                      {images[0] ? (
                        <img src={URL.createObjectURL(images[0])} alt="cover-preview" className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-hotpink-400 group-hover:text-hotpink-600 transition-colors">
                          <div className="bg-white p-4 rounded-full shadow-md mb-4 group-hover:-translate-y-1 transition-transform">
                            <FiImage className="text-4xl" />
                          </div>
                          <span className="font-normal text-base text-gray-700">Upload Cover Image</span>
                          <span className="font-normal text-[10px] uppercase tracking-wider text-hotpink-400 mt-1 bg-hotpink-100 px-2 py-0.5 rounded-full">Required</span>
                        </div>
                      )}
                      {images[0] && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                          <span className="text-white font-normal text-sm bg-black/50 px-6 py-3 rounded-full shadow-xl flex items-center gap-2"><FiUploadCloud className="text-lg"/> Change Cover</span>
                        </div>
                      )}
                    </label>

                    {/* Gallery Thumbnails (Index 1, 2, 3) */}
                    <div className="grid grid-cols-3 gap-4">
                      {[1, 2, 3].map((i) => (
                        <label key={i} className="group flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-2xl cursor-pointer hover:bg-hotpink-50/50 hover:border-hotpink-400 transition-all duration-300 relative overflow-hidden">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(i, e.target.files[0])}
                            className="hidden"
                          />
                          {images[i] ? (
                            <img src={URL.createObjectURL(images[i])} alt={`gallery-preview-${i}`} className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-gray-300 group-hover:text-hotpink-400 transition-colors">
                              <FiImage className="text-2xl mb-2" />
                              <span className="font-normal text-[9px] uppercase tracking-wider">Gallery {i}</span>
                            </div>
                          )}
                          {images[i] && (
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                              <span className="text-white font-normal text-[10px] bg-black/50 px-3 py-1.5 rounded-full">Edit</span>
                            </div>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sticky Footer Action */}
            <div className="mt-12 pt-6 border-t border-gray-100 flex justify-end">
              <button 
                type="submit" 
                className="bg-gradient-to-r from-hotpink-500 to-hotpink-600 text-white shadow-xl shadow-hotpink-500/30 text-lg font-normal px-10 py-4 rounded-2xl flex items-center justify-center gap-3 hover:shadow-2xl hover:-translate-y-1 transition-all w-full md:w-auto"
              >
                <FiUploadCloud className="text-2xl" /> Publish Product
              </button>
            </div>
          </form>
        </div>
      </motion.div>
      
      {/* Publishing Overlay */}
      <AnimatePresence>
        {isPublishing && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="bg-white px-10 py-8 rounded-[2rem] shadow-2xl flex flex-col items-center gap-6 border border-gray-100"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="w-20 h-20 border-4 border-gray-100 border-t-hotpink-500 rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center text-hotpink-500">
                  <FiUploadCloud className="text-2xl animate-pulse" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-normal text-gray-800">Publishing...</h3>
                <p className="text-sm text-gray-500 mt-1 font-normal">Preparing your product for the world.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      
    </div>
  );
};

// Reusable Tab Button for Progress Tracker
const TabButton = ({ active, onClick, icon, label, completed }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center justify-between px-4 py-4 rounded-2xl transition-all duration-300 font-normal text-sm ${
      active 
        ? 'bg-hotpink-50 text-hotpink-600 shadow-sm border border-hotpink-100' 
        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800 border border-transparent'
    }`}
  >
    <div className="flex items-center gap-3">
      <span className={`text-xl ${active ? 'text-hotpink-500' : (completed ? 'text-emerald-500' : 'text-gray-400')}`}>{icon}</span>
      {label}
    </div>
    {completed && !active && (
      <FiCheckCircle className="text-emerald-500 text-lg" />
    )}
  </button>
);

export default Upload;
