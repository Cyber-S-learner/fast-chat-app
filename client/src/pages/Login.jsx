import React, { useState } from 'react'
import { Link, resolvePath, useSearchParams } from 'react-router-dom'
import { Mail, Lock, Facebook, Chrome } from 'lucide-react'
import { loginUser } from '../API_Calls/AuthAPI.js'
import { toast } from 'react-hot-toast'
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { hideLoader, showLoader } from '../redux/loaderSlice.js'



const Login = () => {
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: ""
  })
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleLoginDetails = (e) => {
    const { name, value } = e.target;
    setLoginDetails((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let response = null
    try {
      dispatch(showLoader())
      response = await loginUser(loginDetails)
      dispatch(hideLoader())
      
      if (response?.success) {
        toast.success(response?.message);
        localStorage.setItem('token', response.token)
        navigate('/')

      }
      else {
        
        toast.error(response?.response?.data?.message)
      }

    } catch (error) {
   
      dispatch(hideLoader())


      const msg = error?.response?.data?.message || "Something went wrong";
      toast(msg);
    }

  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#1E1E1E] relative">
      <img
        src="/src/assets/fastchat-logo2.png"
        alt="Fast Chat Logo"
        className="hidden md:block absolute left-2/5 top-[15%] -translate-x-1/2 -translate-y-1/2 rounded-lg w-40 drop-shadow-2xl z-50"
      />
      <div className="hidden md:flex w-2/5 bg-orange-600 flex-col justify-center items-center relative text-white">
        <div className="absolute inset-0 bg-orange-600"></div>
        <h1 className="text-5xl font-bold z-10 font-serif tracking-wide">Welcome Back</h1>
        <p className="z-10 mt-4 text-orange-100 text-lg">Login to continue</p>
      </div>

      <div className="w-full md:w-3/5 flex flex-col justify-center items-center relative p-8">

        <Link
          to="/signup"
          className="hidden md:flex absolute top-1/2 -left-12 -translate-y-1/2 bg-[#121212] py-4 pl-6 pr-8 rounded-l-full items-center shadow-xl cursor-pointer hover:bg-gray-900 transition-colors z-20 group"
        >
          <span className="text-white font-bold text-lg group-hover:text-orange-500 transition-colors">
            Sign Up
          </span>
        </Link>

        <h2 className="md:hidden text-3xl font-bold text-orange-500 mb-8">Login</h2>

        <div className="w-full max-w-md">

          <h2 className="hidden md:block text-center text-4xl font-bold text-orange-600 mb-10 font-serif tracking-wide">
            Login
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
              </div>
              <input
                type="email"
                name="email"
                className="w-full bg-transparent border-b border-gray-700 text-white py-3 pl-8 focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-500 text-sm"
                placeholder="Email"
                value={loginDetails.email}
                onChange={(e) => handleLoginDetails(e)}
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
              </div>
              <input
                type="password"
                name="password"
                className="w-full bg-transparent border-b border-gray-700 text-white py-3 pl-8 focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-500 text-sm"
                placeholder="Password"
                value={loginDetails.password}
                onChange={(e) => handleLoginDetails(e)}
              />
            </div>


            <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded shadow-lg transform transition hover:scale-[1.02] duration-300 mt-6 cursor-pointer">
              Login
            </button>

          </form>

          <div className="mt-10 border-t border-gray-800 pt-6">
            <div className="flex justify-between text-gray-400 text-xs px-2">
              <div className="flex items-center space-x-2 cursor-pointer hover:text-white transition group">
                <Facebook className="h-4 w-4 group-hover:text-blue-500 transition-colors" />
                <span>Facebook</span>
              </div>
              <div className="flex items-center space-x-2 cursor-pointer hover:text-white transition group">
                <Chrome className="h-4 w-4 group-hover:text-red-500 transition-colors" />
                <span>Google +</span>
              </div>
            </div>
          </div>

          <div className="md:hidden mt-8 text-center">
            <p className="text-gray-500">
              Don't have an account?{" "}
              <Link to="/signup" className="text-orange-500 font-bold">
                Sign Up
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Login