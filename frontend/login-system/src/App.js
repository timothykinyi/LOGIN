// App.js
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ContactForm from './components/ContactForm';
import Dashboard from './components/Dashboard'; // Example of a protected route
import EducationForm from './components/EducationForm';
import EmploymentForm from './components/EmploymentForm';
import FinancialForm from './components/FinancialForm';
import HealthForm from './components/HealthForm';
import LoginForm from './components/Login';
import PersonalInfoForm from './components/PersonalInfoForm';
import PreferencesAndLifestyleForm from './components/PreferencesAndLifestyleForm';
import ProfileForm from './components/ProfileForm';
import RegisterForm from './components/RegisterForm';
import SocialAndFamilyForm from './components/SocialAndFamilyForm';
import Success from './components/Success';
import Verification from './components/Verification';
import Displaycontact from './components/displaycontact';
import Displayeducation from './components/displayeducation';
import Displayemployment from './components/displayemployment';
import Displayfinaces from './components/displayfinaces';
import Displayhealth from './components/displayhealth';
import Displaypreference from './components/displaypreference';
import GDashboard from './components/gDashboard';
import Passwordrecovery from './components/passwordreset';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/reset-password" element={<Passwordrecovery />} />
        <Route path="/success" element={<Success />} />
        <Route path="/profileForm" element={<ProfileForm />} />
        <Route path="/gDashboard/personalinfoForm" element={<PersonalInfoForm />} />
        <Route path="/gDashboard/educationForm" element={<EducationForm />} />
        <Route path="/gDashboard/contactForm" element={<ContactForm />} />
        <Route path="/gDashboard/healthForm" element={<HealthForm />} />
        <Route path="/gDashboard/employmentForm" element={<EmploymentForm />} />
        <Route path="/gDashboard/financialForm" element={<FinancialForm />} />
        <Route path="/gDashboard/socialAndFamilyForm" element={<SocialAndFamilyForm />} />
        <Route path="/gDashboard/preferencesAndLifestyleForm" element={<PreferencesAndLifestyleForm />} />
        <Route path="/gDashboard" element={<GDashboard />} />
        <Route path="/showcontact" element={<Displaycontact />} />
        <Route path="/displayeducation" element={<Displayeducation />} />
        <Route path="/displayemployment" element={<Displayemployment />} />
        <Route path="/displayfinaces" element={<Displayfinaces />} />
        <Route path="/displayhealth" element={<Displayhealth />} />
        <Route path="/displaypreference" element={<Displaypreference />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
