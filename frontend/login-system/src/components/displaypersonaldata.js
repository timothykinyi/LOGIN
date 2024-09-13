import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DisplayPersonalInfo = () => {
  const [personalInfoList, setPersonalInfoList] = useState([]);
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
    const fetchPersonalInfo = async () => {
      try {
        const response = await axios.get('https://login-9ebe.onrender.com/api/personal-info');
        const newpersonal = response.data.data.filter(personal => personal.eID === parseInt(eID));
        setPersonalInfoList(newpersonal);
      } catch (error) {
        setError('Error fetching personal information');
        console.error('Error fetching personal information:', error);
      }
    };

    fetchPersonalInfo();
  },[navigate]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Personal Information</h2>
      <ul>
        {personalInfoList.map((info) => (
          <li key={info._id}>
            <p>Name: {info.firstName} {info.lastName}</p>
            <p>Date of Birth: {new Date(info.dateOfBirth).toLocaleDateString()}</p>
            <p>Gender: {info.gender}</p>
            <p>Marital Status: {info.maritalStatus}</p>
            <p>Nationality: {info.nationality}</p>
            <p>Address: {info.streetAddress1}, {info.city}, {info.state}, {info.country}</p>
            <p>Postal Code: {info.postalCode}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisplayPersonalInfo;
