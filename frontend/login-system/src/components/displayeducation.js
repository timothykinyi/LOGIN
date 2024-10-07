import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/displayeducation.css';
const EducationList = () => {
  const [educationData, setEducationData] = useState([]);
  const navigate = useNavigate();
  const eID = sessionStorage.getItem('eID');
  useEffect(() => {
    const eID = sessionStorage.getItem('eID'); // Retrieve eID from session storage
    const token = sessionStorage.getItem('userToken');
  
    if (!eID || !token)
      {
        navigate('/');
        return;
      }
    // Fetch education data when the component mounts
    axios.get('https://login-9ebe.onrender.com/api/education/all')
      .then(response => {
        // Filter the data based on eID, assuming there's a field like userId or _id in the education object
        const filteredEducation = response.data.data.filter(education => education.eID === parseInt(eID));
        setEducationData(filteredEducation); 
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
