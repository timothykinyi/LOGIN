import axios from 'axios';
import React, { useEffect, useState } from 'react';

const EmploymentList = () => {
  const [employmentData, setEmploymentData] = useState([]);

  useEffect(() => {
    // Fetch employment data when the component mounts
    axios.get('https://login-9ebe.onrender.com/api/employment')  // Replace with your actual backend endpoint
      .then(response => {
        setEmploymentData(response.data.data); // Set the fetched data to state
      })
      .catch(error => {
        console.error('Error fetching employment data:', error);
      });
  }, []);

  return (
    <div>
      <h2>Employment Data</h2>
      <ul>
        {employmentData.map((employment, index) => (
          <li key={index}>
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
