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
    const eID = sessionStorage.getItem('eID');
    const token = sessionStorage.getItem('userToken');
  
    if (!eID || !token)
      {
        navigate('/');
        return;
      }
    const fetchSocialFamilyData = async () => {
      try {
        const response = await axios.get('https://login-9ebe.onrender.com/api/social-family/all');
        const newfam = response.data.data.filter(preference => preference.eID === parseInt(eID));
        setSocialFamilyData(newfam);
      } catch (error) {
        setError('Error fetching social family data');
        console.error('Error fetching social family data:', error);
      }
    };

    fetchSocialFamilyData();
  },[navigate]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
<div className="socfam-container">
  <h2>Social Family Data</h2>
  <ul className="socfam-list">
    {socialFamilyData.map((entry) => (
      <li className="socfam-item" key={entry._id}>
        <p><strong>Marital Status:</strong> {entry.maritalStatus}</p>
        <p><strong>Family Members:</strong></p>
        <ul>
          {entry.familyMembers.map((member, index) => (
            <li key={index}>
              {member.name} - {member.relationship}
            </li>
          ))}
        </ul>
        <p><strong>Dependents:</strong></p>
        <ul>
          {entry.dependents.map((dependent, index) => (
            <li key={index}>
              {dependent.name} - {dependent.relationship}
            </li>
          ))}
        </ul>
        <p><strong>Social Affiliations:</strong></p>
        <ul>
          {entry.socialAffiliations.map((affiliation, index) => (
            <li key={index}>
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
