import React from 'react'
import { Link } from 'react-router-dom'
import {BiUser} from "react-icons/bi"
import {AiOutlineLock} from "react-icons/ai"
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Bounce, Flip, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {

  const [name,Setname] = useState()
  const [user,Setuser] = useState()
  const [pass,Setpass] = useState()
  const navigate = useNavigate()










  const show =()=>{
    toast.warning('Enter the Username ', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
      });

  }
  const show1 = ()=>{
    toast.warning('Enter the Password ', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
      });

  }
  const show2 = ()=>{
    toast.warning('Enter your Name ', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
      });

  }










  const handleSubmit = (e)=>{
    e.preventDefault()
    if(!name){
      // alert("enter  name")
      show2()
    }else if(!user){
      // alert("enter user name")
      show()
    }else if(!pass){
      // alert("enter password")
      show1()
    }else{
      axios.post('http://localhost:3001/info',{name,user,pass})
    .then(result => {console.log(result)
      navigate('/login')
    })
    .catch(err => console.log(err))

    }







      


    }

  return (
    <div className='text-white h-[100vh] w-[100%]  flex justify-center items-center bg-cover  ' style={{"backgroundImage":"url('../src/assets/bluee.jpg')"}}>
      <div className='w-full h-screen backdrop-filter backdrop-blur-xl flex justify-center items-center '>
      <div className='bg-transparent border border-slate-400 rounded-xl p-8 shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-20 relative'>
        <h1 className='text-4xl text-white font-bold text-center mb-8 '>Register</h1>
        <form onSubmit={handleSubmit}>
        <div className='relative my-4'>

            <input type='text' className='block w-72 mb-7 py-2.3 px-0 text-l text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer' placeholder=''  onChange={(e)=>Setname(e.target.value)}/>
            <label htmlFor='' className='absolute text-l text-white duration-300 transform -translate-y-8 scale-75 top-3 z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-8 ' >Name</label>
            <BiUser className='absolute right-8 top-1'/>
            
        </div>
        <div className='relative my-4'>
            <input type='text' className='block w-72 py-2.3 px-0 mb-6 text-l text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer' placeholder='' onChange={(e)=>Setuser(e.target.value)}/>
            <label htmlFor='' className='absolute text-l text-white duration-300 transform -translate-y-8 scale-75 top-3 z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-8  '>New username</label>
            {/* <AiOutlineLock className='absolute right-6 top-1'/> */}
            <BiUser className='absolute right-8 top-1'/>
        </div>
        <div className='relative my-4'>
            <input type='password' className='block w-72 py-2.3 px-0  text-l text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer' placeholder='' onChange={(e)=>Setpass(e.target.value)}/>
            <label htmlFor='' className='absolute text-l text-white duration-300 transform -translate-y-8 scale-75 top-3 z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-8  '>New Password</label>
            <AiOutlineLock className='absolute right-8 top-1'/>
        </div>
        <div className='flex justify-between items-center'>
        </div>
        <button type='submit' className='w-full mb-4 mt-3 text-[20px] rounded-full bg-white h-10 text-blue-950 hover:bg-emerald-500 hover:text-white py-1 transition-colors duration-300'>Register</button>  
        <div>
          <span className='m-9'>Already have an Account? <Link to="/login" className='text-blue-950'> Login</Link></span>
        </div>
        
        
        
        
        

        </form>
        
        
        
      </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"/>
      
    </div>
   
  )
}

export default Register
