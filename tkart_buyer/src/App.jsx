import {Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Categories from './components/categories';

function App() {
  return (
    
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/login' element={<Login />} />
         <Route path='/categories' element={<Categories />} />
        <Route path='/register' element={<Register />} />
        <Route path='/Home' element={<Home />} />
      </Routes>
      
  );
}
export default App;
