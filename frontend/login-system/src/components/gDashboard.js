import React, { useEffect, useRef, useState } from 'react';
import { FaBriefcase, FaCogs, FaHeartbeat, FaMoneyBill, FaPhone, FaTimes, FaUniversity, FaUser, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './styles/gDashboard.css';

import ContactForm from './ContactForm';
import EducationForm from './EducationForm';
import EmploymentForm from './EmploymentForm';
import FinancialForm from './FinancialForm';
import HealthForm from './HealthForm';
import PersonalInfoForm from './PersonalInfoForm';
import PreferencesAndLifestyleForm from './PreferencesAndLifestyleForm';
import SocialAndFamilyForm from './SocialAndFamilyForm';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeForm, setActiveForm] = useState(''); // State to track the active form
  const [isNavOpen, setIsNavOpen] = useState(false); // State for toggling navigation
  const [lastTap, setLastTap] = useState(0); // To track double-tap timing
  const navListRef = useRef(null); // Ref for the nav-items list to manipulate scrolling

  useEffect(() => {
    const eID = sessionStorage.getItem('eID');
    const token = sessionStorage.getItem('userToken');
    if (!eID || !token) {
      navigate('/');
      return;
    }
  }, [navigate]);

  // Function to toggle navigation menu
  const toggleNav = () => {
    setIsNavOpen(!isNavOpen); // Toggle the nav open/close state
  };

  // Function to close nav
  const closeNav = () => {
    setIsNavOpen(false);
  };

  // Double-tap detection and toggling the nav
  const handleDoubleTap = (e) => {
    const currentTime = new Date().getTime();
    const tapGap = currentTime - lastTap;

    if (tapGap < 300 && tapGap > 0) {
      // If two taps occurred within 300ms, toggle the nav (open if closed, close if open)
      setIsNavOpen((prevState) => !prevState);
    }

    setLastTap(currentTime);
  };

  useEffect(() => {
    // Add event listener for double-tap detection
    window.addEventListener('touchend', handleDoubleTap);

    return () => {
      // Clean up event listener
      window.removeEventListener('touchend', handleDoubleTap);
    };
  }, [lastTap]);

  // Function to handle the infinite scrolling effect
  const handleScroll = () => {
    const navList = navListRef.current;
    const maxScrollLeft = navList.scrollWidth - navList.clientWidth;
    
    if (navList.scrollLeft === 0) {
      navList.scrollLeft = maxScrollLeft; // Loop back to the end
    } else if (navList.scrollLeft >= maxScrollLeft) {
      navList.scrollLeft = 0; // Loop back to the start
    }
  };

  const navItems = [
    { icon: <FaUser />, form: 'personalinfoForm', label: 'Personal Info' },
    { icon: <FaUniversity />, form: 'educationForm', label: 'Education' },
    { icon: <FaPhone />, form: 'contactForm', label: 'Contact' },
    { icon: <FaHeartbeat />, form: 'healthForm', label: 'Health' },
    { icon: <FaBriefcase />, form: 'employmentForm', label: 'Employment' },
    { icon: <FaMoneyBill />, form: 'financialForm', label: 'Financial' },
    { icon: <FaUsers />, form: 'socialAndFamilyForm', label: 'Social and Family' },
    { icon: <FaCogs />, form: 'preferencesAndLifestyleForm', label: 'Preferences and Lifestyle' },
  ];

  const renderForm = () => {
    switch (activeForm) {
      case 'personalinfoForm':
        return <PersonalInfoForm />;
      case 'educationForm':
        return <EducationForm />;
      case 'contactForm':
        return <ContactForm />;
      case 'healthForm':
        return <HealthForm />;
      case 'employmentForm':
        return <EmploymentForm />;
      case 'financialForm':
        return <FinancialForm />;
      case 'socialAndFamilyForm':
        return <SocialAndFamilyForm />;
      case 'preferencesAndLifestyleForm':
        return <PreferencesAndLifestyleForm />;
      default:
        return <PersonalInfoForm />;
    }
  };

  return (
    <div className="dashboard">
      {/* Main navigation for larger screens */}
      <nav className="dashboard-nav">
        <ul>
          {navItems.map((item, index) => (
            <li key={index}><button onClick={() => setActiveForm(item.form)}>{item.label}</button></li>
          ))}
        </ul>
      </nav>

      {/* Bottom Navigation for mobile view */}
      <div className={`phone-nav-container ${isNavOpen ? 'open' : ''}`}>
        {isNavOpen && (
          <nav className="phone-nav">
            {/* Close button inside nav */}
            <button className="close-btn" onClick={closeNav}>
              <FaTimes />
            </button>

            <ul className="nav-items" ref={navListRef} onScroll={handleScroll}>
              {navItems.map((item, index) => (
                <li key={index} className="nav-item">
                  <button onClick={() => setActiveForm(item.form)}>
                    {item.icon}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      {/* Main content area */}
      <main className="dashboard-content">
        {renderForm()}
      </main>
    </div>
  );
};

export default Dashboard;
