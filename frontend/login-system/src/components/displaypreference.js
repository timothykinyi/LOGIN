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
    const token = sessionStorage.getItem('userToken');
    if (!eID || !token) {
      navigate('/');
      return;
    }

    const fetchPreferences = async () => {
      try {
        // Fetch preferences, including the eID as a query parameter
        const response = await axios.get(`https://login-9ebe.onrender.com/api/preferences/all?eID=${eID}`);
        
        // Assuming the API response structure contains user preferences correctly
        if (response.data.data) {
          const userPreferences = response.data.data; // Directly use the fetched data
          setPreferences(userPreferences);
        }
      } catch (error) {
        setError('Error fetching preferences');
        console.error('Error fetching preferences:', error);
      }
    };

    fetchPreferences();
  }, [eID, navigate]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="pref-container">
      <h2>All Preferences</h2>
      <ul className="pref-list">
        {preferences.map((preference) => (
          <li className="pref-item" key={preference._id}>
            <p><strong>Hobbies:</strong> {Array.isArray(preference.hobbies) ? preference.hobbies.join(', ') : preference.hobbies}</p>
            <p><strong>Dietary Preference:</strong> {preference.dietaryPreference}</p>
            <p><strong>Religious Affiliation:</strong> {preference.religiousAffiliation}</p>
            <p><strong>Selected Hobbies:</strong> {Array.isArray(preference.selectedHobbies) ? preference.selectedHobbies.join(', ') : preference.selectedHobbies}</p>
            <p><strong>Favorite Cuisine:</strong> {preference.favoriteCuisine}</p>
            <p><strong>Pet Preference:</strong> {preference.petPreference}</p>
            <p><strong>Sleep Preference:</strong> {preference.sleepPreference}</p> {/* Added sleepPreference */}
            <p><strong>Environmental Practices:</strong> {preference.environmentalPractices}</p> {/* Added environmentalPractices */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisplayPreferences;
