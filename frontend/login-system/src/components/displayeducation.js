import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/displayeducation.css';

const EducationList = () => {
  const [educationData, setEducationData] = useState([]);
  const navigate = useNavigate();
  const eID = sessionStorage.getItem('eID');

  useEffect(() => {
    const token = sessionStorage.getItem('userToken');

    // Redirect if eID or token is not present
    if (!eID || !token) {
      navigate('/');
      return;
    }

    // Fetch education data when the component mounts
    axios.get(`https://login-9ebe.onrender.com/api/education/all`)
      .then(response => {
        // Check if response.data and response.data.data are defined
        if (response.data && response.data.data) {
          // Assuming the response returns an array of users
          const user = response.data.data.find(user => user.eID === parseInt(eID)); // Find the user by eID
          
          if (user) {
            setEducationData(user.education || []); // Set education data or empty array if undefined
          } else {
            setEducationData([]); // No user found
          }
        } else {
          console.error('Unexpected response structure:', response.data);
          setEducationData([]); // Handle unexpected response
        }
      })
      .catch(error => {
        console.error('Error fetching education data:', error);
      });
  }, [eID, navigate]);

  return (
    <div className="edu-container">
      <h2>Education Data</h2>
      <ul className="edu-list">
        {educationData.length === 0 ? (
          <p className="edu-message">No education data available for this user.</p>
        ) : (
          educationData.map((education, index) => (
            <li className="edu-item" key={index}>
              <p><strong>Level:</strong> {education.educationLevel}</p>
              <p><strong>Institution:</strong> {education.institutionName}</p>
              <p><strong>Degree:</strong> {education.degree}</p>
              <p><strong>Field of Study:</strong> {education.fieldOfStudy}</p>
              <p><strong>Country:</strong> {education.country}</p>
              <p><strong>Start Date:</strong> {new Date(education.startDate).toLocaleDateString()}</p>
              <p><strong>End Date:</strong> {new Date(education.endDate).toLocaleDateString()}</p>
              {education.transferDetails && <p><strong>Transfer Details:</strong> {education.transferDetails}</p>}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default EducationList;
