// Upload.jsx
import React, { useState } from 'react';
import axios from 'axios';

const Upload = () => {
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('description', description);
    formData.append('price', price);
    formData.append('quantity', quantity);
    formData.append('image', image);

    try {
      await axios.post('http://localhost:8080/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Product uploaded successfully!');
    } catch (error) {
      console.error(error);
      alert('Upload failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md space-y-4">
        <h2 className="text-2xl font-bold">Upload Product</h2>
        <input type="file" onChange={e => setImage(e.target.files[0])} required />
        <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="border p-2 w-full" required />
        <input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} className="border p-2 w-full" required />
        <input type="number" placeholder="Quantity" value={quantity} onChange={e => setQuantity(e.target.value)} className="border p-2 w-full" required />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Upload</button>
      </form>
    </div>
  );
};

export default Upload;

