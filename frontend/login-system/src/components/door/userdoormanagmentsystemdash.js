// Dashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/gDashboard.css'; // Ensure to import the CSS file for dashboard styling

// Import individual form components
import Doormanagment from './doormanagment';
import Phonedoor from './phonedoor';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeForm, setActiveForm] = useState(''); // State to track the active form
  useEffect(() => {
    const eID = sessionStorage.getItem('eID');
    const token = sessionStorage.getItem('userToken');
  if (!eID || !token)
    {
     //navigate('/');
      return;
    }
  },[navigate]);
  const renderForm = () => {
    switch (activeForm) {
      case 'doormanagment':
        return <Doormanagment />;
      case 'phonedoor':
        return <Phonedoor />;
      default:
        return <div>Please select a form to view.</div>;
    }
  };

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <ul>
          <li><button onClick={() => setActiveForm('doormanagment')}>Door managment</button></li>
          <li><button onClick={() => setActiveForm('phonedoor')}>Phone door</button></li>
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
