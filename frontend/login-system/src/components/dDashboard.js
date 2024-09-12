// Dashboard.js
import React, { useState } from 'react';
import './styles/gDashboard.css'; // Ensure to import the CSS file for dashboard styling

// Import individual form components
import ContactForm from './displaycontact';
import EducationForm from './displayeducation';
import EmploymentForm from './displayemployment';
import FinancialForm from './displayfinaces';
import HealthForm from './displayhealth';
import PersonalInfoForm from './displaypersonaldata';
import PreferencesAndLifestyleForm from './displaypreference';
import SocialAndFamilyForm from './displaysocialFamily';

const Dashboard = () => {
  const [activeForm, setActiveForm] = useState(''); // State to track the active form

  const renderForm = () => {
    switch (activeForm) {
      case 'displaypersonaldata':
        return <PersonalInfoForm />;
      case 'displayeducation':
        return <EducationForm />;
      case 'displaycontact':
        return <ContactForm />;
      case 'displayhealth':
        return <HealthForm />;
      case 'displayemployment':
        return <EmploymentForm />;
      case 'displayfinaces':
        return <FinancialForm />;
      case 'displaysocialFamily':
        return <SocialAndFamilyForm />;
      case 'displaypreference':
        return <PreferencesAndLifestyleForm />;
      default:
        return <div>Please select a form to view.</div>;
    }
  };

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <ul>
          <li><button onClick={() => setActiveForm('displaypersonaldata')}>Personal Info</button></li>
          <li><button onClick={() => setActiveForm('displayeducation')}>Education</button></li>
          <li><button onClick={() => setActiveForm('displaycontact')}>Contact</button></li>
          <li><button onClick={() => setActiveForm('displayhealth')}>Health</button></li>
          <li><button onClick={() => setActiveForm('displayemployment')}>Employment</button></li>
          <li><button onClick={() => setActiveForm('displayfinaces')}>Financial</button></li>
          <li><button onClick={() => setActiveForm('displaysocialFamily')}>Social and Family</button></li>
          <li><button onClick={() => setActiveForm('displaypreference')}>Preferences and Lifestyle</button></li>
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
