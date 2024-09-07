import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressIndicator from './ProgressIndicator'; // Import the Progress Indicator component
import './RegisterForm.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    fullName: '',
    phoneNumber: '',
    dob: '',
    address: '',
    securityQuestion: '',
    securityAnswer: '',
    occupation: '', // New field
    gender: '', // New field
    maritalStatus: '' // New field
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateStep = () => {
    const errors = {};
    const { email, password, confirmPassword, username, fullName, phoneNumber, dob, address, securityQuestion, securityAnswer, occupation, gender, maritalStatus } = formData;

    if (currentStep === 4) {
      const emailRegex = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]{1,64}@[a-zA-Z0-9.-]{1,255}\.[a-zA-Z]{2,}$/;

      if (!emailRegex.test(email)) errors.email = 'Invalid email format.';

      if (password.length < 8) errors.password = 'Password must be at least 8 characters.';
      if (!/[A-Z]/.test(password)) errors.password = 'Password must contain at least one uppercase letter.';
      if (!/[a-z]/.test(password)) errors.password = 'Password must contain at least one lowercase letter.';
      if (!/[0-9]/.test(password)) errors.password = 'Password must contain at least one number.';
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.password = 'Password must contain at least one special character.';
      if (password !== confirmPassword) errors.confirmPassword = "Passwords don't match.";
    }

    if (currentStep === 1) {
      if (!/^[a-zA-Z_]{4,} [a-zA-Z_]{4,}$/.test(fullName)) errors.fullName = 'Full Name must have two names each with at least 4 characters and have no digits, ensuring there is a space between the two names.';
      if (!/^[a-zA-Z_]{4,}$/.test(username)) errors.username = "Username must be at least 4 characters and have no digits.";
      if (!/^(07|01)\d{8}$/.test(phoneNumber)) errors.phoneNumber = 'Invalid phone number format.';
    }

    if (currentStep === 2) {
      if (!dob) errors.dob = 'Date of birth is required.';
      if (!address) errors.address = 'Address is required.';
      if (!securityQuestion) errors.securityQuestion = 'Security question is required.';
      if (!securityAnswer) errors.securityAnswer = 'Security answer is required.';
    }

    if (currentStep === 3) {
      if (!occupation) errors.occupation = 'Occupation is required.';
      if (!gender) errors.gender = 'Gender is required.';
      if (!maritalStatus) errors.maritalStatus = 'Marital status is required.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (!validateStep()) return;

    const formDataToSubmit = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key]) formDataToSubmit.append(key, formData[key]);
    });

    try {
      setLoading(true);
      const response = await fetch('https://login-9ebe.onrender.com/api/auth/register', {
        method: 'POST',
        body: formDataToSubmit,
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        navigate('/login');
      } else {
        setErrorMessage(data.error || 'An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  const nextStep = () => {
    if (validateStep()) setCurrentStep(currentStep + 1);
  };

  const previousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <ProgressIndicator currentStep={currentStep} /> {/* Add Progress Indicator */}
      <form onSubmit={handleSubmit}>

        {currentStep === 1 && (
          <div className="form-step">
            <div className="form-group">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                required
              />
              {formErrors.fullName && <p className="error-message">{formErrors.fullName}</p>}
            </div>
            <div className="form-group">
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
                required
              />
              {formErrors.phoneNumber && <p className="error-message">{formErrors.phoneNumber}</p>}
            </div>
            <div className="form-group">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                required
              />
              {formErrors.username && <p className="error-message">{formErrors.username}</p>}
            </div>
            <button type="button" onClick={nextStep} disabled={loading}>
              Next
            </button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="form-step">
            <div className="form-group">
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                placeholder="Date of Birth"
                required
              />
              {formErrors.dob && <p className="error-message">{formErrors.dob}</p>}
            </div>
            <div className="form-group">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                required
              />
              {formErrors.address && <p className="error-message">{formErrors.address}</p>}
            </div>
            <div className="form-group">
              <input
                type="text"
                name="securityQuestion"
                value={formData.securityQuestion}
                onChange={handleChange}
                placeholder="Security Question"
                required
              />
              {formErrors.securityQuestion && <p className="error-message">{formErrors.securityQuestion}</p>}
            </div>
            <div className="form-group">
              <input
                type="text"
                name="securityAnswer"
                value={formData.securityAnswer}
                onChange={handleChange}
                placeholder="Security Answer"
                required
              />
              {formErrors.securityAnswer && <p className="error-message">{formErrors.securityAnswer}</p>}
            </div>
            <button type="button" onClick={previousStep}>Back</button>
            <button type="button" onClick={nextStep} disabled={loading}>
              Next
            </button>
            
          </div>
        )}

        {currentStep === 3 && (
          <div className="form-step">
            <div className="form-group">
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                placeholder="Occupation"
                required
              />
              {formErrors.occupation && <p className="error-message">{formErrors.occupation}</p>}
            </div>
            <div className="form-group">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {formErrors.gender && <p className="error-message">{formErrors.gender}</p>}
            </div>
            <div className="form-group">
              <select
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                required
              >
                <option value="">Select Marital Status</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </select>
              {formErrors.maritalStatus && <p className="error-message">{formErrors.maritalStatus}</p>}
            </div>
            <button type="button" onClick={previousStep}>Back</button>
            <button type="button" onClick={nextStep} disabled={loading}>
              Next
            </button>
          </div>
        )}
        {currentStep === 4 && (
          <div className="form-step">
            <div className="form-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
              {formErrors.email && <p className="error-message">{formErrors.email}</p>}
            </div>
            <div className="form-group">
              <input
                type={passwordVisible ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
              />
              {formErrors.password && <p className="error-message">{formErrors.password}</p>}
            </div>
            <div className="form-group">
              <input
                type={passwordVisible ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
              />
              {formErrors.confirmPassword && <p className="error-message">{formErrors.confirmPassword}</p>}
            </div>
            <button type="button" onClick={previousStep}>Back</button>
            <button type="submit" disabled={loading}>
              Register
            </button>
            
          </div>
        )}
        {loading && <div className="loader">Loading...</div>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
      <a className="toggle-link" href="/login">Already have an account? Login</a>
    </div>
  );
};

export default RegisterForm;
