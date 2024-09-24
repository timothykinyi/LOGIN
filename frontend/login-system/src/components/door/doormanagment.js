import axios from 'axios';
import React, { useEffect, useState } from 'react';

const DooruserManagement = () => {
  const [error, setError] = useState(null);
  const [DID, setDID] = useState(''); // For input field
  const [allowedDIDs, setAllowedDIDs] = useState([]); // List of allowed eIDs

  // Fetch allowed eIDs from the server on component mount
  useEffect(() => {
    fetchAllowedDIDs();
  }, []);

  // Function to fetch allowed eIDs from the server
  const fetchAllowedDIDs = async () => {
    try {
      const response = await axios.get('https://login-9ebe.onrender.com/door/dID/allowed-Dids');
      // Assuming response contains an array of eIDs in the first document
      if (response.data.length > 0) {
        setAllowedDIDs(response.data[0].doorid); // Access the first document and its eIDs array
      } else {
        setAllowedDIDs([]);
      }
    } catch (error) {
      setError(error.message);
      console.error('Error fetching allowed eIDs:', error);
    }
  };

  // Function to handle adding eID
  const addDID = async () => {
    if (!DID) {
      alert('eID cannot be empty');
      return;
    }

    try {
      await axios.post('https://login-9ebe.onrender.com/door/dID/allowed-Dids', { DID });
      setDID(''); // Clear the input field
      fetchAllowedDIDs(); // Refresh the list of allowed eIDs
    } catch (error) {
      setError(error.response?.data?.message);
      console.error('Error adding eID:', error);
    }
  };

  // Function to handle removing eID
  const removeDID = async (DIDToRemove) => {
    try {
      await axios.delete(`https://login-9ebe.onrender.com/door/dID/allowed-Dids/${DIDToRemove}`);
      fetchAllowedDIDs(); // Refresh list
    } catch (error) {
      setError(error.message);
      console.error('Error removing eID:', error);
    }
  };

  return (
    <div>
      
      <h1>Add comonly used doors for easy access</h1>
      {/* Form to add eID */}
      <div>
        <input
          type="text"
          placeholder="Enter Door ID"
          value={DID}
          onChange={(e) => setDID(e.target.value)}
        />
        <button onClick={addDID}>Add Door Code</button>
      </div>

      {/* Table to display allowed eIDs */}
      <div>
        <h2>Allowed Doors</h2>
        <table>
          <thead>
            <tr>
              <th>Door</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allowedDIDs.map((item) => (
              <tr key={item}>
                <td>{item}</td>
                <td>
                  <button onClick={() => removeDID(item)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default DooruserManagement;
