import axios from 'axios';
import React, { useEffect, useState } from 'react';

const DoorManagement = ({ houseId }) => {
  const [doors, setDoors] = useState([]);
  const [doorName, setDoorName] = useState('');

  useEffect(() => {
    const fetchDoors = async () => {
      try {
        const response = await axios.get(`https://login-9ebe.onrender.com//api/doors/${houseId}`);
        setDoors(response.data);
      } catch (error) {
        console.error("Error fetching doors:", error);
      }
    };
    fetchDoors();
  }, [houseId]);

  const handleAddDoor = async () => {
    try {
      await axios.post('https://login-9ebe.onrender.com/api/doors/add', { name: doorName, houseId });
      setDoorName(''); // Clear input
      const response = await axios.get(`https://login-9ebe.onrender.com/api/doors/${houseId}`); // Refresh door list
      setDoors(response.data);
    } catch (error) {
      console.error("Error adding door:", error);
    }
  };

  return (
    <div>
      <h2>Manage Doors</h2>
      <input 
        type="text" 
        value={doorName} 
        onChange={(e) => setDoorName(e.target.value)} 
        placeholder="Door Name"
      />
      <button onClick={handleAddDoor}>Add Door</button>
      <ul>
        {doors.map((door) => (
          <li key={door._id}>{door.name} (ID: {door.doorID})</li>
        ))}
      </ul>
    </div>
  );
};

export default DoorManagement;
