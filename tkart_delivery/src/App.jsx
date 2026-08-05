import { Routes, Route, Navigate } from 'react-router-dom';


import Login from './login';
import Register from './register';
import Dashboard from './dashboard';
import Notifications from './Notifications';
import ActiveDelivery from './ActiveDelivery';

import Layout from './components/Layout';
import Profile from './components/Profile';
import Landing from './Landing';




// Protected Route component
const Bounce = null;
const toast = {
  success: (msg) => console.log(msg),
  error: (msg) => console.log(msg),
  info: (msg) => console.log(msg),
  warn: (msg) => console.log(msg)
};

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes wrapped in Layout */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/active-delivery" element={<ActiveDelivery />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
      
    </div>
  );
}

export default App;
