// src/components/Register.js
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/housereg.css';

const Register = () => {
  const [ownerEID, setOwnerEID] = useState('');
  const [address, setAddress] = useState('');
  const [numberOfDoors, setNumberOfDoors] = useState(1);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [doorNames, setDoorNames] = useState(['']); // Array to hold door names
  const [userEIDs, setUserEIDs] = useState([]); // Array to hold user EIDs and access rights
  const navigate = useNavigate();

  const handleDoorNameChange = (index, value) => {
    const newDoorNames = [...doorNames];
    newDoorNames[index] = value;
    setDoorNames(newDoorNames);
  };

  const handleUserEIDChange = (index, value) => {
    const newUserEIDs = [...userEIDs];
    newUserEIDs[index].eid = value; // Update the EID of the specified user
    setUserEIDs(newUserEIDs);
  };

  const handleUserAccessChange = (index, accessType) => {
    const newUserEIDs = [...userEIDs];
    newUserEIDs[index].access = accessType; // Set access type (all or specific doors)
    // Initialize specificDoors array if accessing specific doors
    newUserEIDs[index].specificDoors = accessType === 'specific' ? [] : undefined; 
    setUserEIDs(newUserEIDs);
  };

  const handleDoorSelectionChange = (userIndex, doorIndex) => {
    const newUserEIDs = [...userEIDs];
    const selectedDoorId = doorNames[doorIndex]; // Get the door name as an identifier

    // If specificDoors is not initialized, ensure it's an array
    if (!newUserEIDs[userIndex].specificDoors) {
      newUserEIDs[userIndex].specificDoors = [];
    }

    if (newUserEIDs[userIndex].specificDoors.includes(selectedDoorId)) {
      // If already selected, remove it from the specific doors
      newUserEIDs[userIndex].specificDoors = newUserEIDs[userIndex].specificDoors.filter(id => id !== selectedDoorId);
    } else {
      // Otherwise, add it to the specific doors
      newUserEIDs[userIndex].specificDoors.push(selectedDoorId);
    }

    setUserEIDs(newUserEIDs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('https://login-9ebe.onrender.com/api/houses/register', {
        ownerEID,
        address,
        numberOfDoors,
        password,
        confirmPassword,
        doorNames,
        userEIDs: userEIDs.map(user => ({
          eid: user.eid,
          access: user.access,
          specificDoors: user.specificDoors || [], // Ensure specificDoors is always an array
        })), // Pass user EIDs for access
      });
      alert(response.data.message);
      sessionStorage.setItem('HID', response.data.HID);
      navigate('/house/verification');
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  // Add a new user access section
  const addUserAccess = () => {
    setUserEIDs([...userEIDs, { eid: '', access: 'specific', specificDoors: [] }]); // Initialize specificDoors
  };

  return (
    <form onSubmit={handleSubmit} className="hreg-form">
      <input type="text" className="hreg-input" placeholder="House Owner EID" value={ownerEID} onChange={(e) => setOwnerEID(e.target.value)} required />
      <input type="text" className="hreg-input" placeholder="House Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
      <input type="number" className="hreg-input" placeholder="Number of Doors" value={numberOfDoors} onChange={(e) => setNumberOfDoors(e.target.value)} min="1" required />
      <input type="password" className="hreg-input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <input type="password" className="hreg-input" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
      
      {/* Render inputs for door names */}
      {Array.from({ length: numberOfDoors }, (_, i) => (
        <input
          key={i}
          type="text"
          className="hreg-input"
          placeholder={`Name for Door ${i + 1}`}
          value={doorNames[i] || ''}
          onChange={(e) => handleDoorNameChange(i, e.target.value)}
          required
        />
      ))}

      {/* Section to manage user access */}
      <h3 className="hreg-heading">Access for Users</h3>
      {userEIDs.map((user, index) => (
        <div key={index} className="hreg-user-access">
          <input
            type="text"
            className="hreg-input"
            placeholder="User EID"
            value={user.eid}
            onChange={(e) => handleUserEIDChange(index, e.target.value)}
            required
          />
          <div className="hreg-access-options">
            <label>
              <input
                type="radio"
                name={`access-${index}`}
                value="all"
                checked={user.access === 'all'}
                onChange={() => handleUserAccessChange(index, 'all')}
              />
              All Doors
            </label>
            <label>
              <input
                type="radio"
                name={`access-${index}`}
                value="specific"
                checked={user.access === 'specific'}
                onChange={() => handleUserAccessChange(index, 'specific')}
              />
              Specific Doors
            </label>
          </div>

          {/* Show door options if specific doors are selected */}
          {user.access === 'specific' && (
            <div className="hreg-specific-doors">
              {doorNames.map((doorName, doorIndex) => (
                <label key={doorIndex} className="hreg-door-option">
                  <input
                    type="checkbox"
                    checked={user.specificDoors && user.specificDoors.includes(doorName)} // Check if this door is in the user's specific doors
                    onChange={() => handleDoorSelectionChange(index, doorIndex)} // Track door selection
                  />
                  {doorName || `Door ${doorIndex + 1}`}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}

      <button type="button" className="hreg-button" onClick={addUserAccess}>Add User Access</button>
      <button type="submit" className="hreg-button">Register House</button>
    </form>
  );
};

export default Register;
