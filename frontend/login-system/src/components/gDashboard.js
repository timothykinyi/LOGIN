// Dashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/gDashboard.css'; // Ensure to import the CSS file for dashboard styling

// Import individual form components
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
  useEffect(() => {
    const eID = sessionStorage.getItem('eID');
    const token = sessionStorage.getItem('userToken');
  if (!eID || !token)
    {
      navigate('/');
      return;
    }
  },[navigate]);
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
        return <div>Please select a form to view.</div>;
    }
  };

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <ul>
          <li><button onClick={() => setActiveForm('personalinfoForm')}>Personal Info</button></li>
          <li><button onClick={() => setActiveForm('educationForm')}>Education</button></li>
          <li><button onClick={() => setActiveForm('contactForm')}>Contact</button></li>
          <li><button onClick={() => setActiveForm('healthForm')}>Health</button></li>
          <li><button onClick={() => setActiveForm('employmentForm')}>Employment</button></li>
          <li><button onClick={() => setActiveForm('financialForm')}>Financial</button></li>
          <li><button onClick={() => setActiveForm('socialAndFamilyForm')}>Social and Family</button></li>
          <li><button onClick={() => setActiveForm('preferencesAndLifestyleForm')}>Preferences and Lifestyle</button></li>
          {/* Add more buttons as necessary */}
        </ul>
      </nav>
      <main className="dashboard-content">
        {renderForm()}
      </main>
    </div>
  );
};

export default Dashboard;
