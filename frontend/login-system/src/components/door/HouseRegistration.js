import axios from 'axios';
import React, { useState } from 'react';

const HouseRegistration = () => {
    const [houseName, setHouseName] = useState('');
    const [ownerEID, setOwnerEID] = useState('');
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    const registerHouse = async () => {
        if (!houseName || !ownerEID) {
            alert('Both house name and owner EID are required.');
            return;
        }

        try {
            const response = await axios.post('https://login-9ebe.onrender.com/api/houses/add', {
                name: houseName,
                ownerEID: ownerEID
            });
            setMessage(response.data.message);
            setHouseName('');
            setOwnerEID('');
            
        } catch (error) {
            setError(error.response?.data?.message || 'Error registering house');
            console.error('Error registering house:', error);
        }
    };

    return (
        <div>
            <h2>Register a House</h2>
            <input
                type="text"
                placeholder="House Name"
                value={houseName}
                onChange={(e) => setHouseName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Owner EID"
                value={ownerEID}
                onChange={(e) => setOwnerEID(e.target.value)}
            />
            <button onClick={registerHouse}>Register House</button>
            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default HouseRegistration;
