import {Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Categories from './components/Sub-Components/categories';
import Profile from './components/Sub-Components/Profile'; 
import Wishlist from './components/Sub-Components/wishlist';
import MyCart from './components/Sub-Components/MyCart'

function App() {
  return (
    <div className="font-sans">
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/Home' element={<Home />} />
         <Route path='/categories' element={<Categories />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/Wishlist" element={<Wishlist />} />
         <Route path="/MyCart" element={<MyCart />} />
         
      </Routes>
    </div>
  );
}

export default App;
