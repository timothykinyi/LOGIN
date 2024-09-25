import axios from 'axios';
import React, { useEffect, useState } from 'react';

const DooruserManagement = () => {
  const [error, setError] = useState(null);
  const [doorID, setDoorID] = useState(''); // For door ID input
  const [name, setName] = useState(''); // For door name input
  const [allowedDIDs, setAllowedDIDs] = useState([]); // List of allowed door IDs
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [doorsToAdd, setDoorsToAdd] = useState([]); // List of doors to add
  const [isMultiple, setIsMultiple] = useState(false); // Toggle between single/multiple door mode

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

  // Add door to list of doors to be added
  const addDoorToList = () => {
    if (!doorID || !name) {
      alert('Door ID and name cannot be empty');
      return;
    }

    const newDoor = { doorID: parseInt(doorID), name };
    setDoorsToAdd([...doorsToAdd, newDoor]);
    setDoorID(''); // Clear the input fields
    setName('');
  };

  // Function to handle submitting the list of doors to the server
  const submitDoors = async () => {
    if (doorsToAdd.length === 0) {
      alert('No doors to add');
      return;
    }

    try {
      setIsLoading(true);
      await axios.post('https://login-9ebe.onrender.com/door/dID/allowed-dids', { doors: doorsToAdd });
      setDoorsToAdd([]); // Clear the list of doors to be added
      fetchAllowedDIDs(); // Refresh the list of allowed door IDs
    } catch (error) {
      setError(error.response?.data?.message);
      console.error('Error adding doors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Remove door from the "doors to be added" list
  const removeDoorFromList = (index) => {
    const updatedDoors = doorsToAdd.filter((_, i) => i !== index);
    setDoorsToAdd(updatedDoors);
  };

  // Function to handle removing door ID from the server
  const removeDID = async (id) => {
    try {
      setIsLoading(true);
      await axios.delete(`https://login-9ebe.onrender.com/door/dID/allowed-dids/${id}`);
      fetchAllowedDIDs(); // Refresh list
    } catch (error) {
      setError(error.message);
      console.error('Error removing door ID:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Add commonly used doors for easy access</h1>

      {/* Toggle between single and multiple door mode */}
      <div>
        <label>
          <input
            type="checkbox"
            checked={isMultiple}
            onChange={() => setIsMultiple(!isMultiple)}
          />
          Add Multiple Doors
        </label>
      </div>

      {/* Form to add door(s) */}
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

        {isMultiple ? (
          <button onClick={addDoorToList}>Add to List</button>
        ) : (
          <button onClick={submitDoors} disabled={isLoading || !doorID || !name}>
            Add Single Door
          </button>
        )}
      </div>

      {/* List of doors to be added */}
      {isMultiple && (
        <div>
          <h2>Doors to be added</h2>
          {doorsToAdd.length > 0 ? (
            <ul>
              {doorsToAdd.map((door, index) => (
                <li key={index}>
                  {door.doorID} - {door.name}
                  <button onClick={() => removeDoorFromList(index)}>Remove</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No doors added yet</p>
          )}
          <button onClick={submitDoors} disabled={isLoading || doorsToAdd.length === 0}>
            Submit Doors
          </button>
        </div>
      )}

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
