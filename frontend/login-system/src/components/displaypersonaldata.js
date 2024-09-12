import axios from 'axios';
import React, { useEffect, useState } from 'react';

const DisplayPersonalInfo = () => {
  const [personalInfoList, setPersonalInfoList] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        const response = await axios.get('https://your-backend-url.com/api/personal-info');
        setPersonalInfoList(response.data.data);
      } catch (error) {
        setError('Error fetching personal information');
        console.error('Error fetching personal information:', error);
      }
    };

    fetchPersonalInfo();
  }, []);

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
