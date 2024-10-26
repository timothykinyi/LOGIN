// DisplayPreferences.js
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
        const response = await axios.get(`https://login-9ebe.onrender.com/api/preferences/all`, {
          params: { eID },
          headers: { Authorization: `Bearer ${token}` },
        });
        setPreferences(response.data.data);
      } catch (error) {
        setError('Error fetching preferences');
        console.error('Error fetching preferences:', error);
      }
    };

    fetchPreferences();
  }, [navigate, eID]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="pref-container">
      <h2>All Preferences</h2>
      <ul className="pref-list">
        {preferences.map((preference, index) => (
          <li className="pref-item" key={index}>
            <p><strong>Hobbies:</strong> {preference.hobbies?.join(', ')}</p>
            <p><strong>Dietary Preference:</strong> {preference.dietaryPreference || 'N/A'}</p>
            <p><strong>Religious Affiliation:</strong> {preference.religiousAffiliation || 'N/A'}</p>
            <p><strong>Selected Hobbies:</strong> {preference.selectedHobbies?.join(', ')}</p>
            <p><strong>Selected Activities:</strong> {preference.selectedActivities?.join(', ')}</p>
            <p><strong>Selected Music Genres:</strong> {preference.selectedMusicGenres?.join(', ')}</p>
            <p><strong>Favorite Cuisine:</strong> {preference.favoriteCuisine || 'N/A'}</p>
            <p><strong>Sleep Preference:</strong> {preference.sleepPreference || 'N/A'}</p>
            <p><strong>Pet Preference:</strong> {preference.petPreference || 'N/A'}</p>
            <p><strong>Environmental Practices:</strong> {preference.environmentalPractices || 'N/A'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisplayPreferences;
