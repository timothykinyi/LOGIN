import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/displayemployment.css';

const EmploymentList = () => {
  const [employmentData, setEmploymentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const eID = sessionStorage.getItem('eID');

  useEffect(() => {
    const token = sessionStorage.getItem('userToken');
    if (!eID || !token) {
      navigate('/');
      return;
    }

    // Fetch employment data when the component mounts
    axios.get(`https://login-9ebe.onrender.com/api/employment?eID=${eID}`)  // Fetch employment data for specific eID
      .then(response => {
        setEmploymentData(response.data.data); // Set the fetched data to state
        setLoading(false); // Stop loading
      })
      .catch(err => {
        console.error('Error fetching employment data:', err);
        setError('Error fetching employment data. Please try again later.'); // Set error state
        setLoading(false); // Stop loading
      });
  }, [navigate, eID]);

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  if (error) {
    return <div>{error}</div>; // Error state
  }

  return (
    <div className="emp-container">
      <h2>Employment Data</h2>
      {employmentData.length === 0 ? (
        <p>No employment data available.</p> // Message for no data
      ) : (
        <ul className="emp-list">
          {employmentData.map((employment, index) => (
            <li className="emp-item" key={index}>
              <p><strong>Job Title:</strong> {employment.jobTitle}</p>
              <p><strong>Employer:</strong> {employment.employer}</p>
              <p><strong>Job Category:</strong> {employment.jobCategory}</p>
              <p>
                <strong>Skills:</strong> {Array.isArray(employment.skills) ? employment.skills.join(', ') : employment.skills || 'No skills listed'}
              </p>
              <p><strong>Start Date:</strong> {new Date(employment.startDate).toLocaleDateString()}</p>
              <p><strong>End Date:</strong> {employment.endDate ? new Date(employment.endDate).toLocaleDateString() : 'Continuing'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmploymentList;
