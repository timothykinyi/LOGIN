import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { FaChartBar, FaClipboardList, FaHome, } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Bottomnav from '../BottomNavBar';
import Header from '../header';
import '../styles/gDashboard.css';
import { default as HouseManagementForm, default as MonitoringConsole } from './housedash';
import RegisterHomeForm from './housereg';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeForm, setActiveForm] = useState('housedash'); // HouseManagement as default
  const [isNavOpen, setIsNavOpen] = useState(false); // Nav open/close state
  const [isAddingNew, setIsAddingNew] = useState(false); // Add/update form state
  const navListRef = useRef(null);
  const eID = sessionStorage.getItem('eID');

  // Track taps for double-tap detection
  const lastTapRef = useRef(0);

  useEffect(() => {
    const token = sessionStorage.getItem('userToken');
    if (!eID || !token) {
      navigate('/');
      return;
    }
    register();
  }, [navigate, eID]);

  const register = async () => {
    try {
      const response = await axios.post('https://your-api-endpoint.com/register', { eID });
      console.log('Registration successful:', response.data);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleDoubleTap = () => {
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - lastTapRef.current;

    if (timeDifference < 300 && timeDifference > 0) {
      setIsNavOpen(!isNavOpen); // Toggle nav on double-tap
    }

    lastTapRef.current = currentTime;
  };

  const navItems = [
    { icon: <FaHome />, form: 'housereg', formComponent: <RegisterHomeForm />, label: 'Register Home' },
    { icon: <FaClipboardList />, form: 'housedash', formComponent: <HouseManagementForm />, label: 'House Management' },
    { icon: <FaChartBar />, form: 'monitoring', formComponent: <MonitoringConsole />, label: 'Monitoring Console' },
  ];

  const renderContent = () => {
    const currentItem = navItems.find(item => item.form === activeForm);
    if (currentItem) {
      return (
        <div>
          {currentItem.formComponent} {/* Render the form component */}
          <div className="button-group">
            <button className="sign-in-btn" onClick={() => setIsAddingNew(!isAddingNew)}>
              {isAddingNew ? 'Back to Display' : 'Add/Update Info'}
            </button>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dash-dashboard" onTouchEnd={handleDoubleTap}>
      <nav className="dash-dashboard-nav">
        <ul>
          {navItems.map((item, index) => (
            <li key={index}>
              <button onClick={() => { setActiveForm(item.form); setIsAddingNew(false); }}>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Phone navigation toggle based on double-tap */}
      <div className={`dash-phone-nav-container ${isNavOpen ? 'open' : ''}`}>
        {isNavOpen && (
          <nav className="dash-phone-nav">
            <ul className="dash-nav-items" ref={navListRef}>
              {navItems.map((item, index) => (
                <li key={index} className="dash-nav-item">
                  <button
                    onClick={() => {
                      setActiveForm(item.form);
                      setIsNavOpen(false); // Close after form selection
                      setIsAddingNew(false);
                    }}>
                    {item.icon}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      <main className="dash-dashboard-content">
        <Header />
        <section className="mainsection">
          {renderContent()}
        </section>
        <Bottomnav />
      </main>
    </div>
  );
};

export default Dashboard;
