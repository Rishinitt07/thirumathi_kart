
// import React from 'react';
// import { Link } from 'react-router-dom';
// import { BiUser } from "react-icons/bi";
// import { AiOutlineLock } from "react-icons/ai";
// import { useNavigate,redirect } from 'react-router-dom';
// import axios from 'axios';
// import { useState } from 'react';
// import { Bounce, ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const Login = () => {
//   const [user, setUser] = useState('');
//   const [pass, setPass] = useState('');
//   const navigate = useNavigate();


//   const show2 = () => {
//     toast.error('Invalid Credentials', {
//       position: "top-right",
//       autoClose: 5000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//       theme: "dark",
//       transition: Bounce,
//     });
//   }

//   axios.defaults.withCredentials = true



//   const handleLogin = (e)=>{
//     e.preventDefault()
//     axios.post('http://localhost:3001/login',{user,pass})
//     .then(res=>{
//       if(res.data.login){
//         navigate('/home')

//       }
//       else{
//         navigate('/login')
//       }
     
//       console.log(res.data)
//     })
//     .catch(err=>{
//       console.log(err)
//       show2()
//     })
//   }
  

//   return (
//     <div className='text-white h-[100vh] w-[100%] flex justify-center items-center bg-cover' style={{ backgroundImage: "url('../src/assets/green.jpg')" }}>
//       <div className='w-full h-screen backdrop-filter backdrop-blur-xl flex justify-center items-center'>
//         <div className='bg-transparent border border-slate-400 rounded-xl p-8 shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-20 relative'>
//           <h1 className='text-4xl text-white font-bold text-center mb-8'>Login</h1>
//           <form onSubmit={handleLogin}>
//             <div className='relative my-4'>
//               <input type='text' className='block w-72 mb-7 py-2.3 px-0 text-l text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer' placeholder='' onChange={(e) => setUser(e.target.value)} />
//               <label htmlFor='' className='absolute text-l text-white duration-300 transform -translate-y-8 scale-75 top-3 z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-8' >Your Username</label>
//               <BiUser className='absolute right-6 top-1' />
//             </div>
//             <div className='relative my-4'>
//               <input type='password' className='block w-72 py-2.3 px-0 text-l text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer' placeholder='' onChange={(e) => setPass(e.target.value)} />
//               <label htmlFor='' className='absolute text-l text-white duration-300 transform -translate-y-8 scale-75 top-3 z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-8'>Your Password</label>
//               <AiOutlineLock className='absolute right-6 top-1' />
//             </div>
//             <div className='flex justify-between items-center'>
//               <div className='flex gap-2 items-center '>
//                 <input type='checkbox' name='' id='' />
//                 <label htmlFor='Remember me'>Remember Me</label>
//               </div>
//               <Link to="" className='text-blue-300 hover:cursor-pointer'>
//                 Forget Password?
//               </Link>
//             </div>
//             <button type='submit' className='w-full mb-4 mt-3 text-[20px] rounded-full bg-white h-10 text-blue-950 hover:bg-emerald-500 hover:text-white py-1 transition-colors duration-300'>Login</button>
//             <div>
//               <span className='m-9'>New Here? <Link to="/register" className='text-blue-950'> Create an account</Link></span>
//             </div>
//           </form>
//         </div>
//       </div>
//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="colored" />
//     </div>
//   )
// }

// export default Login;



// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { BiUser } from "react-icons/bi";
// import { AiOutlineLock } from "react-icons/ai";
// import axios from 'axios';
// import { Bounce, ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const Login = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   axios.defaults.withCredentials = true;

//   const showError = () => {
//     toast.error('Invalid Credentials', {
//       position: "top-right",
//       autoClose: 5000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//       theme: "dark",
//       transition: Bounce,
//     });
//   };

//   const handleLogin = (e) => {
//     e.preventDefault();

//     axios.post('http://localhost:8080/login', {
//       username,
//       password
//     })
//     .then((res) => {
//       if (res.data.token) {
//         localStorage.setItem('token', res.data.token); // Store token
//         navigate('/home');
//       } else {
//         showError();
//       }
//     })
//     .catch((err) => {
//       console.error(err);
//       showError();
//     });
//   };

