import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/PersonalInfoForm.css';

const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina',
  'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados',
  'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana',
  'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon',
  'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo',
  'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica',
  'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea',
  'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia',
  'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
  'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel',
  'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea North', 'Korea South',
  'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya',
  'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali',
  'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco',
  'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands',
  'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Macedonia', 'Norway', 'Oman', 'Pakistan',
  'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland',
  'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia',
  'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia',
  'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands',
  'Somalia', 'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland',
  'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago',
  'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom',
  'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen',
  'Zambia', 'Zimbabwe'
];

const PersonalInfoForm = () => {
  const navigate = useNavigate();
  const eID = sessionStorage.getItem('eID');
  useEffect(() => {
    const eID = sessionStorage.getItem('eID');
    const token = sessionStorage.getItem('userToken');
    if (!eID || !token)
      {
        navigate('/');
        return;
      }
    },[navigate]);
  const [formData, setFormData] = useState({
    eID: eID,
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    nationality: '',
    streetAddress1: '',
    streetAddress2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  const [submitMessage, setSubmitMessage] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First Name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last Name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of Birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.maritalStatus) newErrors.maritalStatus = 'Marital Status is required';
    if (!formData.nationality) newErrors.nationality = 'Nationality is required';
    if (!formData.streetAddress1.trim()) newErrors.streetAddress1 = 'Street Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State/Province is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal Code is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Post the form data to the backend
        const response = await axios.post('https://login-9ebe.onrender.com/api/personal-info', formData);

        // Handle successful form submission
        setSubmitMessage('Form submitted successfully!');
        console.log(response.data.message);
      } catch (error) {
        console.error('Error submitting form:', error);
        setSubmitMessage('Error submitting the form, please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="personal-info-form">
      <h2>Personal Information</h2>

      <div className="form-group">
        <label>First Name:</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className={errors.firstName ? 'error' : ''}
          required
        />
        {errors.firstName && <small className="error-message">{errors.firstName}</small>}
      </div>

      <div className="form-group">
        <label>Last Name:</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className={errors.lastName ? 'error' : ''}
          required
        />
        {errors.lastName && <small className="error-message">{errors.lastName}</small>}
      </div>

      <div className="form-group">
        <label>Date of Birth:</label>
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          className={errors.dateOfBirth ? 'error' : ''}
          required
        />
        {errors.dateOfBirth && <small className="error-message">{errors.dateOfBirth}</small>}
      </div>

      <div className="form-group">
        <label>Gender:</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className={errors.gender ? 'error' : ''}
          required
        >
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="non-binary">Non-binary</option>
        </select>
        {errors.gender && <small className="error-message">{errors.gender}</small>}
      </div>

      <div className="form-group">
        <label>Marital Status:</label>
        <select
          name="maritalStatus"
          value={formData.maritalStatus}
          onChange={handleChange}
          className={errors.maritalStatus ? 'error' : ''}
          required
        >
          <option value="">Select</option>
          <option value="single">Single</option>
          <option value="married">Married</option>
          <option value="divorced">Divorced</option>
          <option value="widowed">Widowed</option>
        </select>
        {errors.maritalStatus && <small className="error-message">{errors.maritalStatus}</small>}
      </div>

      <div className="form-group">
        <label>Nationality:</label>
        <select
          name="nationality"
          value={formData.nationality}
          onChange={handleChange}
          className={errors.nationality ? 'error' : ''}
          required
        >
          <option value="">Select</option>
          {countries.map((country, index) => (
            <option key={index} value={country}>{country}</option>
          ))}
        </select>
        {errors.nationality && <small className="error-message">{errors.nationality}</small>}
      </div>

      <h3>Address</h3>

      <div className="form-group">
        <label>Street Address (Line 1):</label>
        <input
          type="text"
          name="streetAddress1"
          value={formData.streetAddress1}
          onChange={handleChange}
          className={errors.streetAddress1 ? 'error' : ''}
          required
        />
        {errors.streetAddress1 && <small className="error-message">{errors.streetAddress1}</small>}
      </div>

      <div className="form-group">
        <label>Street Address (Line 2):</label>
        <input
          type="text"
          name="streetAddress2"
          value={formData.streetAddress2}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>City:</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          className={errors.city ? 'error' : ''}
          required
        />
        {errors.city && <small className="error-message">{errors.city}</small>}
      </div>

      <div className="form-group">
        <label>State/Province/Region:</label>
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleChange}
          className={errors.state ? 'error' : ''}
          required
        />
        {errors.state && <small className="error-message">{errors.state}</small>}
      </div>

      <div className="form-group">
        <label>Postal Code:</label>
        <input
          type="text"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleChange}
          className={errors.postalCode ? 'error' : ''}
          required
        />
        {errors.postalCode && <small className="error-message">{errors.postalCode}</small>}
      </div>

      <div className="form-group">
      <label>Country:</label>
      <select
          name="country"
          value={formData.country}
          onChange={handleChange}
          className={errors.country ? 'error' : ''}
          required
        >
          <option value="">Select</option>
          {countries.map((country, index) => (
            <option key={index} value={country}>{country}</option>
          ))}
        </select>

        {errors.country && <small className="error-message">{errors.country}</small>}
      </div>

      <div className="button-group">
        <button type="submit"className="sign-in-btn">Submit</button>
      </div>
      {submitMessage && <p className="submit-message">{submitMessage}</p>}
    </form>

  );
};

export default PersonalInfoForm;
