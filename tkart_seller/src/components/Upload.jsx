// File: Upload.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import tklogo from './tklogo.png';
import uploadIcon from './upload-icon.png'; // 70x70px icon
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const categoriesData = [/* Paste the large category JSON here */{
  category: 'Household',
  subCategories: [
    {
      name: 'Bedroom',
      subSubCategories: [
        'Bed', 'Pillow', 'Blanket', 'Wardrobe', 'Mirror', 'Curtains', 'Table lamp', 'Alarm clock'
      ]
    },
    {
      name: 'Living Room',
      subSubCategories: [
        'Curtains', 'Wall clock', 'Books/Magazines'
      ]
    },
    {
      name: 'Bathroom',
      subSubCategories: [
        'Bucket', 'Mug', 'Towel', 'Toothbrush', 'Soap', 'Mirror', 'Comb', 'Cleaning tools'
      ]
    },
    {
      name: 'Cleaning Supplies',
      subSubCategories: [
        'Broom', 'Mop', 'Dustpan', 'Detergent', 'Cloths', 'Garbage bags', 'Disinfectant'
      ]
    },
    {
      name: 'Electrical & Misc',
      subSubCategories: [
        'Bulbs', 'Charger', 'Power bank', 'Extension cords', 'Iron box', 'Batteries', 'Torch'
      ]
    }
  ]
},
{
  category: 'Fashion',
  subCategories: [
    {
      name: 'Clothing',
      subSubCategories: [
        'Tops', 'Kurtis', 'Dresses', 'Jeans', 'Sarees', 'Nightwear', 'Kids wear', 'Men’s wear'
      ]
    },
    {
      name: 'Accessories',
      subSubCategories: [
        'Bags', 'Wallets', 'Sunglasses', 'Belts', 'Hats', 'Scarves', 'Socks'
      ]
    },
    {
      name: 'Footwear',
      subSubCategories: [
        'Sandals', 'Heels', 'Sneakers', 'Traditional footwear', 'Kids’ shoes'
      ]
    },
    {
      name: 'Materials',
      subSubCategories: [
        'Fabric', 'Sewing kits', 'Beads', 'Laces', 'Zips'
      ]
    }
  ]
},
{
  category: 'Kitchen',
  subCategories: [
    {
      name: 'Cooking Appliances',
      subSubCategories: [
        'Stove', 'Induction cooktop', 'Mixer', 'Rice cooker', 'Pressure cooker'
      ]
    },
    {
      name: 'Cookware',
      subSubCategories: [
        'Frying pan', 'Kadai', 'Tawa', 'Pressure cooker'
      ]
    },
    {
      name: 'Utensils & Cutlery',
      subSubCategories: [
        'Plates', 'Bowls', 'Spoons', 'Forks', 'Knives', 'Tongs', 'Ladles', 'Trays'
      ]
    },
    {
      name: 'Storage Containers',
      subSubCategories: [
        'Spice jars', 'Oil cans', 'Grain boxes', 'Lunch boxes', 'Water bottles'
      ]
    },
    {
      name: 'Cleaning',
      subSubCategories: [
        'Dish soap', 'Sponge', 'Rack', 'Bin', 'Towels', 'Gloves', 'Mop'
      ]
    },
    {
      name: 'Food Basics',
      subSubCategories: [
        'Rice', 'Wheat', 'Pulses', 'Oil', 'Spices', 'Salt', 'Sugar', 'Tea/Coffee'
      ]
    },
    {
      name: 'Prep Tools',
      subSubCategories: [
        'Measuring cups', 'Chopping board', 'Knives', 'Peeler', 'Grater', 'Whisk'
      ]
    }
  ]
},
{
  category: 'Cosmetics',
  subCategories: [
    {
      name: 'Makeup',
      subSubCategories: ['Lipstick', 'Eyeliner', 'Mascara', 'Foundation', 'Blush', 'Removers', 'Brushes']
    },
    {
      name: 'Skincare',
      subSubCategories: ['Face wash', 'Scrub', 'Moisturizer', 'Serum', 'Sunscreen', 'Masks', 'Toner']
    },
    {
      name: 'Haircare',
      subSubCategories: ['Hair oil', 'Shampoo', 'Conditioner', 'Serum', 'Masks']
    },
    {
      name: 'Bodycare',
      subSubCategories: ['Lotion', 'Soaps', 'Body wash', 'Scrubs', 'Deodorants']
    },
    {
      name: 'Nailcare',
      subSubCategories: ['Nail polish', 'Removers', 'Art kits', 'Cuticle oil']
    }
  ]
},
{
  category: 'Organics',
  subCategories: [
    {
      name: 'Skincare & Beauty',
      subSubCategories: ['Herbal packs', 'Organic soaps', 'Aloe gel', 'Rose water', 'Hair oils']
    },
    {
      name: 'Organic Food',
      subSubCategories: ['Cold-pressed oils', 'Raw honey', 'Ghee', 'Jaggery', 'Millets', 'Pulses', 'Spices']
    },
    {
      name: 'Wellness',
      subSubCategories: ['Ayurvedic powders', 'Herbal juices', 'Detox mixes', 'Bath salts']
    },
    {
      name: 'Home & Personal',
      subSubCategories: ['Natural cleaners', 'Eco pads', 'Bamboo brushes', 'Repellents']
    },
    {
      name: 'Gardening',
      subSubCategories: ['Organic fertilizers', 'Seeds', 'Bio-pesticides']
    },
    {
      name: 'Eco Products',
      subSubCategories: ['Cloth bags', 'Clay utensils', 'Bamboo goods', 'Organic clothing']
    }
  ]
},
{
  category: 'Handcrafts',
  subCategories: [
    {
      name: 'Home Decor',
      subSubCategories: ['Wall art', 'Candles', 'Lamps', 'Dreamcatchers', 'Planters']
    },
    {
      name: 'Fashion Accessories',
      subSubCategories: ['Handmade jewelry', 'Bags', 'Scarves', 'Keychains']
    },
    {
      name: 'Traditional Crafts',
      subSubCategories: ['Terracotta', 'Wooden toys', 'Bamboo items', 'Jute products']
    },
    {
      name: 'Fabric Crafts',
      subSubCategories: ['Printed fabrics', 'Embroidered items', 'Quilts', 'Knitted goods']
    },
    {
      name: 'Gifts & Stationery',
      subSubCategories: ['Cards', 'Notebooks', 'Soap sets', 'Resin gifts', 'Magnets']
    },
    {
      name: 'Kids & DIY',
      subSubCategories: ['Toys', 'Craft kits', 'Coloring books']
    },
    {
      name: 'Kitchen Items',
      subSubCategories: ['Clay cups', 'Wooden boards', 'Coasters', 'Painted bowls']
    }
  ]
},
{
  category: 'Groceries',
  subCategories: [
    {
      name: 'Grains & Staples',
      subSubCategories: ['Rice', 'Wheat', 'Millets', 'Poha', 'Dalia']
    },
    {
      name: 'Pulses',
      subSubCategories: ['Toor', 'Moong', 'Urad', 'Chana', 'Masoor', 'Rajma', 'Chole']
    },
    {
      name: 'Oils & Ghee',
      subSubCategories: ['Sunflower', 'Mustard', 'Coconut', 'Ghee']
    },
    {
      name: 'Spices',
      subSubCategories: ['Turmeric', 'Chili', 'Garam masala', 'Jeera', 'Whole spices']
    },
    {
      name: 'Sweeteners',
      subSubCategories: ['Sugar', 'Jaggery', 'Honey']
    },
    {
      name: 'Beverages',
      subSubCategories: ['Tea', 'Coffee', 'Health drinks']
    },
    {
      name: 'Snacks',
      subSubCategories: ['Biscuits', 'Chips', 'Dry fruits', 'Seeds']
    },
    {
      name: 'Essentials',
      subSubCategories: ['Detergents', 'Cleaners', 'Soaps', 'Toiletries']
    },
    {
      name: 'Vegetables',
      subSubCategories: ['Onion', 'Potato', 'Tomato', 'Garlic', 'Greens']
    }
  ]
},
{
  category: 'Jewellery',
  subCategories: [
    {
      name: 'Earrings',
      subSubCategories: ['Studs', 'Hoops', 'Jhumkas', 'Danglers', 'Terracotta', 'Resin']
    },
    {
      name: 'Necklaces',
      subSubCategories: ['Chains', 'Pendants', 'Beaded', 'Chokers', 'Layered']
    },
    {
      name: 'Rings',
      subSubCategories: ['Bands', 'Stone rings', 'Adjustable', 'Handmade']
    },
    {
      name: 'Bracelets/Bangles',
      subSubCategories: ['Glass', 'Metal', 'Thread', 'Cuff', 'Kada']
    },
    {
      name: 'Anklets',
      subSubCategories: ['Silver', 'Beaded', 'Chain']
    },
    {
      name: 'Nose Jewelry',
      subSubCategories: ['Nose pins', 'Rings', 'Nath']
    },
    {
      name: 'Hair/Head Jewelry',
      subSubCategories: ['Maang tikka', 'Clips', 'Hairbands', 'Juda pins']
    },
    {
      name: 'Other Accessories',
      subSubCategories: ['Waist belts', 'Brooches', 'Toe rings', 'Armlets']
    },
    {
      name: 'Eco-Friendly',
      subSubCategories: ['Terracotta', 'Fabric', 'Wooden', 'Crochet', 'Quilling']
    }
  ]
},
{
  category: 'Stationery',
  subCategories: [
    {
      name: 'Writing Tools',
      subSubCategories: ['Pens', 'Pencils', 'Markers', 'Highlighters', 'Erasers', 'Sharpeners']
    },
    {
      name: 'Paper Products',
      subSubCategories: ['Notebooks', 'Diaries', 'Sticky notes', 'Drawing books']
    },
    {
      name: 'Office Supplies',
      subSubCategories: ['Files', 'Clips', 'Staplers', 'Scissors', 'Glue', 'Tape']
    },
    {
      name: 'Art Supplies',
      subSubCategories: ['Crayons', 'Paints', 'Brushes', 'Colour pencils']
    },
    {
      name: 'Math Tools',
      subSubCategories: ['Geometry box', 'Calculator', 'Graph rulers']
    },
    {
      name: 'Misc',
      subSubCategories: ['ID holders', 'Whiteboards', 'Chalk', 'Packaging material']
    }
  ]
}
];

