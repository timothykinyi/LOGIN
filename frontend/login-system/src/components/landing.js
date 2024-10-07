// src/components/LandingPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './images/logo.png'; // Import your logo image
import './styles/LandingPage.css';
import './styles/button.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="overlay">
        {/* Logo Image */}
        <img src={logo} alt="Company Logo" className="logo" />
        <div className="button-container">
          <button className="button" onClick={() => navigate('/login')}>Sign In</button>
          <button className="button" onClick={() => navigate('/register')}>Sign Up</button>
        </div>
      </div>
    </div>
  );
};



export default LandingPage;
