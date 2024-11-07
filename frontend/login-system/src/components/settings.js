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
  const eID = sessionStorage.getItem('eID');

  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [changeUsername, setChangeUsername] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [changeEmail, setChangeEmail] = useState(false);
  const [changePhoneNumber, setChangePhoneNumber] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');


  const handleSaveUsername = async () => {
    setError(null);
    setMessage(null);
    if (!/^[a-zA-Z0-9_]{4,}$/.test(newUsername)) {
      setError('Username must be at least 4 characters long and contain only letters, numbers, or underscores.');
      return;
    } else {
      try {
        const response = await axios.post('https://login-9ebe.onrender.com/api/auth/changeusername', { eID, newUsername });
        setMessage(response.data.message);
        setError(null);
        sessionStorage.setItem('userToken', response.data.token);
      } catch (error) {
        setError(error.response?.data?.message || 'An error occurred while processing your request.');
      }
    }
  };

  const handleSavePassword = async () => {
    setError(null);
    setMessage(null);
    if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      setError('Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, and a special character.');
      return;
    } else if (newPassword !== confirmPassword) {
      setError('The passwords do not match!');
      return;
    } else {
      try {
        const response = await axios.post('https://login-9ebe.onrender.com/api/auth/changepassword', { eID, newPassword });
        setMessage(response.data.message);
        setError(null);
        sessionStorage.setItem('userToken', response.data.token);
      } catch (error) {
        setError(error.response?.data?.message || 'An error occurred while processing your request.');
      }
    }
  };

  const handleSaveEmail = async () => {
    setError(null);
    setMessage(null);
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(newEmail)) {
      setError('Please enter a valid Gmail address (e.g., yourname@gmail.com).');
      return;
    } else {
      try {
        const response = await axios.post('https://login-9ebe.onrender.com/api/auth/changeemail', { eID, newEmail });
        setMessage(response.data.message);
        setError(null);
        sessionStorage.setItem('userToken', response.data.token);
      } catch (error) {
        setError(error.response?.data?.message || 'An error occurred while updating the email.');
      }
    }
  };

  const handleSavePhoneNumber = async () => {
    setError(null);
    setMessage(null);
    if (!/^(07|01)\d{8}$/.test(newPhoneNumber)) {
      setError('Please enter a valid 10-digit phone number starting with 07 or 01.');
      return;
    } else {
      try {
        const response = await axios.post('https://login-9ebe.onrender.com/api/auth/changephonenumber', { eID, newPhoneNumber });
        setMessage(response.data.message);
        setError(null);
        sessionStorage.setItem('userToken', response.data.token);
      } catch (error) {
        setError(error.response?.data?.message || 'An error occurred while processing your request.');
      }
    }
  };

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
          <button className="settings-button" onClick={() => setChangeUsername(!changeUsername)}>Change Username</button>
        <button className="settings-button" onClick={() => setChangePassword(!changePassword)}>Change Password</button>
        <button className="settings-button" onClick={() => setChangeEmail(!changeEmail)}>Change Email</button>
        <button className="settings-button" onClick={() => setChangePhoneNumber(!changePhoneNumber)}>Change Phone Number</button>
          </div>
          <form>
            {changeUsername && (
              <div>
                <label>New Username:</label>
                <input type="text" name="username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} required />
                <button type="button" onClick={handleSaveUsername}>Save Username</button>
              </div>
            )}
            {changePassword && (
              <div>
                <label>New Password:</label>
                <input type="password" name="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                <label>Confirm Password:</label>
                <input type="password" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                <button type="button" onClick={handleSavePassword}>Save Password</button>
              </div>
            )}
            {changeEmail && (
              <div>
                <label>New Email:</label>
                <input type="email" name="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required />
                <button type="button" onClick={handleSaveEmail}>Save Email</button>
              </div>
            )}
            {changePhoneNumber && (
              <div>
                <label>Phone Number:</label>
                <input type="text" name="phoneNumber" placeholder="07XXXXXXXX or 01XXXXXXXX" value={newPhoneNumber} onChange={(e) => setNewPhoneNumber(e.target.value)} required />
                <button type="button" onClick={handleSavePhoneNumber}>Save Phone Number</button>
              </div>
            )}
            {message && <p className="message">{message}</p>}
            {error && <p className="error">{error}</p>}
          </form>
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
