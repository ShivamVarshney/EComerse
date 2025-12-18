import React from 'react'
import { useState } from 'react'
import { AiOutlineHome, AiOutlineShopping, AiOutlineLogin, AiOutlineUserAdd, AiOutlineShoppingCart } from 'react-icons/ai'
import { FaHeart } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import './Navigation.css';
import { useSelector, useDispatch } from "react-redux";

import { useLogoutMutation } from '../../redux/api/usersApiSlice'
import { logout } from '../../redux/features/auth/authSlice'
import FavoritesCount from '../Products/FavoritesCount '


function Navigation() {

  const {userInfo} = useSelector(state =>state.auth)
  const {cartItems} = useSelector(state => state.cart)
  const [dropDownOpen, setDropDownOpen] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)

  const toggleDropdown = () => {
    setDropDownOpen(!dropDownOpen)
  }
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar)
  }
  const closeSidebar = () => {
    setShowSidebar(false)
  };
const dispatch = useDispatch()
const navigate = useNavigate()

const [logoutApiCall] = useLogoutMutation()

const logoutHandler = async ()=>{
  try {
     await logoutApiCall().unwrap()
     dispatch(logout())
     navigate('/login')
  } catch (error) {
    console.error(error)
  }
}
  return (
    <div style={{ zIndex: 999 }} className={`${showSidebar ? "hidden" : 'flex'} xl :flex lg:flex md:hidden sm:hidden flex-col justify-between p-4 text-white bg-black w-[%] hover:w-[15%] h-[100vh] fixed`}
      id='navigation-container'
    >
      <div className="flex flex-col justify-center space-y-4">
        <Link to='/' className='flex items-center transition-transform transform hover:translate-x-2'>
          <AiOutlineHome className='mr-2 mt-[3rem]' size={26} />
          <span className='hidden nav-item-name mt-[3rem]'>
            HOME
          </span>
        </Link>
        <Link to='/shop' className='flex items-center transition-transform transform hover:translate-x-2'>
          <AiOutlineShopping className='mr-2 mt-[3rem]' size={26} />
          <span className='hidden nav-item-name mt-[3rem]'>
            SHOP
          </span>
        </Link>
        <Link to='/cart' className='flex items-center transition-transform transform hover:translate-x-2'>
          
          {/* 1. Wrapper Div: Holds both Icon and Badge together */}
          <div className="relative mt-[3rem] mr-2"> 
            
            {/* Icon: Removed the margin from here because the parent wrapper has it now */}
            <AiOutlineShoppingCart size={26} /> 

            {/* Badge: Positioned absolute relative to the wrapper */}
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 px-1 py-0 text-sm text-white bg-pink-500 rounded-full">
                {cartItems.reduce((a, c) => a + c.qty, 0)}
              </span>
            )}
            
          </div>

          <span className='hidden nav-item-name mt-[3rem]'>
            CART
          </span>
        </Link>
        <Link to='/favorite' className='flex items-center transition-transform transform hover:translate-x-2'>
          <FaHeart className='mr-2 mt-[3rem]' size={26} />
          <span className='hidden nav-item-name mt-[3rem]'>
            Favorite
          </span>{" "}
          <FavoritesCount />
        </Link>
      </div>

      <div className='relative'>
        <button onClick={toggleDropdown } className='flex items-center text-gray-8000 focus:outline-none'>
          {userInfo ? <span className='text-white'>{userInfo.username}</span>: (<></>)}

          {userInfo && (
            <svg 
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 ml-1 ${
              dropDownOpen ? "trnsform rotate-180" : ""
            }`}
            fill='none'
            viewBox='0 0 24 24'
            stroke='white'
            >
              <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth="2"
              d = {dropDownOpen ? "M5 15l7-7 7 7": "M19 9l-7 7-7-7"} 
              />
            </svg>
          )}
        </button>
            {dropDownOpen && userInfo && (
              <ul className={`absolute right-0 mt-2 mr-14 space-y-2 bg-gray-600 text-gray-300  ${
                !userInfo.isAdmin ? "-top-20" : "-top-80"
              }`}>
                {userInfo.isAdmin && (
                  <>
                  <li> 
                    <Link to = '/admin/dashboard'
                      className='block px-4 py-2
                      hover:bg-blue-600 '
                    >DashBoard</Link>
                  </li>
                  <li> 
                    <Link to = '/admin/productlist'
                      className='block px-4 py-2 hover:bg-blue-600'
                    >Products</Link>
                  </li>
                  <li> 
                    <Link to = '/admin/categorylist'
                      className='block px-4 py-2 hover:bg-blue-600'
                    >Category</Link>
                  </li>
                  <li> 
                    <Link to = '/admin/orderlist'
                      className='block px-4 py-2 hover:bg-blue-600'
                    >Order</Link>
                  </li>
                  <li> 
                    <Link to = '/admin/userlist'
                      className='block px-4 py-2 hover:bg-blue-600'
                    >Users</Link>
                  </li>
                  
                  </>
                )}
                <li> 
                    <Link to = '/profile'
                      className='block px-4 py-2 hover:bg-blue-600 '
                    >Profile</Link>
                  </li>
                  <li> 
                    <Link to = '/logout'
                    onClick={logoutHandler}
                      className='block px-4 py-2 hover:bg-blue-600'
                    >Logout</Link>
                  </li>
              </ul>
            )}
      


       {!userInfo &&  (
        <ul>
        <li>
          <Link to='/login' className='flex items-center transition-transform transform hover:translate-x-2'>
          <AiOutlineLogin className='mr-2 mt-[3rem]' size={26} />
          <span className='hidden nav-item-name mt-[3rem]'>
            Login
          </span>
        </Link>
        </li>
        <li>
          <Link to='/register' className='flex items-center transition-transform transform hover:translate-x-2'>
          <AiOutlineUserAdd className='mr-2 mt-[3rem]' size={26} />
          <span className='hidden nav-item-name mt-[3rem]'>
           Register
          </span>
        </Link>
        </li>
       </ul>
       )}
       </div>
    </div>
  );
};

export default Navigation