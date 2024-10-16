import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './styles/header.css';

const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const eID = sessionStorage.getItem('eID');
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const userId = sessionStorage.getItem('eID');
      const response = await axios.get(`https://login-9ebe.onrender.com/api/notifications/${userId}`);
      setNotifications(response.data);
      const unread = response.data.filter((n) => !n.isRead).length;
      setUnreadCount(unread); // Set unread count
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    if (eID) {
      fetchNotifications(); // This will now work since fetchNotifications is defined above
    }
  }, [eID]);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      markNotificationsAsRead();
    }
  };

  const markNotificationsAsRead = async () => {
    try {
      const userId = sessionStorage.getItem('eID');
      await axios.post(`https://login-9ebe.onrender.com/api/notifications/read-all/${userId}`);
      setUnreadCount(0); // Reset unread count after marking
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  return (
    <header className="dash-dashboard-header">
      <div className="header-content">
        {eID && <div className="header-eid">EiD: {eID}</div>}
        <div className="header-notifications">
          {/* Clicking the bell icon now only toggles notifications */}
          <button className="notification-button" onClick={toggleNotifications}>
            <FaBell />
            {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
          </button>
          
          {showNotifications && (
            <div className="notification-dropdown">
              {/* Display only unread notifications */}
              {notifications
                .filter(notification => !notification.isRead) // Only show unread notifications
                .map((notification, index) => (
                  <div key={index} className="notification-item unread">
                    {notification.message}
                  </div>
                ))}
              {/* "View All Notifications" Button to navigate to notifications page */}
              <button onClick={() => navigate('/notifications')}>
                View All Notifications
              </button>
            </div>
          )}


        </div>
      </div>
    </header>
  );
};

export default Header;
