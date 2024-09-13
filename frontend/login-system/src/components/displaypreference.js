import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div>
      <h2>All Preferences</h2>
      <ul>
        {preferences.map((preference) => (
          <li key={preference._id}>
            <p>Hobbies: {preference.hobbies.join(', ')}</p>
            <p>Dietary Preference: {preference.dietaryPreference}</p>
            <p>Religious Affiliation: {preference.religiousAffiliation}</p>
            <p>Selected Hobbies: {preference.selectedHobbies.join(', ')}</p>
            <p>Favorite Cuisine: {preference.favoriteCuisine}</p>
            <p>Pet Preference: {preference.petPreference}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisplayPreferences;
