import axios from 'axios';
import React, { useEffect, useState } from 'react';

const DoorManagement = () => {
    const [error, setError] = useState(null);
  const [eID, setEID] = useState(''); // For input field
  const [allowedEIDs, setAllowedEIDs] = useState([]); // List of allowed eIDs

  // Fetch allowed eIDs from the server on component mount
  useEffect(() => {
    fetchAllowedEIDs();
  }, []);

  // Function to fetch allowed eIDs from the server
  const fetchAllowedEIDs = async () => {
    try {
      const response = await axios.get('https://login-9ebe.onrender.com/door/eID/allowed-eids');
      setAllowedEIDs(response.data); // Assuming the response is an array of eIDs
    } catch (error) {
        setError(error.message);
      console.error('Error fetching allowed eIDs:', error);
    }
  };

  // Function to handle adding eID
  const addEID = async () => {
    if (!eID) {
      alert('eID cannot be empty');
      return;
    }
  
    try {
      await axios.post('https://login-9ebe.onrender.com/door/eID/allowed-eids', { eID });
      setEID(''); // Clear the input field
      fetchAllowedEIDs(); // Refresh the list of allowed eIDs
    } catch (error) {
      setError(error.response?.data?.message);
      console.error('Error adding eID:', error);
    }
  };
  

  // Function to handle removing eID
  const removeEID = async (id) => {
    try {
      await axios.delete(`https://login-9ebe.onrender.com/door/eID/allowed-eids/${id}`);
      fetchAllowedEIDs(); // Refresh list
    } catch (error) {
        setError(error.message);
      console.error('Error removing eID:', error);
    }
  };

  return (
    <div>
      <h1>Door Management System</h1>

      {/* Form to add eID */}
      <div>
        <input
          type="text"
          placeholder="Enter eID"
          value={eID}
          onChange={(e) => setEID(e.target.value)}
        />
        <button onClick={addEID}>Add eID</button>
      </div>

      {/* Table to display allowed eIDs */}
      <div>
        <h2>Allowed eIDs</h2>
        <table>
          <thead>
            <tr>
              <th>eID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allowedEIDs.map((item) => (
              <tr key={item._id}>
                <td>{item.eID}</td>
                <td>
                  <button onClick={() => removeEID(item._id)}>Remove</button>
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

export default DoorManagement;
