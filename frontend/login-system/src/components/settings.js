import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Bottomnav from './BottomNavBar';
import Header from './header';
import './styles/setting.css';

const AppSettings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const navigate = useNavigate();
  // Handlers
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleNotifications = () => setNotificationsEnabled(!notificationsEnabled);
  const toggleBiometric = () => setBiometricEnabled(!biometricEnabled);
  const handleLanguageChange = (e) => setLanguage(e.target.value);
  const performLogout = async () => {
    try {
      const token = sessionStorage.getItem('userToken');
      const decodedToken = jwtDecode(token); // Decode the token
      const username = decodedToken?.username;

      if (!username) {
        console.error('Username is missing.');
        return;
      }

      await axios.post('https://login-9ebe.onrender.com/api/auth/logout', { username });

      // Clear the user token or session
      sessionStorage.removeItem('userToken'); // Clear user token
      sessionStorage.removeItem('eID'); // Clear user ID
      localStorage.removeItem('eID');
      localStorage.removeItem('userToken');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="seti-page">
      <Header />
      <section className="seti-settings-page">
        <h2 className="seti-page-title">Settings</h2>

        {/* Account Section */}
        <section className="seti-settings-section">
          <h3 className="seti-section-title">Account</h3>
          <div className="seti-account-buttons">
          <div className="button-group">
            <button className="sign-in-btn">Edit Profile</button>
            <button className="sign-in-btn">Change Password</button>
          </div>

          </div>
        </section>

        {/* App Preferences Section */}
        <section className="seti-settings-section">
          <h3 className="seti-section-title">App Preferences</h3>
          <div className="seti-settings-option">
            <label className="seti-option-label">Dark Mode</label>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={toggleDarkMode}
              className="seti-option-checkbox"
            />
          </div>
          <div className="seti-settings-option">
            <label className="seti-option-label">Language</label>
            <select
              value={language}
              onChange={handleLanguageChange}
              className="seti-option-select"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
            </select>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="seti-settings-section">
          <h3 className="seti-section-title">Notifications</h3>
          <div className="seti-settings-option">
            <label className="seti-option-label">Push Notifications</label>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={toggleNotifications}
              className="seti-option-checkbox"
            />
          </div>
        </section>

        {/* Security & Privacy Section */}
        <section className="seti-settings-section">
          <h3 className="seti-section-title">Security & Privacy</h3>
          <div className="seti-settings-option">
            <label className="seti-option-label">Enable Biometric Authentication</label>
            <input
              type="checkbox"
              checked={biometricEnabled}
              onChange={toggleBiometric}
              className="seti-option-checkbox"
            />
          </div>
          <div className="button-group">
            <button className="sign-in-btn">Manage Permissions</button>
            <button className="sign-in-btn">Clear Cache</button>
          </div>
        </section>

        {/* Logout Section */}
        <section className="seti-settings-section">
          <button className="seti-logout-button" onClick={performLogout}>Logout</button>
        </section>
      </section>

      <Bottomnav />
    </div>
  );
};

export default AppSettings;
