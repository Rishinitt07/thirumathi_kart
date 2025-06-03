// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Home = () => {
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem('token');

//     if (!token) {
//       navigate('/login');
//       return;
//     }

//     axios.get('http://localhost:8080/dashboard', {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//     .then(res => {
//       setMessage(res.data);
//     })
//     .catch(err => {
//       console.error('Access denied', err);
//       localStorage.removeItem('token');
//       navigate('/login');
//     });
//   }, [navigate]);

//   return (
//     <div className='text-white h-screen flex justify-center items-center bg-green-900'>
//       <div className='text-center'>
//         <h1 className='text-4xl font-bold'>Welcome to the Home Page 🎉</h1>
//         <p className='mt-4'>{message}</p>
//       </div>
//     </div>
//   );
// };

// export default Home;




import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

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
    <div className="text-white min-h-screen bg-green-900">
   
      <nav className="bg-green-800 p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">Thirumathi Kart</h1>
        <ul className="flex gap-6 text-lg">
          <li><Link to="/home" className="hover:underline">Home</Link></li>
          <li><Link to="/upload" className="hover:underline">Upload Products</Link></li>
          <li><Link to="/orders" className="hover:underline">Orders</Link></li>
          <li><Link to="/profile" className="hover:underline">Profile</Link></li>
        </ul>
      </nav>

     
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Welcome to the Home Page 🎉</h2>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Home;

