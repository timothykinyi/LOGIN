// App.js
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard'; // Example of a protected route
import LoginForm from './components/Login';
import RegisterForm from './components/RegisterForm';
import Success from './components/Success';
import Verification from './components/Verification';
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
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
