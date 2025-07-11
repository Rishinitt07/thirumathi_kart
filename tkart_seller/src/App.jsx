import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';            // 💼 Seller Layout
import Dashboard from './components/Dashboard';      // Public Landing
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';                // Seller Home
import Upload from './components/Upload';            // Product Upload
import Orders from './components/Orders';            // Seller Orders
import Profile from './components/Profile';          // Seller Profile
import MyProducts from './components/MyProducts';    // Seller's own listings
import About from './components/About.jsx'

// 🔐 ProtectedRoute wrapper
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <div className="font-josefin">
      <Routes>
        {/* 🆓 Public Routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔐 Protected Routes inside Layout */}
        <Route element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route path="/home" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/myproducts" element={<MyProducts />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
        </Route>

        {/* 🌐 Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