//   return (
//     <div className='text-white h-[100vh] w-[100%] flex justify-center items-center bg-cover' style={{ backgroundImage: "url('../src/assets/green.jpg')" }}>
//       <div className='w-full h-screen backdrop-filter backdrop-blur-xl flex justify-center items-center'>
//         <div className='bg-transparent border border-slate-400 rounded-xl p-8 shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-20 relative'>
//           <h1 className='text-4xl text-white font-bold text-center mb-8'>Login</h1>
//           <form onSubmit={handleLogin}>
//             <div className='relative my-4'>
//               <input
//                 type='text'
//                 className='block w-72 mb-7 py-2.3 px-0 text-l text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer'
//                 onChange={(e) => setUsername(e.target.value)}
//               />
//               <label className='absolute text-l text-white duration-300 transform -translate-y-8 scale-75 top-3 z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-8'>
//                 Your Username
//               </label>
//               <BiUser className='absolute right-6 top-1' />
//             </div>
//             <div className='relative my-4'>
//               <input
//                 type='password'
//                 className='block w-72 py-2.3 px-0 text-l text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer'
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//               <label className='absolute text-l text-white duration-300 transform -translate-y-8 scale-75 top-3 z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-8'>
//                 Your Password
//               </label>
//               <AiOutlineLock className='absolute right-6 top-1' />
//             </div>
//             <div className='flex justify-between items-center'>
//               <div className='flex gap-2 items-center '>
//                 <input type='checkbox' />
//                 <label>Remember Me</label>
//               </div>
//               <Link to="" className='text-blue-300 hover:cursor-pointer'>
//                 Forget Password?
//               </Link>
//             </div>
//             <button
//               type='submit'
//               className='w-full mb-4 mt-3 text-[20px] rounded-full bg-white h-10 text-blue-950 hover:bg-emerald-500 hover:text-white py-1 transition-colors duration-300'
//             >
//               Login
//             </button>
//             <div>
//               <span className='m-9'>New Here? <Link to="/register" className='text-blue-950'>Create an account</Link></span>
//             </div>
//           </form>
//         </div>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default Login;



// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { BiUser } from "react-icons/bi";
// import { AiOutlineLock } from "react-icons/ai";
// import axios from 'axios';
// import { Bounce, ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const Login = () => {
//   const [user, setUser] = useState('');
//   const [pass, setPass] = useState('');
//   const navigate = useNavigate();

//   const show2 = () => {
//     toast.error('Invalid Credentials', {
//       position: "top-right",
//       autoClose: 5000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//       theme: "dark",
//       transition: Bounce,
//     });
//   };

//   axios.defaults.withCredentials = true;

//   const handleLogin = (e) => {
//     e.preventDefault();

//     axios.post('http://localhost:8080/login', { username:user, password: pass })
//       .then(res => {
//         if (res.data.token) {
//           localStorage.setItem('token', res.data.token);  // Store JWT token
//           navigate('/home');  // Navigate to protected home page
//         } else {
//           show2();  // Show error toast on failure
//         }
//       })
//       .catch(err => {
//         console.log(err);
//         show2();  // Show error toast on error
//       });
//   };

