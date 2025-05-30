import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    axios.get('http://localhost:8080/dashboard', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => {
      setMessage(res.data);
    })
    .catch(err => {
      console.error('Access denied', err);
      localStorage.removeItem('token');
      navigate('/login');
    });
  }, [navigate]);

  return (
    <div className='text-white h-screen flex justify-center items-center bg-green-900'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold'>Welcome to the Home Page 🎉</h1>
        <p className='mt-4'>{message}</p>
      </div>
    </div>
  );
};

export default Home;

