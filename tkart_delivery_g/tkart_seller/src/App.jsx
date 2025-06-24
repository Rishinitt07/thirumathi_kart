import React from 'react'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import Register from './components/Register'
import Home from './components/Home'
import Upload from './components/Upload'
import Orders from './components/Orders'     
import Profile from './components/Profile'
import MyProducts from './components/MyProducts'          
   
import { BrowserRouter, Route,Routes } from 'react-router-dom'

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Dashboard/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
         <Route path='/home' element={<Home/>}/>
         <Route path='/upload' element={<Upload/>}/>
         <Route path='/myproducts' element={<MyProducts/>}/>
         <Route path='/orders' element={<Orders/>}/>
         <Route path='/profile' element={<Profile/>}/>

       

        
      </Routes>
      


    </div>
  )
}

export default App
