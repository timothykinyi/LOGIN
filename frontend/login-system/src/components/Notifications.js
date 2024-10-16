import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './styles/notifications.css';

const Notifications = () => {
  const navigate = useNavigate();
  const eID = sessionStorage.getItem('eID');
  const [notifications, setNotifications] = useState([]); // Holds fetched notifications
  const [unreadCount, setUnreadCount] = useState(0); // Holds the count of unread notifications

  // Function to trigger phone notification
  const triggerPhoneNotification = (message) => {
    if ('serviceWorker' in navigator && 'Notification' in window && Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification('EiD Notification', {
          body: message,
          icon: '../favicon.ico', // Path to the notification icon
          badge: '../favicon.ico', // Small icon for the notification
          vibrate: [200, 100, 200], // Vibration pattern for emphasis
          tag: 'eid-notification', // Unique tag to group notifications
          renotify: true, // Replace previous notifications with the same tag
  
          actions: [
            { action: 'view', title: 'View Details', icon: '../images/view-icon.png' },
            { action: 'dismiss', title: 'Dismiss', icon: '../images/dismiss-icon.png' },
          ],
  
          data: {
            dateOfArrival: Date.now(),
            primaryKey: 1,
          },
  
          silent: false, // Set to true if you don't want a sound notification
        });
      });
    }
  };

  // Function to fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`https://login-9ebe.onrender.com/api/notifications/${eID}`);
      const fetchedNotifications = response.data;

      setNotifications(fetchedNotifications);
      
      // Filter unread notifications
      const unreadNotifications = fetchedNotifications.filter((n) => !n.isRead);
      const unread = unreadNotifications.length;
      
      setUnreadCount(unread); // Set unread count

      // Trigger phone notification for each unread notification
      unreadNotifications.forEach((notification) => {
        triggerPhoneNotification(notification.message); // Pass the message to the phone notification
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Mark all notifications as read when the notification section is opened
  const markAllAsReadOnOpen = async () => {
    try {
      await axios.post(`https://login-9ebe.onrender.com/api/notifications/read-all/${eID}`);
      setUnreadCount(0); // Reset unread count after marking
      fetchNotifications(); // Refresh notification list after marking
    } catch (error) {
      console.error('Error marking notifications as read on open:', error);
    }
  };

  // Calculate time difference for display
  const timeSince = (date) => {
    const now = new Date();
    const timeSent = new Date(date);
    const diffInSeconds = Math.floor((now - timeSent) / 1000); // Time difference in seconds

    if (diffInSeconds < 60) {
      return `${diffInSeconds}s ago`; // Less than a minute
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`; // Less than an hour
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`; // Less than a day
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`; // Less than a week
    } else {
      return timeSent.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }); // Over a week
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem('userToken');
    if (!eID || !token) {
      navigate('/');
      return;
    }

    // Fetch notifications on load and mark them as read automatically
    fetchNotifications();
    markAllAsReadOnOpen(); // Mark all as read when opening the notifications section
  }, [navigate, eID]);

  return (
    <div className="nav-notifications">
      <header className="nav-notifications-header">
        <div className="nav-notificationsdiv">
          <h2>Notifications ({unreadCount})</h2>
        </div>
        <button className="nav-close-btn" onClick={() => navigate('/dDashboard')}>
          <FaTimes />
        </button>
      </header>

      <div className="nav-notification-list">
        {notifications.length === 0 ? (
          <p>No notifications available.</p>
        ) : (
          notifications.map((notification, index) => (
            <div
              key={index}
              className={`nav-notification-item ${notification.isRead ? 'nav-read' : 'nav-unread'}`}
            >
              <p className='nav-notification-p'>{notification.message}</p>
              <span className="nav-notification-date">{timeSince(notification.timeSent)}</span> {/* Show notification date */}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
