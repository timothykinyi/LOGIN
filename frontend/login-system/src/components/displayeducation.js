import axios from 'axios';
import React, { useEffect, useState } from 'react';

const EducationList = () => {
  const [educationData, setEducationData] = useState([]);

  useEffect(() => {
    // Fetch education data when the component mounts
    axios.get('https://login-9ebe.onrender.com/api/education/all')
      .then(response => {
        setEducationData(response.data.data); // Set the fetched data to state
      })
      .catch(error => {
        console.error('Error fetching education data:', error);
      });
  }, []);

  return (
    <div>
      <h2>Education Data</h2>
      <ul>
        {educationData.map((education, index) => (
          <li key={index}>
            <p><strong>Level:</strong> {education.educationLevel}</p>
            <p><strong>Institution:</strong> {education.institutionName}</p>
            <p><strong>Degree:</strong> {education.degree}</p>
            <p><strong>Field of Study:</strong> {education.fieldOfStudy}</p>
            <p><strong>Country:</strong> {education.country}</p>
            <p><strong>Start Date:</strong> {new Date(education.startDate).toLocaleDateString()}</p>
            <p><strong>End Date:</strong> {new Date(education.endDate).toLocaleDateString()}</p>
            {education.transferDetails && <p><strong>Transfer Details:</strong> {education.transferDetails}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EducationList;
