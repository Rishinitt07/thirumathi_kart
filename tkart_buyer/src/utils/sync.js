import axios from 'axios';

const API_URL = 'http://localhost:8081';

export const syncCartToDB = async (cart) => {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    await axios.put(`${API_URL}/cart`, { items: cart }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (error) {
    console.error('Failed to sync cart:', error);
  }
};

export const syncWishlistToDB = async (wishlist) => {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    await axios.put(`${API_URL}/wishlist`, { items: wishlist }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (error) {
    console.error('Failed to sync wishlist:', error);
  }
};

export const fetchInitialData = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const res = await axios.get(`${API_URL}/sync`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (res.data) {
      if (res.data.cart) localStorage.setItem('cart', JSON.stringify(res.data.cart));
      if (res.data.wishlist) localStorage.setItem('wishlist', JSON.stringify(res.data.wishlist));
      window.dispatchEvent(new Event('storage'));
    }
  } catch (error) {
    console.error('Failed to fetch initial sync data:', error);
  }
};
