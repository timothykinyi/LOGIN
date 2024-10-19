import React from 'react'
import logo from '../assets/logo2.png'
import '../styles/Navbar.css'
const Navbar = () => {
  return (
    <nav className='container'>
      <img src={logo} alt="" className='logo'/>
      <ul>
        <li>Home</li>
        <li>About</li>
        <li>Contact us</li>
        <li>Stories</li>
      </ul>
    </nav>
  )
}

export default Navbar
