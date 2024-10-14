// src/components/Register.js
import axios from 'axios';
import React, { useState } from 'react';

const Register = () => {
  const [ownerEID, setOwnerEID] = useState('');
  const [address, setAddress] = useState('');
  const [numberOfDoors, setNumberOfDoors] = useState(1);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [doorNames, setDoorNames] = useState(['']); // Array to hold door names
  const [userEIDs, setUserEIDs] = useState([]); // Array to hold user EIDs and access rights

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
    setUserEIDs(newUserEIDs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users/register', {
        ownerEID,
        address,
        numberOfDoors,
        password,
        confirmPassword,
        doorNames,
        userEIDs: userEIDs.map(user => ({
          eid: user.eid,
          access: user.access,
        })), // Pass user EIDs for access
      });
      alert('House registered successfully');
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  // Add a new user access section
  const addUserAccess = () => {
    setUserEIDs([...userEIDs, { eid: '', access: 'specific' }]); // Add a new entry for user access
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="House Owner EID" value={ownerEID} onChange={(e) => setOwnerEID(e.target.value)} required />
      <input type="text" placeholder="House Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
      <input type="number" placeholder="Number of Doors" value={numberOfDoors} onChange={(e) => setNumberOfDoors(e.target.value)} min="1" required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
      
      {/* Render inputs for door names */}
      {Array.from({ length: numberOfDoors }, (_, i) => (
        <input
          key={i}
          type="text"
          placeholder={`Name for Door ${i + 1}`}
          value={doorNames[i] || ''}
          onChange={(e) => handleDoorNameChange(i, e.target.value)}
          required
        />
      ))}

      {/* Section to manage user access */}
      <h3>Access for Users</h3>
      {userEIDs.map((user, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="User EID"
            value={user.eid}
            onChange={(e) => handleUserEIDChange(index, e.target.value)}
            required
          />
          <div>
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
            <div>
              {Array.from({ length: numberOfDoors }, (_, i) => (
                <label key={i}>
                  <input
                    type="checkbox"
                    // Here, you would need a way to track which doors this user has access to
                    // For now, we are just rendering checkboxes without storing the state
                  />
                  {doorNames[i] || `Door ${i + 1}`}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}

      <button type="button" onClick={addUserAccess}>Add User Access</button>
      <button type="submit">Register House</button>
    </form>
  );
};

export default Register;