//   return (
//     <div className='text-white h-[100vh] w-[100%] flex justify-center items-center bg-cover' style={{ backgroundImage: "url('../src/assets/green.jpg')" }}>
//       <div className='w-full h-screen backdrop-filter backdrop-blur-xl flex justify-center items-center'>
//         <div className='bg-transparent border border-slate-400 rounded-xl p-8 shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-20 relative'>
//           <h1 className='text-4xl text-white font-bold text-center mb-8'>Login</h1>
//           <form onSubmit={handleLogin}>
//             <div className='relative my-4'>
//               <input
//                 type='text'
//                 className='block w-72 mb-7 py-2.3 px-0 text-l text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer'
//                 placeholder=''
//                 onChange={(e) => setUser(e.target.value)}
//               />
//               <label className='absolute text-l text-white duration-300 transform -translate-y-8 scale-75 top-3 z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-8'>
//                 Your Account number
//               </label>
//               <BiUser className='absolute right-6 top-1' />
//             </div>
//             <div className='relative my-4'>
//               <input
//                 type='password'
//                 className='block w-72 py-2.3 px-0 text-l text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer'
//                 placeholder=''
//                 onChange={(e) => setPass(e.target.value)}
//               />
//               <label className='absolute text-l text-white duration-300 transform -translate-y-8 scale-75 top-3 z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-8'>
//                 Your Password
//               </label>
//               <AiOutlineLock className='absolute right-6 top-1' />
//             </div>
//             <div className='flex justify-between items-center'>
//               <div className='flex gap-2 items-center '>
//                 <input type='checkbox' />
//                 <label>Remember Me</label>
//               </div>
//               <Link to="" className='text-blue-300 hover:cursor-pointer'>
//                 Forget Password?
//               </Link>
//             </div>
//             <button
//               type='submit'
//               className='w-full mb-4 mt-3 text-[20px] rounded-full bg-white h-10 text-blue-950 hover:bg-emerald-500 hover:text-white py-1 transition-colors duration-300'
//             >
//               Login
//             </button>
//             <div>
//               <span className='m-9'>New Here? <Link to="/register" className='text-blue-950'>Create an account</Link></span>
//             </div>
//           </form>
//         </div>
//       </div>
//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="colored"
//       />
//     </div>
//   );
// };

// export default Login;




// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { BiUser } from "react-icons/bi";
// import { AiOutlineLock } from "react-icons/ai";
// import axios from 'axios';
// import { Bounce, ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const Login = () => {
//   const [user, setUser] = useState('');
//   const [pass, setPass] = useState('');
//   const navigate = useNavigate();

//   const show2 = () => {
//     toast.error('Invalid Credentials', {
//       position: "top-right",
//       autoClose: 5000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//       theme: "dark",
//       transition: Bounce,
//     });
//   };

//   axios.defaults.withCredentials = true;

//   const handleLogin = (e) => {
//     e.preventDefault();

//     axios.post('http://localhost:8080/login', {
//       account_number: parseInt(user), // ✅ Send account_number instead of username
//       password: pass
//     })
//     .then(res => {
//       if (res.data.token) {
//         localStorage.setItem('token', res.data.token); // ✅ Save JWT
//         navigate('/home'); // ✅ Redirect to protected route
//       } else {
//         show2(); // ❌ Invalid token response
//       }
//     })
//     .catch(err => {
//       console.error(err);
//       show2(); // ❌ Login failed
//     });
//   };

//   return (
//     <div className='text-white h-[100vh] w-[100%] flex justify-center items-center bg-cover' style={{ backgroundImage: "url('../src/assets/green.jpg')" }}>
//       <div className='w-full h-screen backdrop-filter backdrop-blur-xl flex justify-center items-center'>
//         <div className='bg-transparent border border-slate-400 rounded-xl p-8 shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-20 relative'>
//           <h1 className='text-4xl text-white font-bold text-center mb-8'>Login</h1>
//           <form onSubmit={handleLogin}>
//             <div className='relative my-4'>
//               <input
//                 type='text'
//                 className='block w-72 mb-7 py-2.3 px-0 text-l text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer'
//                 placeholder=''
//                 onChange={(e) => setUser(e.target.value)}
//               />
//               <label className='absolute text-l text-white duration-300 transform -translate-y-8 scale-75 top-3 z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-8'>
//                 Your Account Number
//               </label>
//               <BiUser className='absolute right-6 top-1' />
//             </div>
//             <div className='relative my-4'>
//               <input
//                 type='password'
//                 className='block w-72 py-2.3 px-0 text-l text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer'
//                 placeholder=''
//                 onChange={(e) => setPass(e.target.value)}
//               />
//               <label className='absolute text-l text-white duration-300 transform -translate-y-8 scale-75 top-3 z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-8'>
//                 Your Password
//               </label>
//               <AiOutlineLock className='absolute right-6 top-1' />
//             </div>
//             <div className='flex justify-between items-center'>
//               <div className='flex gap-2 items-center '>
//                 <input type='checkbox' />
//                 <label>Remember Me</label>
//               </div>
//               <Link to="" className='text-blue-300 hover:cursor-pointer'>
//                 Forget Password?
//               </Link>
//             </div>
//             <button
//               type='submit'
//               className='w-full mb-4 mt-3 text-[20px] rounded-full bg-white h-10 text-blue-950 hover:bg-emerald-500 hover:text-white py-1 transition-colors duration-300'
//             >
//               Login
//             </button>
//             <div>
//               <span className='m-9'>New Here? <Link to="/register" className='text-blue-950'>Create an account</Link></span>
//             </div>
//           </form>
//         </div>
//       </div>
//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="colored"
//       />
//     </div>
//   );
// };

