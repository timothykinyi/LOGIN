import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProgressIndicator from './ProgressIndicator'; // Import the Progress Indicator
import './styles/RegisterForm.css';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    username: '',
    dateOfBirth: '',
    gender: '',
    category: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [formErrors, setFormErrors] = useState({});
  const [isNextEnabled, setIsNextEnabled] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    validateField(name, value);
  };

  // Validate individual fields
  const validateField = (name, value) => {
    const errors = { ...formErrors };

    switch (name) {
      case 'fullName':
        errors.fullName = !/^[a-zA-Z_]{4,}$/.test(value)
          ? 'Full Name must have at least 4 characters and have no digits.'
          : '';
        break;
      case 'email':
        errors.email = !/^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]{1,64}@[a-zA-Z0-9.-]{1,255}\.[a-zA-Z]{2,}$/.test(value)
          ? 'Please enter a valid email.'
          : '';
        break;
      case 'username':
        errors.username = !/^[\d]{6,}$/.test(value)
          ? 'Username must be at 6 digits long'
          : '';
        break;
      case 'password':
        errors.password = value.length < 8
          ? 'Password must be at least 8 characters long.'
          : !/[A-Z]/.test(value)
            ? 'Password must contain at least one uppercase letter.'
            : !/[a-z]/.test(value)
              ? 'Password must contain at least one lowercase letter.'
              : !/[0-9]/.test(value)
                ? 'Password must contain at least one number.'
                : !/[!@#$%^&*(),.?":{}|<>]/.test(value)
                  ? 'Password must contain at least one special character.'
                  : '';
        break;
      case 'confirmPassword':
        errors.confirmPassword = value !== formData.password
          ? "Passwords don't match."
          : '';
        break;
      case 'category':
        errors.category = !value ? 'Category is required.' : '';
        break;
      default:
        break;
    }

    setFormErrors(errors);
    return errors[name] === '';
  };

  // Validate the current step's fields
  const validateCurrentStep = () => {
    const fields = [];

    if (currentStep === 1) {
      fields.push('fullName', 'email', 'username');
    } else if (currentStep === 2) {
      fields.push('password', 'confirmPassword');
    } else if (currentStep === 3) {
      fields.push('category');
    }

    let isValid = true;
    fields.forEach((field) => {
      const value = formData[field];
      if (!validateField(field, value)) {
        isValid = false;
      }
    });

    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post('https://login-9ebe.onrender.com/api/auth/companyregister', formData);
      setMessage(response.data.message);
      sessionStorage.setItem('email', formData.email);
      navigate('/companyVerification');
    } catch (error) {
      setMessage(
        error.response && error.response.data
          ? error.response.data.message
          : 'An error occurred while processing your request.'
      );
    }
    setLoading(false);
  };

  // Proceed to the next step if the current step is valid
  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // Go back to the previous step
  const previousStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // Run validation whenever the form data changes
  useEffect(() => {
    setIsNextEnabled(validateCurrentStep());
  }, [formData, currentStep]);

  return (
    <div className="container">
      <h2>Register</h2>
      <ProgressIndicator currentStep={currentStep} steps={3} /> {/* Progress Indicator */}
      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <div className="form-step">
            <label>Enter Your company Name:</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your company name"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={() => validateField('fullName', formData.fullName)}
              required
            />
            {formErrors.fullName && <p className="error-message">{formErrors.fullName}</p>}

            <label>Email:</label>
            <input
              type="email"
              name="email"
              placeholder="yourname@gmail.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => validateField('email', formData.email)}
              required
            />
            {formErrors.email && <p className="error-message">{formErrors.email}</p>}

            <label>CEO's EiD:</label>
            <input
              type="number"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              onBlur={() => validateField('username', formData.username)}
              required
            />
            {formErrors.username && <p className="error-message">{formErrors.username}</p>}

            <button className='button' type="button" onClick={nextStep} disabled={!isNextEnabled}>
              Next
            </button>
          </div>
        )}
        {currentStep === 2 && (
          <div className="form-step">
            
            <label>Password:</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              onBlur={() => validateField('password', formData.password)}
              required
            />
            {formErrors.password && <p className="error-message">{formErrors.password}</p>}

            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={() => validateField('confirmPassword', formData.confirmPassword)}
              required
            />
            {formErrors.confirmPassword && <p className="error-message">{formErrors.confirmPassword}</p>}

            <button className='button'type="button" onClick={previousStep}>
              Back
            </button>
            <button className='button' type="button" onClick={nextStep} disabled={!isNextEnabled}>
              Next
            </button>
          </div>
        )}
        {currentStep === 3 && (
          <div className="form-step">
            
            <label>Category:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              onBlur={() => validateField('category', formData.category)}
              required
            >
              <option value="">Select Category</option>
              <option value="company">Company</option>
            </select>
            {formErrors.category && <p className="error-message">{formErrors.category}</p>}

            <button className='button' type="button" onClick={previousStep}>
              Back
            </button>
            <button className='button' type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        )}
      </form>
      {message && <p className="message">{message}</p>}
      <p style={{color: 'white'}}> If you have an account <Link to="/">Login</Link></p>
    </div>
  );
};

export default Register;
