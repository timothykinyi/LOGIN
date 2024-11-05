import { Button, Checkbox, FormControlLabel, TextField } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';

const DataShareForm = () => {
  const [selectedFields, setSelectedFields] = useState([]);
  const [expiryHours, setExpiryHours] = useState('');
  const [dataID, setDataID] = useState(null);
  const [expiryTime, setExpiryTime] = useState(null);

  const availableFields = [
    'fullName', 'email', 'phoneNumber', 'dateOfBirth', 'gender', 'bloodType', 
    'allergies', 'medicalHistory', 'education', 'employment', 'preference', 
    'finance', 'social'
  ];

  const handleFieldChange = (field) => {
    setSelectedFields((prevFields) =>
      prevFields.includes(field) ? prevFields.filter(f => f !== field) : [...prevFields, field]
    );
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/share-data', {
        userId: 'YOUR_USER_ID', // Replace with actual user ID
        selectedFields,
        expiryHours: parseInt(expiryHours, 10)
      });
      setDataID(response.data.dataID);
      setExpiryTime(response.data.expiryTime);
    } catch (error) {
      console.error('Error sharing data:', error);
    }
  };

  return (
    <div>
      <h2>Share Your Data</h2>
      <div>
        {availableFields.map((field) => (
          <FormControlLabel
            key={field}
            control={<Checkbox checked={selectedFields.includes(field)} onChange={() => handleFieldChange(field)} />}
            label={field}
          />
        ))}
      </div>
      <TextField
        label="Expiry Time (Hours)"
        value={expiryHours}
        onChange={(e) => setExpiryHours(e.target.value)}
        type="number"
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>Share Data</Button>
      {dataID && (
        <div>
          <p>Data ID: {dataID}</p>
          <p>Expires at: {new Date(expiryTime).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};

export default DataShareForm;
