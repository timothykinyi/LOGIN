import axios from 'axios'; // Import axios
import { jwtDecode } from 'jwt-decode'; // Correctly import jwtDecode
import React, { useEffect, useRef, useState } from 'react';
import { FaBell, FaBriefcase, FaCogs, FaHeartbeat, FaMoneyBill, FaPhone, FaShareAlt, FaTimes, FaUniversity, FaUser, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { register } from '../serviceWorkerRegistration';
import './styles/gDashboard.css'; // Your prefixed CSS file
// Import both display and form components
import Bottomnav from './BottomNavBar';
import ContactForm from './ContactForm';
import EducationForm from './EducationForm';
import EmploymentForm from './EmploymentForm';
import FinancialForm from './FinancialForm';
import HealthForm from './HealthForm';
import PersonalInfoForm from './PersonalInfoForm';
import PreferencesAndLifestyleForm from './PreferencesAndLifestyleForm';
import SocialAndFamilyForm from './SocialAndFamilyForm';
import DisplayContact from './displaycontact';
import DisplayEducation from './displayeducation';
import DisplayEmployment from './displayemployment';
import DisplayFinancial from './displayfinaces';
import DisplayHealth from './displayhealth';
import DisplayPersonalInfo from './displaypersonaldata';
import DisplayPreferencesAndLifestyle from './displaypreference';
import DisplaySocialAndFamily from './displaysocialFamily';
import Header from './header';

import DataShare from './DataShare';


const Dashboard = () => {
  const navigate = useNavigate();
  const [activeForm, setActiveForm] = useState('personalInfo'); // State to track the active form
  const [isNavOpen, setIsNavOpen] = useState(false); // State for toggling navigation
  const [isAddingNew, setIsAddingNew] = useState(false); // State to toggle between display and form
  const [lastTap, setLastTap] = useState(0); // To track double-tap timing
  const [swipeStart, setSwipeStart] = useState(null); // State to track the start position of a swipe
  const navListRef = useRef(null); // Ref for the nav-items list to manipulate scrolling
  const scrollRef = useRef(null); // To keep track of auto-scroll state
  const eID = sessionStorage.getItem('eID');
  const [notifications, setNotifications] = useState([]); // Holds fetched notifications
  const [unreadCount, setUnreadCount] = useState(0); // Holds the count of unread notifications
  const [showNotifications, setShowNotifications] = useState(false); // Toggle notification dropdown
  const [showAllNotifications, setShowAllNotifications] = useState(false); // State to toggle between all notifications and unread only

  
  useEffect(() => {
    const token = sessionStorage.getItem('userToken');
    if (!eID || !token) {
      navigate('/');
      return;
    }

    // Fetch notifications on load
    fetchNotifications();
    register();
  }, [navigate]);

  useEffect(() => {
    if ('Notification' in window && navigator.serviceWorker) {
      Notification.requestPermission().then((result) => {
        if (result === 'granted') {
          console.log('Notification permission granted.');
        }
      });
    }
  }, []);

  
  const triggerPhoneNotification = (message) => {
    if ('serviceWorker' in navigator && 'Notification' in window && Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification('EiD Notification', {
          body: message,
          icon: '../favicon.ico', // Path to the notification icon
          image: FaBell, // Optional image to display in notification
          badge: '../favicon.ico', // Small icon for the notification
          vibrate: [200, 100, 200], // Longer vibration pattern for emphasis
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
  
          // Sound can be simulated with vibrate pattern; no direct sound support in web notifications
          silent: false, // Set to true if you don't want a sound notification
        });
      });
    }
  };
  
    
  // Function to fetch notifications
  const fetchNotifications = async () => {
    try {
      const userId = sessionStorage.getItem('eID');
      const response = await axios.get(`https://login-9ebe.onrender.com/api/notifications/${userId}`);
      setNotifications(response.data);
      const unread = response.data.filter((n) => !n.isRead).length;
      triggerPhoneNotification ('You are now logged in');
      setUnreadCount(unread); // Set unread count
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Function to perform logout
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

  const toggleAddNew = () => {
    setIsAddingNew(!isAddingNew);
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleDoubleTap = (e) => {
    const currentTime = new Date().getTime();
    const tapGap = currentTime - lastTap;

    if (tapGap < 300 && tapGap > 0) {
      setIsNavOpen((prevState) => !prevState);
    }

    setLastTap(currentTime);
  };

  useEffect(() => {
    window.addEventListener('touchend', handleDoubleTap);

    return () => {
      window.removeEventListener('touchend', handleDoubleTap);
    };
  }, [lastTap]);

  const handleScroll = () => {
    const navList = navListRef.current;
    const maxScrollLeft = navList.scrollWidth - navList.clientWidth;

    if (navList.scrollLeft === 0) {
      navList.scrollLeft = maxScrollLeft;
    } else if (navList.scrollLeft >= maxScrollLeft) {
      navList.scrollLeft = 0;
    }
  };

  const handleScrollLoop = () => {
    const navList = navListRef.current;

    if (!scrollRef.current) {
      scrollRef.current = setInterval(() => {
        if (navList.scrollTop + navList.clientHeight >= navList.scrollHeight) {
          // Reached the bottom, scroll to the top
          navList.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        } else {
          // Scroll down incrementally
          navList.scrollBy({
            top: 50,
            behavior: 'smooth',
          });
        }
      }, 3000); // Adjust time interval to control scrolling speed
    }
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setSwipeStart(touch.clientX); // Set the swipe start position
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const swipeDistance = touch.clientX - swipeStart;

    if (swipeStart !== null) {
      if (swipeDistance > 100) { // Right swipe
        changeForm(-1); // Change to previous form
        setSwipeStart(null); // Reset the swipe start position
      } else if (swipeDistance < -100) { // Left swipe
        changeForm(1); // Change to next form
        setSwipeStart(null); // Reset the swipe start position
      }
    }
  };

  // Toggle notification dropdown
  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications); // Toggle visibility
    markNotificationsAsRead(); // Mark as read when opened
  };

  // Mark all notifications as read
  const markNotificationsAsRead = async () => {
    try {
      const userId = sessionStorage.getItem('eID');
      await axios.post(`https://login-9ebe.onrender.com/api/notifications/read-all/${userId}`);
      setUnreadCount(0); // Reset unread count after marking
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const changeForm = (direction) => {
    const currentIndex = navItems.findIndex(item => item.form === activeForm);
    const newIndex = (currentIndex + direction + navItems.length) % (navItems.length); // Exclude logout
    setActiveForm(navItems[newIndex].form);
  };

  const navItems = [
    { icon: <FaUser />, form: 'personalInfo', display: <DisplayPersonalInfo />, formComponent: <PersonalInfoForm />, label: 'Personal Info' },
    { icon: <FaUniversity />, form: 'education', display: <DisplayEducation />, formComponent: <EducationForm />, label: 'Education' },
    { icon: <FaPhone />, form: 'contact', display: <DisplayContact />, formComponent: <ContactForm />, label: 'Contact' },
    { icon: <FaHeartbeat />, form: 'health', display: <DisplayHealth />, formComponent: <HealthForm />, label: 'Health' },
    { icon: <FaBriefcase />, form: 'employment', display: <DisplayEmployment />, formComponent: <EmploymentForm />, label: 'Employment' },
    { icon: <FaMoneyBill />, form: 'financial', display: <DisplayFinancial />, formComponent: <FinancialForm />, label: 'Financial' },
    { icon: <FaUsers />, form: 'socialFamily', display: <DisplaySocialAndFamily />, formComponent: <SocialAndFamilyForm />, label: 'Social and Family' },
    { icon: <FaCogs />, form: 'preferences', display: <DisplayPreferencesAndLifestyle />, formComponent: <PreferencesAndLifestyleForm />, label: 'Preferences and Lifestyle' },
    { icon: <FaShareAlt />, form: 'dataShare', display: <DataShare />, label: 'Share Data' },
  ];

  const renderContent = () => {
    const currentItem = navItems.find(item => item.form === activeForm);
    if (currentItem) {
      if (currentItem.isLogout) {
        performLogout(); // Call performLogout directly
        return null; // Render nothing as we are logging out
      }
      return (
        <div>
          {isAddingNew ? currentItem.formComponent : currentItem.display}
          <div className="button-group">
            <button className="sign-in-btn" onClick={toggleAddNew}>
              {isAddingNew ? 'Back to Display' : 'Add/Update Info'}
            </button>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dash-dashboard" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}>
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

      <div className={`dash-phone-nav-container ${isNavOpen ? 'open' : ''}`}>
        {isNavOpen && (
          <nav className="dash-phone-nav">
            <button className="dash-close-btn" onClick={() => setIsNavOpen(false)}>
              <FaTimes />
            </button>
            <ul className="dash-nav-items" ref={navListRef} onScroll={handleScrollLoop}>
              {/* Create a continuous scrolling effect by duplicating nav items */}
              {[...navItems].map((item, index) => (
                <li key={index} className="dash-nav-item">
                  <button
                    onClick={() => {
                      {
                        setActiveForm(item.form);
                        setIsAddingNew(false);
                      }
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
        <Header/>
        <section className="mainsection">
        {renderContent()}
        </section>
        <Bottomnav/>
      </main>
      
    </div>
  );
};

export default Dashboard;
