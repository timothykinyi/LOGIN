import axios from 'axios';
import React, { useEffect, useState } from 'react';

const HouseDetails = ({ HID }) => {
  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch house details from the backend
    const fetchHouseDetails = async () => {
      try {
        const response = await axios.get(`/api/houses/${HID}`);
        setHouse(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching house details');
        setLoading(false);
      }
    };

    fetchHouseDetails();
  }, [HID]);

  const handleRemoveUser = async (doorId, userEID) => {
    try {
      await axios.delete(`/api/houses/${HID}/doors/${doorId}/users/${userEID}`);
      // Refetch house details after removing user
      const updatedHouse = await axios.get(`/api/houses/${HID}`);
      setHouse(updatedHouse.data);
    } catch (err) {
      console.error('Error removing user', err);
    }
  };

  const handleUpdateAccess = async (doorId, allowedUsers) => {
    try {
      await axios.put(`/api/houses/${HID}/doors/${doorId}`, { allowedUsers });
      // Refetch house details after updating access
      const updatedHouse = await axios.get(`/api/houses/${HID}`);
      setHouse(updatedHouse.data);
    } catch (err) {
      console.error('Error updating access', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>House Details</h1>
      <h2>Address: {house.address}</h2>
      <h3>Doors:</h3>
      <ul>
        {house.doors.map(door => (
          <li key={door.doorId}>
            <strong>{door.name}</strong> (ID: {door.doorId})
            <ul>
              {door.allowedUsers.map(user => (
                <li key={user.eid}>
                  {user.eid} ({user.access})
                  <button onClick={() => handleRemoveUser(door.doorId, user.eid)}>Remove User</button>
                </li>
              ))}
            </ul>
            <button onClick={() => handleUpdateAccess(door.doorId, /* new allowedUsers here */)}>
              Edit Access
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HouseDetails;
