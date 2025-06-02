import React from 'react'
import Dashboard from './components/Dashboard'
import { BrowserRouter, Route,Routes } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Home from './components/Home'

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Dashboard/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
         <Route path='/home' element={<Home/>}/>
        
      </Routes>
     

    </div>
     
  )
}

export default App

