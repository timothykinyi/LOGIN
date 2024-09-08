import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/AuthForm.css';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [currentStep, setCurrentStep] = useState(1); // Multi-step state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    fullName: '',
    phoneNumber: '',
    dob: '',
    address: '',
    profilePicture: null,
    securityQuestion: '',
    securityAnswer: ''
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    const { email, password, confirmPassword, phoneNumber, dob, address, securityQuestion, securityAnswer } = formData;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Invalid email format.');
      return false;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return false;
    }

    if (!isLogin && password !== confirmPassword) {
      setErrorMessage("Passwords don't match.");
      return false;
    }

    if (!isLogin && !/^\d{10}$/.test(phoneNumber)) {
      setErrorMessage('Invalid phone number format.');
      return false;
    }

    if (!isLogin && !dob) {
      setErrorMessage('Date of birth is required.');
      return false;
    }

    if (!isLogin && !address) {
      setErrorMessage('Address is required.');
      return false;
    }

    if (!isLogin && !securityQuestion) {
      setErrorMessage('Security question is required.');
      return false;
    }

    if (!isLogin && !securityAnswer) {
      setErrorMessage('Security answer is required.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (!validateForm()) return;

    const formDataToSubmit = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key]) formDataToSubmit.append(key, formData[key]);
    });

    try {
      setLoading(true);
      const url = isLogin ? 'https://login-9ebe.onrender.com/api/auth/login' : 'https://login-9ebe.onrender.com/api/auth/register';
      const response = await fetch(url, {
        method: 'POST',
        body: formDataToSubmit,
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        setErrorMessage(data.message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setCurrentStep(1); // Reset to first step on form toggle
    setErrorMessage('');
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const previousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="container">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
            <input
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
            {!isLogin && (
              <input
                type={passwordVisible ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
              />
            )}
            <div className="toggle-password">
              <input
                type="checkbox"
                checked={passwordVisible}
                onChange={() => setPasswordVisible(!passwordVisible)}
              />
              <label>Show Password</label>
            </div>
            <button type="button" onClick={nextStep}>Next</button>
          </>
        )}

        {currentStep === 2 && !isLogin && (
          <>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" required />
            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" required />
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} placeholder="Date of Birth" required />
            <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" required />
            <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" required />
            <input
              type="file"
              name="profilePicture"
              accept="image/*"
              onChange={handleChange}
              placeholder="Profile Picture"
            />
            <input type="text" name="securityQuestion" value={formData.securityQuestion} onChange={handleChange} placeholder="Security Question" required />
            <input type="text" name="securityAnswer" value={formData.securityAnswer} onChange={handleChange} placeholder="Security Answer" required />
            <button type="button" onClick={previousStep}>Back</button>
            <button type="submit" disabled={loading}>{loading ? 'Loading...' : 'Register'}</button>
          </>
        )}

        {isLogin && (
          <button type="submit" disabled={loading}>{loading ? 'Loading...' : 'Login'}</button>
        )}

        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>

      <a className="toggle-link" onClick={toggleForm}>
        {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
      </a>
    </div>
  );
};

export default AuthForm;
