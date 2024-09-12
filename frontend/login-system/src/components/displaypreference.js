import axios from 'axios';
import React, { useEffect, useState } from 'react';

const DisplayPreferences = () => {
  const [preferences, setPreferences] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await axios.get('https://login-9ebe.onrender.com/api/preferences/all');
        setPreferences(response.data.data);
      } catch (error) {
        setError('Error fetching preferences');
        console.error('Error fetching preferences:', error);
      }
    };

    fetchPreferences();
  }, []);

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
