import {Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Categories from './components/categories';
import Profile from './components/Profile'; 
import Wishlist from './components/wishlist';
import MyCart from './components/MyCart'

function App() {
  return (
    <div className="font-sans">
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/login' element={<Login />} />
        <Route path='/categories' element={<Categories />} />
        <Route path='/register' element={<Register />} />
        <Route path='/Home' element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/Wishlist" element={<Wishlist />} />
         <Route path="/MyCart" element={<MyCart />} />
      </Routes>
    </div>
  );
}

export default App;
