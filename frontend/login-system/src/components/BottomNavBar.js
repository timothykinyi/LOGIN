import React from 'react';
import { BsFillPersonFill } from 'react-icons/bs';
import { FaBell, FaCogs, FaHome } from 'react-icons/fa';
import './styles/Navbar.css';

const BottomNavbar = () => {
  return (
    <footer className="nav-footer">
      <nav className="bottom-navbar">
        <ul className="nav-links">
          {/* Home Icon */}
          <li className="nav-item">
            <a href="/dDashboard" className="nav-link">
              <BsFillPersonFill />
              <span>Profile</span>
            </a>
          </li>

          {/* Users Icon */}
          <li className="nav-item">
            <a href="/house/homedash" className="nav-link">
              <FaHome />
              <span>Houses</span>
            </a>
          </li>

          {/* Notifications Icon */}
          <li className="nav-item">
            <a href="#notifications" className="nav-link">
              <FaBell />
              <span>Notifications</span>
            </a>
          </li>

                    {/* Settings Icon */}
                    <li className="nav-item">
            <a href="/settings" className="nav-link">
              <FaCogs />
              <span>Settings</span>
            </a>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

export default BottomNavbar;
