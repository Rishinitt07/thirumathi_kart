import React from 'react'
import Dashboard from './components/Dashboard'
import { BrowserRouter, Route,Routes } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Dashboard/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        
      </Routes>
     

    </div>
     
  )
}

export default App

