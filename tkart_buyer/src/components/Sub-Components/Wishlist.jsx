import React, { useState } from 'react';
import { FaTrash, FaCartPlus } from 'react-icons/fa';

const initialWishlist = [
  { id: 1, name: 'Handcrafted Bowl', price: 399, rating: 4 },
  { id: 2, name: 'Organic Honey', price: 249, rating: 5 },
  { id: 3, name: 'Clay Water Jug', price: 499, rating: 4 },
  { id: 4, name: 'Bamboo Basket', price: 299, rating: 5 },
  { id: 5, name: 'Herbal Soap Set', price: 199, rating: 4 },
  { id: 6, name: 'Cotton Saree', price: 799, rating: 5 },
  { id: 7, name: 'Brass Diya Set', price: 599, rating: 4 },
  { id: 8, name: 'Jute Handbag', price: 349, rating: 4 },
  { id: 9, name: 'Millet Combo Pack', price: 699, rating: 5 },
  { id: 10, name: 'Terracotta Mug Set', price: 549, rating: 4 },
];

const Wishlist = () => {
  const [wishlist, setWishlist] = useState(initialWishlist);

  const handleRemove = (id) => {
    setWishlist(wishlist.filter(item => item.id !== id));
  };

  const handleAddToCart = (item) => {
    alert(`${item.name} added to cart!`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-josefin">
      {/* Header */}
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <a href="/home" className="flex items-center gap-2">
          <img
            src="https://thirumathikart.nitt.edu/assets/img/tklogo.png"
            alt="Thirumathi Kart Logo"
            className="w-10 h-10 object-contain"
          />
          <span className="text-xl font-bold text-gray-800">Thirumathi Kart</span>
        </a>
        <nav className="flex gap-6 text-sm text-gray-700">
          <a href="/home" className="hover:text-green-600">Home</a>
          <a href="/categories" className="hover:text-green-600">Categories</a>
          <a href="/cart" className="hover:text-green-600">🛒</a>
        </nav>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto p-6 w-full flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4 bg-white rounded-lg shadow p-4 space-y-6">
          <div className="text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
              alt="User Icon"
              className="w-16 h-16 mx-auto rounded-full mb-2"
            />
            <p className="text-gray-700">Hello, <strong>user</strong></p>
          </div>

          <div>
            <h3 className="text-sm font-bold mb-2 text-gray-800">MY ORDERS</h3>
            <button className="w-full text-left text-gray-600 hover:text-black">My Orders</button>
          </div>

          <div>
            <h3 className="text-sm font-bold mb-2 text-gray-800">ACCOUNT SETTINGS</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><a href="#" className="hover:underline">Profile Information</a></li>
              <li><a href="#" className="hover:underline">Manage Addresses</a></li>
              <li><a href="#" className="hover:underline">PAN Card Information</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold mb-2 text-gray-800">PAYMENTS</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><a href="#" className="hover:underline">Saved UPI</a></li>
              <li><a href="#" className="hover:underline">Saved Cards</a></li>
            </ul>
          </div>
        </aside>

        {/* Wishlist Section */}
        <section className="w-full lg:w-3/4">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Your Wishlist</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {wishlist.length === 0 ? (
              <p className="text-gray-500 col-span-full">Your wishlist is empty.</p>
            ) : (
              wishlist.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between">
                  <div>
                    <div className="w-full h-40 bg-gray-200 rounded mb-4 flex items-center justify-center text-4xl">
                      📦
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                    <p className="text-yellow-500 text-sm mt-1">
                      {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                    </p>
                    <p className="text-gray-700 font-medium mt-2">₹ {item.price}</p>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200"
                    >
                      <FaTrash /> Remove
                    </button>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded hover:bg-green-200"
                    >
                      <FaCartPlus /> Add Cart
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto text-center text-sm py-4 text-gray-500 border-t">
        Copyright © 2025 Thirumathi Kart. All Rights Reserved.
      </footer>
    </div>
  );
};

export default Wishlist;
