import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    axios
      .get('http://localhost:8080/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .catch(err => {
        console.error('Access denied', err);
        localStorage.removeItem('token');
        navigate('/login');
      });
  }, [navigate]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-pink-600 mb-4">Welcome to Thirumathi Kart</h1>
      <p className="text-gray-700 text-lg">
        This is your home page. Use the sidebar to explore more features!
      </p>
    </div>
  );
};

export default Home;
