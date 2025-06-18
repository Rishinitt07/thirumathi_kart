import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const productData = [
  {
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


// Reusable Sidebar Component
const SidebarItem = ({ to, label, icon }) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-5 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
  >
    <span className="text-lg">{icon}</span>
    <span className="font-medium">{label}</span>
  </Link>
);

const Sidebar = ({ isOpen, closeSidebar }) => (
  <>
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transition-all duration-300 z-40 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="h-16 flex items-center px-6 border-b">
        <h2 className="text-xl font-bold">Menu</h2>
      </div>
      <div className="p-4 space-y-2 mt-4">
        <SidebarItem to="/home" label="Home" icon="🏠" />
        <SidebarItem to="/categories" label="Categories" icon="🗂️" />
        <SidebarItem to="/cart" label="My Cart" icon="🛒" />
        <SidebarItem to="/orders" label="My Orders" icon="📦" />
        <SidebarItem to="/wishlist" label="Wishlist" icon="❤️" />
        <SidebarItem to="/profile" label="Profile" icon="👤" />
      </div>
    </div>
    {isOpen && (
      <div
        onClick={closeSidebar}
        className="fixed inset-0 bg-transparent bg-opacity-50 z-30 md:hidden"
      />
    )}
  </>
);

// Enhanced Navbar Component
const Navbar = ({ toggleSidebar }) => (
  <header className="sticky top-0 z-30 bg-white shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="mr-4 text-gray-500 hover:text-gray-600 md:hidden"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link to="/home" className="flex items-center">
            <img
              src="https://thirumathikart.nitt.edu/assets/img/tklogo.png"
              alt="Logo"
              className="h-8 w-8"
            />
            <span className="ml-2 text-xl font-bold text-gray-800">Thirumathi Kart</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600 hidden sm:inline">Hi! Buyer</span>
          <Link to="/cart" className="p-1 text-gray-500 hover:text-gray-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  </header>
);


// Main component
const Categories = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(productData[0]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(productData[0].subCategories[0]);
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState(productData[0].subCategories[0].subSubCategories[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    const existing = cartItems.find(i => i.name === item.name);
    const updatedCart = existing
      ? cartItems.map(i => i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i)
      : [...cartItems, { ...item, quantity: 1 }];

    setCartItems(updatedCart);
    setConfirmationMessage(`${item.name} added to cart!`);
    setTimeout(() => setConfirmationMessage(''), 2000);
  };
  useEffect(() => {
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      setWishlistItems(JSON.parse(storedWishlist));
    }
  }, []);

  const addToWishlist = (item) => {
    const exists = wishlistItems.find(w => w.name === item.name);
    if (!exists) {
      const updated = [...wishlistItems, item];
      setWishlistItems(updated);
      localStorage.setItem('wishlist', JSON.stringify(updated));
      toast.success(`❤️ ${item.name} added to wishlist!`);
    } else {
      toast.info(`${item.name} is already in wishlist`);
    }
  };



  const filteredProducts = selectedSubCategory.subSubCategories.filter(product =>
    product.toLowerCase().includes(searchQuery.toLowerCase())
  );


 return (
  <div className="min-h-screen bg-white text-black font-josefin flex flex-col">
    {/* Full-width Navbar */}
    <div className="w-full">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
    </div>

    <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />

    <AnimatePresence>
      {confirmationMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded shadow-lg z-50"
        >
          {confirmationMessage}
        </motion.div>
      )}
    </AnimatePresence>

    <div className="flex flex-1">
      {/* Desktop Sidebar - Fixed width and sticky */}
      <aside className="w-64 bg-gray-100 border-r p-4 hidden sm:block sticky top-0 h-[calc(100vh-64px)] overflow-auto">
        <h2 className="text-xl font-bold mb-4">Categories</h2>
        <ul>
          {productData.map((cat, i) => (
            <li key={i} className="mb-3">
              <button
                className={`w-full text-left font-semibold ${selectedCategory.category === cat.category ? 'text-blue-600' : 'hover:text-blue-400'}`}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedSubCategory(cat.subCategories[0]);
                  setSelectedSubSubCategory(cat.subCategories[0].subSubCategories[0]);
                  setSearchQuery('');
                }}
              >
                {cat.category}
              </button>
              {selectedCategory.category === cat.category && (
                <ul className="ml-4 mt-2">
                  {cat.subCategories.map((sub, j) => (
                    <li key={j} className="mb-1">
                      <button
                        className={`text-sm ${selectedSubCategory.name === sub.name ? 'text-blue-500 font-semibold' : 'text-gray-700 hover:text-blue-400'}`}
                        onClick={() => {
                          setSelectedSubCategory(sub);
                          setSelectedSubSubCategory(sub.subSubCategories[0]);
                          setSearchQuery('');
                        }}
                      >
                        {sub.name}
                      </button>
                      {selectedSubCategory.name === sub.name && (
                        <ul className="ml-4 mt-1">
                          {sub.subSubCategories.map((prod, k) => (
                            <li key={k}>
                              <button
                                className={`text-xs ${selectedSubSubCategory === prod ? 'text-blue-400 font-medium' : 'text-gray-600 hover:text-blue-400'}`}
                                onClick={() => setSelectedSubSubCategory(prod)}
                              >
                                {prod}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-x-hidden">
        {/* Mobile Category Button */}
        <div className="sm:hidden mb-4 text-right">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded"
          >
            Browse Categories
          </button>
        </div>

        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl font-bold">
            {selectedCategory.category} - {selectedSubCategory.name} - {selectedSubSubCategory}
          </h1>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border px-4 py-2 rounded-md w-full sm:w-64"
          />
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((prod, index) => (
            <div key={index} className="border rounded-md p-4 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg mb-2">{prod}</h3>

              <div className="flex flex-wrap gap-2 mt-3">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    addToCart({ id: index, name: prod, price: 299, image: 'https://via.placeholder.com/64' })
                  }
                  className="px-4 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 flex-1 min-w-[120px]"
                >
                  Add to Cart
                </motion.button>

                <button
                  onClick={() =>
                    addToWishlist({ id: index, name: prod, price: 299, image: 'https://via.placeholder.com/64' })

                  }
                  className="px-4 py-1 text-sm bg-pink-500 text-white rounded hover:bg-pink-600 flex-1 min-w-[120px]"
                >
                  Add to Wishlist
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>

    {/* Mobile Category Modal */}
    {showCategoryModal && (
      <div className="fixed inset-0 z-50 flex justify-center items-start pt-20 bg-grey bg-opacity-0 sm:hidden">
        <div className="bg-white w-11/12 max-w-sm p-4 rounded-lg shadow-lg overflow-auto max-h-[80vh]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Categories</h2>
            <button onClick={() => setShowCategoryModal(false)} className="text-gray-500 text-xl">✖</button>
          </div>
          <ul>
            {productData.map((cat, i) => (
              <li key={i} className="mb-3">
                <button
                  className={`w-full text-left font-semibold ${selectedCategory.category === cat.category ? 'text-blue-600' : 'hover:text-blue-400'}`}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSelectedSubCategory(cat.subCategories[0]);
                    setSelectedSubSubCategory(cat.subCategories[0].subSubCategories[0]);
                    setSearchQuery('');
                    setShowCategoryModal(false);
                  }}
                >
                  {cat.category}
                </button>
                {selectedCategory.category === cat.category && (
                  <ul className="ml-4 mt-2">
                    {cat.subCategories.map((sub, j) => (
                      <li key={j} className="mb-1">
                        <button
                          className={`text-sm ${selectedSubCategory.name === sub.name ? 'text-blue-500 font-semibold' : 'text-gray-700 hover:text-blue-400'}`}
                          onClick={() => {
                            setSelectedSubCategory(sub);
                            setSelectedSubSubCategory(sub.subSubCategories[0]);
                            setSearchQuery('');
                            setShowCategoryModal(false);
                          }}
                        >
                          {sub.name}
                        </button>
                        {selectedSubCategory.name === sub.name && (
                          <ul className="ml-4 mt-1">
                            {sub.subSubCategories.map((prod, k) => (
                              <li key={k}>
                                <button
                                  className={`text-xs ${selectedSubSubCategory === prod ? 'text-blue-400 font-medium' : 'text-gray-600 hover:text-blue-400'}`}
                                  onClick={() => {
                                    setSelectedSubSubCategory(prod);
                                    setShowCategoryModal(false);
                                  }}
                                >
                                  {prod}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )}

    <footer className="mt-auto text-center text-sm py-3 text-gray-500 border-t">
      Copyright © 2025 Thirumathi Kart. All Rights Reserved.
    </footer>
    
    <ToastContainer position="top-center" autoClose={2000} />
  </div>
  );
}

export default Categories;
