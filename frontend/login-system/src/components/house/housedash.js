import axios from 'axios';
import React, { useEffect, useState } from 'react';

const HouseDetails = () => {
  const [houses, setHouses] = useState([]);  // For storing the list of houses owned by the user
  const [selectedHouse, setSelectedHouse] = useState(null);  // For storing the selected house details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userEID = sessionStorage.getItem('eID');  // Fetch the EID from session storage

  // Fetch houses owned by the user when the page loads
  useEffect(() => {
    const fetchUserHouses = async () => {
      try {
        const response = await axios.get(`https://login-9ebe.onrender.com/api/houses/owner/${userEID}`);
        setHouses(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching houses');
        setLoading(false);
      }
    };

    fetchUserHouses();
  }, [userEID]);

  // Fetch house details when a house is selected
  const fetchHouseDetails = async (HID) => {
    try {
      const response = await axios.get(`https://login-9ebe.onrender.com/api/houses/${HID}`);
      setSelectedHouse(response.data);
      sessionStorage.setItem('HID', HID);  // Store the selected house's HID in session storage
    } catch (err) {
      console.error('Error fetching house details', err);
    }
  };

  const handleRemoveUser = async (doorId, userEID) => {
    try {
      await axios.delete(`/api/houses/${selectedHouse.HID}/doors/${doorId}/users/${userEID}`);
      // Refetch house details after removing user
      fetchHouseDetails(selectedHouse.HID);
    } catch (err) {
      console.error('Error removing user', err);
    }
  };

  const handleUpdateAccess = async (doorId, allowedUsers) => {
    try {
      await axios.put(`https://login-9ebe.onrender.com/api/houses/${selectedHouse.HID}/doors/${doorId}`, { allowedUsers });
      // Refetch house details after updating access
      fetchHouseDetails(selectedHouse.HID);
    } catch (err) {
      console.error('Error updating access', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>My Houses</h1>
      {houses.length === 0 ? (
        <p>You don't own any houses.</p>
      ) : (
        <ul>
          {houses.map(house => (
            <li key={house.HID} onClick={() => fetchHouseDetails(house.HID)}>
              {house.address} (ID: {house.HID})
            </li>
          ))}
        </ul>
      )}

      {selectedHouse && (
        <div>
          <h2>House Details</h2>
          <h3>Address: {selectedHouse.address}</h3>
          <h4>Doors:</h4>
          <ul>
            {selectedHouse.doors.map(door => (
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
      )}
    </div>
  );
};

export default HouseDetails;
