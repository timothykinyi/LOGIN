import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../styles/housedash.css';

const HouseDetails = () => {
  const [houses, setHouses] = useState([]);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUserEID, setNewUserEID] = useState('');
  const [selectedDoors, setSelectedDoors] = useState([]);
  const userEID = sessionStorage.getItem('eID');

  useEffect(() => {
    const fetchUserHouses = async () => {
      try {
        const response = await axios.post('https://login-9ebe.onrender.com/api/houses/owner', {
          eID: userEID,
        });

        if (response.data.length === null) {
          // No houses found, but this is not an error, just display a message
          setHouses([]);
        } else {
          // Houses found, set the houses state
          setHouses(response.data);
        }

        setLoading(false);
      } catch (err) {
        // Handle actual errors like network issues
        setError('Error fetching house');
        setLoading(false);
        console.log(err);
      }
    };

    fetchUserHouses();
  }, [userEID]);

  const fetchHouseDetails = async (HID) => {
    try {
      const response = await axios.get(`https://login-9ebe.onrender.com/api/houses/${HID}`);
      setSelectedHouse(response.data);
      sessionStorage.setItem('HID', HID);
    } catch (err) {
      console.error('Error fetching house details', err);
    }
  };

  const handleRemoveUser = async (doorId, userEID) => {
    try {
      await axios.delete(`https://login-9ebe.onrender.com/api/houses/${selectedHouse.HID}/doors/${doorId}/users/${userEID}`);
      fetchHouseDetails(selectedHouse.HID);
    } catch (err) {
      console.error('Error removing user', err);
    }
  };

  const handleUpdateAccess = async (doorId, newAllowedUsers) => {
    try {
      const door = selectedHouse.doors.find((d) => d.doorId === doorId);
      const existingAllowedUsers = door.allowedUsers;

      const updatedAllowedUsers = [
        ...existingAllowedUsers,
        ...newAllowedUsers.filter((newUser) => !existingAllowedUsers.some((existingUser) => existingUser.eid === newUser.eid)),
      ];

      await axios.put(`https://login-9ebe.onrender.com/api/houses/${selectedHouse.HID}/doors/${doorId}`, { allowedUsers: updatedAllowedUsers });

      fetchHouseDetails(selectedHouse.HID);
    } catch (err) {
      console.error('Error updating access', err);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const newAllowedUsers = selectedDoors.map((doorId) => ({ eid: newUserEID, access: 'specific' }));
    await Promise.all(
      selectedDoors.map(async (doorId) => {
        await handleUpdateAccess(doorId, newAllowedUsers);
      })
    );
    setNewUserEID('');
    setSelectedDoors([]);
  };

  if (loading) return <div className="hdash-loading">Loading...</div>;
  if (error) return <div className="hdash-error">{error}</div>;

  return (
    <div className="hdash-container">
      <h1 className="hdash-title">My Houses</h1>
      {houses.length === 0 ? (
        <p className="hdash-no-houses">There is no house under your EID. Please register a house first.</p>
      ) : (
        <ul className="hdash-house-list">
          {houses.map((house) => (
            <li key={house.HID} className="hdash-house-item" onClick={() => fetchHouseDetails(house.HID)}>
              {house.address} (ID: {house.HID})
            </li>
          ))}
        </ul>
      )}

      {selectedHouse && (
        <div className="hdash-house-details">
          <h2 className="hdash-subtitle">House Details</h2>
          <h3 className="hdash-house-address">Address: {selectedHouse.address}</h3>
          <h4 className="hdash-doors-title">Doors:</h4>
          <ul className="hdash-doors-list">
            {selectedHouse.doors.map((door) => (
              <li key={door.doorId} className="hdash-door-item">
                <strong className="hdash-door-name">{door.name}</strong> (ID: {door.doorId})
                <ul className="hdash-users-list">
                  {door.allowedUsers.map((user) => (
                    <li key={user.eid} className="hdash-user-item">
                      {user.eid} ({user.access})
                      <button className="hdash-remove-user-btn" onClick={() => handleRemoveUser(door.doorId, user.eid)}>
                        Remove User
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          <form className="hdash-add-user-form" onSubmit={handleAddUser}>
            <h4 className="hdash-add-user-title">Add New User</h4>
            <label className="hdash-input-label">
              User EID:
              <input
                className="hdash-input"
                type="text"
                value={newUserEID}
                onChange={(e) => setNewUserEID(e.target.value)}
                required
              />
            </label>
            <h5 className="hdash-doors-select-title">Select Doors:</h5>
            {selectedHouse.doors.map((door) => (
              <label key={door.doorId} className="hdash-checkbox-label">
                <input
                  type="checkbox"
                  value={door.doorId}
                  checked={selectedDoors.includes(door.doorId)}
                  onChange={(e) => {
                    const { checked, value } = e.target;
                    if (checked) {
                      setSelectedDoors([...selectedDoors, value]);
                    } else {
                      setSelectedDoors(selectedDoors.filter((id) => id !== value));
                    }
                  }}
                />
                {door.name}
              </label>
            ))}
            <button className="hdash-submit-btn" type="submit">Add User</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default HouseDetails;
