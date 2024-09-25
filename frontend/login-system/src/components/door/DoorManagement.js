import axios from 'axios';
import React, { useEffect, useState } from 'react';

const DoorManagement = () => {
    const [houseId, setHouseId] = useState('');
    const [doorName, setDoorName] = useState('');
    const [doors, setDoors] = useState([]);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Function to fetch doors for the specified house ID
    const fetchDoors = async () => {
        if (!houseId) return; // Do nothing if houseId is not provided
        setIsLoading(true);
        try {
            const response = await axios.get(`https://login-9ebe.onrender.com/doors/${houseId}`);
            setDoors(response.data);
        } catch (error) {
            setError(error.message);
            console.error('Error fetching doors:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Function to handle adding a new door
    const addDoor = async () => {
        if (!doorName || !houseId) {
            alert('Door name and house ID are required.');
            return;
        }

        try {
            const response = await axios.post('https://login-9ebe.onrender.com/doors/add', { name: doorName, houseId });
            setMessage(response.data.message);
            setDoorName(''); // Clear the input field
            fetchDoors(); // Refresh the list of doors
        } catch (error) {
            setError(error.response?.data?.message);
            console.error('Error adding door:', error);
        }
    };

    useEffect(() => {
        fetchDoors(); // Fetch doors whenever houseId changes
    }, [houseId]);

    return (
        <div>
            <h1>Door Management</h1>
            <div>
                <input
                    type="text"
                    placeholder="Enter House ID"
                    value={houseId}
                    onChange={(e) => setHouseId(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Enter Door Name"
                    value={doorName}
                    onChange={(e) => setDoorName(e.target.value)}
                />
                <button onClick={addDoor}>Add Door</button>
            </div>
            <h2>Doors in House {houseId}</h2>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {doors.map((door) => (
                        <li key={door._id}>{door.name} (ID: {door.doorID})</li>
                    ))}
                </ul>
            )}
            {error && <p className="error">{error}</p>}
            {message && <p className="success">{message}</p>}
        </div>
    );
};

export default DoorManagement;
