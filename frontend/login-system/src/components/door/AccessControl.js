import axios from 'axios';
import React, { useEffect, useState } from 'react';

const AccessControl = ({ houseId }) => {
  const [doors, setDoors] = useState([]);
  const [selectedDoorId, setSelectedDoorId] = useState('');
  const [userEID, setUserEID] = useState('');
  const [accessLevel, setAccessLevel] = useState('view');

  useEffect(() => {
    const fetchDoors = async () => {
      try {
        const response = await axios.get(`/api/doors/${houseId}`);
        setDoors(response.data);
      } catch (error) {
        console.error("Error fetching doors:", error);
      }
    };
    fetchDoors();
  }, [houseId]);

  const handleGrantAccess = async () => {
    try {
      await axios.post('https://login-9ebe.onrender.com//api/access/grant', { doorId: selectedDoorId, userEID, accessLevel });
      setUserEID(''); // Clear input
    } catch (error) {
      console.error("Error granting access:", error);
    }
  };

  return (
    <div>
      <h2>Access Management</h2>
      <select onChange={(e) => setSelectedDoorId(e.target.value)}>
        <option value="">Select Door</option>
        {doors.map((door) => (
          <option key={door._id} value={door._id}>{door.name}</option>
        ))}
      </select>
      <input 
        type="text" 
        value={userEID} 
        onChange={(e) => setUserEID(e.target.value)} 
        placeholder="User EID" 
      />
      <select value={accessLevel} onChange={(e) => setAccessLevel(e.target.value)}>
        <option value="view">View</option>
        <option value="control">Control</option>
      </select>
      <button onClick={handleGrantAccess}>Grant Access</button>
    </div>
  );
};

export default AccessControl;
