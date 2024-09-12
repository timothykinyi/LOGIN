import axios from 'axios';
import React, { useEffect, useState } from 'react';

const HealthDataList = () => {
  const [healthData, setHealthData] = useState([]);

  useEffect(() => {
    // Fetch health data when the component mounts
    axios.get('https://login-9ebe.onrender.com/api/health/all') // Update with your backend URL
      .then(response => {
        setHealthData(response.data.data); // Set the fetched data to state
      })
      .catch(error => {
        console.error('Error fetching health data:', error);
      });
  }, []);

  return (
    <div>
      <h2>Health Data</h2>
      <ul>
        {healthData.map((data, index) => (
          <li key={index}>
            <p><strong>Blood Type:</strong> {data.bloodType}</p>
            <p><strong>Allergies:</strong> {data.allergies || 'N/A'}</p>
            <p><strong>Medical History:</strong></p>
            <ul>
              {data.medicalHistory.map((record, idx) => (
                <li key={idx}>
                  <p><strong>Date:</strong> {new Date(record.date).toLocaleDateString()}</p>
                  <p><strong>Description:</strong> {record.description}</p>
                </li>
              ))}
            </ul>
            <p><strong>Insurance Provider:</strong> {data.insuranceProvider}</p>
            <p><strong>Policy Number:</strong> {data.policyNumber}</p>
            <p><strong>Coverage Details:</strong> {data.coverageDetails}</p>
            <p><strong>Conditions:</strong> {data.conditions || 'None'}</p>
            <p><strong>Disabilities:</strong> {data.disabilities || 'None'}</p>
            <p><strong>Additional Info:</strong> {data.additionalInfo || 'None'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HealthDataList;
