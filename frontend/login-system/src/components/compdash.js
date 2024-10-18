import axios from 'axios';
import React, { useState } from 'react';
import './styles/DataStoreForm.css'; // Import the CSS file for styling

const DataStoreForm = () => {
  const [selectedFields, setSelectedFields] = useState([]);

  const compId = sessionStorage.getItem('cID');
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
        const response  =await axios.post('https://login-9ebe.onrender.com/api/auth/store-selected-data', {
        selectedFields,
        compId
      });

      alert('Data stored successfully!');
    } catch (error) {
      console.error('Error storing user data:', error);
      alert(response.data.message);
    }
  };

  return (
    <div className="cnd-form-container">
      <h2 className="cnd-heading">Select User Data to Store</h2>
      <form className="cnd-form" onSubmit={handleSubmit}>
        <h3 className="cnd-subheading">Select Fields:</h3>
        {availableFields.map((field) => (
          <div className="cnd-checkbox-container" key={field.value}>
            <label className="cnd-checkbox-label">
              <input
                type="checkbox"
                value={field.value}
                onChange={handleFieldChange}
                className="cnd-checkbox-input"
              />
              {field.label}
            </label>
          </div>
        ))}
        <button type="submit" className="cnd-submit-button">Store Selected Data</button>
      </form>
    </div>
  );
};

export default DataStoreForm;
