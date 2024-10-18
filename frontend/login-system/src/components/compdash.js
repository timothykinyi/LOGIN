import axios from 'axios';
import React, { useState } from 'react';

const UserDataSelector = () => {
  const [selectedFields, setSelectedFields] = useState([]);
  const [userId, setUserId] = useState('');
  const [userData, setUserData] = useState(null);

  const availableFields = [
    { label: 'Full Name', value: 'fullName' },
    { label: 'Email', value: 'email' },
    { label: 'Phone Number', value: 'phoneNumber' },
    { label: 'Username', value: 'username' },
    { label: 'Date of Birth', value: 'dateOfBirth' },
    { label: 'Gender', value: 'gender' },
    { label: 'Category', value: 'category' },
    { label: 'eID', value: 'eID' },
  ];

  const handleFieldChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedFields((prevFields) => [...prevFields, value]);
    } else {
      setSelectedFields((prevFields) => prevFields.filter((field) => field !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/get-user-data', {
        userId, // Add userId for the backend to retrieve the specific user's data
        selectedFields
      });

      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  return (
    <div>
      <h2>Select User Data</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="userId">Enter User ID:</label>
        <input
          type="text"
          id="userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />

        <h3>Select Fields:</h3>
        {availableFields.map((field) => (
          <div key={field.value}>
            <label>
              <input
                type="checkbox"
                value={field.value}
                onChange={handleFieldChange}
              />
              {field.label}
            </label>
          </div>
        ))}

        <button type="submit">Get Selected Data</button>
      </form>

      {userData && (
        <div>
          <h3>Retrieved User Data:</h3>
          <pre>{JSON.stringify(userData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default UserDataSelector;
