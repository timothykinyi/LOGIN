import React, { useEffect, useRef, useState } from 'react';
import { FaBriefcase, FaCogs, FaHeartbeat, FaMoneyBill, FaPhone, FaSignOutAlt, FaTimes, FaUniversity, FaUser, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './styles/gDashboard.css'; // Your prefixed CSS file

// Import both display and form components
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

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeForm, setActiveForm] = useState('personalInfo'); // State to track the active form
  const [isNavOpen, setIsNavOpen] = useState(false); // State for toggling navigation
  const [isAddingNew, setIsAddingNew] = useState(false); // State to toggle between display and form
  const [lastTap, setLastTap] = useState(0); // To track double-tap timing
  const navListRef = useRef(null); // Ref for the nav-items list to manipulate scrolling
  const scrollRef = useRef(null); // To keep track of auto-scroll state
  const eID = sessionStorage.getItem('eID');
  useEffect(() => {
    const eID = sessionStorage.getItem('eID');
    const token = sessionStorage.getItem('userToken');
    if (!eID || !token) {
      navigate('/');
      return;
    }
  }, [navigate]);

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
      }, 2000); // Adjust time interval to control scrolling speed
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    sessionStorage.removeItem('userToken'); // Clear user token
    sessionStorage.removeItem('eID'); // Clear user ID
    navigate('/login'); // Redirect to login page
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
    { icon: <FaSignOutAlt />, form: 'logout', label: 'Logout', isLogout: true }, // Added Logout item
  ];

  const renderContent = () => {
    const currentItem = navItems.find(item => item.form === activeForm);
    if (currentItem) {
      if (currentItem.isLogout) {
        handleLogout(); // Call handleLogout directly
        return null; // Render nothing as we are logging out
      }
      return (
        <div>
          {isAddingNew ? currentItem.formComponent : currentItem.display}
          <button className="dash-toggle-btn" onClick={toggleAddNew}>
            {isAddingNew ? 'Back to Display' : 'Add/Update Info'}
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dash-dashboard">
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
              {navItems.map((item, index) => (
                <li key={index} className="dash-nav-item">
                  <button onClick={() => { 
                      setActiveForm(item.form); 
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
      {eID && <div className="eID-display">User eID: {eID}</div>} {/* Display eID */}

        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
