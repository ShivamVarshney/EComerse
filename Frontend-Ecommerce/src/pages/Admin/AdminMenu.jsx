import { useState } from "react"
import { NavLink } from "react-router-dom"
import {FaTimes} from 'react-icons/fa'

function AdminMenu() {

  const [isMenuOpen , setIsMenuOpen] = useState(false)
  const togglemenu = ()=>{
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <>
    <button className= {`${ isMenuOpen ? " top-2 right-2 " : "top-5 right-7"} bg-[#242323] p-2 fixed rounded-lg`} onClick={togglemenu}>

      {
        isMenuOpen ? (
          <FaTimes color="white" className="z-50"/>
        ):
        (
          <>
          <div className="w-6 h-1 bg-gray-500 my-1"></div>
          <div className="w-6 h-1 bg-gray-500 my-1"></div>
          <div className="w-6 h-1 bg-gray-500 my-1"></div>
          </>
        )
        }
    </button>

    {
      isMenuOpen && (
        <section className="bg-[#151515] p-4 fixed right-7 top-5">
          <ul>
          <li>
            <NavLink className='list-item py-2 px-3 block mb-5 hover: bg-[#2ED2D2D] rounded-sm' to="/admin/dashboard" style={({isActive}) =>({
              color :isActive ? "greenyellow" : "white"
            })}>
              ADMIN DASHBOARD
            </NavLink>
          </li>
          <li>
            <NavLink className='list-item py-2 px-3 block mb-5 hover: bg-[#2ED2D2D] rounded-sm' to="/admin/categorylist" style={({isActive}) =>({
              color :isActive ? "greenyellow" : "white"
            })}>
              CREATE CATEGORY
            </NavLink>
          </li>
          <li>
            <NavLink className='list-item py-2 px-3 block mb-5 hover: bg-[#2ED2D2D] rounded-sm' to="/admin/productlist" style={({isActive}) =>({
              color :isActive ? "greenyellow" : "white"
            })}>
              CREATE PRODUCT
            </NavLink>
          </li>
          <li>
            <NavLink className='list-item py-2 px-3 block mb-5 hover: bg-[#2ED2D2D] rounded-sm' to="/admin/allproducts" style={({isActive}) =>({
              color :isActive ? "greenyellow" : "white"
            })}>
              ALL PRODUCTS
            </NavLink>
          </li>
          <li>
            <NavLink className='list-item py-2 px-3 block mb-5 hover: bg-[#2ED2D2D] rounded-sm' to="/admin/userlist" style={({isActive}) =>({
              color :isActive ? "greenyellow" : "white"
            })}>
              MANAGE USERS
            </NavLink>
          </li>
          <li>
            <NavLink className='list-item py-2 px-3 block mb-5 hover: bg-[#2ED2D2D] rounded-sm' to="/admin/orderlist" style={({isActive}) =>({
              color :isActive ? "greenyellow" : "white"
            })}>
              MANAGE ORDERS
            </NavLink>
          </li></ul>
        </section>
      )
    }
    </>
  )
}

export default AdminMenu