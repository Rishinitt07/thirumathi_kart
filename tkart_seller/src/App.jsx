import React from 'react'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import { BrowserRouter, Route,Routes } from 'react-router-dom'

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Dashboard/>}/>
        <Route path='/login' element={<Login/>}/>
      </Routes>
      


    </div>
  )
}

export default App
