import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/displaypreference.css';
const DisplayPreferences = () => {
  const [preferences, setPreferences] = useState([]);
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
    const fetchPreferences = async () => {
      try {
        const response = await axios.get('https://login-9ebe.onrender.com/api/preferences/all');
        const newpreference = response.data.data.filter(preference => preference.eID === parseInt(eID));
        setPreferences(newpreference);
      } catch (error) {
        setError('Error fetching preferences');
        console.error('Error fetching preferences:', error);
      }
    };

    fetchPreferences();
  },[navigate]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
  <div className="pref-container">
    <h2>All Preferences</h2>
    <ul className="pref-list">
      {preferences.map((preference) => (
        <li className="pref-item" key={preference._id}>
          <p><strong>Hobbies:</strong> {preference.hobbies.join(', ')}</p>
          <p><strong>Dietary Preference:</strong> {preference.dietaryPreference}</p>
          <p><strong>Religious Affiliation:</strong> {preference.religiousAffiliation}</p>
          <p><strong>Selected Hobbies:</strong> {preference.selectedHobbies.join(', ')}</p>
          <p><strong>Favorite Cuisine:</strong> {preference.favoriteCuisine}</p>
          <p><strong>Pet Preference:</strong> {preference.petPreference}</p>
        </li>
      ))}
    </ul>
  </div>
  );
};

export default DisplayPreferences;