// export default Login;




// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { BiUser } from "react-icons/bi";
// import { AiOutlineLock } from "react-icons/ai";
// import axios from 'axios';
// import { Bounce, ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const Login = () => {
//   const [accountNumber, setAccountNumber] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   // Show toast for invalid credentials
//   const showErrorToast = () => {
//     toast.error('Invalid Credentials', {
//       position: "top-right",
//       autoClose: 5000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       theme: "dark",
//       transition: Bounce,
//     });
//   };

//   // Optional: Enable sending cookies, though your backend does not currently use cookies.
//   axios.defaults.withCredentials = true;

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     // Basic validation
//     if (!accountNumber || !password) {
//       toast.warn("Please enter both Account Number and Password");
//       return;
//     }

//     try {
//       const response = await axios.post('http://localhost:8080/login', {
//         account_number: Number(accountNumber),  // Must be number (int)
//         password: password
//       });

//       // Backend returns { token: "JWT_TOKEN" } on success
//       if (response.data.token) {
//         // Save token locally for authenticated requests
//         localStorage.setItem('token', response.data.token);
//         // Redirect user to dashboard or home page
//         navigate('/home');
//       } else {
//         showErrorToast();
//       }
//     } catch (error) {
//       // Handle errors from backend (401, 500, network errors)
//       showErrorToast();
//       console.error("Login error:", error);
//     }
//   };

//   return (
//     <div className='text-white h-[100vh] w-[100%] flex justify-center items-center bg-cover' style={{ backgroundImage: "url('../src/assets/green.jpg')" }}>
//       <div className='w-full h-screen backdrop-filter backdrop-blur-xl flex justify-center items-center'>
//         <div className='bg-transparent border border-slate-400 rounded-xl p-8 shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-20 relative'>
//           <h1 className='text-4xl text-white font-bold text-center mb-8'>Login</h1>
//           <form onSubmit={handleLogin}>
//             <div className='relative my-4'>
//               <input
//                 type='number'   // Change input type to number for account number
//                 className='block w-72 mb-7 py-2.3 px-0 text-l text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer'
//                 placeholder=''
//                 value={accountNumber}
//                 onChange={(e) => setAccountNumber(e.target.value)}
//                 required
//               />
//               <label className='absolute text-l text-white duration-300 transform -translate-y-8 scale-75 top-3 z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-8'>
//                 Your Account Number
//               </label>
//               <BiUser className='absolute right-6 top-1' />
//             </div>
//             <div className='relative my-4'>
//               <input
//                 type='password'
//                 className='block w-72 py-2.3 px-0 text-l text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer'
//                 placeholder=''
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//               <label className='absolute text-l text-white duration-300 transform -translate-y-8 scale-75 top-3 z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-8'>
//                 Your Password
//               </label>
//               <AiOutlineLock className='absolute right-6 top-1' />
//             </div>
//             <div className='flex justify-between items-center'>
//               <div className='flex gap-2 items-center '>
//                 <input type='checkbox' id="rememberMe" />
//                 <label htmlFor="rememberMe">Remember Me</label>
//               </div>
//               <Link to="" className='text-blue-300 hover:cursor-pointer'>
//                 Forget Password?
//               </Link>
//             </div>
//             <button
//               type='submit'
//               className='w-full mb-4 mt-3 text-[20px] rounded-full bg-white h-10 text-blue-950 hover:bg-emerald-500 hover:text-white py-1 transition-colors duration-300'
//             >
//               Login
//             </button>
//             <div>
//               <span className='m-9'>New Here? <Link to="/register" className='text-blue-950'>Create an account</Link></span>
//             </div>
//           </form>
//         </div>
//       </div>
//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="colored"
//       />
//     </div>
//   );
// };

