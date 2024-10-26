import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/displaypersonaldata.css';

const DisplayPersonalInfo = () => {
  const [personalInfoList, setPersonalInfoList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const eID = sessionStorage.getItem('eID');

  useEffect(() => {
    const token = sessionStorage.getItem('userToken');
  
    if (!eID || !token) {
      navigate('/');
      return;
    }

    const fetchPersonalInfo = async () => {
      try {
        const response = await axios.get(`https://login-9ebe.onrender.com/api/personal-info/all`, {
          params: { eID }
        });
        setPersonalInfoList(response.data.data);
      } catch (error) {
        setError('Error fetching personal information');
        console.error('Error fetching personal information:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalInfo();
  }, [navigate, eID]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="pers-container">
      <h2>Personal Information</h2>
      {personalInfoList.length > 0 ? (
        <ul className="pers-info-list">
          {personalInfoList.map((info, index) => (
            <li className="pers-info-item" key={index}>
              <p><span>Name:</span> {info.firstName} {info.lastName}</p>
              <p><span>Date of Birth:</span> {new Date(info.dateOfBirth).toLocaleDateString()}</p>
              <p><span>Gender:</span> {info.gender}</p>
              <p><span>Marital Status:</span> {info.maritalStatus}</p>
              <p><span>Nationality:</span> {info.nationality}</p>
              <p><span>Address:</span> {info.streetAddress1}, {info.city}, {info.state}, {info.country}</p>
              <p><span>Postal Code:</span> {info.postalCode}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div>No personal information found</div>
      )}
    </div>
  );
};

export default DisplayPersonalInfo;
