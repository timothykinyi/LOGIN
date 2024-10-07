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
        errors.fullName = !/^[a-zA-Z_]{4,} [a-zA-Z_]{4,}$/.test(value)
          ? 'Full Name must have two names each with at least 4 characters and have no digits, ensuring there is a space between the two names.'
          : '';
        break;
      case 'email':
        errors.email = !/^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]{1,64}@[a-zA-Z0-9.-]{1,255}\.[a-zA-Z]{2,}$/.test(value)
          ? 'Please enter a valid email.'
          : '';
        break;
      case 'username':
        errors.username = !/^[a-zA-Z_]{4,}$/.test(value)
          ? 'Username must be at least 4 characters long and contain only letters or underscores.'
          : '';
        break;
      case 'phoneNumber':
        errors.phoneNumber = !/^(07|01)\d{8}$/.test(value)
          ? 'Please enter a valid 10-digit phone number starting with 07 or 01.'
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
      case 'dateOfBirth':
        errors.dateOfBirth = !value ? 'Date of Birth is required.' : '';
        break;
      case 'gender':
        errors.gender = !value ? 'Gender is required.' : '';
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
      fields.push('phoneNumber', 'password', 'confirmPassword');
    } else if (currentStep === 3) {
      fields.push('dateOfBirth', 'gender', 'category');
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
      const response = await axios.post('https://login-9ebe.onrender.com/api/auth/register', formData);
      setMessage(response.data.message);
      sessionStorage.setItem('email', formData.email);
      navigate('/verification');
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
            <label>Enter Your Full Name:</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your name"
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

            <label>Username:</label>
            <input
              type="text"
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
            <label>Phone Number:</label>
            <input
              type="text"
              name="phoneNumber"
              placeholder="07XXXXXXXX or 01XXXXXXXX"
              value={formData.phoneNumber}
              onChange={handleChange}
              onBlur={() => validateField('phoneNumber', formData.phoneNumber)}
              required
            />
            {formErrors.phoneNumber && <p className="error-message">{formErrors.phoneNumber}</p>}

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
            <label>Date of Birth:</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              onBlur={() => validateField('dateOfBirth', formData.dateOfBirth)}
              required
            />
            {formErrors.dateOfBirth && <p className="error-message">{formErrors.dateOfBirth}</p>}

            <label>Gender:</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              onBlur={() => validateField('gender', formData.gender)}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {formErrors.gender && <p className="error-message">{formErrors.gender}</p>}

            <label>Category:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              onBlur={() => validateField('category', formData.category)}
              required
            >
              <option value="">Select Category</option>
              <option value="Self">My own account</option>
              <option value="Child">My child's account</option>
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
