import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom'; 

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


const Navbar = ({ toggleCart }) => (
  <div className="flex items-center justify-between px-6 py-3 border-w shadow-md sticky top-0 bg-white z-50 font-josefin">
    <div className="flex items-center gap-3">
      <img src="https://thirumathikart.nitt.edu/assets/img/tklogo.png" alt="Logo" className="w-10 h-10" />
     <Link to="/Home" className="text-xl font-bold ">
   Thirumathi Kart
</Link>

    </div>
    <div className="flex items-center gap-4 cursor-pointer" onClick={toggleCart}>
      <span className="text-sm">🛒 My Cart</span>
    </div>
  </div>
);

const Categories = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(productData[0]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(productData[0].subCategories[0]);
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState(productData[0].subCategories[0].subSubCategories[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (itemName) => {
    const existingItem = cartItems.find(item => item.name === itemName);
    if (existingItem) {
      setCartItems(cartItems.map(item => item.name === itemName ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCartItems([...cartItems, { name: itemName, quantity: 1 }]);
    }
    setConfirmationMessage(`${itemName} added to cart!`);
    setTimeout(() => setConfirmationMessage(''), 2000);
  };

  const removeFromCart = (itemName) => {
    const updatedCart = cartItems
      .map(item => item.name === itemName ? { ...item, quantity: item.quantity - 1 } : item)
      .filter(item => item.quantity > 0);
    setCartItems(updatedCart);
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const filteredProducts = selectedSubCategory.subSubCategories.filter(product =>
    product.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white text-black font-josefin">
      <Navbar toggleCart={() => setShowCart(!showCart)} />

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

      <div className="flex">
        <aside className="w-64 bg-gray-100 border-w p-4 hidden sm:block sticky top-0 h-[calc(100vh-64px)] overflow-auto">
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
        <main className="flex-1 p-6">
          <header className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">
              {selectedCategory.category} - {selectedSubCategory.name} - {selectedSubSubCategory}
            </h1>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border px-4 py-2 rounded-md w-64"
            />
          </header>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((prod, index) => (
              <div key={index} className="border rounded-md p-4 shadow-sm">
                <h3 className="font-semibold text-lg mb-2">{prod}</h3>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => addToCart(prod)}
                  className="mt-2 px-4 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add to Cart
                </motion.button>
              </div>
            ))}
          </div>
        </main>

        {showCart && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-80 bg-white/70 backdrop-blur-lg border-0 shadow-2xl z-50 p-6 overflow-y-auto"
          >
            <h2 className="text-xl font-bold mb-4">🛒 My Cart</h2>
            {cartItems.length === 0 ? (
              <p className="text-gray-500">Your cart is empty.</p>
            ) : (
              <ul className="space-y-3">
                {cartItems.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.name)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {cartItems.length > 0 && (
              <div className="mt-6">
                <p className="font-bold text-lg">Total Items: {totalItems}</p>
              </div>
            )}
            <button
              onClick={() => setShowCart(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
            >✕</button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Categories;

