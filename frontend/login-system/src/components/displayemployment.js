import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/displayemployment.css';
const EmploymentList = () => {
  const [employmentData, setEmploymentData] = useState([]);
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
    // Fetch employment data when the component mounts
    axios.get('https://login-9ebe.onrender.com/api/employment')  // Replace with your actual backend endpoint
      .then(response => {
        const newemploy = response.data.data.filter(employ => employ.eID === parseInt(eID));
        setEmploymentData(newemploy); // Set the fetched data to state
      })
      .catch(error => {
        console.error('Error fetching employment data:', error);
      });
  },[navigate]);

  return (
    <div className="emp-container">
      <h2>Employment Data</h2>
      <ul className="emp-list">
        {employmentData.map((employment, index) => (
          <li className="emp-item" key={index}>
            <p><strong>Job Title:</strong> {employment.jobTitle}</p>
            <p><strong>Employer:</strong> {employment.employer}</p>
            <p><strong>Job Category:</strong> {employment.jobCategory}</p>
            <p><strong>Skills:</strong> {employment.skills}</p>
            <p><strong>Start Date:</strong> {new Date(employment.startDate).toLocaleDateString()}</p>
            <p><strong>End Date:</strong> {employment.endDate ? new Date(employment.endDate).toLocaleDateString() : 'Continuing'}</p>
          </li>
        ))}
      </ul>
    </div>

  );
};

export default EmploymentList;
