import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/displaypreference.css';

const DisplayPreferences = () => {
  const [preferences, setPreferences] = useState(null); // State for storing preferences
  const [error, setError] = useState(null); // State for error handling
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();
  const eID = sessionStorage.getItem('eID'); // Fetching eID from sessionStorage

  useEffect(() => {
    const token = sessionStorage.getItem('userToken');
    if (!eID || !token) {
      navigate('/');
      return;
    }

    const fetchPreferences = async () => {
      try {
        // API call to fetch preferences by eID
        const response = await axios.get(`https://login-9ebe.onrender.com/api/preferences/preferences/${eID}`);
        
        // Check if the response contains data
        if (response.data) {
          setPreferences(response.data); // Set preferences directly from the response
        } else {
          setError('No preferences found for this user');
        }
      } catch (error) {
        setError('Error fetching preferences');
        console.error('Error fetching preferences:', error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchPreferences();
  }, [eID, navigate]);

  if (loading) {
    return <div>Loading preferences...</div>; // Display while loading
  }

  if (error) {
    return <div>{error}</div>; // Display error messages
  }

  if (!preferences) {
    return <div>No preferences available</div>; // Handle empty preferences case
  }

  return (
    <div className="pref-container">
      <h2>User Preferences</h2>
      <ul className="pref-list">
        {preferences.hobbies && (
          <li className="pref-item">
            <p><strong>Hobbies:</strong> {preferences.hobbies.join(', ')}</p>
          </li>
        )}
        {preferences.dietaryPreference && (
          <li className="pref-item">
            <p><strong>Dietary Preference:</strong> {preferences.dietaryPreference}</p>
          </li>
        )}
        {preferences.religiousAffiliation && (
          <li className="pref-item">
            <p><strong>Religious Affiliation:</strong> {preferences.religiousAffiliation}</p>
          </li>
        )}
        {preferences.selectedHobbies && (
          <li className="pref-item">
            <p><strong>Selected Hobbies:</strong> {preferences.selectedHobbies.join(', ')}</p>
          </li>
        )}
        {preferences.selectedActivities && (
          <li className="pref-item">
            <p><strong>Selected Activities:</strong> {preferences.selectedActivities.join(', ')}</p>
          </li>
        )}
        {preferences.selectedMusicGenres && (
          <li className="pref-item">
            <p><strong>Selected Music Genres:</strong> {preferences.selectedMusicGenres.join(', ')}</p>
          </li>
        )}
        {preferences.favoriteCuisine && (
          <li className="pref-item">
            <p><strong>Favorite Cuisine:</strong> {preferences.favoriteCuisine}</p>
          </li>
        )}
        {preferences.sleepPreference && (
          <li className="pref-item">
            <p><strong>Sleep Preference:</strong> {preferences.sleepPreference}</p>
          </li>
        )}
        {preferences.petPreference && (
          <li className="pref-item">
            <p><strong>Pet Preference:</strong> {preferences.petPreference}</p>
          </li>
        )}
        {preferences.environmentalPractices && (
          <li className="pref-item">
            <p><strong>Environmental Practices:</strong> {preferences.environmentalPractices}</p>
          </li>
        )}
      </ul>
    </div>
  );
};

export default DisplayPreferences;