const SidebarItem = ({ to, label }) => {
  const [hover, setHover] = useState(false);
  return (
    <Link
      to={to}
      style={{ ...styles.menuItem, backgroundColor: hover ? '#ABD1F3' : 'transparent' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {label}
    </Link>
  );
};

const Sidebar = ({ isOpen, closeSidebar }) => (
  <>
    <div style={{ ...styles.sidebar, left: isOpen ? 0 : '-200px' }}>
      <SidebarItem to="/home" label="Home" />
      <SidebarItem to="/upload" label="Add Product" />
      <SidebarItem to="/myproducts" label="My Product" />
      <SidebarItem to="/orders" label="Orders" />
      <SidebarItem to="/profile" label="Profile" />
    </div>
    {isOpen && window.innerWidth <= 768 && (
      <div style={styles.overlay} onClick={closeSidebar}></div>
    )}
  </>
);

const Navbar = ({ toggleSidebar }) => (
  <div style={styles.navbar}>
    <div style={styles.logoContainer}>
      <img
        src="https://cdn-icons-png.flaticon.com/128/3917/3917065.png"
        alt="Menu"
        onClick={toggleSidebar}
        style={styles.menuIconLeft}
      />
      <img src={tklogo} alt="Logo" style={styles.logo} />
      <span style={styles.logoText}>Thirumathi Kart</span>
    </div>
    <div style={styles.rightMenu}>
      <span style={styles.adminText}>Hi! Admin</span>
    </div>
  </div>
);


const Upload = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [images, setImages] = useState([null, null, null, null]);

  useEffect(() => {
    return () => {
      images.forEach(img => {
        if (img) URL.revokeObjectURL(img);
      });
    };
  }, [images]);
  
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    subcategory: '',
    inner_subcategory: '',
    quantity: '',
    price: '',
  });

  const [subCategories, setSubCategories] = useState([]);
  const [innerCategories, setInnerCategories] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const selected = categoriesData.find(c => c.category === form.category);
    setSubCategories(selected ? selected.subCategories : []);
    setForm(prev => ({ ...prev, subcategory: '', innercategory: '' }));
  }, [form.category]);

  useEffect(() => {
    const selected = subCategories.find(s => s.name === form.subcategory);
    setInnerCategories(selected ? selected.subSubCategories : []);
    setForm(prev => ({ ...prev, innercategory: '' }));
  }, [form.subcategory]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (index, file) => {
    const updated = [...images];
    updated[index] = file;
    setImages(updated);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    images.forEach((img, i) => img && formData.append(`image${i + 1}`, img));
  
    try {
      await axios.post('http://localhost:8080/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
      });
  
      //alert('Product uploaded successfully!');
      toast.success('Product uploaded successfully!');

      setForm({
        name: '',
        description: '',
        category: '',
        subcategory: '',
        inner_subcategory: '',
        quantity: '',
        price: '',
      });
      setImages([null, null, null, null]);
  
    } catch (err) {
      console.error(err);
      toast.error('Upload failed');
    }
  };
  
  const isDesktop = window.innerWidth > 768;

  return (
    <div style={styles.container}>
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div style={styles.bodyWrapper}>
        <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
        <div style={{ ...styles.contentArea, marginLeft: isDesktop && sidebarOpen ? '200px' : '0' }}>
          <form onSubmit={handleSubmit} style={styles.form}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Upload Product</h2>

            <div style={styles.horizontalGroup}>
              {images.map((img, i) => (
                <label key={i} style={styles.uploadBox}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleImageChange(i, e.target.files[0])}
                    style={{ display: 'none' }}
                  />
                  <img
                    src={img ? URL.createObjectURL(img) : uploadIcon}
                    alt={`Image ${i + 1}`}
                    style={styles.uploadIcon}
                  />
                  <span style={styles.imageLabel}>Image {i + 1}</span>
                </label>
              ))}
            </div>

            <div style={styles.horizontalGroup}>
              <input
                name="name"
                placeholder="Product Name"
                value={form.name}
                onChange={handleChange}
                style={styles.input}
                required
              />
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                style={styles.input}
                required
              >
                <option value="">Select Category</option>
                {categoriesData.map((cat, idx) => (
                  <option key={idx} value={cat.category}>
                    {cat.category}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.horizontalGroup}>
              <select
                name="subcategory"
                value={form.subcategory}
                onChange={handleChange}
                style={styles.input}
                required
              >
                <option value="">Select Subcategory</option>
                {subCategories.map((sub, idx) => (
                  <option key={idx} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
              </select>
              <select
                name="inner_subcategory"
                value={form.inner_subcategory}
                onChange={handleChange}
                style={styles.input}
                required
              >
                <option value="">Select Inner Category</option>
                {innerCategories.map((inner, idx) => (
                  <option key={idx} value={inner}>
                    {inner}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.horizontalGroup}>
              <input
                name="quantity"
                type="number"
                placeholder="Quantity"
                value={form.quantity}
                onChange={handleChange}
                style={styles.input}
                required
              />
              <input
                name="price"
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.horizontalGroup}>
              <input
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <button type="submit" style={styles.button}>
              Submit
            </button>
          </form>
          <ToastContainer position="top-right" autoClose={3000}/>
        </div>
      </div>
    </div>
  );
};


const styles = {
  container: { minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f7fafc' },
  navbar: {
    borderBottom: '1px solid lightgray',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    position: 'sticky',
    top: 0,
    zIndex: 1001,
    background: 'white',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  
  menuIconLeft: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    filter: 'grayscale(100%)',
    marginRight: '10px',
  },
  logo: { width: '40px', height: '40px' },
  logoText: { fontSize: '22px', fontWeight: 'bold', color: 'black', fontFamily: "'Josefin Sans', sans-serif" },
  rightMenu: { display: 'flex', alignItems: 'center', gap: '15px' },
  adminText: { fontSize: '14px', color: 'black', fontWeight: '500', fontFamily: "'Josefin Sans', sans-serif" },
  menuIcon: { width: '20px', height: '20px', cursor: 'pointer', filter: 'grayscale(100%)' },
  bodyWrapper: { display: 'flex', flex: 1 },
  sidebar: {
    position: 'fixed',
    top: '93px',
    bottom: '100px',
    left: 0,
    width: '200px',
    height: '85%',
    backgroundColor: 'white',
    borderRight: '1px solid lightgray',
    borderTop: '1px solid lightgray',
    borderBottom: '1px solid lightgray',
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '20px',
    zIndex: 1000,
    transition: 'left 0.3s ease',
    borderRadius: '20px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },
  menuItem: {
    fontFamily: "'Josefin Sans', sans-serif",
    padding: '12px 20px',
    textDecoration: 'none',
    color: '#333',
    fontWeight: '500',
    transition: 'background 0.3s ease',
    borderRadius: '4px',
  },
  contentArea: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    transition: 'margin-left 0.3s ease',
    backgroundColor: '#f7fafc',
  },
  form: {
    fontFamily: "'Josefin Sans', sans-serif",
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '20px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    maxWidth: '900px',
    width: '100%',
    border: '1px solid lightgray',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    flex: 1,
  },
  horizontalGroup: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  uploadBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '80px',
    cursor: 'pointer',
  },
  uploadIcon: {
    width: '70px',
    height: '70px',
    objectFit: 'cover',
    borderRadius: '5px',
    border: '1px dashed #ccc',
  },
  imageLabel: {
    fontSize: '12px',
    marginTop: '5px',
    color: '#555',
  },
  button: {
    color: '#fff',
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: ' #3170DE',
  },
  overlay: {
    position: 'fixed',
    top: '60px',
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 900,
  },
};

export default Upload;