// export default Login;

// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { BiUser } from "react-icons/bi";
// import { AiOutlineLock } from "react-icons/ai";
// import axios from 'axios';
// import { Bounce, ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const Login = () => {
//   const [accountNumber, setAccountNumber] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   // Show toast for invalid credentials
//   const showErrorToast = () => {
//     toast.error('Invalid Credentials', {
//       position: "top-right",
//       autoClose: 5000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       theme: "dark",
//       transition: Bounce,
//     });
//   };

//   axios.defaults.withCredentials = true;

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     if (!accountNumber || !password) {
//       toast.warn("Please enter both Account Number and Password");
//       return;
//     }

//     try {
//       const response = await axios.post('http://localhost:8080/login', {
//         account_number: Number(accountNumber),  // must be number
//         password: password
//       });

//       if (response.data.token) {
//         localStorage.setItem('token', response.data.token);
//         navigate('/home');
//       } else {
//         showErrorToast();
//       }
//     } catch (error) {
//       showErrorToast();
//       console.error("Login error:", error);
//     }
//   };

//   return (
//     <div className='text-white h-[100vh] w-[100%] flex justify-center items-center bg-cover' style={{ backgroundImage: "url('../src/assets/green.jpg')" }}>
//       <div className='w-full h-screen backdrop-filter backdrop-blur-xl flex justify-center items-center'>
//         <div className='bg-transparent border border-slate-400 rounded-xl p-8 shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-20 relative'>
//           <h1 className='text-4xl text-white font-bold text-center mb-8'>Login</h1>
//           <form onSubmit={handleLogin}>
//             <div className='relative my-4'>
//               <input
//                 type='number'
//                 className='block w-72 mb-7 py-2.3 px-0 text-l text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer'
//                 placeholder=''
//                 value={accountNumber}
//                 onChange={(e) => setAccountNumber(e.target.value)}
//                 required
//               />
//               <label className='absolute text-l text-white duration-300 transform -translate-y-8 scale-75 top-3 z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-8'>
//                 Your Account Number
//               </label>
//               <BiUser className='absolute right-6 top-1' />
//             </div>
//             <div className='relative my-4'>
//               <input
//                 type='password'
//                 className='block w-72 py-2.3 px-0 text-l text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer'
//                 placeholder=''
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//               <label className='absolute text-l text-white duration-300 transform -translate-y-8 scale-75 top-3 z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-8'>
//                 Your Password
//               </label>
//               <AiOutlineLock className='absolute right-6 top-1' />
//             </div>
//             <div className='flex justify-between items-center'>
//               <div className='flex gap-2 items-center '>
//                 <input type='checkbox' id="rememberMe" />
//                 <label htmlFor="rememberMe">Remember Me</label>
//               </div>
//               <Link to="" className='text-blue-300 hover:cursor-pointer'>
//                 Forget Password?
//               </Link>
//             </div>
//             <button
//               type='submit'
//               className='w-full mb-4 mt-3 text-[20px] rounded-full bg-white h-10 text-blue-950 hover:bg-emerald-500 hover:text-white py-1 transition-colors duration-300'
//             >
//               Login
//             </button>
//             <div>
//               <span className='m-9'>New Here? <Link to="/register" className='text-blue-950'>Create an account</Link></span>
//             </div>
//           </form>
//         </div>
//       </div>
//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="colored"
//       />
//     </div>
//   );
// };

// export default Login;




// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { BiUser } from "react-icons/bi";
// import { AiOutlineLock } from "react-icons/ai";
// import axios from "axios";
// import { Bounce, ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const Login = () => {
//   const [user, setUser] = useState("");
//   const [pass, setPass] = useState("");
//   const navigate = useNavigate();

//   const notify = (msg) => {
//     toast.warning(msg, {
//       position: "top-right",
//       autoClose: 5000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       theme: "dark",
//       transition: Bounce,
//     });
//   };

//   const handleLogin = (e) => {
//     e.preventDefault();
//     if (!user) return notify("Enter the Account Number");
//     if (!pass) return notify("Enter the Password");

//     axios
//       .post("http://localhost:8080/login", {
//         account_number: user,
//         password: pass,
//       })
//       .then((res) => {
//         localStorage.setItem("token", res.data.token);
//         navigate("/dashboard");
//       })
//       .catch((err) => {
//         console.error(err);
//         toast.error("Login failed. Please check your credentials.", {
//           position: "top-right",
//           autoClose: 5000,
//           theme: "dark",
//         });
//       });
//   };

//   return (
//     <div
//       className="text-white h-[100vh] w-[100%] flex justify-center items-center bg-cover"
//       style={{ backgroundImage: "url('../src/assets/green.jpg')" }}
//     >
//       <div className="w-full h-screen backdrop-filter backdrop-blur-xl flex justify-center items-center">
//         <div className="bg-transparent border border-slate-400 rounded-xl p-8 shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-20 relative">
//           <h1 className="text-4xl text-white font-bold text-center mb-8">
//             Login
//           </h1>
//           <form onSubmit={handleLogin}>
//             <div className="relative my-4">
//               <input
//                 type="text"
//                 className="block w-72 mb-7 py-2.3 px-0 text-l text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer"
//                 placeholder=""
//                 onChange={(e) => setUser(e.target.value)}
//               />
//               <label
//                 className="absolute text-l text-white duration-300 transform -translate-y-8 scale-75 top-3 z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-8"
//               >
//                 Account Number
//               </label>
//               <BiUser className="absolute right-8 top-1" />
//             </div>

//             <div className="relative my-4">
//               <input
//                 type="password"
//                 className="block w-72 py-2.3 px-0 mb-6 text-l text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer"
//                 placeholder=""
//                 onChange={(e) => setPass(e.target.value)}
//               />
//               <label
//                 className="absolute text-l text-white duration-300 transform -translate-y-8 scale-75 top-3 z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-8"
//               >
//                 Password
//               </label>
//               <AiOutlineLock className="absolute right-8 top-1" />
//             </div>

//             <button
//               type="submit"
//               className="w-full mb-4 mt-3 text-[20px] rounded-full bg-white h-10 text-blue-950 hover:bg-emerald-500 hover:text-white py-1 transition-colors duration-300"
//             >
//               Login
//             </button>

//             <div>
//               <span className="m-9">
//                 Don't have an Account?
//                 <Link to="/register" className="text-blue-950">
//                   {" "}
//                   Register
//                 </Link>
//               </span>
//             </div>
//           </form>
//         </div>
//       </div>

//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="colored"
//       />
//     </div>
//   );
// };

// export default Login;








// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { BiUser } from "react-icons/bi";
// import { AiOutlineLock } from "react-icons/ai";
// import axios from 'axios';
// import { Bounce, ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const Login = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   axios.defaults.withCredentials = true;

//   const showError = () => {
//     toast.error('Invalid Credentials', {
//       position: "top-right",
//       autoClose: 5000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//       theme: "dark",
//       transition: Bounce,
//     });
//   };

//   const handleLogin = (e) => {
//     e.preventDefault();

//     axios.post('http://localhost:8080/login', {
//       username,
//       password
//     })
//     .then((res) => {
//       if (res.data.token) {
//         localStorage.setItem('token', res.data.token); // Store token
//         navigate('/home');
//       } else {
//         showError();
//       }
//     })
//     .catch((err) => {
//       console.error(err);
//       showError();
//     });
//   };

//   return (
//     <div className='text-white h-[100vh] w-[100%] flex justify-center items-center bg-cover' style={{ backgroundImage: "url('../src/assets/green.jpg')" }}>
//       <div className='w-full h-screen backdrop-filter backdrop-blur-xl flex justify-center items-center'>
//         <div className='bg-transparent border border-slate-400 rounded-xl p-8 shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-20 relative'>
//           <h1 className='text-4xl text-white font-bold text-center mb-8'>Login</h1>
//           <form onSubmit={handleLogin}>
//             <div className='relative my-4'>
//               <input
//                 type='text'
//                 className='block w-72 mb-7 py-2.3 px-0 text-l text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer'
//                 onChange={(e) => setUsername(e.target.value)}
//               />
//               <label className='absolute text-l text-white duration-300 transform -translate-y-8 scale-75 top-3 z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-8'>
//                 Your Username
//               </label>
//               <BiUser className='absolute right-6 top-1' />
//             </div>
//             <div className='relative my-4'>
//               <input
//                 type='password'
//                 className='block w-72 py-2.3 px-0 text-l text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer'
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//               <label className='absolute text-l text-white duration-300 transform -translate-y-8 scale-75 top-3 z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-8'>
//                 Your Password
//               </label>
//               <AiOutlineLock className='absolute right-6 top-1' />
//             </div>
//             <div className='flex justify-between items-center'>
//               <div className='flex gap-2 items-center '>
//                 <input type='checkbox' />
//                 <label>Remember Me</label>
//               </div>
//               <Link to="" className='text-blue-300 hover:cursor-pointer'>
//                 Forget Password?
//               </Link>
//             </div>
//             <button
//               type='submit'
//               className='w-full mb-4 mt-3 text-[20px] rounded-full bg-white h-10 text-blue-950 hover:bg-emerald-500 hover:text-white py-1 transition-colors duration-300'
//             >
//               Login
//             </button>
//             <div>
//               <span className='m-9'>New Here? <Link to="/register" className='text-blue-950'>Create an account</Link></span>
//             </div>
//           </form>
//         </div>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default Login;



import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BiUser } from "react-icons/bi";
import { AiOutlineLock } from "react-icons/ai";
import axios from 'axios';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();

  const show2 = () => {
    toast.error('Invalid Credentials', {
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
  };

  axios.defaults.withCredentials = true;

  const handleLogin = (e) => {
    e.preventDefault();

    axios.post('http://localhost:8080/login', { username: user, password: pass })
      .then(res => {
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);  // Store JWT token
          navigate('/home');  // Navigate to protected home page
        } else {
          show2();  // Show error toast on failure
        }
      })
      .catch(err => {
        console.log(err);
        show2();  // Show error toast on error
      });
  };

  return (
    <div className='text-white h-[100vh] w-[100%] flex justify-center items-center bg-cover' style={{ backgroundImage: "url('../src/assets/green.jpg')" }}>
      <div className='w-full h-screen backdrop-filter backdrop-blur-xl flex justify-center items-center'>
        <div className='bg-transparent border border-slate-400 rounded-xl p-8 shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-20 relative'>
          <h1 className='text-4xl text-white font-bold text-center mb-8'>Login</h1>
          <form onSubmit={handleLogin}>
            <div className='relative my-4'>
              <input
                type='text'
                className='block w-72 mb-7 py-2.3 px-0 text-l text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer'
                placeholder=''
                onChange={(e) => setUser(e.target.value)}
              />
              <label className='absolute text-l text-white duration-300 transform -translate-y-8 scale-75 top-3 z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-8'>
                Your Username
              </label>
              <BiUser className='absolute right-6 top-1' />
            </div>
            <div className='relative my-4'>
              <input
                type='password'
                className='block w-72 py-2.3 px-0 text-l text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer'
                placeholder=''
                onChange={(e) => setPass(e.target.value)}
              />
              <label className='absolute text-l text-white duration-300 transform -translate-y-8 scale-75 top-3 z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-8'>
                Your Password
              </label>
              <AiOutlineLock className='absolute right-6 top-1' />
            </div>
            <div className='flex justify-between items-center'>
              <div className='flex gap-2 items-center '>
                <input type='checkbox' />
                <label>Remember Me</label>
              </div>
              <Link to="" className='text-blue-300 hover:cursor-pointer'>
                Forget Password?
              </Link>
            </div>
            <button
              type='submit'
              className='w-full mb-4 mt-3 text-[20px] rounded-full bg-white h-10 text-blue-950 hover:bg-emerald-500 hover:text-white py-1 transition-colors duration-300'
            >
              Login
            </button>
            <div>
              <span className='m-9'>New Here? <Link to="/register" className='text-blue-950'>Create an account</Link></span>
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
        theme="colored"
      />
    </div>
  );
};

export default Login;
