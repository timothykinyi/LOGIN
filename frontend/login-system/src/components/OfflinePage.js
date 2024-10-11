import React from 'react';
import offline from './images/offline.jpeg';
import './styles/OfflinePage.css';

const OfflinePage = () => {
  return (
    <div className="landing-container">
      <div className="overlay">
        <div className="hero">
          <img src={offline} alt="Offline" className="log" />
          <h3>You're Offline</h3>
          <p>It seems you are not connected to the internet. Please check your connection and try again.</p>
        </div>
      </div>
    </div>
  );
};

export default OfflinePage;
