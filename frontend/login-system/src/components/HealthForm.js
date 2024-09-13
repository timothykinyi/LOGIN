import axios from 'axios'; // Import axios for API requests
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/HealthForm.css';

const HealthForm = () => {
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
  const [healthData, setHealthData] = useState({
    eID: eID,
    bloodType: '',
    allergies: '',
    medicalHistory: [{ id: Date.now(), date: '', description: '' }],
    insuranceProvider: '',
    policyNumber: '',
    coverageDetails: '',
    conditions: '',
    disabilities: '',
    additionalInfo: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHealthData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleMedicalHistoryChange = (id, e) => {
    const { name, value } = e.target;
    setHealthData(prevData => ({
      ...prevData,
      medicalHistory: prevData.medicalHistory.map(entry =>
        entry.id === id ? { ...entry, [name]: value } : entry
      )
    }));
  };

  const handleAddMedicalHistory = () => {
    setHealthData(prevData => ({
      ...prevData,
      medicalHistory: [...prevData.medicalHistory, { id: Date.now(), date: '', description: '' }]
    }));
  };

  const handleRemoveMedicalHistory = (id) => {
    setHealthData(prevData => ({
      ...prevData,
      medicalHistory: prevData.medicalHistory.filter(entry => entry.id !== id)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!healthData.bloodType) newErrors.bloodType = 'Blood type is required';
    if (!healthData.insuranceProvider) newErrors.insuranceProvider = 'Insurance provider is required';
    if (!healthData.policyNumber) newErrors.policyNumber = 'Policy number is required';
    if (!healthData.coverageDetails) newErrors.coverageDetails = 'Coverage details are required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post('https://login-9ebe.onrender.com/api/health', healthData);
        
        if (response.status === 200) {
          setSuccessMessage('Health data successfully submitted');
          setApiError('');
        } else {
          setApiError('An error occurred while submitting the form');
          setSuccessMessage('');
        }
      } catch (error) {
        setApiError('An error occurred while submitting the form');
        setSuccessMessage('');
        console.error('Error occurred:', error);
      }
    }
  };

  return (
    <form className="health-form" onSubmit={handleSubmit}>
      <h2>Health Data</h2>

      <div className="form-group">
        <label>Blood Type:</label>
        <select
          name="bloodType"
          value={healthData.bloodType}
          onChange={handleChange}
          className={errors.bloodType ? 'error' : ''}
          required
        >
          <option value="">Select Blood Type</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>
        {errors.bloodType && <small className="error-message">{errors.bloodType}</small>}
      </div>

      <div className="form-group">
        <label>Allergies:</label>
        <input
          type="text"
          name="allergies"
          value={healthData.allergies}
          onChange={handleChange}
        />
      </div>

      <div className="section">
        <h3>Medical History</h3>
        {healthData.medicalHistory.map((entry) => (
          <div key={entry.id} className="form-group">
            <label>Date:</label>
            <input
              type="date"
              name="date"
              value={entry.date}
              onChange={(e) => handleMedicalHistoryChange(entry.id, e)}
              required
            />
            <label>Description:</label>
            <input
              type="text"
              name="description"
              value={entry.description}
              onChange={(e) => handleMedicalHistoryChange(entry.id, e)}
              required
            />
            <button type="button" onClick={() => handleRemoveMedicalHistory(entry.id)} className="remove-entry">
              Remove This Entry
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddMedicalHistory} className="add-entry">
          Add Another Medical History Entry
        </button>
      </div>

      <div className="form-group">
        <label>Insurance Provider:</label>
        <input
          type="text"
          name="insuranceProvider"
          value={healthData.insuranceProvider}
          onChange={handleChange}
          className={errors.insuranceProvider ? 'error' : ''}
          required
        />
        {errors.insuranceProvider && <small className="error-message">{errors.insuranceProvider}</small>}
      </div>

      <div className="form-group">
        <label>Policy Number:</label>
        <input
          type="text"
          name="policyNumber"
          value={healthData.policyNumber}
          onChange={handleChange}
          className={errors.policyNumber ? 'error' : ''}
          required
        />
        {errors.policyNumber && <small className="error-message">{errors.policyNumber}</small>}
      </div>

      <div className="form-group">
        <label>Coverage Details:</label>
        <input
          type="text"
          name="coverageDetails"
          value={healthData.coverageDetails}
          onChange={handleChange}
          className={errors.coverageDetails ? 'error' : ''}
          required
        />
        {errors.coverageDetails && <small className="error-message">{errors.coverageDetails}</small>}
      </div>

      <div className="form-group">
        <label>Conditions:</label>
        <input
          type="text"
          name="conditions"
          value={healthData.conditions}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Disabilities:</label>
        <input
          type="text"
          name="disabilities"
          value={healthData.disabilities}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Additional Information:</label>
        <textarea
          name="additionalInfo"
          value={healthData.additionalInfo}
          onChange={handleChange}
        />
      </div>

      <button type="submit">Submit</button>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {apiError && <p className="error-message">{apiError}</p>}
    </form>
  );
};

export default HealthForm;
