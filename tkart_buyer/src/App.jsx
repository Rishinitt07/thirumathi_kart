import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Categories from './components/Sub-Components/categories.jsx';
import Profile from './components/Sub-Components/Profile';
import Wishlist from './components/Sub-Components/Wishlist';
import Cart from './components/Sub-Components/Cart';
import Orders from './components/Sub-Components/Orders';

function App() {
  return (
    <div className="font-sans">
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/home' element={<Home />} />
        <Route path='/categories' element={<Categories />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </div>
  );
}

export default App;
