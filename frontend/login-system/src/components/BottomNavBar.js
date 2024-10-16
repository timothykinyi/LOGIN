import React from 'react';
import { FaBell, FaCogs, FaHome, FaUsers } from 'react-icons/fa';
import './styles/Navbar.css';

const BottomNavbar = () => {
  return (
    <footer className="nav-footer">
      <nav className="bottom-navbar">
        <ul className="nav-links">
          {/* Home Icon */}
          <li className="nav-item">
            <a href="#home" className="nav-link">
              <FaHome />
              <span>Home</span>
            </a>
          </li>

          {/* Users Icon */}
          <li className="nav-item">
            <a href="#users" className="nav-link">
              <FaUsers />
              <span>Users</span>
            </a>
          </li>

          {/* Settings Icon */}
          <li className="nav-item">
            <a href="#settings" className="nav-link">
              <FaCogs />
              <span>Settings</span>
            </a>
          </li>

          {/* Notifications Icon */}
          <li className="nav-item">
            <a href="#notifications" className="nav-link">
              <FaBell />
              <span>Notifications</span>
            </a>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

export default BottomNavbar;
