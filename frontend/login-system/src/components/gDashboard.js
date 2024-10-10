import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './images/lg.png';
import './styles/landingPage.css'; // Updated CSS file
const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="overlay">
        <div className="hero">
          <img src={logo} alt="Company Log" className="log" />
          <p className="hero-description">
            Welcome to EiD your identity, simplified.
          </p>
          <div className="button-group">
            <button className="sign-in-btn" onClick={() => navigate('/login')}>
              Sign In
            </button>
            <button className="sign-up-btn" onClick={() => navigate('/register')}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
