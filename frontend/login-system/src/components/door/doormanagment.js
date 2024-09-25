import axios from 'axios';
import React, { useEffect, useState } from 'react';

const DooruserManagement = () => {
  const [error, setError] = useState(null);
  const [doorID, setDoorID] = useState(''); // For door ID input
  const [name, setName] = useState(''); // For door name input
  const [allowedDIDs, setAllowedDIDs] = useState([]); // List of allowed door IDs
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Fetch allowed door IDs from the server on component mount
  useEffect(() => {
    fetchAllowedDIDs();
  }, []);

  // Function to fetch allowed door IDs from the server
  const fetchAllowedDIDs = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://login-9ebe.onrender.com/door/dID/allowed-dids');
      setAllowedDIDs(response.data);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching allowed door IDs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle adding door ID
  const addDID = async () => {
    if (!doorID || !name) {
      alert('Door ID and name cannot be empty');
      return;
    }

    try {
      await axios.post('https://login-9ebe.onrender.com/door/dID/allowed-dids', { doorID, name });
      setDoorID(''); // Clear the input fields
      setName('');
      fetchAllowedDIDs(); // Refresh the list of allowed door IDs
    } catch (error) {
      setError(error.response?.data?.message);
      console.error('Error adding door ID:', error);
    }
  };

  // Function to handle removing door ID
  const removeDID = async (id) => {
    try {
      await axios.delete(`https://login-9ebe.onrender.com/door/dID/allowed-dids/${id}`);
      fetchAllowedDIDs(); // Refresh list
    } catch (error) {
      setError(error.message);
      console.error('Error removing door ID:', error);
    }
  };

  return (
    <div>
      <h1>Add commonly used doors for easy access</h1>

      {/* Form to add door ID */}
      <div>
        <input
          type="number"
          placeholder="Enter Door ID"
          value={doorID}
          onChange={(e) => setDoorID(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Door Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={addDID} disabled={isLoading}>Add Door Code</button>
      </div>

      {/* Table to display allowed door IDs */}
      <div>
        <h2>Allowed Doors</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Door</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allowedDIDs.map((item) => (
                <tr key={item._id}>
                  <td>{item.doorID} - {item.name}</td>
                  <td>
                    <button onClick={() => removeDID(item._id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default DooruserManagement;
