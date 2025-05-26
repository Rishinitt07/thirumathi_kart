import React from 'react'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import Register from './components/Register'
import { BrowserRouter, Route,Routes } from 'react-router-dom'

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
