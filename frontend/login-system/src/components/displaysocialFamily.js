import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/displaysocialFamily.css';

const DisplaySocialFamilyData = () => {
  const [socialFamilyData, setSocialFamilyData] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const eID = sessionStorage.getItem('eID');

  useEffect(() => {
    const token = sessionStorage.getItem('userToken');

    if (!eID || !token) {
      navigate('/');
      return;
    }

    const fetchSocialFamilyData = async () => {
      try {
        // Send eID as a query parameter to retrieve data for this user
        const response = await axios.get(`https://login-9ebe.onrender.com/api/social-family/all?eID=${eID}`);
        setSocialFamilyData(response.data.data); // Directly set the data received from the backend
      } catch (error) {
        setError('Error fetching social family data');
        console.error('Error fetching social family data:', error);
      }
    };

    fetchSocialFamilyData();
  }, [navigate, eID]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="socfam-container">
      <h2>Social Family Data</h2>
      <ul className="socfam-list">
        {socialFamilyData.map((entry, index) => (
          <li className="socfam-item" key={index}>
            <p><strong>Marital Status:</strong> {entry.maritalStatus}</p>
            <p><strong>Family Members:</strong></p>
            <ul>
              {entry.familyMembers.map((member, idx) => (
                <li key={idx}>
                  {member.name} - {member.relationship}
                </li>
              ))}
            </ul>
            <p><strong>Dependents:</strong></p>
            <ul>
              {entry.dependents.map((dependent, idx) => (
                <li key={idx}>
                  {dependent.name} - {dependent.relationship}
                </li>
              ))}
            </ul>
            <p><strong>Social Affiliations:</strong></p>
            <ul>
              {entry.socialAffiliations.map((affiliation, idx) => (
                <li key={idx}>
                  {affiliation.organization} - {affiliation.role}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisplaySocialFamilyData;
